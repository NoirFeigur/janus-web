/** users 业务请求函数 —— 调基础 HTTP 层，是人写的边界（设计规范 §API 三层）。 */
import type { User } from './users.types';

import { apiClient } from '@/lib/http/interceptors';
import type { Page } from '@/types/api';


export interface ListUsersParams {
  limit: number;
  offset: number;
  keyword?: string;
  employee_no?: string;
  status?: string;
}

export async function listUsers(params: ListUsersParams): Promise<Page<User>> {
  const res = await apiClient.get<Page<User>>('/admin/users', { params });
  return res.data;
}

export async function getUser(id: string): Promise<User> {
  const res = await apiClient.get<User>(`/admin/users/${id}`);
  return res.data;
}
