/**
 * 用户筛选工具栏 —— 常驻、可一眼扫的筛选条（取代 ProTable light 折叠搜索的视觉杂乱）。
 *
 * 受控组件：父级 UserTable 持有原始筛选态（输入即时响应），防抖后喂给 ProTable 查询。
 * 关键词 + 工号为带清除的输入框；状态用分段控件（全部/启用/禁用，一眼可选）；
 * 右侧显示实时结果计数 + 重置（仅有筛选时可点）。
 */
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Segmented } from 'antd';

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
}

export function UserFilterBar({ value, onChange, onReset, total, loading }: UserFilterBarProps) {
  const t = useT();
  const hasFilter = value.keyword !== '' || value.employeeNo !== '' || value.status !== undefined;

  const statusOptions = [
    { label: t('common.all'), value: ALL },
    ...USER_STATUS_META.map((m) => ({ label: t(m.labelKey), value: m.value })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        allowClear
        size="small"
        prefix={<SearchOutlined className="text-text-tertiary" />}
        placeholder={t('pages.user.searchPlaceholder')}
        value={value.keyword}
        onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        className="w-56"
      />
      <Input
        allowClear
        size="small"
        placeholder={t('pages.user.employeeNoPlaceholder')}
        value={value.employeeNo}
        onChange={(e) => onChange({ ...value, employeeNo: e.target.value })}
        className="w-36"
      />
      <Segmented
        size="small"
        options={statusOptions}
        value={value.status ?? ALL}
        onChange={(v) => onChange({ ...value, status: v === ALL ? undefined : (v as UserStatus) })}
      />
      <div className="ml-auto flex items-center gap-2 text-xs text-text-tertiary">
        <span>{t('pages.user.totalCount', { total })}</span>
        {hasFilter && (
          <Button size="small" type="link" onClick={onReset} disabled={loading} className="!text-xs">
            {t('pages.user.clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}
