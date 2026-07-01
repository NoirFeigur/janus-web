/** 路由守卫：AuthGuard（验 token）/ PermissionGuard（验权限码）。 */
import { useAuthStore } from '@stores/auth.store';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';


import { paths } from './paths';

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.accessToken !== null);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function PermissionGuard({ perm, children }: { perm: string; children: ReactNode }) {
  // 超管旁路：is_superuser 直接放行；否则查权限码集合（与 auth.store.hasPermission 同源）。
  const hasPermission = useAuthStore((s) => s.user?.isSuperuser === true || s.permissions.includes(perm));
  if (!hasPermission) {
    return <Navigate to={paths.notFound} replace />;
  }
  return children;
}
