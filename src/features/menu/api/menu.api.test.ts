/**
 * menu.api 测试 —— getCurrentMenus 打 /admin/menus/current，成功信封被拦截器解包。
 * import '@/api/interceptors' 挂载真实拦截器；MSW 返回信封，断言拿到内层数组。
 */
import '@/api/interceptors';

import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '../../../../tests/msw/server';

import { getCurrentMenus } from './menu.api';

describe('menu.api', () => {
  it('getCurrentMenus 请求 /admin/menus/current 并解包信封为菜单数组', async () => {
    const rows = [
      {
        id: '1',
        name: 'menu.dashboard',
        parent_id: null,
        menu_type: 'menu',
        perms: null,
        path: '/dashboard',
        component: 'DashboardPage',
        query_param: null,
        is_frame: false,
        is_cache: true,
        icon: 'dashboard',
        sort_order: 0,
        visible: true,
        status: 'active',
        remark: null,
        created_at: '2024-01-01T00:00:00Z',
      },
    ];
    server.use(
      http.get('*/admin/menus/current', () =>
        HttpResponse.json({ success: true, data: rows, trace_id: 't' }),
      ),
    );

    const menus = await getCurrentMenus();
    expect(menus).toHaveLength(1);
    expect(menus[0]?.path).toBe('/dashboard');
    expect(menus[0]?.component).toBe('DashboardPage');
  });
});
