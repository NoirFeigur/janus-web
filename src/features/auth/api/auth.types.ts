/**
 * auth feature 本地类型 —— 表单态 + 会话映射。
 * API 出入参类型来自 generated（不手抄），此处仅本模块专用的视图/表单类型。
 */
import type { components } from '@/lib/openapi/types';

/** 登录表单值。 */
export interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

/** 后端 token 读模型（generated）。 */
export type TokenRead = components['schemas']['TokenRead'];

/** 后端当前用户读模型（generated）。 */
export type CurrentUserRead = components['schemas']['CurrentUserRead'];
