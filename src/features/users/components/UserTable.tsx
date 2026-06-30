/** 用户列表表格 —— ProTable 接 TanStack 数据，offset/limit 适配（设计规范 §9.1）。 */
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';


import { listUsers } from '../api/users.api';
import type { User } from '../api/users.types';

import { useUserStatusValueEnum } from './userStatusValueEnum';

import { proTableRequest } from '@/utils/proTableRequest';

export function UserTable() {
  const intl = useIntl();
  const statusValueEnum = useUserStatusValueEnum();

  // 列在组件内构建并随 intl 重算 —— 切语言时表头/枚举重渲染（架构决策 6.12.5 ④）。
  const columns: ProColumns<User>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'common.username' }),
        dataIndex: 'username',
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'pages.user.employeeNo' }),
        dataIndex: 'employee_no',
        search: false,
      },
      {
        title: intl.formatMessage({ id: 'pages.user.realName' }),
        dataIndex: 'real_name',
        search: false,
      },
      {
        title: intl.formatMessage({ id: 'pages.user.email' }),
        dataIndex: 'email',
        search: false,
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'common.status' }),
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: statusValueEnum,
      },
      {
        title: intl.formatMessage({ id: 'common.createdAt' }),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
      },
    ],
    [intl, statusValueEnum],
  );

  return (
    <ProTable<User>
      rowKey="id"
      size="small"
      columns={columns}
      search={{ filterType: 'light' }}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      request={(params) =>
        proTableRequest<User>(
          ({ limit, offset, ...filters }) =>
            listUsers({
              limit,
              offset,
              keyword: filters.username as string | undefined,
              status: filters.status as string | undefined,
            }),
          params,
        )
      }
    />
  );
}
