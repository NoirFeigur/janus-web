/** 用户管理页（薄）—— 只编排 feature，不写业务逻辑。 */
import { UserTable } from '@features/users/components/UserTable';
import { useIntl } from 'react-intl';

import { PageContainer } from '@/components/PageContainer';

export default function UsersPage() {
  const intl = useIntl();
  return (
    <PageContainer title={intl.formatMessage({ id: 'menu.users' })}>
      <UserTable />
    </PageContainer>
  );
}
