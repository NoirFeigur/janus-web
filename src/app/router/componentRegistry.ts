/**
 * 组件注册表 —— 后端菜单 component 字段 → 前端懒加载组件。
 *
 * 服务端驱动菜单的落地策略（best practice on Vite/React）：路由组件仍在前端
 * 静态注册（保 tree-shaking + 类型安全），后端 component 字段作查表 key。
 * 纯动态 import() 拼路径在 Vite 下 tree-shaking 失效、且无类型保障，不取。
 *
 * 新增页面：在此表登记一行；后端菜单 component 填同名 key 即自动接上。
 * 未登记的 key 回落 PlaceholderPage（feature 尚未实现时的占位）。
 */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const DashboardPage = lazy(() => import('@/pages/dashboard'));
const UsersPage = lazy(() => import('@/pages/users'));
const PlaceholderPage = lazy(() => import('@/components/PlaceholderPage'));
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const NotFoundPage = lazy(() => import('@/pages/404'));

/** component 名 → 懒加载组件。业务页 key 与后端 menu.component 一致；框架页（首页/登录/404）本地固定。 */
const COMPONENT_REGISTRY: Record<string, LazyExoticComponent<ComponentType>> = {
  DashboardPage,
  UsersPage,
  PlaceholderPage,
  HomePage,
  LoginPage,
  NotFoundPage,
};

/** 按后端 component 名取组件；未登记则回落占位页（不崩，方便渐进实现）。 */
export function resolveComponent(component: string | null): LazyExoticComponent<ComponentType> {
  const hit = component ? COMPONENT_REGISTRY[component] : undefined;
  return hit ?? PlaceholderPage;
}
