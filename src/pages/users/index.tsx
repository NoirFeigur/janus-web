/** 用户管理页（薄）—— 只编排 feature，不写业务逻辑。 */
import { UserTable } from '@features/users/components/UserTable';

import { PageContainer } from '@/components/PageContainer';
import { useT } from '@/hooks/useT';

export default function UsersPage() {
  const t = useT();
  return (
    <PageContainer title={t('menu.users')}>
      <UserTable />
    </PageContainer>
  );
}
