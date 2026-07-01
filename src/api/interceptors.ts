/**
 * Axios 拦截器：挂 token / 语言；解析方案 B 信封；统一错误处理 + 401 静默刷新。
 *
 * 契约见设计规范 §5：
 * - 请求：挂 Authorization: Bearer <jwt> + Accept-Language。
 * - 响应成功（success=true）：透出 data（解包信封）。
 * - 响应失败（success=false / 网络错误）：归一化为 ApiError 抛出，
 *   按 code 查 i18n 文案 toast；422 字段错误带回供表单消费。
 * - 401 / 凭据失效：先尝试用 refresh token 静默换发（单飞去重，多个并发 401 只刷一次），
 *   成功则用新 token 重放原请求；刷新失败或无 refresh token 才清会话回登录页。
 *
 * 分层约束：本文件属 api 层，不得 import features；refresh 调用直接走 apiClient +
 * generated 类型内联实现，不依赖 features/auth。
 */

import { translate } from '@lib/i18n';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import { message } from 'antd';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import { apiClient } from './client';

import type { components } from '@/api/generated/types';
import { type ErrorEnvelope, ApiError, type SuccessEnvelope } from '@/types/api';

type TokenRead = components['schemas']['TokenRead'];

/** 带重试/刷新标记的请求配置（防止重放与刷新自身触发递归刷新）。 */
interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _isRefresh?: boolean;
}

/** 凭据失效类错误码：命中即走「刷新或登出」路径。 */
const AUTH_EXPIRED_CODES = ['auth.invalid_token', 'auth.token_revoked', 'auth.refresh_invalid'];

function isErrorEnvelope(data: unknown): data is ErrorEnvelope {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data).success === false &&
    'code' in data
  );
}

function isSuccessEnvelope(data: unknown): data is SuccessEnvelope<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data).success === true
  );
}

// ---- 请求拦截 ----------------------------------------------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  config.headers.set('Accept-Language', useLocaleStore.getState().locale);
  return config;
});

// ---- 单飞刷新 ----------------------------------------------------------------
// 多个并发请求同时 401 时，只发一次 /auth/refresh，其余等同一个 promise。
let refreshInFlight: Promise<string | null> | null = null;

async function runRefresh(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    return null;
  }
  try {
    const res = await apiClient.post<TokenRead>(
      '/auth/refresh',
      { refresh_token: refreshToken },
      { _isRefresh: true } as RetryableConfig,
    );
    const token = res.data;
    useAuthStore.getState().setTokens({
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? refreshToken,
    });
    return token.access_token;
  } catch {
    return null;
  }
}

function refreshOnce(): Promise<string | null> {
  refreshInFlight ??= runRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

function redirectToLogin(): void {
  useAuthStore.getState().clear();
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login');
  }
}

// ---- 响应拦截 ----------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // 成功信封：解包 data，业务侧直接拿到 <T>。
    if (isSuccessEnvelope(response.data)) {
      response.data = response.data.data;
    }
    return response;
  },
  async (axiosError: AxiosError) => {
    const original = axiosError.config as RetryableConfig | undefined;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;

    let apiError: ApiError;
    if (isErrorEnvelope(body)) {
      apiError = new ApiError({
        code: body.code,
        status,
        params: body.params,
        fieldErrors: body.errors,
        traceId: body.trace_id,
      });
    } else {
      // 非信封错误（网络断开 / 网关 5xx 裸响应等）→ 归一化为 internal.error。
      apiError = new ApiError({
        code: status === 0 ? 'service.unavailable' : 'internal.error',
        status,
      });
    }

    const isAuthExpired = status === 401 || AUTH_EXPIRED_CODES.includes(apiError.code);

    // 401 且非刷新请求自身、非已重放过 → 尝试静默刷新后重放原请求。
    if (isAuthExpired && original && !original._isRefresh && !original._retry) {
      const newToken = await refreshOnce();
      if (newToken) {
        original._retry = true;
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return apiClient(original); // 重放：返回解包后的成功 data。
      }
    }

    // 刷新失败 / 无 refresh token / 刷新请求自身 401：清会话回登录页。
    if (isAuthExpired) {
      redirectToLogin();
    }

    // 422 字段级错误交给表单处理，不弹全局 toast。
    if (apiError.fieldErrors.length === 0) {
      const text = translate(
        `error.${apiError.code}`,
        apiError.params as Record<string, string | number>,
      );
      void message.error(text);
    }

    return Promise.reject(apiError);
  },
);

export { apiClient };
