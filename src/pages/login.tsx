/**
 * 登录页 —— 分栏品牌页（当前仅密码登录；企微扫码登录后端暂未支持，见设计规范 §11.1）。
 *
 * 左栏：Laplace navy 品牌面，Janus「网关」门户motif（呼应罗马门神 Janus = 通道/门户）。
 * 右栏：洁净表单，标准 AntD 表单原语（可信、熟悉，不发明控件）。
 * 移动端：左栏隐藏，顶部落一枚紧凑品牌标，单列表单。
 *
 * 登录逻辑走 useLoginMutation（login→getMe→setSession 复合流）；成功后按 AuthGuard
 * 带来的 from 回跳，无则去固定首页 '/'。错误由拦截器统一按 code toast，不在此重复弹。
 */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLoginMutation } from '@features/auth/api/auth.queries';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';
import { useT } from '@/hooks/useT';

interface LoginValues {
  username: string;
  password: string;
  remember: boolean;
}

interface FromState {
  from?: string;
}

/** 开发期预填，方便本地调试；生产构建（import.meta.env.DEV=false）下为空，绝不硬编码凭据进包。 */
const DEV_DEFAULTS = import.meta.env.DEV
  ? { username: 'admin', password: '123456' }
  : {};

/** 门户 motif —— 同心弧 + 节点点阵，navy 深浅分层，缓旋。纯装饰，aria-hidden。 */
function PortalMotif() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-h-[26rem] max-w-[26rem]"
      fill="none"
      aria-hidden="true"
    >
      <g className="janus-portal-ring" opacity="0.9">
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        <circle
          cx="200"
          cy="200"
          r="120"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 10"
          opacity="0.42"
        />
        <circle cx="200" cy="200" r="88" stroke="currentColor" strokeWidth="1" opacity="0.36" />
      </g>
      {/* 中心门户开口：两道相对的弧，喻「双面门神」通道。 */}
      <path d="M200 108 A92 92 0 0 1 200 292" stroke="currentColor" strokeWidth="2.5" opacity="0.72" />
      <path d="M200 292 A92 92 0 0 1 200 108" stroke="currentColor" strokeWidth="2.5" opacity="0.32" />
      <circle cx="200" cy="200" r="6" fill="currentColor" opacity="0.78" />
      {/* 节点点阵 —— 网关的「连接」意象。 */}
      <g fill="currentColor" opacity="0.52">
        <circle cx="200" cy="50" r="3" />
        <circle cx="350" cy="200" r="3" />
        <circle cx="200" cy="350" r="3" />
        <circle cx="50" cy="200" r="3" />
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const t = useT();

  const onFinish = (values: LoginValues) => {
    loginMutation.mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: () => {
          const from = (location.state as FromState | null)?.from;
          void navigate(from ?? paths.home, { replace: true });
        },
      },
    );
  };

  return (
    <div className="grid min-h-[100dvh] bg-white lg:grid-cols-2">
      {/* —— 左：品牌面（lg+ 显示） —— */}
      <aside className="relative hidden overflow-hidden bg-laplace-deep lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="relative z-10 flex items-center gap-3 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-lg font-semibold">
            J
          </span>
          <span className="text-lg font-semibold tracking-tight">
            {t('common.appName')}
          </span>
        </div>

        {/* 门户 motif 居中铺陈。 */}
        <div className="pointer-events-none absolute inset-0 z-0 grid place-items-center text-white/70">
          <PortalMotif />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white">
            {t('login.headline')}
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-white/70">
            {t('login.subhead')}
          </p>
        </div>
      </aside>

      {/* —— 右：表单面 —— */}
      <main className="flex items-center justify-center bg-page px-6 py-12 sm:px-12 lg:bg-white">
        <div className="janus-rise w-full max-w-sm rounded-md bg-card-bg p-6 shadow-sm sm:p-8 lg:p-0 lg:shadow-none">
          {/* 移动端紧凑品牌标（lg 隐藏，左栏已承担品牌）。 */}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-laplace text-lg font-semibold text-white">
              J
            </span>
            <span className="text-lg font-semibold tracking-tight text-laplace">
              {t('common.appName')}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-normal text-text-primary">
              {t('login.title')}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">{t('login.tip')}</p>
          </div>

          <Form<LoginValues>
            layout="vertical"
            requiredMark={false}
            initialValues={{ remember: true, ...DEV_DEFAULTS }}
            onFinish={onFinish}
            disabled={loginMutation.isPending}
          >
            <Form.Item
              name="username"
              label={t('common.username')}
              rules={[{ required: true, message: t('login.usernameRequired') }]}
            >
              <Input
                size="large"
                autoComplete="username"
                prefix={<UserOutlined className="text-text-secondary" />}
                placeholder={t('login.usernamePlaceholder')}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('common.password')}
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password
                size="large"
                autoComplete="current-password"
                prefix={<LockOutlined className="text-text-secondary" />}
                placeholder={t('login.passwordPlaceholder')}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="!mb-4">
              <Checkbox>{t('login.remember')}</Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loginMutation.isPending}
            >
              {t('common.login')}
            </Button>
          </Form>

          <p className="mt-6 text-center text-xs text-text-secondary">{t('login.qrSoon')}</p>
        </div>
      </main>
    </div>
  );
}
