/** 菜单树 -> AntD Menu items。 */
import type { MenuProps } from 'antd';

import type { MenuTreeNode } from '../api/menu.types';

import { resolveIcon } from './iconRegistry';

type MenuItem = Required<MenuProps>['items'][number];
type Translate = (id: string) => string;

export function menuTreeToAntdItems(
  tree: readonly MenuTreeNode[],
  t: Translate,
): MenuItem[] {
  return tree.flatMap((node) => {
    if (node.menu_type === 'button' || !node.path) {
      return [];
    }

    const children = menuTreeToAntdItems(node.children, t);
    const item: MenuItem = {
      key: node.path,
      icon: resolveIcon(node.icon),
      label: t(node.name),
      children: children.length > 0 ? children : undefined,
    };

    return [item];
  });
}
