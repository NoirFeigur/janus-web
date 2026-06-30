/** 登录页 —— 当前仅密码登录（企微扫码登录后端暂未支持，见设计规范 §11.1）。 */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { useAuthStore } from '@stores/auth.store';
import { App } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';

interface LoginValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const setSession = useAuthStore((s) => s.setSession);

  const onFinish = (values: LoginValues): Promise<boolean> => {
    // TODO: 接 /auth/login。当前桩：写入占位会话以便走通鉴权路由。
    setSession({
      accessToken: 'dev-token',
      refreshToken: 'dev-refresh',
      user: { id: '0', username: values.username, realName: null },
      permissions: [],
    });
    void message.success(intl.formatMessage({ id: 'common.success' }));
    void navigate(paths.dashboard);
    return Promise.resolve(true);
  };

  return (
    <ProConfigProvider>
      <div className="grid min-h-screen place-items-center bg-page">
        <LoginForm<LoginValues>
          title={intl.formatMessage({ id: 'common.appName' })}
          onFinish={onFinish}
          submitter={{ searchConfig: { submitText: intl.formatMessage({ id: 'common.login' }) } }}
        >
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder={intl.formatMessage({ id: 'common.username' })}
            rules={[{ required: true }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder={intl.formatMessage({ id: 'common.password' })}
            rules={[{ required: true }]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}
