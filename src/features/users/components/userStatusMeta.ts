/**
 * 用户状态展示元数据 —— 徽章与筛选分段控件的单一来源。
 *
 * value：后端 code；labelKey：走 enum.userStatus.*（codegen 同步，切语言重渲染）；
 * tone：语义色调，映射 §2.1 状态 token（success/error）。状态永不只靠颜色区分，
 * 徽章始终「圆点 + 文字」双通道。
 */
import type { UserStatus } from '../api/users.types';

export type StatusTone = 'success' | 'error' | 'warning' | 'info';

export interface UserStatusMeta {
  value: UserStatus;
  labelKey: string;
  tone: StatusTone;
}

export const USER_STATUS_META: readonly UserStatusMeta[] = [
  { value: 'active', labelKey: 'enum.userStatus.active', tone: 'success' },
  { value: 'disabled', labelKey: 'enum.userStatus.disabled', tone: 'error' },
];
