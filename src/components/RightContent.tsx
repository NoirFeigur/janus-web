/** 顶栏右侧内容 —— 用户菜单 + 语言切换（设计规范 §3.1）。 */
import { LogoutOutlined, TranslationOutlined } from '@ant-design/icons';
import { useLogoutMutation } from '@features/auth/api/auth.queries';
import { type AppLocale } from '@lib/i18n';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';
import { useT } from '@/hooks/useT';

export function RightContent() {
  const t = useT();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const logoutMutation = useLogoutMutation();

  const onLogout = () => {
    // 先请求后端撤销会话（best-effort），无论成败都清本地态后回登录页。
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        void navigate(paths.login, { replace: true });
      },
    });
  };

  return (
    <Space size="middle">
      <Dropdown
        menu={{
          items: [
            { key: 'zh-CN', label: '简体中文' },
            { key: 'en-US', label: 'English' },
          ],
          onClick: ({ key }) => setLocale(key as AppLocale),
        }}
      >
        <TranslationOutlined className="cursor-pointer text-base" />
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
        <span className="cursor-pointer">{user?.realName ?? user?.username ?? 'User'}</span>
      </Dropdown>
    </Space>
  );
}
