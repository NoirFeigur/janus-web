/** 概览页 —— 薄编排层：套 PageContainer，渲染 features/dashboard 的业务组件。 */
import { DashboardOverview } from '@features/dashboard/components/DashboardOverview';

import { PageContainer } from '@/components/PageContainer';
import { useT } from '@/hooks/useT';

export default function DashboardPage() {
  const t = useT();
  return (
    <PageContainer title={t('menu.dashboard')}>
      <DashboardOverview />
    </PageContainer>
  );
}
