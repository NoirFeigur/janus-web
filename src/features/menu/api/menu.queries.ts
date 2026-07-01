/** query key 工厂 + queryOptions（设计规范 §query key 工厂）。 */
import { queryOptions } from '@tanstack/react-query';

import { getCurrentMenus } from './menu.api';

export const menuQueries = {
  all: () => ['menus'] as const,
  current: () => [...menuQueries.all(), 'current'] as const,
};

export const currentMenusOptions = () =>
  queryOptions({
    queryKey: menuQueries.current(),
    queryFn: getCurrentMenus,
    // 菜单极少变动，登录期内基本静态 —— 拉一次长缓存，避免每次进页面重取。
    staleTime: 5 * 60 * 1000,
  });
