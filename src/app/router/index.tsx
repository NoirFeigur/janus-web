/** 路由树 —— createBrowserRouter + 懒加载。私有路由过 AuthGuard。 */
import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';


import { AuthGuard } from './guards';
import { paths } from './paths';

import { AppLayout } from '@/app/AppLayout';

const LoginPage = lazy(() => import('@/pages/login'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const UsersPage = lazy(() => import('@/pages/users'));
const NotFoundPage = lazy(() => import('@/pages/404'));
const PlaceholderPage = lazy(() => import('@/pages/placeholder'));

/** 懒加载页套 Suspense —— helper（非组件），避开 react-refresh 单文件多导出限制。 */
const lazyElement = (Page: ComponentType) => (
  <Suspense fallback={null}>
    <Page />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: paths.login,
    element: lazyElement(LoginPage),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to={paths.dashboard} replace /> },
      {
        path: paths.dashboard,
        element: lazyElement(DashboardPage),
      },
      {
        path: paths.users,
        element: lazyElement(UsersPage),
      },
      // 其余 feature 先挂占位页，后续逐个实现。
      ...[paths.credentials, paths.catalog, paths.grants, paths.usage, paths.quota].map((p) => ({
        path: p,
        element: lazyElement(PlaceholderPage),
      })),
    ],
  },
  {
    path: paths.notFound,
    element: lazyElement(NotFoundPage),
  },
  { path: '*', element: <Navigate to={paths.notFound} replace /> },
]);
