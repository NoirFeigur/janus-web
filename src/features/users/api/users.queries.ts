/** query key 工厂 + queryOptions（设计规范 §query key 工厂）。 */
import { queryOptions } from '@tanstack/react-query';

import { getUser, listUsers, type ListUsersParams } from './users.api';

export const userQueries = {
  all: () => ['users'] as const,
  lists: () => [...userQueries.all(), 'list'] as const,
  list: (params: ListUsersParams) => [...userQueries.lists(), params] as const,
  details: () => [...userQueries.all(), 'detail'] as const,
  detail: (id: string) => [...userQueries.details(), id] as const,
};

export const userListOptions = (params: ListUsersParams) =>
  queryOptions({
    queryKey: userQueries.list(params),
    queryFn: () => listUsers(params),
  });

export const userDetailOptions = (id: string) =>
  queryOptions({
    queryKey: userQueries.detail(id),
    queryFn: () => getUser(id),
  });
