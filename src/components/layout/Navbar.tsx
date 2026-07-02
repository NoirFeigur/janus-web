/** 顶部横向栏 —— 折叠、面包屑、语言与用户菜单。 */
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { type AppLocale } from '@lib/i18n';
import { Avatar, Button, Dropdown, Space, Tooltip } from 'antd';

import { Breadcrumb } from './Breadcrumb';
import type { LayoutMenuNode } from './menuTree.types';

import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';

interface NavbarProps {
  siderCollapsed: boolean;
  isMobile: boolean;
  onNavigationToggle: () => void;
  menuTree: readonly LayoutMenuNode[];
  onLogout: () => void;
}

export function Navbar({
  siderCollapsed,
  isMobile,
  onNavigationToggle,
  menuTree,
  onLogout,
}: NavbarProps) {
  const t = useT();
  const user = useAuthStore((state) => state.user);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const displayName = user?.realName ?? user?.username ?? 'User';
  const navigationLabel = isMobile
    ? t('common.nav.open')
    : t(siderCollapsed ? 'common.nav.expand' : 'common.nav.collapse');
  const navigationIcon = isMobile ? (
    <MenuOutlined />
  ) : siderCollapsed ? (
    <MenuUnfoldOutlined />
  ) : (
    <MenuFoldOutlined />
  );

  return (
    <div className="flex h-full min-w-0 items-center justify-between bg-header-bg px-4">
      <div className="flex min-w-0 items-center gap-4">
        <Tooltip title={navigationLabel}>
          <Button
            type="text"
            icon={navigationIcon}
            aria-label={navigationLabel}
            className="h-9 w-9 rounded-md text-text-primary hover:bg-table-row-selected hover:text-primary"
            onClick={onNavigationToggle}
          />
        </Tooltip>
        <div className="hidden min-w-0 sm:block">
          <Breadcrumb menuTree={menuTree} />
        </div>
      </div>
      <Space size="small" className="shrink-0">
        <Dropdown
          menu={{
            items: [
              { key: 'zh-CN', label: '简体中文' },
              { key: 'en-US', label: 'English' },
            ],
            onClick: ({ key }) => setLocale(key as AppLocale),
          }}
        >
          <Button
            type="text"
            icon={<TranslationOutlined />}
            aria-label={t('common.language')}
            className="h-9 w-9 rounded-md text-text-primary hover:bg-table-row-selected hover:text-primary"
          />
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: t('common.logout'),
                onClick: onLogout,
              },
            ],
          }}
        >
          <button
            type="button"
            className="flex h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-text-primary transition-colors hover:bg-table-row-selected hover:text-primary"
          >
            <Avatar size="small" icon={<UserOutlined />} />
            <span className="hidden max-w-32 truncate sm:inline">{displayName}</span>
          </button>
        </Dropdown>
      </Space>
    </div>
  );
}
