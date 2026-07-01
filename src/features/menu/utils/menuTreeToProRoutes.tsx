/**
 * 菜单树 → ProLayout route 结构。
 *
 * ProLayout 吃 { path, name, icon, routes } 递归结构。本函数把服务端菜单树
 * 映射过去：name 是 i18n key，用传入的 t 翻译（保持纯函数，不在此调 hook）；
 * icon 走 iconRegistry；button 类型不入侧栏（后端已过滤，此处再兜底剔除）。
 */
import type { MenuDataItem } from '@ant-design/pro-components';

import type { MenuTreeNode } from '../api/menu.types';

import { resolveIcon } from './iconRegistry';

type Translate = (id: string) => string;

export function menuTreeToProRoutes(
  tree: readonly MenuTreeNode[],
  t: Translate,
): MenuDataItem[] {
  return tree
    .filter((node) => node.menu_type !== 'button')
    .map((node) => {
      const item: MenuDataItem = {
        path: node.path ?? undefined,
        name: t(node.name),
        icon: resolveIcon(node.icon),
      };
      const childRoutes = menuTreeToProRoutes(node.children, t);
      if (childRoutes.length > 0) {
        item.children = childRoutes;
      }
      return item;
    });
}
