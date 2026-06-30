/** users 模块本地类型（API 类型最终来自 generated；此处手写镜像）。 */

export type UserStatus = 'active' | 'disabled';

export interface User {
  id: string;
  username: string;
  employee_no: string;
  real_name: string | null;
  email: string | null;
  mobile: string | null;
  department_id: string | null;
  status: UserStatus;
  preferred_locale: string;
  remark: string | null;
  created_at: string;
  role_ids: string[];
}

export interface UserFilters {
  keyword?: string;
  status?: UserStatus;
}
