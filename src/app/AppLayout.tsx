/** 主框架布局 —— ProLayout（侧栏 + 顶栏 + 内容区，设计规范 §3.1）。 */
import { HomeOutlined } from '@ant-design/icons';
import { ProLayout, type MenuDataItem } from '@ant-design/pro-components';
import { currentMenusOptions } from '@features/menu/api/menu.queries';
import { buildMenuTree } from '@features/menu/utils/buildMenuTree';
import { menuTreeToProRoutes } from '@features/menu/utils/menuTreeToProRoutes';
import { useUiStore } from '@stores/ui.store';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';
import { RightContent } from '@/components/RightContent';
import { useT } from '@/hooks/useT';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const siderCollapsed = useUiStore((s) => s.siderCollapsed);
  const setSiderCollapsed = useUiStore((s) => s.setSiderCollapsed);
  const t = useT();

  // 服务端驱动菜单：拉当前用户可见菜单 → 建树 → 映射为 ProLayout route。
  // 首页是固定入口、非动态菜单，恒置于侧栏顶部；概览等功能页来自动态菜单。
  const { data: menus } = useQuery(currentMenusOptions());
  const proRoutes = useMemo<MenuDataItem[]>(() => {
    const home: MenuDataItem = {
      path: paths.home,
      name: t('menu.home'),
      icon: <HomeOutlined />,
    };
    const dynamic = menus ? menuTreeToProRoutes(buildMenuTree(menus), t) : [];
    return [home, ...dynamic];
  }, [menus, t]);

  return (
    <ProLayout
      title={t('common.appName')}
      logo={false}
      layout="side"
      fixSiderbar
      collapsed={siderCollapsed}
      onCollapse={setSiderCollapsed}
      location={{ pathname: location.pathname }}
      route={{ path: '/', routes: proRoutes }}
      menuItemRender={(item, dom) => (
        <a
          onClick={() => {
            if (item.path) void navigate(item.path);
          }}
        >
          {dom}
        </a>
      )}
      rightContentRender={() => <RightContent />}
    >
      <Outlet />
    </ProLayout>
  );
}
