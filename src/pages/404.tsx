import { Button, Result } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';

export default function NotFoundPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({ id: 'common.notFound' })}
      extra={
        <Button type="primary" onClick={() => void navigate(paths.dashboard)}>
          {intl.formatMessage({ id: 'common.backHome' })}
        </Button>
      }
    />
  );
}
