/**
 * 用户状态徽章 —— 圆点 + 文字双通道（状态永不只靠颜色，达 WCAG AA）。
 *
 * tone 映射 §2.1 状态 token（Tailwind 由 @theme inline 生成 bg-success/bg-error… 工具类）。
 * 文字用默认墨色保证对比度；语义色只承载圆点，避免彩色文字在密集表格里发虚。
 */
import type { UserStatus } from '../api/users.types';

import { USER_STATUS_META, type StatusTone } from './userStatusMeta';

import { useT } from '@/hooks/useT';

const TONE_DOT: Record<StatusTone, string> = {
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const t = useT();
  const meta = USER_STATUS_META.find((m) => m.value === status);

  // 未知状态兜底：灰点 + 原始 code，绝不空渲染。
  if (!meta) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-text-tertiary" />
        <span className="text-text-secondary">{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-1.5 rounded-full ${TONE_DOT[meta.tone]}`} aria-hidden />
      <span className="text-text-primary">{t(meta.labelKey)}</span>
    </span>
  );
}
