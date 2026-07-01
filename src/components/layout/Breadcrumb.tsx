/** 顶部面包屑 —— 根据当前路由和服务端菜单树生成。 */
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import type { LayoutMenuNode } from './menuTree.types';

import { paths } from '@/app/router/paths';
import { useT } from '@/hooks/useT';

interface BreadcrumbProps {
  menuTree: readonly LayoutMenuNode[];
}

interface MenuCrumb {
  path: string;
  titleKey: string;
}

const findCrumbPath = (
  tree: readonly LayoutMenuNode[],
  pathname: string,
  parents: readonly MenuCrumb[] = [],
): MenuCrumb[] => {
  for (const node of tree) {
    if (node.menu_type === 'button' || !node.path) {
      continue;
    }

    const current = [...parents, { path: node.path, titleKey: node.name }];
    if (node.path === pathname) {
      return current;
    }

    const childPath = findCrumbPath(node.children, pathname, current);
    if (childPath.length > 0) {
      return childPath;
    }
  }

  return [];
};

export function Breadcrumb({ menuTree }: BreadcrumbProps) {
  const { pathname } = useLocation();
  const t = useT();
  const dynamicCrumbs = pathname === paths.home ? [] : findCrumbPath(menuTree, pathname);
  const crumbs: MenuCrumb[] = [
    { path: paths.home, titleKey: 'menu.home' },
    ...dynamicCrumbs.filter((crumb) => crumb.path !== paths.home),
  ];

  return (
    <AntdBreadcrumb
      items={crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return {
          title: isLast ? t(crumb.titleKey) : <Link to={crumb.path}>{t(crumb.titleKey)}</Link>,
        };
      })}
    />
  );
}
