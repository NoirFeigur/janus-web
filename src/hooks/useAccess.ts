/**
 * useAccess —— 拿权限判定函数，命令式判断（如按钮禁用态、条件逻辑）。
 * 走 authStore.hasPermission（超管恒 true；否则查权限码集合）。
 * 声明式包裹用 <Access perm="...">（components/Access.tsx）。
 */
import { useAuthStore } from '@stores/auth.store';

export function useAccess(): (perm: string) => boolean {
  return useAuthStore((s) => s.hasPermission);
}
