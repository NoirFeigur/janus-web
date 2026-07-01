/** 占位页 —— 尚未实现的 feature 路由先挂这里（跨 feature 复用的共享 UI）。 */
import { Empty } from 'antd';

import { PageContainer } from '@/components/PageContainer';
import { useT } from '@/hooks/useT';

export default function PlaceholderPage() {
  const t = useT();
  return (
    <PageContainer>
      <div className="grid min-h-80 place-items-center rounded-md bg-card-bg p-6 shadow-sm">
        <Empty description={t('common.comingSoon')} />
      </div>
    </PageContainer>
  );
}
