/** query key 工厂 + queryOptions + mutation hooks（设计规范 §query key 工厂）。 */
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  batchDeleteUsers,
  createUser,
  deleteUser,
  getUser,
  listDepartmentOptions,
  listRoleOptions,
  listUsers,
  resetUserPassword,
  updateUser,
  type ListUsersParams,
} from './users.api';
import type { UserCreate, UserUpdate } from './users.types';

export const userQueries = {
  all: () => ['users'] as const,
  lists: () => [...userQueries.all(), 'list'] as const,
  list: (params: ListUsersParams) => [...userQueries.lists(), params] as const,
  details: () => [...userQueries.all(), 'detail'] as const,
  detail: (id: string) => [...userQueries.details(), id] as const,
  roleOptions: () => [...userQueries.all(), 'roleOptions'] as const,
  departmentOptions: () => [...userQueries.all(), 'departmentOptions'] as const,
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

/** 引用型下拉数据缓存久些（角色/部门变动低频）,避免每次开抽屉都重拉。 */
export const roleOptionsQuery = () =>
  queryOptions({
    queryKey: userQueries.roleOptions(),
    queryFn: () => listRoleOptions(),
    staleTime: 5 * 60 * 1000,
  });

export const departmentOptionsQuery = () =>
  queryOptions({
    queryKey: userQueries.departmentOptions(),
    queryFn: () => listDepartmentOptions(),
    staleTime: 5 * 60 * 1000,
  });

/**
 * 写操作 mutation —— 成功后按层级失效 userQueries.lists()(级联所有列表查询重取)。
 *
 * 错误 toast 由 HTTP 拦截器统一处理(非 422);422 字段错误经 ApiError.fieldErrors
 * 透传给表单做字段级提示,故此处不吞错。成功提示交由调用方(抽屉/确认)按语境给。
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreate) => createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdate }) =>
      updateUser(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: userQueries.lists() });
      void queryClient.invalidateQueries({ queryKey: userQueries.detail(id) });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });
}

export function useBatchDeleteUsersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => batchDeleteUsers(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });
}

export function useResetUserPasswordMutation() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      resetUserPassword(id, password),
  });
}
