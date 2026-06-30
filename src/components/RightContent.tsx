/** 顶栏右侧内容 —— 用户菜单 + 语言切换（设计规范 §3.1）。 */
import { LogoutOutlined, TranslationOutlined } from '@ant-design/icons';
import { type AppLocale } from '@lib/i18n';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import { Dropdown, Space } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';

export function RightContent() {
  const intl = useIntl();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const onLogout = () => {
    clear();
    void navigate(paths.login);
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
              label: intl.formatMessage({ id: 'common.logout' }),
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
