/**
 * 用户筛选工具栏 —— 表格卡片的统一顶栏（旗舰范式：后续 feature 表格照此继承）。
 *
 * 左区：搜索 + 工号 + 状态分段筛选（输入防抖在父层收敛）
 * 右区：实时计数 → 重置（无筛选时禁用，常驻不跳动）→ 操作插槽（新建等）
 */
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Segmented } from 'antd';
import type { ReactNode } from 'react';

import type { UserStatus } from '../api/users.types';

import { USER_STATUS_META } from './userStatusMeta';

import { useT } from '@/hooks/useT';

/** 分段控件「全部」哨兵值 —— 映射为 status=undefined（不筛选）。 */
const ALL = '__all__';

export interface UserFilterState {
  keyword: string;
  employeeNo: string;
  status: UserStatus | undefined;
}

interface UserFilterBarProps {
  value: UserFilterState;
  onChange: (next: UserFilterState) => void;
  onReset: () => void;
  /** 回车即查（跳过防抖等待）—— 急性子用户的便捷通道 */
  onSubmit?: () => void;
  total: number;
  loading: boolean;
  /** 右侧操作区插槽（新建按钮等） */
  actions?: ReactNode;
}

export function UserFilterBar({
  value,
  onChange,
  onReset,
  onSubmit,
  total,
  loading,
  actions,
}: UserFilterBarProps) {
  const t = useT();
  const hasFilter = value.keyword !== '' || value.employeeNo !== '' || value.status !== undefined;

  const statusOptions = [
    { label: t('common.all'), value: ALL },
    ...USER_STATUS_META.map((m) => ({ label: t(m.labelKey), value: m.value })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {/* 检索组：搜索 + 工号紧邻（gap-2），与视图筛选（状态）以 gap-3 分层。 */}
      <div className="flex items-center gap-2">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-text-secondary" />}
          placeholder={t('pages.user.searchPlaceholder')}
          value={value.keyword}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
          onPressEnter={onSubmit}
          className="w-64"
        />
        <Input
          allowClear
          placeholder={t('pages.user.employeeNoPlaceholder')}
          value={value.employeeNo}
          onChange={(e) => onChange({ ...value, employeeNo: e.target.value })}
          onPressEnter={onSubmit}
          className="w-40"
        />
      </div>
      <Segmented
        size="middle"
        options={statusOptions}
        value={value.status ?? ALL}
        onChange={(v) => onChange({ ...value, status: v === ALL ? undefined : (v as UserStatus) })}
      />

      <div className="ml-auto flex items-center gap-3">
        {/* 实时计数升级为沉降底 pill：一眼可辨规模（人性化），tabular-nums 稳定不跳字，
            aria-live 播报变化。弱底而非纯文字，让「当前结果集大小」有独立的信息块。 */}
        <span
          className="bg-surface-sunken text-text-secondary rounded-md px-2.5 py-1 text-sm tabular-nums"
          aria-live="polite"
        >
          {t('pages.user.totalCount', { total })}
        </span>
        {/* 重置常驻，无筛选时禁用——位置不跳动，可发现性优于忽隐忽现 */}
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined />}
          onClick={onReset}
          disabled={!hasFilter || loading}
        >
          {t('common.reset')}
        </Button>
        {actions ? (
          <>
            <span className="h-4 w-px bg-border-secondary" aria-hidden />
            {actions}
          </>
        ) : null}
      </div>
    </div>
  );
}
