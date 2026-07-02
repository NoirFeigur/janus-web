/**
 * 用户列表表格 —— 旗舰参考范式（后续 feature 表格照此继承）。
 *
 * 组成：常驻筛选工具栏（UserFilterBar，防抖喂查询）+ ProTable（关闭内建 search，
 * 表体 tabular-nums 见 global.css）+ 状态徽章 + 教学空状态 + 批量选择操作条。
 * offset/limit 适配走 proTableRequest；列随 t 重算以支持切语言。
 */
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { App, Button, Tooltip } from 'antd';
import { Fragment, useMemo, useRef, useState } from 'react';

import { listUsers } from '../api/users.api';
import { useBatchDeleteUsersMutation, useDeleteUserMutation } from '../api/users.queries';
import type { User } from '../api/users.types';

import { UserFilterBar, type UserFilterState } from './UserFilterBar';
import { UserFormDrawer } from './UserFormDrawer';
import { UserResetPasswordModal } from './UserResetPasswordModal';
import { UserStatusBadge } from './UserStatusBadge';
import { UserTableEmpty } from './UserTableEmpty';

import { Access } from '@/components/Access';
import { useAccess } from '@/hooks/useAccess';
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
  const can = useAccess();
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  // 表格卡片即滚动容器：sticky 表头锚到它（而非 window），保住「卡片填满高度、卡内滚动」。
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // 回车即查：递增 nonce 强制 queryParams 立即用当前原始输入重算（跳过防抖等待）。
  const [submitNonce, setSubmitNonce] = useState(0);
  const handleSubmit = () => setSubmitNonce((n) => n + 1);

  // params 变化触发 ProTable 重取（承载筛选态 → 请求）。防抖值 settle 或提交 nonce
  // 变更时重算；提交路径读原始 filters 立即生效，日常输入仍走防抖。
  const queryParams = useMemo(
    () => ({
      keyword: filters.keyword.trim() || undefined,
      employee_no: filters.employeeNo.trim() || undefined,
      status: filters.status,
    }),
    // 依赖用防抖值 + nonce：日常输入靠防抖节流触发；回车靠 nonce 立即触发。
    // 读取用原始 filters，保证提交时拿到最新值而非滞后的防抖值。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedKeyword, debouncedEmployeeNo, filters.status, submitNonce],
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
        message.success(t('pages.user.batchDeleteSuccess', { affected: result.affected }));
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
      { title: t('common.username'), dataIndex: 'username', width: 160, ellipsis: true, className: 'font-medium' },
      { title: t('pages.user.employeeNo'), dataIndex: 'employee_no', width: 130 },
      {
        title: t('pages.user.realName'),
        dataIndex: 'real_name',
        width: 140,
        render: (_, row) => orDash(row.real_name),
      },
      {
        title: t('pages.user.email'),
        dataIndex: 'email',
        width: 240,
        ellipsis: true,
        render: (_, row) => orDash(row.email),
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        width: 110,
        render: (_, row) => <UserStatusBadge status={row.status} />,
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 180,
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 220,
        fixed: 'right',
        render: (_, row) => {
          // 命令式过滤出有权限的动作，再以竖分隔符串联 —— 避免 <Access> 静默隐藏
          // 后留下的悬空分隔线。整列读起来是一条紧凑的操作带，而非松散的链接堆。
          const items: React.ReactNode[] = [];
          if (can('system:user:edit')) {
            items.push(
              <Button key="edit" type="link" size="small" className="!px-0" onClick={() => openEdit(row)}>
                {t('common.edit')}
              </Button>,
            );
          }
          if (can('system:user:resetPwd')) {
            items.push(
              <Button key="reset" type="link" size="small" className="!px-0" onClick={() => openReset(row)}>
                {t('pages.user.resetPassword')}
              </Button>,
            );
          }
          if (can('system:user:remove')) {
            items.push(
              <Button
                key="delete"
                type="link"
                size="small"
                danger
                className="!px-0"
                onClick={() => confirmDelete(row)}
              >
                {t('common.delete')}
              </Button>,
            );
          }
          if (items.length === 0) {
            return <span className="text-text-tertiary">—</span>;
          }
          return (
            <div className="flex items-center">
              {items.map((item, i) => (
                <Fragment key={i}>
                  {i > 0 && <span className="mx-2 h-3.5 w-px bg-border-secondary" aria-hidden />}
                  {item}
                </Fragment>
              ))}
            </div>
          );
        },
      },
    ],
    // openEdit/openReset/confirmDelete 为稳定闭包（仅调 setState/modal），can 为稳定
    // store 方法引用，t 变即重算列（切语言）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, can],
  );
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* 筛选卡片 —— 独立白色浮层，与表格卡片以 gap 分隔，画布从缝隙透出（消除单卡内
          横向色带的割裂感）。 */}
      <div className="shrink-0 rounded-lg bg-card-bg px-4 py-3 shadow-sm">
        <UserFilterBar
          value={filters}
          onChange={setFilters}
          onReset={handleReset}
          onSubmit={handleSubmit}
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

      {/* 表格卡片 —— 独立白色浮层，撑满剩余高度，自身即滚动容器；sticky 表头锚到此
          div 而非 window（见 scrollRef），保住卡内滚动的双浮卡语义。表头无灰底（白 +
          底边框 + 弱化列名），靠结构而非填色区分，彻底去掉内部色带。 */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-card-bg shadow-sm"
      >
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
          scroll={{ x: 900 }}
          sticky={{ getContainer: () => scrollRef.current ?? window }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            // 大数据集直接跳档（便捷）；深翻页用快速跳页免逐页点。
            pageSizeOptions: [10, 20, 50, 100],
            showQuickJumper: true,
            // 总数已由工具栏的实时计数承载，分页器不再重复展示，避免双份 total 噪音。
            showTotal: undefined,
          }}
          rowSelection={{ preserveSelectedRowKeys: true }}
          // 斑马纹按数据 index 打标（偶数行），而非 CSS nth-child —— scroll.x 会插入
          // 隐藏的 .ant-table-measure-row 作为首个 tr，令 nth-child 奇偶错位。index 免疫。
          rowClassName={(_, index) => (index % 2 === 1 ? 'janus-row-stripe' : '')}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
            <div className="flex items-center gap-3">
              <Access perm="system:user:remove">
                <Button
                  size="small"
                  danger
                  loading={batchDeleteMutation.isPending}
                  onClick={() => confirmBatchDelete(selectedRowKeys.map(String), onCleanSelected)}
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
