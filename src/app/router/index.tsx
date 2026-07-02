/** 路由树 —— createBrowserRouter + 懒加载。私有路由过 AuthGuard；动态功能页再过菜单驱动的页级访问守卫。 */
import { Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { resolveComponent } from './componentRegistry';
import { AuthGuard, MenuAccessGuard } from './guards';
import { paths } from './paths';

import { AppLayout } from '@/app/AppLayout';

/**
 * 动态功能页清单 —— path → 组件注册名。这是前端对"我有哪些可路由功能页"的静态声明
 * （保 tree-shaking + 类型安全）；服务端菜单数据决定其中哪些进侧栏/可访问。
 * 首页（/）不在此列——它是固定门户页，单独静态注册、不过菜单守卫。
 * 概览（/dashboard）是动态菜单之一，在此列、过菜单守卫。
 * 新增功能页：加一行 + 在 componentRegistry 登记组件 + 后端菜单填同名 component。
 */
const ROUTE_MANIFEST: { path: string; component: string }[] = [
  // dashboard 内容暂下线，统一走「即将上线」占位；恢复只需改回 'DashboardPage'。
  { path: paths.dashboard, component: 'PlaceholderPage' },
  { path: paths.users, component: 'UsersPage' },
  { path: paths.credentials, component: 'PlaceholderPage' },
  { path: paths.catalog, component: 'PlaceholderPage' },
  { path: paths.grants, component: 'PlaceholderPage' },
  { path: paths.usage, component: 'PlaceholderPage' },
  { path: paths.quota, component: 'PlaceholderPage' },
];

const LoginPage = resolveComponent('LoginPage');
const NotFoundPage = resolveComponent('NotFoundPage');
// 首页内容暂下线，落地 '/' 直接展示「即将上线」占位；恢复改回 resolveComponent('HomePage')。
const HomeElement = resolveComponent('PlaceholderPage');

/** 懒加载页套 Suspense —— helper（非组件），避开 react-refresh 单文件多导出限制。 */
const lazyElement = (Page: ComponentType) => (
  <Suspense fallback={null}>
    <Page />
  </Suspense>
);

/** 动态功能页 = Suspense 懒加载 + 菜单驱动的页级访问守卫。 */
const guardedElement = (component: string) => (
  <MenuAccessGuard>{lazyElement(resolveComponent(component))}</MenuAccessGuard>
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
      // 固定首页：登录后落地 '/'（门户页，非动态菜单，不过菜单守卫）。内容暂下线，走占位。
      { index: true, element: lazyElement(HomeElement) },
      ...ROUTE_MANIFEST.map(({ path, component }) => ({
        path,
        element: guardedElement(component),
      })),
    ],
  },
  {
    path: paths.notFound,
    element: lazyElement(NotFoundPage),
  },
  { path: '*', element: lazyElement(NotFoundPage) },
]);
