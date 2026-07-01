/**
 * Access 门控组件测试 —— 有权限渲染 children，无权限渲染 fallback，超管旁路。
 * 直接操纵 auth.store（组件订阅 hasPermission），断言渲染结果而非实现。
 */
import { useAuthStore } from '@stores/auth.store';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Access } from './Access';

const superuser = {
  accessToken: 't',
  refreshToken: 'r',
  user: { id: '1', username: 'admin', realName: '超管', isSuperuser: true },
  permissions: [] as string[],
};

describe('Access', () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });
  afterEach(() => {
    useAuthStore.getState().clear();
  });

  it('持有权限码：渲染 children', () => {
    useAuthStore.getState().setSession({
      accessToken: 't',
      refreshToken: 'r',
      user: { id: '2', username: 'u', realName: null, isSuperuser: false },
      permissions: ['system:user:add'],
    });
    render(
      <Access perm="system:user:add">
        <button>新建</button>
      </Access>,
    );
    expect(screen.getByRole('button', { name: '新建' })).toBeInTheDocument();
  });

  it('缺权限码：不渲染 children（默认 fallback=null）', () => {
    useAuthStore.getState().setSession({
      accessToken: 't',
      refreshToken: 'r',
      user: { id: '2', username: 'u', realName: null, isSuperuser: false },
      permissions: ['system:user:list'],
    });
    render(
      <Access perm="system:user:add">
        <button>新建</button>
      </Access>,
    );
    expect(screen.queryByRole('button', { name: '新建' })).not.toBeInTheDocument();
  });

  it('缺权限码：渲染 fallback', () => {
    useAuthStore.getState().setSession({
      accessToken: 't',
      refreshToken: 'r',
      user: { id: '2', username: 'u', realName: null, isSuperuser: false },
      permissions: [],
    });
    render(
      <Access perm="system:user:add" fallback={<span>无权限</span>}>
        <button>新建</button>
      </Access>,
    );
    expect(screen.getByText('无权限')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '新建' })).not.toBeInTheDocument();
  });

  it('超管旁路：权限码集合为空也放行', () => {
    useAuthStore.getState().setSession(superuser);
    render(
      <Access perm="anything:at:all">
        <button>操作</button>
      </Access>,
    );
    expect(screen.getByRole('button', { name: '操作' })).toBeInTheDocument();
  });
});
