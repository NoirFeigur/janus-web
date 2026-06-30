/**
 * 概览页 —— 当前按「能做的先做」：用 usage/stats 可得的 KPI 先上。
 * 趋势/环比/分布/健康条等后端暂不支持，标占位（设计规范 §11.3）。
 */
import { ProCard } from '@ant-design/pro-components';
import { Alert, Col, Row } from 'antd';
import { useIntl } from 'react-intl';

import { PageContainer } from '@/components/PageContainer';
import { StatCard } from '@/components/StatCard';

export default function DashboardPage() {
  const intl = useIntl();
  return (
    <PageContainer title={intl.formatMessage({ id: 'menu.dashboard' })}>
      <Row gutter={16}>
        <Col span={6}>
          <StatCard title={intl.formatMessage({ id: 'pages.dashboard.todayRequests' })} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={intl.formatMessage({ id: 'pages.dashboard.todayTokens' })} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={intl.formatMessage({ id: 'pages.dashboard.activeUsers' })} value="—" />
        </Col>
        <Col span={6}>
          <StatCard title={intl.formatMessage({ id: 'pages.dashboard.todayCost' })} value="—" />
        </Col>
      </Row>
      <ProCard className="mt-4">
        <Alert
          type="info"
          showIcon
          message={intl.formatMessage({ id: 'pages.dashboard.pendingNotice' })}
        />
      </ProCard>
    </PageContainer>
  );
}
