import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/app/router/paths';
import { useT } from '@/hooks/useT';

export default function NotFoundPage() {
  const t = useT();
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('common.notFound')}
      extra={
        <Button type="primary" onClick={() => void navigate(paths.dashboard)}>
          {t('common.backHome')}
        </Button>
      }
    />
  );
}
