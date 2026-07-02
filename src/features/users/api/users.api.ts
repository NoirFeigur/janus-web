/** users 业务请求函数 —— 调基础 HTTP 层，是人写的边界（设计规范 §API 三层）。 */
import type { BatchResult, User, UserCreate, UserUpdate } from './users.types';

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

export async function createUser(payload: UserCreate): Promise<User> {
  const res = await apiClient.post<User>('/admin/users', payload);
  return res.data;
}

export async function updateUser(id: string, payload: UserUpdate): Promise<User> {
  const res = await apiClient.put<User>(`/admin/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}

/**
 * 批量软删除。入参 ids 为字符串(雪花 ID 全程走字符串避免 JS 精度丢失);
 * 后端 Pydantic lax 模式无损 str→int 强转。返回受影响/跳过明细。
 */
export async function batchDeleteUsers(ids: string[]): Promise<BatchResult> {
  const res = await apiClient.post<BatchResult>('/admin/users/batch-delete', { ids });
  return res.data;
}

export async function resetUserPassword(id: string, password: string): Promise<void> {
  await apiClient.post(`/admin/users/${id}/reset-password`, { password });
}

/**
 * 表单里角色/部门选择器的选项（value 为雪花字符串,与写入方向一致）。
 *
 * 无独立 roles/departments feature 可复用,且 ESLint 禁跨 feature import,故把这两个
 * 引用型下拉的极简 loader 就近放在 users feature（务实,边界干净）。只取选项需要的
 * id/name,不引整个领域模型。
 */
export interface RefOption {
  value: string;
  label: string;
}

interface RoleRefRead {
  id: string;
  name: string;
  code: string;
}

interface DeptRefRead {
  id: string;
  name: string;
}

/** 角色列表分页,拉一页足量（内部后台角色数远小于 200）喂选择器。 */
export async function listRoleOptions(): Promise<RefOption[]> {
  const res = await apiClient.get<Page<RoleRefRead>>('/admin/roles', {
    params: { limit: 200, offset: 0 },
  });
  return res.data.items.map((r) => ({ value: r.id, label: `${r.name} (${r.code})` }));
}

/** 部门是扁平 list（非分页）,直接映射为选项。 */
export async function listDepartmentOptions(): Promise<RefOption[]> {
  const res = await apiClient.get<DeptRefRead[]>('/admin/departments');
  return res.data.map((d) => ({ value: d.id, label: d.name }));
}
