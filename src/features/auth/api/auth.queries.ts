/**
 * auth mutations（TanStack Query）。
 *
 * 登录是「取 token → 拉 profile → 落会话」的复合流，用一个 mutation 串起来，
 * onSuccess 时会话已就绪，页面只管跳转。登出先请求后端撤销会话（best-effort），
 * 无论成败都清本地态（onSettled），避免服务端不可达时卡在已登录状态。
 */
import { useAuthStore } from '@stores/auth.store';
import { useMutation } from '@tanstack/react-query';

import { getMe, login, logout } from './auth.api';

/** 登录：username/password → 写入完整会话（token + user + permissions）。 */
export function useLoginMutation() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (vars: { username: string; password: string }) => {
      const token = await login(vars.username, vars.password);
      // access token 落库后，后续 getMe 请求拦截器会自动挂上它。
      useAuthStore.getState().setAccessToken(token.access_token);
      const me = await getMe();
      return { token, me };
    },
    onSuccess: ({ token, me }) => {
      setSession({
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? '',
        user: {
          id: me.user_id,
          username: me.username,
          realName: me.real_name ?? null,
          isSuperuser: me.is_superuser,
        },
        permissions: me.permissions,
      });
    },
    onError: () => {
      // 登录失败（凭据错/getMe 失败）：清掉可能写入的半会话。
      useAuthStore.getState().clear();
    },
  });
}

/** 登出：请求后端撤销会话（失败也无妨），随后一律清本地态。 */
export function useLogoutMutation() {
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clear();
    },
  });
}
