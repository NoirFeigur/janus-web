/** 占位页 —— 尚未实现的 feature 路由先挂这里（间距/底色由 BasicContainer 统一提供）。 */
import { Empty } from 'antd';

import { BasicContainer } from '@/components/BasicContainer';
import { useT } from '@/hooks/useT';

export default function PlaceholderPage() {
  const t = useT();
  return (
    <BasicContainer block padding={false}>
      <div className="grid h-full place-items-center rounded-md bg-card-bg shadow-sm">
        <Empty description={t('common.comingSoon')} />
      </div>
    </BasicContainer>
  );
}
