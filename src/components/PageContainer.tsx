/** 页面容器 —— 统一标题 + 内容卡片（白卡片浮于浅灰底，设计规范 §3.2）。 */
import { PageContainer as ProPageContainer } from '@ant-design/pro-components';
import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, extra, children }: PageContainerProps) {
  return (
    <ProPageContainer className="janus-page" header={{ title, extra, ghost: true }}>
      {children}
    </ProPageContainer>
  );
}
