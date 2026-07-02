/**
 * 用户筛选工具栏 —— 表格卡片的统一顶栏。
 *
 * 左侧：搜索 + 工号 + 状态筛选
 * 右侧：计数 + 重置 + 操作按钮（新建等，由 slot 传入）
 */
import { SearchOutlined } from '@ant-design/icons';
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
  total: number;
  loading: boolean;
  /** 右侧操作区插槽（新建按钮等） */
  actions?: ReactNode;
}

export function UserFilterBar({ value, onChange, onReset, total, loading, actions }: UserFilterBarProps) {
  const t = useT();
  const hasFilter = value.keyword !== '' || value.employeeNo !== '' || value.status !== undefined;

  const statusOptions = [
    { label: t('common.all'), value: ALL },
    ...USER_STATUS_META.map((m) => ({ label: t(m.labelKey), value: m.value })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        allowClear
        prefix={<SearchOutlined className="text-text-tertiary" />}
        placeholder={t('pages.user.searchPlaceholder')}
        value={value.keyword}
        onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        className="w-52"
      />
      <Input
        allowClear
        placeholder={t('pages.user.employeeNoPlaceholder')}
        value={value.employeeNo}
        onChange={(e) => onChange({ ...value, employeeNo: e.target.value })}
        className="w-32"
      />
      <Segmented
        size="middle"
        options={statusOptions}
        value={value.status ?? ALL}
        onChange={(v) => onChange({ ...value, status: v === ALL ? undefined : (v as UserStatus) })}
      />

      {hasFilter && (
        <Button size="small" type="link" onClick={onReset} disabled={loading}>
          {t('pages.user.clearFilters')}
        </Button>
      )}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-text-tertiary">
          {t('pages.user.totalCount', { total })}
        </span>
        {actions}
      </div>
    </div>
  );
}
