/**
 * auth mutations 测试 —— 登录复合流（login→getMe→setSession）+ 登出清态。
 *
 * MSW 返回成功信封，经真实拦截器解包（import '@/lib/http/interceptors' 挂载）；
 * 断言 auth.store 的会话状态变化，而非内部实现。
 */
import '@/lib/http/interceptors';

import { useAuthStore } from '@stores/auth.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../../../../tests/msw/server';

import { useLoginMutation, useLogoutMutation } from './auth.queries';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return createElement(QueryClientProvider, { client }, children);
}

describe('auth mutations', () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  afterEach(() => {
    useAuthStore.getState().clear();
  });

  it('登录成功：写入完整会话（token + user + permissions + 超管标记）', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({
          success: true,
          data: { access_token: 'acc-1', token_type: 'Bearer', expires_in: 900, refresh_token: 'ref-1' },
          trace_id: 't',
        }),
      ),
      http.get('*/auth/me', () =>
        HttpResponse.json({
          success: true,
          data: {
            user_id: '42',
            username: 'admin',
            real_name: '超级管理员',
            department_id: null,
            preferred_locale: 'zh-CN',
            permissions: ['system:user:list'],
            is_superuser: true,
          },
          trace_id: 't',
        }),
      ),
    );

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    result.current.mutate({ username: 'admin', password: '123456' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('acc-1');
    expect(state.refreshToken).toBe('ref-1');
    expect(state.user).toMatchObject({ id: '42', username: 'admin', isSuperuser: true });
    expect(state.permissions).toEqual(['system:user:list']);
  });

  it('登录失败（凭据错）：不写入会话', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json(
          { success: false, code: 'auth.invalid_token', params: {}, trace_id: 't' },
          { status: 401 },
        ),
      ),
    );

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    result.current.mutate({ username: 'admin', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('登出：请求后端撤销后清本地会话', async () => {
    useAuthStore.getState().setSession({
      accessToken: 'acc-1',
      refreshToken: 'ref-1',
      user: { id: '1', username: 'admin', realName: null, isSuperuser: false },
      permissions: ['x'],
    });
    server.use(
      http.post('*/auth/logout', () =>
        HttpResponse.json({ success: true, data: null, trace_id: 't' }),
      ),
    );

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('登出即使后端失败也清本地会话（best-effort）', async () => {
    useAuthStore.getState().setSession({
      accessToken: 'acc-1',
      refreshToken: 'ref-1',
      user: { id: '1', username: 'admin', realName: null, isSuperuser: false },
      permissions: ['x'],
    });
    server.use(http.post('*/auth/logout', () => HttpResponse.error()));

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    result.current.mutate();

    // 后端失败时 mutation 落 error 态，但 onSettled 仍清本地态。
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
