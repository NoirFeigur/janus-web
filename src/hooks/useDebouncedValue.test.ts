/** useDebouncedValue 单测 —— 防抖时序（假定时器）。 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初始即返回传入值', () => {
    const { result } = renderHook(() => useDebouncedValue('a', 300));
    expect(result.current).toBe('a');
  });

  it('delay 内连续变化只在停止后取最终值', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'ab' });
    rerender({ v: 'abc' });
    // 未过 delay，仍是旧值。
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // 过 delay 后取最终值。
    expect(result.current).toBe('abc');
  });

  it('delay 未满时不更新', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 500), {
      initialProps: { v: 'x' },
    });
    rerender({ v: 'y' });
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('x');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('y');
  });
});
