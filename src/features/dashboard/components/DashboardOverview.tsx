/**
 * 概览业务组件 —— dashboard 领域的核心内容。概览相关的 KPI / 趋势 / 分布等
 * 后续都在此（及同 feature 下的子组件）生长；跨 feature 的数据编排放页面层。
 *
 * 当前按「能做的先做」：先摆 usage/stats 可得的 KPI 占位；
 * 趋势/环比/分布/健康条等后端聚合端点待迭代，标占位（设计规范 §11.3）。
 */
import { ProCard } from '@ant-design/pro-components';
import { Alert, Col, Row } from 'antd';

import { StatCard } from '@/components/StatCard';
import { useT } from '@/hooks/useT';

export function DashboardOverview() {
  const t = useT();
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <StatCard title={t('pages.dashboard.todayRequests')} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={t('pages.dashboard.todayTokens')} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={t('pages.dashboard.activeUsers')} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={t('pages.dashboard.todayCost')} value="—" />
        </Col>
      </Row>
      <ProCard className="mt-4">
        <Alert type="info" showIcon message={t('pages.dashboard.pendingNotice')} />
      </ProCard>
    </>
  );
}
