/**
 * 用户筛选工具栏 —— 专注检索：只管「找到目标用户」，不掺任何写操作或计数。
 *
 * 左区：搜索 + 工号 + 状态下拉筛选（输入防抖在父层收敛，回车即查跳过等待）
 * 右区：重置（无筛选时禁用，常驻不跳动）
 *
 * 计数归分页器、新建/批量删除/导出归表格卡片的操作栏 —— 各司其职，见 DESIGN.md §8。
 */
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';

import type { UserStatus } from '../api/users.types';

import { USER_STATUS_META } from './userStatusMeta';

import { useT } from '@/hooks/useT';

/** 状态下拉「全部」哨兵值 —— 映射为 status=undefined（不筛选）。 */
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
  loading: boolean;
}

export function UserFilterBar({ value, onChange, onReset, onSubmit, loading }: UserFilterBarProps) {
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
      {/* 状态筛选：Select 而非 Segmented —— 与输入框同为方框控件，检索行视觉统一；
          且作为旗舰范式，后续多值筛选（渠道/类型等）可直接继承同一控件。ALL 哨兵映射
          status=undefined（不筛选）。 */}
      <Select
        size="middle"
        options={statusOptions}
        value={value.status ?? ALL}
        onChange={(v) => onChange({ ...value, status: v === ALL ? undefined : (v as UserStatus) })}
        className="w-32"
      />

      {/* 重置常驻右侧，无筛选时禁用——位置不跳动，可发现性优于忽隐忽现。 */}
      <Button
        type="text"
        size="small"
        icon={<ReloadOutlined />}
        onClick={onReset}
        disabled={!hasFilter || loading}
        className="ml-auto"
      >
        {t('common.reset')}
      </Button>
    </div>
  );
}
