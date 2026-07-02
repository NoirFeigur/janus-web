/**
 * auth 业务请求函数 —— 调 apiClient（拦截器已解包成功信封，故直接拿内层 data）。
 *
 * 端点契约见 janus-server/src/auth/router.py：
 * - POST /auth/login    {username,password} → TokenRead(access+refresh+expires_in)
 * - POST /auth/logout   （Bearer 鉴权）撤销当前会话 → null
 * - POST /auth/refresh  {refresh_token} → TokenRead（轮换出新 access+refresh）
 * - GET  /auth/me       → CurrentUserRead（含 permissions[] + is_superuser）
 */
import type { CurrentUserRead, TokenRead } from './auth.types';

import { apiClient } from '@/lib/http/client';

export async function login(username: string, password: string): Promise<TokenRead> {
  const res = await apiClient.post<TokenRead>('/auth/login', { username, password });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function refresh(refreshToken: string): Promise<TokenRead> {
  const res = await apiClient.post<TokenRead>('/auth/refresh', { refresh_token: refreshToken });
  return res.data;
}

export async function getMe(): Promise<CurrentUserRead> {
  const res = await apiClient.get<CurrentUserRead>('/auth/me');
  return res.data;
}
