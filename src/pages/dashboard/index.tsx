/** 概览页 —— 薄编排层：渲染 features/dashboard 的业务组件（间距/底色由 BasicContainer 统一提供）。 */
import { DashboardOverview } from '@features/dashboard/components/DashboardOverview';

import { BasicContainer } from '@/components/BasicContainer';

export default function DashboardPage() {
  return (
    <BasicContainer>
      <DashboardOverview />
    </BasicContainer>
  );
}
