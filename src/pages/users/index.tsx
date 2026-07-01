/** 用户管理页（薄）—— 只编排 feature（间距/高度由 BasicContainer 统一提供）。 */
import { UserTable } from '@features/users/components/UserTable';

import { BasicContainer } from '@/components/BasicContainer';

export default function UsersPage() {
  return (
    <BasicContainer block>
      <UserTable />
    </BasicContainer>
  );
}
