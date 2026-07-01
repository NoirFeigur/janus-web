/**
 * useDebouncedValue —— 防抖值 hook（跨 feature 共享）。
 *
 * 典型场景:ProTable / 搜索框输入按 code 触发查询前，先防抖降低请求频次。
 * 值在 delay 内持续变化时只在停止后取最终值;组件卸载/依赖变更时清理定时器。
 */
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
