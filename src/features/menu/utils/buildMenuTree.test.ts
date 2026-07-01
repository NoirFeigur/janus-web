/** buildMenuTree 单测 —— 建树、排序、孤儿容错。 */
import { describe, expect, it } from 'vitest';

import type { MenuRead } from '../api/menu.types';

import { buildMenuTree } from './buildMenuTree';

/** 造一个 MenuRead，只填测试关心的字段，其余给合理默认。 */
function menu(partial: Partial<MenuRead> & Pick<MenuRead, 'id'>): MenuRead {
  return {
    id: partial.id,
    name: partial.name ?? `menu.${partial.id}`,
    parent_id: partial.parent_id ?? null,
    menu_type: partial.menu_type ?? 'menu',
    perms: partial.perms ?? null,
    path: partial.path ?? `/${partial.id}`,
    component: partial.component ?? 'PlaceholderPage',
    query_param: partial.query_param ?? null,
    is_frame: partial.is_frame ?? false,
    is_cache: partial.is_cache ?? true,
    icon: partial.icon ?? null,
    sort_order: partial.sort_order ?? 0,
    visible: partial.visible ?? true,
    status: partial.status ?? 'active',
    remark: partial.remark ?? null,
    created_at: partial.created_at ?? '2024-01-01T00:00:00Z',
  };
}

describe('buildMenuTree', () => {
  it('把扁平列表按 parent_id 建成树', () => {
    const flat = [
      menu({ id: '1', parent_id: null }),
      menu({ id: '2', parent_id: '1' }),
      menu({ id: '3', parent_id: '1' }),
    ];
    const tree = buildMenuTree(flat);
    expect(tree).toHaveLength(1);
    expect(tree[0]?.id).toBe('1');
    expect(tree[0]?.children.map((c) => c.id)).toEqual(['2', '3']);
  });

  it('同级按 sort_order 升序排列', () => {
    const flat = [
      menu({ id: 'a', parent_id: null, sort_order: 2 }),
      menu({ id: 'b', parent_id: null, sort_order: 0 }),
      menu({ id: 'c', parent_id: null, sort_order: 1 }),
    ];
    const tree = buildMenuTree(flat);
    expect(tree.map((n) => n.id)).toEqual(['b', 'c', 'a']);
  });

  it('子层也递归按 sort_order 排序', () => {
    const flat = [
      menu({ id: 'root', parent_id: null }),
      menu({ id: 'x', parent_id: 'root', sort_order: 5 }),
      menu({ id: 'y', parent_id: 'root', sort_order: 1 }),
    ];
    const tree = buildMenuTree(flat);
    expect(tree[0]?.children.map((n) => n.id)).toEqual(['y', 'x']);
  });

  it('父节点不在返回集里的孤儿挂到顶层（容错不丢节点）', () => {
    const flat = [
      menu({ id: '1', parent_id: null }),
      menu({ id: 'orphan', parent_id: '999' }), // 父 999 不存在
    ];
    const tree = buildMenuTree(flat);
    expect(tree.map((n) => n.id).sort()).toEqual(['1', 'orphan']);
  });

  it('空列表返回空树', () => {
    expect(buildMenuTree([])).toEqual([]);
  });
});
