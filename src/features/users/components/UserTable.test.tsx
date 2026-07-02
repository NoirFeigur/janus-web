/**
 * UserTable 组件测 —— 全链路：MSW 发成功信封 → 响应拦截器解包 → ProTable 渲染。
 *
 * 顺带验证:表头走 i18n（zh-CN 中文列名）、offset/limit 请求参数正确、
 * 行数据（用户名/工号）与状态徽章（启用/禁用）渲染到位。
 * 注:筛选栏的状态分段控件也含「启用/禁用」文案,故状态断言须锚定表体(.ant-table-tbody)。
 */
import { useAuthStore } from '@stores/auth.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import { App as AntdApp } from 'antd';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { RawIntlProvider } from 'react-intl';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../../../../tests/msw/server';

import { UserTable } from './UserTable';


import { createAppIntl } from '@/lib/i18n';

/**
 * UserTable 依赖三重上下文：i18n（列名文案）、QueryClient（行内 CRUD mutation 钩子）、
 * AntD App（App.useApp() 取 message/modal）。测试逐个提供,贴近真实装配。
 * 每次新建 QueryClient 并关重试,避免用例间缓存串扰、失败请求拖慢。
 */
function renderWithIntl(node: ReactNode) {
  const intl = createAppIntl('zh-CN');
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <RawIntlProvider value={intl}>
      <QueryClientProvider client={queryClient}>
        <AntdApp>{node}</AntdApp>
      </QueryClientProvider>
    </RawIntlProvider>,
  );
}

const SAMPLE_USERS = [
  {
    id: '1001',
    username: 'ann',
    employee_no: 'E-1001',
    real_name: '安妮',
    email: 'ann@corp.com',
    mobile: null,
    department_id: null,
    status: 'active',
    preferred_locale: 'zh-CN',
    remark: null,
    created_at: '2026-01-01T08:00:00Z',
    role_ids: [],
  },
  {
    id: '1002',
    username: 'bob',
    employee_no: 'E-1002',
    real_name: '鲍勃',
    email: null,
    mobile: null,
    department_id: null,
    status: 'disabled',
    preferred_locale: 'zh-CN',
    remark: null,
    created_at: '2026-01-02T08:00:00Z',
    role_ids: [],
  },
];

describe('UserTable', () => {
  beforeEach(() => {
    // 请求拦截器会挂 Authorization；给个 token 让链路贴近真实。
    useAuthStore.setState({
      accessToken: 'test-token',
      refreshToken: null,
      user: null,
      permissions: [],
    });
  });

  afterEach(() => {
    useAuthStore.getState().clear();
  });

  it('拉取并渲染用户行（成功信封被拦截器解包）', async () => {
    server.use(
      http.get('*/admin/users', () =>
        HttpResponse.json({
          success: true,
          data: { items: SAMPLE_USERS, total: 2, limit: 20, offset: 0 },
          trace_id: 't-1',
        }),
      ),
    );

    renderWithIntl(<UserTable />);

    // 行数据出现即证明 request→interceptor unwrap→ProTable 全链路通。
    expect(await screen.findByText('ann')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('E-1001')).toBeInTheDocument();
    // 状态徽章在表体渲染：active→启用、disabled→禁用（i18n）。
    // 锚定表体以排除筛选栏分段控件里同名的「启用/禁用」。
    const tbody = document.querySelector<HTMLElement>('.ant-table-tbody');
    if (!tbody) {
      throw new Error('table body not found');
    }
    expect(within(tbody).getByText('启用')).toBeInTheDocument();
    expect(within(tbody).getByText('禁用')).toBeInTheDocument();
  });

  it('表头列名走 i18n（zh-CN）', async () => {
    server.use(
      http.get('*/admin/users', () =>
        HttpResponse.json({
          success: true,
          data: { items: [], total: 0, limit: 20, offset: 0 },
          trace_id: 't-2',
        }),
      ),
    );

    renderWithIntl(<UserTable />);

    // 表头列名走 i18n。sticky + 横向滚动使 AntD 拆出多个 <table>（表头/表体分离），
    // 故按 columnheader 角色取列名，不锚定单一 table。
    const usernameHeader = await screen.findByRole('columnheader', { name: '用户名' });
    expect(usernameHeader).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '工号' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '状态' })).toBeInTheDocument();
  });

  it('以 offset/limit 请求后端（current/pageSize 已换算）', async () => {
    let capturedUrl = '';
    server.use(
      http.get('*/admin/users', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({
          success: true,
          data: { items: [], total: 0, limit: 20, offset: 0 },
          trace_id: 't-3',
        });
      }),
    );

    renderWithIntl(<UserTable />);

    await waitFor(() => expect(capturedUrl).not.toBe(''));
    const url = new URL(capturedUrl);
    // 首屏 current=1/pageSize=20 → limit=20 & offset=0。
    expect(url.searchParams.get('limit')).toBe('20');
    expect(url.searchParams.get('offset')).toBe('0');
  });
});
