/**
 * Axios 拦截器单测 —— 方案B信封解包 + 错误归一化为 ApiError + 401 清会话。
 *
 * 通过 MSW 对 apiClient 发真实响应，验证响应拦截器行为(import 本模块即挂载拦截器)。
 */
import { useAuthStore } from '@stores/auth.store';
import { message } from 'antd';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../tests/msw/server';

import { apiClient } from './interceptors';


import { ApiError } from '@/types/api';

describe('api interceptors', () => {
  beforeEach(() => {
    vi.spyOn(message, 'error').mockImplementation(
      () => '' as unknown as ReturnType<typeof message.error>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clear();
  });

  it('成功信封被解包：res.data 直接是内层 data', async () => {
    server.use(
      http.get('*/admin/ping', () =>
        HttpResponse.json({ success: true, data: { pong: 1 }, trace_id: 't' }),
      ),
    );
    const res = await apiClient.get<{ pong: number }>('/admin/ping');
    expect(res.data).toEqual({ pong: 1 });
  });

  it('错误信封归一化为 ApiError（携带 code/status/params/traceId）', async () => {
    server.use(
      http.get('*/admin/boom', () =>
        HttpResponse.json(
          {
            success: false,
            code: 'quota.exceeded',
            params: { used: 10, limit: 10 },
            trace_id: 'trace-x',
          },
          { status: 400 },
        ),
      ),
    );
    const err = await apiClient.get('/admin/boom').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    const apiErr = err as ApiError;
    expect(apiErr.code).toBe('quota.exceeded');
    expect(apiErr.status).toBe(400);
    expect(apiErr.params).toEqual({ used: 10, limit: 10 });
    expect(apiErr.traceId).toBe('trace-x');
  });

  it('422 字段错误带回 fieldErrors 且不弹全局 toast', async () => {
    server.use(
      http.post('*/admin/config', () =>
        HttpResponse.json(
          {
            success: false,
            code: 'request.invalid',
            params: {},
            trace_id: 't',
            errors: [{ field: 'config_key', type: 'missing', msg: '该字段为必填项' }],
          },
          { status: 422 },
        ),
      ),
    );
    const err = (await apiClient.post('/admin/config', {}).catch((e: unknown) => e)) as ApiError;
    expect(err.fieldErrors).toHaveLength(1);
    expect(err.fieldErrors[0]).toMatchObject({ field: 'config_key', type: 'missing' });
    // 422 交表单处理，不弹全局 toast。
    expect(message.error).not.toHaveBeenCalled();
  });

  it('非信封错误（网络断开）归一化为 service.unavailable', async () => {
    server.use(http.get('*/admin/down', () => HttpResponse.error()));
    const err = (await apiClient.get('/admin/down').catch((e: unknown) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe('service.unavailable');
    expect(err.status).toBe(0);
  });

  it('401 清空会话（token 被清）', async () => {
    // 先把路由推到 /login，规避拦截器对 window.location.assign 的调用（jsdom 未实现）。
    window.history.pushState({}, '', '/login');
    useAuthStore.setState({ accessToken: 'live-token' });
    server.use(
      http.get('*/admin/secure', () =>
        HttpResponse.json(
          { success: false, code: 'auth.invalid_token', params: {}, trace_id: 't' },
          { status: 401 },
        ),
      ),
    );
    await apiClient.get('/admin/secure').catch(() => undefined);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('401 且有 refresh token：静默刷新后重放原请求，会话换发新 token', async () => {
    useAuthStore.setState({ accessToken: 'stale-token', refreshToken: 'r1' });
    let secureCalls = 0;
    server.use(
      http.get('*/admin/secure', () => {
        secureCalls += 1;
        // 首次（旧 token）401；刷新后重放（新 token）放行。
        if (secureCalls === 1) {
          return HttpResponse.json(
            { success: false, code: 'auth.invalid_token', params: {}, trace_id: 't' },
            { status: 401 },
          );
        }
        return HttpResponse.json({ success: true, data: { ok: true }, trace_id: 't' });
      }),
      http.post('*/auth/refresh', () =>
        HttpResponse.json({
          success: true,
          data: { access_token: 'new-token', token_type: 'Bearer', expires_in: 900, refresh_token: 'r2' },
          trace_id: 't',
        }),
      ),
    );

    const res = await apiClient.get<{ ok: boolean }>('/admin/secure');
    expect(res.data).toEqual({ ok: true });
    expect(secureCalls).toBe(2); // 原请求被重放一次。
    // 会话被换发为刷新返回的新 token 对。
    expect(useAuthStore.getState().accessToken).toBe('new-token');
    expect(useAuthStore.getState().refreshToken).toBe('r2');
  });

  it('401 但 refresh 也失败：清会话（不无限重试）', async () => {
    window.history.pushState({}, '', '/login');
    useAuthStore.setState({ accessToken: 'stale-token', refreshToken: 'r-bad' });
    server.use(
      http.get('*/admin/secure', () =>
        HttpResponse.json(
          { success: false, code: 'auth.invalid_token', params: {}, trace_id: 't' },
          { status: 401 },
        ),
      ),
      http.post('*/auth/refresh', () =>
        HttpResponse.json(
          { success: false, code: 'auth.refresh_invalid', params: {}, trace_id: 't' },
          { status: 401 },
        ),
      ),
    );
    await apiClient.get('/admin/secure').catch(() => undefined);
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });
});
