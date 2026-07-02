/**
 * 用户列表空状态 —— 区分「无筛选结果」与「首次无数据」，教人下一步而非死胡同。
 *
 * hasFilter=true：筛选无命中，提示放宽条件 + 一键清除；
 * hasFilter=false：本就无用户，陈述事实（用户由后端/同步创建，前端暂无新建入口）。
 * 不用「暂无数据」这种死胡同文案（§UX search/no-results）。
 */
import { Button, Empty } from 'antd';

import { useT } from '@/hooks/useT';

interface UserTableEmptyProps {
  hasFilter: boolean;
  onReset: () => void;
}

export function UserTableEmpty({ hasFilter, onReset }: UserTableEmptyProps) {
  const t = useT();

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="text-text-secondary">
          {hasFilter ? t('pages.user.emptyFiltered') : t('pages.user.emptyDefault')}
        </span>
      }
    >
      {hasFilter ? (
        <Button size="small" onClick={onReset}>
          {t('pages.user.clearFilters')}
        </Button>
      ) : null}
    </Empty>
  );
}
