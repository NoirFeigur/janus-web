/** proTableRequest 适配器单测 —— current/pageSize ↔ offset/limit 换算 + 失败态。 */
import { describe, expect, it, vi } from 'vitest';

import { proTableRequest } from './proTableRequest';

import type { Page } from '@/types/api';

function pageOf<T>(items: T[], total: number): Page<T> {
  return { items, total, limit: items.length, offset: 0 };
}

describe('proTableRequest', () => {
  it('把 current/pageSize 换算成 offset/limit 传给 fetcher', async () => {
    const fetcher = vi.fn().mockResolvedValue(pageOf([{ id: '1' }], 1));
    await proTableRequest(fetcher, { current: 3, pageSize: 20 });
    // 第 3 页、每页 20 → offset = (3-1)*20 = 40，limit = 20。
    expect(fetcher).toHaveBeenCalledWith({ limit: 20, offset: 40 });
  });

  it('缺省分页时 current=1/pageSize=20 → offset=0', async () => {
    const fetcher = vi.fn().mockResolvedValue(pageOf([], 0));
    await proTableRequest(fetcher, {});
    expect(fetcher).toHaveBeenCalledWith({ limit: 20, offset: 0 });
  });

  it('透传筛选字段（非分页参数）给 fetcher', async () => {
    const fetcher = vi.fn().mockResolvedValue(pageOf([], 0));
    await proTableRequest(fetcher, { current: 1, pageSize: 10, keyword: 'ann', status: 'active' });
    expect(fetcher).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      keyword: 'ann',
      status: 'active',
    });
  });

  it('成功时返回 { data, total, success:true }', async () => {
    const items = [{ id: '1' }, { id: '2' }];
    const fetcher = vi.fn().mockResolvedValue(pageOf(items, 42));
    const result = await proTableRequest(fetcher, { current: 1, pageSize: 20 });
    expect(result).toEqual({ data: items, total: 42, success: true });
  });

  it('fetcher 抛错时吞掉异常返回失败态（不向上抛）', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('boom'));
    const result = await proTableRequest(fetcher, { current: 1, pageSize: 20 });
    expect(result).toEqual({ data: [], total: 0, success: false });
  });
});
