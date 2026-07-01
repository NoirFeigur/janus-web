/** menu 业务请求函数 —— 调基础 HTTP 层，是人写的边界（设计规范 §API 三层）。 */
import type { MenuRead } from './menu.types';

import { apiClient } from '@/api/interceptors';

/**
 * 拉取当前用户可见的菜单（服务端驱动侧栏）。
 * 后端按角色过滤，超管返回全量；仅返回 active + visible 节点（按钮节点不在内）。
 */
export async function getCurrentMenus(): Promise<MenuRead[]> {
  const res = await apiClient.get<MenuRead[]>('/admin/menus/current');
  return res.data;
}
