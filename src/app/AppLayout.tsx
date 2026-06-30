/** 主框架布局 —— ProLayout（侧栏 + 顶栏 + 内容区，设计规范 §3.1）。 */
import {
  ApiOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  KeyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { useUiStore } from '@stores/ui.store';
import { useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { paths } from './router/paths';

import { RightContent } from '@/components/RightContent';



export function AppLayout() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const siderCollapsed = useUiStore((s) => s.siderCollapsed);
  const setSiderCollapsed = useUiStore((s) => s.setSiderCollapsed);

  const t = (id: string) => intl.formatMessage({ id });

  return (
    <ProLayout
      title={t('common.appName')}
      logo={false}
      layout="side"
      fixSiderbar
      collapsed={siderCollapsed}
      onCollapse={setSiderCollapsed}
      location={{ pathname: location.pathname }}
      route={{
        path: '/',
        routes: [
          { path: paths.dashboard, name: t('menu.dashboard'), icon: <DashboardOutlined /> },
          { path: paths.users, name: t('menu.users'), icon: <TeamOutlined /> },
          { path: paths.credentials, name: t('menu.credentials'), icon: <KeyOutlined /> },
          { path: paths.catalog, name: t('menu.catalog'), icon: <AppstoreOutlined /> },
          { path: paths.grants, name: t('menu.grants'), icon: <DeploymentUnitOutlined /> },
          { path: paths.usage, name: t('menu.usage'), icon: <BarChartOutlined /> },
          { path: paths.quota, name: t('menu.quota'), icon: <ApiOutlined /> },
        ],
      }}
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
