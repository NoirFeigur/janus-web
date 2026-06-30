/**
 * ProTable ↔ 后端 Page<T> 适配（设计规范 §5.4）。
 *
 * ProTable 用 current/pageSize 思维；后端用 offset/limit。这里做换算，
 * 各 feature 不重复写。fetcher 接收已换算好的 {limit, offset} + 透传筛选参数。
 */
import type { Page } from '@/types/api';

export interface ProTableResult<T> {
  data: T[];
  total: number;
  success: boolean;
}

export interface OffsetLimitParams {
  limit: number;
  offset: number;
}

/** ProTable request 的 params 形态（current/pageSize + 任意筛选字段）。 */
type ProTableParams = {
  current?: number;
  pageSize?: number;
} & Record<string, unknown>;

export async function proTableRequest<T>(
  fetcher: (args: OffsetLimitParams & Record<string, unknown>) => Promise<Page<T>>,
  params: ProTableParams,
): Promise<ProTableResult<T>> {
  const { current = 1, pageSize = 20, ...filters } = params;
  const limit = pageSize;
  const offset = (current - 1) * pageSize;
  try {
    const pageData = await fetcher({ limit, offset, ...filters });
    return { data: pageData.items, total: pageData.total, success: true };
  } catch {
    // 拦截器已 toast；这里只让 ProTable 进入失败态。
    return { data: [], total: 0, success: false };
  }
}
