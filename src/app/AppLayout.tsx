/** 主框架布局 —— RuoYi 风格侧栏 + 顶栏 + 页签 + 内容区。 */
import { HomeOutlined } from '@ant-design/icons';
import { useLogoutMutation } from '@features/auth/api/auth.queries';
import { currentMenusOptions } from '@features/menu/api/menu.queries';
import { buildMenuTree } from '@features/menu/utils/buildMenuTree';
import { menuTreeToAntdItems } from '@features/menu/utils/menuTreeToAntdItems';
import { useUiStore } from '@stores/ui.store';
import { useQuery } from '@tanstack/react-query';
import { Drawer, Layout, Menu, type MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';
import { Navbar } from '@/components/layout/Navbar';
import { TagsView } from '@/components/layout/TagsView';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useT } from '@/hooks/useT';

const { Header, Sider, Content } = Layout;

const SIDER_WIDTH = 224;
const SIDER_COLLAPSED_WIDTH = 72;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const siderCollapsed = useUiStore((s) => s.siderCollapsed);
  const toggleSider = useUiStore((s) => s.toggleSider);
  const mobileDrawerOpen = useUiStore((s) => s.mobileDrawerOpen);
  const openMobileDrawer = useUiStore((s) => s.openMobileDrawer);
  const closeMobileDrawer = useUiStore((s) => s.closeMobileDrawer);
  const logoutMutation = useLogoutMutation();
  const { isMobile, isTablet } = useBreakpoint();
  const t = useT();

  // 平板临时收起（会话态，不写持久化）—— 平板默认走 80px 图标栏，用户可临时展开；
  // 桌面折叠偏好（siderCollapsed）持久化，绝不被平板断点污染。
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const effectiveCollapsed = isTablet ? !tabletExpanded : siderCollapsed;
  const onSiderToggle = () => {
    if (isTablet) {
      setTabletExpanded((v) => !v);
      return;
    }
    toggleSider();
  };

  // 服务端驱动菜单：AppLayout 是顶层编排层，可依赖 features；components 只接收展示所需树。
  const { data: menus } = useQuery(currentMenusOptions());
  const menuTree = useMemo(() => (menus ? buildMenuTree(menus) : []), [menus]);
  const menuItems = useMemo<MenuProps['items']>(() => {
    const home = {
      key: paths.home,
      icon: <HomeOutlined />,
      label: t('menu.home'),
    };

    const dynamic = menuTreeToAntdItems(menuTree, t);
    return [home, ...dynamic];
  }, [menuTree, t]);

  const selectedKeys = [location.pathname];

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key !== location.pathname) {
      void navigate(key);
    }
    if (isMobile) {
      closeMobileDrawer();
    }
  };

  const menu = (
    <Menu
      mode="inline"
      theme="dark"
      items={menuItems}
      selectedKeys={selectedKeys}
      onClick={onMenuClick}
      className="border-none"
    />
  );

  const logo = (
    <div className="janus-sider-logo flex h-14 items-center justify-center bg-nav px-4 text-white">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-white/10 text-sm font-semibold">
        J
      </span>
      <span className="ml-2 truncate text-sm font-semibold tracking-normal">
        {t('common.appName')}
      </span>
    </div>
  );

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        void navigate(paths.login, { replace: true });
      },
    });
  };

  return (
    <Layout className="min-h-[100dvh] overflow-x-hidden bg-page">
      {isMobile ? (
        <Drawer
          placement="left"
          open={isMobile && mobileDrawerOpen}
          closable={false}
          width={SIDER_WIDTH}
          className="janus-mobile-drawer"
          onClose={closeMobileDrawer}
        >
          {logo}
          {menu}
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={effectiveCollapsed}
          collapsedWidth={SIDER_COLLAPSED_WIDTH}
          trigger={null}
          width={SIDER_WIDTH}
          theme="dark"
          className="janus-sider min-h-[100dvh]"
          onCollapse={onSiderToggle}
        >
          {logo}
          {menu}
        </Sider>
      )}
      <Layout className="h-[100dvh] min-w-0 bg-page">
        <Header className="sticky top-0 z-10 h-14 bg-header-bg p-0 leading-none shadow-sm">
          <Navbar
            siderCollapsed={effectiveCollapsed}
            isMobile={isMobile}
            onNavigationToggle={isMobile ? openMobileDrawer : onSiderToggle}
            menuTree={menuTree}
            onLogout={onLogout}
          />
        </Header>
        <TagsView menuTree={menuTree} />
        <Content className="min-h-0 min-w-0 flex-1 overflow-hidden bg-page">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
