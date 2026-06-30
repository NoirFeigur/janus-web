/** TanStack QueryClient —— 默认 staleTime / 重试策略。 */
import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 4xx 客户端错误不重试；其余（网络/5xx）最多重试 2 次。
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
