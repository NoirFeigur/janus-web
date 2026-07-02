/**
 * 用户列表表格 —— 旗舰参考范式（后续 feature 表格照此继承）。
 *
 * 组成：常驻筛选工具栏（UserFilterBar，防抖喂查询）+ ProTable（关闭内建 search，
 * 表体 tabular-nums 见 global.css）+ 状态徽章 + 教学空状态 + 批量选择操作条。
 * offset/limit 适配走 proTableRequest；列随 t 重算以支持切语言。
 */
import {
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { App, Button, Space, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';

import { listUsers } from '../api/users.api';
import { useBatchDeleteUsersMutation, useDeleteUserMutation } from '../api/users.queries';
import type { User } from '../api/users.types';

import { UserFilterBar, type UserFilterState } from './UserFilterBar';
import { UserFormDrawer } from './UserFormDrawer';
import { UserResetPasswordModal } from './UserResetPasswordModal';
import { UserStatusBadge } from './UserStatusBadge';
import { UserTableEmpty } from './UserTableEmpty';

import { Access } from '@/components/Access';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useT } from '@/hooks/useT';
import { proTableRequest } from '@/utils/proTableRequest';

const EMPTY_FILTER: UserFilterState = { keyword: '', employeeNo: '', status: undefined };

/** null / 空串统一渲染为弱化占位，绝不留空白单元格。 */
function orDash(value: string | null): React.ReactNode {
  if (value === null || value === '') {
    return <span className="text-text-tertiary">—</span>;
  }
  return value;
}

export function UserTable() {
  const t = useT();
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  const [filters, setFilters] = useState<UserFilterState>(EMPTY_FILTER);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 抽屉/弹窗态：单组件双模式，record=null 即新建。
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<User | null>(null);

  const deleteMutation = useDeleteUserMutation();
  const batchDeleteMutation = useBatchDeleteUsersMutation();

  // 输入类筛选防抖收敛为查询参数；状态是分段控件（点选，无需防抖）。
  const debouncedKeyword = useDebouncedValue(filters.keyword);
  const debouncedEmployeeNo = useDebouncedValue(filters.employeeNo);

  // params 变化触发 ProTable 重取（承载筛选态 → 请求）。
  const queryParams = useMemo(
    () => ({
      keyword: debouncedKeyword.trim() || undefined,
      employee_no: debouncedEmployeeNo.trim() || undefined,
      status: filters.status,
    }),
    [debouncedKeyword, debouncedEmployeeNo, filters.status],
  );

  const hasFilter =
    filters.keyword !== '' || filters.employeeNo !== '' || filters.status !== undefined;

  const handleReset = () => {
    setFilters(EMPTY_FILTER);
  };

  const openCreate = () => {
    setDrawerMode('create');
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const openEdit = (row: User) => {
    setDrawerMode('edit');
    setEditingUser(row);
    setDrawerOpen(true);
  };

  const openReset = (row: User) => {
    setResetTarget(row);
    setResetOpen(true);
  };

  /** 单行删除：二次确认后软删，成功列表由 mutation 失效重取（此处仅 toast + reload）。 */
  const confirmDelete = (row: User) => {
    modal.confirm({
      title: t('pages.user.deleteConfirmTitle'),
      icon: <ExclamationCircleOutlined />,
      content: t('pages.user.deleteConfirmContent', {
        name: row.real_name ?? row.username,
      }),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        await deleteMutation.mutateAsync(row.id);
        message.success(t('pages.user.deleteSuccess'));
        void actionRef.current?.reload();
      },
    });
  };

  /** 批量删除：确认后一次性软删所选，展示受影响/跳过计数。 */
  const confirmBatchDelete = (ids: string[], onCleanSelected: () => void) => {
    modal.confirm({
      title: t('pages.user.batchDeleteConfirmTitle'),
      icon: <ExclamationCircleOutlined />,
      content: t('pages.user.batchDeleteConfirmContent', { count: ids.length }),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        const result = await batchDeleteMutation.mutateAsync(ids);
        message.success(
          t('pages.user.batchDeleteSuccess', { affected: result.affected }),
        );
        onCleanSelected();
        void actionRef.current?.reload();
      },
    });
  };

  const handleFormSuccess = () => {
    void actionRef.current?.reload();
  };

  const columns: ProColumns<User>[] = useMemo(
    () => [
      { title: t('common.username'), dataIndex: 'username', width: 150, ellipsis: true },
      { title: t('pages.user.employeeNo'), dataIndex: 'employee_no', width: 150 },
      {
        title: t('pages.user.realName'),
        dataIndex: 'real_name',
        width: 150,
        render: (_, row) => orDash(row.real_name),
      },
      {
        title: t('pages.user.email'),
        dataIndex: 'email',
        ellipsis: true,
        render: (_, row) => orDash(row.email),
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        width: 100,
        render: (_, row) => <UserStatusBadge status={row.status} />,
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 250,
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 250,
        fixed: 'right',
        render: (_, row) => (
          <Space size="small">
            <Access perm="system:user:edit">
              <Button type="link" size="small" className="!px-0" onClick={() => openEdit(row)}>
                {t('common.edit')}
              </Button>
            </Access>
            <Access perm="system:user:resetPwd">
              <Button type="link" size="small" className="!px-0" onClick={() => openReset(row)}>
                {t('pages.user.resetPassword')}
              </Button>
            </Access>
            <Access perm="system:user:remove">
              <Button
                type="link"
                size="small"
                danger
                className="!px-0"
                onClick={() => confirmDelete(row)}
              >
                {t('common.delete')}
              </Button>
            </Access>
          </Space>
        ),
      },
    ],
    // openEdit/openReset/confirmDelete 为稳定闭包（仅调 setState/modal），t 变即重算列。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  // @ts-ignore
    return (
    <div className="flex h-full min-h-0 flex-col rounded-lg bg-card-bg shadow-sm">
      {/* 统一顶栏：筛选 + 操作，一行搞定 */}
      <div className="shrink-0 border-b border-border-secondary px-4 py-3">
        <UserFilterBar
          value={filters}
          onChange={setFilters}
          onReset={handleReset}
          total={total}
          loading={loading}
          actions={
            <Access perm="system:user:add">
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                {t('common.create')}
              </Button>
            </Access>
          }
        />
      </div>

      {/* 表格区：撑满剩余高度，无自带 toolbar */}
      <div className="min-h-0 flex-1">
        <ProTable<User>
          actionRef={actionRef}
          rowKey="id"
          size="middle"
          columns={columns}
          search={false}
          options={false}
          toolbar={undefined}
          headerTitle={false}
          params={queryParams}
          scroll={{ x: 900, y: 9999 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
          }}
          rowSelection={{ preserveSelectedRowKeys: true }}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
            <div className="flex items-center gap-3">
              <Access perm="system:user:remove">
                <Button
                  size="small"
                  danger
                  loading={batchDeleteMutation.isPending}
                  onClick={() =>
                    confirmBatchDelete(selectedRowKeys.map(String), onCleanSelected)
                  }
                >
                  {t('pages.user.batchDelete')}
                </Button>
              </Access>
              <Tooltip title={t('pages.user.exportComingSoon')}>
                <Button size="small" disabled>
                  {t('pages.user.exportSelected')}
                </Button>
              </Tooltip>
              <Button size="small" type="link" onClick={onCleanSelected}>
                {t('pages.user.clearSelection')}
              </Button>
            </div>
          )}
          locale={{
            emptyText: <UserTableEmpty hasFilter={hasFilter} onReset={handleReset} />,
          }}
          request={async (params) => {
            setLoading(true);
            const result = await proTableRequest<User>(
              ({ limit, offset, ...rest }) =>
                listUsers({
                  limit,
                  offset,
                  keyword: rest.keyword as string | undefined,
                  employee_no: rest.employee_no as string | undefined,
                  status: rest.status as string | undefined,
                }),
              params,
            );
            setTotal(result.total);
            setLoading(false);
            return result;
          }}
        />
      </div>

      <UserFormDrawer
        open={drawerOpen}
        mode={drawerMode}
        record={editingUser}
        onOpenChange={setDrawerOpen}
        onSuccess={handleFormSuccess}
      />
      <UserResetPasswordModal open={resetOpen} record={resetTarget} onOpenChange={setResetOpen} />
    </div>
  );
}
