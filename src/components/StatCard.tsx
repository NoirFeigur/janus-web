/** KPI 统计卡 —— 仪表盘顶部用（设计规范 §3.2 / §9.5）。 */
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: ReactNode;
  value: string | number;
  suffix?: string;
  loading?: boolean;
}

export function StatCard({ title, value, suffix, loading }: StatCardProps) {
  return (
    <ProCard bordered>
      <StatisticCard.Statistic title={title} value={value} suffix={suffix} loading={loading} />
    </ProCard>
  );
}
