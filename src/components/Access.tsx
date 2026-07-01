/**
 * 权限门控 —— 按钮级 RBAC 的声明式包裹。有权限渲染 children，否则渲染 fallback。
 * 走 authStore.hasPermission（含超管旁路）。命令式判断用 useAccess（hooks/useAccess）。
 *
 * 与页级 PermissionGuard 同源（都走 hasPermission），但 Access 用于元素级、
 * 无权限时静默隐藏（不跳转），PermissionGuard 用于路由级、无权限跳走。
 */
import { useAuthStore } from '@stores/auth.store';
import type { ReactNode } from 'react';

interface AccessProps {
  /** 所需权限码，如 'system:user:add'。 */
  perm: string;
  children: ReactNode;
  /** 无权限时的回落渲染（默认不渲染任何东西）。 */
  fallback?: ReactNode;
}

/** 声明式权限门控：有权限渲染 children，否则渲染 fallback（默认 null）。 */
export function Access({ perm, children, fallback = null }: AccessProps) {
  const allowed = useAuthStore((s) => s.hasPermission(perm));
  return <>{allowed ? children : fallback}</>;
}
