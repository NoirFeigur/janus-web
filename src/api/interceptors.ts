/**
 * Axios 拦截器：挂 token / 语言；解析方案 B 信封；统一错误处理。
 *
 * 契约见设计规范 §5：
 * - 请求：挂 Authorization: Bearer <jwt> + Accept-Language。
 * - 响应成功（success=true）：透出 data（解包信封）。
 * - 响应失败（success=false / 网络错误）：归一化为 ApiError 抛出，
 *   按 code 查 i18n 文案 toast；401 类清会话回登录页；422 字段错误带回供表单消费。
 */

import { translate } from '@lib/i18n';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import { message } from 'antd';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';


import { apiClient } from './client';

import { type ErrorEnvelope, ApiError, type SuccessEnvelope } from '@/types/api';

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

// ---- 响应拦截 ----------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // 成功信封：解包 data，业务侧直接拿到 <T>。
    if (isSuccessEnvelope(response.data)) {
      response.data = response.data.data;
    }
    return response;
  },
  (axiosError: AxiosError) => {
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

    // 401 / 凭据失效：清会话并回登录页（refresh 流程后续接入）。
    const authExpiredCodes = ['auth.invalid_token', 'auth.token_revoked', 'auth.refresh_invalid'];
    if (status === 401 || authExpiredCodes.includes(apiError.code)) {
      useAuthStore.getState().clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
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
