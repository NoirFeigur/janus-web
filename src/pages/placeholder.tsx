/** 占位页 —— 尚未实现的 feature 路由先挂这里。 */
import { Empty } from 'antd';
import { useIntl } from 'react-intl';

import { PageContainer } from '@/components/PageContainer';

export default function PlaceholderPage() {
  const intl = useIntl();
  return (
    <PageContainer>
      <Empty description={intl.formatMessage({ id: 'common.comingSoon' })} />
    </PageContainer>
  );
}
