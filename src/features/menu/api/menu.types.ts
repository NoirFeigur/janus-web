/**
 * menu feature 本地类型 —— 服务端菜单读模型（generated）+ 前端建树后的节点。
 * API 出入参类型来自 generated（不手抄）；MenuTreeNode 是前端建树的视图类型。
 */
import type { components } from '@/api/generated/types';

/** 后端菜单读模型（generated）。扁平结构，靠 parent_id 自关联。 */
export type MenuRead = components['schemas']['MenuRead'];

/** 菜单类型：catalog=分组目录（无页面）/ menu=可路由页面 / button=按钮级权限码。 */
export type MenuType = 'catalog' | 'menu' | 'button';

/** 建树后的菜单节点 —— MenuRead + children。 */
export interface MenuTreeNode extends MenuRead {
  children: MenuTreeNode[];
}
