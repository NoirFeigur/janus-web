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

/**
 * 新建用户入参。
 *
 * 雪花 ID 一律走**字符串**:后端读模型把 department_id / role_ids 序列化为字符串
 * (雪花 ~18 位,超 JS Number.MAX_SAFE_INTEGER,转 number 会丢精度)。写入方向后端
 * schema 声明为 int,但 Pydantic lax 模式对 JSON 里的字符串做无损 str→int 强制转换
 * (已验证 198268490598055936 完整存活),故前端全程持有字符串、原样发送即可。
 */
export interface UserCreate {
  username: string;
  employee_no: string;
  password?: string | null;
  real_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  department_id?: string | null;
  status: UserStatus;
  preferred_locale: string;
  remark?: string | null;
  role_ids?: string[];
}

/** 编辑用户入参(部分更新;未传字段不变;role_ids=null 表示不改,[]表示清空)。 */
export interface UserUpdate {
  password?: string | null;
  real_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  department_id?: string | null;
  status?: UserStatus | null;
  preferred_locale?: string | null;
  remark?: string | null;
  role_ids?: string[] | null;
}

/** 批量操作结果(后端把跳过的雪花 ID 序列化为字符串)。 */
export interface BatchResult {
  requested: number;
  affected: number;
  skipped_ids: string[];
}
