/** 路由守卫：AuthGuard（验 token）/ PermissionGuard（验权限码）/ 菜单驱动的页级访问。 */
import { currentMenusOptions } from '@features/menu/api/menu.queries';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';
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
  const hasPermission = useAuthStore(
    (s) => s.user?.isSuperuser === true || s.permissions.includes(perm),
  );
  if (!hasPermission) {
    return <Navigate to={paths.notFound} replace />;
  }
  return children;
}

/**
 * 页级访问守卫 —— 当前路径不在用户动态菜单树内则回固定首页（服务端驱动的页级鉴权）。
 * 固定首页（paths.home '/'）是 index 路由、不套本守卫，天然不受此判定影响。
 * 概览（/dashboard）等均为动态菜单，须在菜单树内方可访问。
 * 菜单加载中放行（渲染 children），加载完成后再判定，避免加载期误跳。
 */
export function MenuAccessGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: menus } = useQuery(currentMenusOptions());

  const allowedPaths = useMemo(() => {
    if (!menus) return null;
    return new Set(
      menus
        .filter((m) => m.menu_type === 'menu' && m.path !== null)
        .map((m) => m.path as string),
    );
  }, [menus]);

  // 菜单未就绪 → 放行（加载态由页面自身 Suspense 处理）。
  if (!allowedPaths) {
    return children;
  }
  if (!allowedPaths.has(location.pathname)) {
    return <Navigate to={paths.home} replace />;
  }
  return children;
}
