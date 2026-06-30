/**
 * 认证态（管理面 JWT 轨）—— token / 当前用户 / 权限码。
 *
 * 仅承载客户端态。后端双认证体系中，本前端只用 RS256 JWT（access + refresh）；
 * sk-key 由 credentials feature 管理、本前端自身不用它发管理面请求（设计规范 §4.4）。
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CurrentUser {
  id: string;
  username: string;
  realName: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  /** RuoYi 风格权限码集合，如 'system:user:list'（设计规范 §4.3）。 */
  permissions: string[];
  isAuthenticated: () => boolean;
  hasPermission: (code: string) => boolean;
  setSession: (args: {
    accessToken: string;
    refreshToken: string;
    user: CurrentUser;
    permissions: string[];
  }) => void;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      permissions: [],
      isAuthenticated: () => get().accessToken !== null,
      hasPermission: (code) => get().permissions.includes(code),
      setSession: ({ accessToken, refreshToken, user, permissions }) =>
        set({ accessToken, refreshToken, user, permissions }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null, permissions: [] }),
    }),
    { name: 'janus.auth' },
  ),
);
