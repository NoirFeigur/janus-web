/**
 * 扁平菜单列表 → 树。后端返回扁平 MenuRead[]（parent_id 自关联），
 * 前端建树供 ProLayout 渲染。同级按 sort_order 升序（后端已排，此处再保序）。
 *
 * 说明：
 * - 只建"有父可依"的树；parent_id 指向不存在节点的孤儿挂到顶层（容错，不丢节点）。
 * - button 类型节点不进侧栏（后端 /current 已过滤 visible=false，正常不会返回），
 *   此处不特殊处理类型，纯按 parent_id 建树，由调用方决定渲染哪些类型。
 */
import type { MenuRead, MenuTreeNode } from '../api/menu.types';

export function buildMenuTree(flat: readonly MenuRead[]): MenuTreeNode[] {
  // 一次遍历建 id → node（带空 children）映射。
  const nodeById = new Map<string, MenuTreeNode>();
  for (const item of flat) {
    nodeById.set(item.id, { ...item, children: [] });
  }

  const roots: MenuTreeNode[] = [];
  for (const item of flat) {
    const node = nodeById.get(item.id)!;
    const parent = item.parent_id !== null ? nodeById.get(item.parent_id) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      // 顶层，或父节点不在返回集里（越权/过滤）→ 作为根，容错不丢。
      roots.push(node);
    }
  }

  sortByOrder(roots);
  return roots;
}

/** 递归按 sort_order 升序（并列按 id 稳定）排序每一层。 */
function sortByOrder(nodes: MenuTreeNode[]): void {
  nodes.sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
  for (const node of nodes) {
    if (node.children.length > 0) {
      sortByOrder(node.children);
    }
  }
}
