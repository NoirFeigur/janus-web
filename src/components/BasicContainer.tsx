/**
 * 基础容器 —— 路由内容区的通用布局外壳（统一间距/高度/滚动，不含标题、不绑路由）。
 *
 * - padding（默认 true）：统一 16px 内间距；置 false 交由内容自控（如自带卡片的 ProTable）。
 * - block（默认 false）：占满父级剩余高度、内容超出时内部滚动（表格/看板类页面用，配合
 *   AppLayout 的全高链）；不开则随内容自然增高、由外层滚动。
 * 背景为页面灰底，内容组件自行提供白卡片层级。
 */
import type { ReactNode } from 'react';

interface BasicContainerProps {
  children: ReactNode;
  block?: boolean;
  padding?: boolean;
}

export function BasicContainer({ children, block = false, padding = true }: BasicContainerProps) {
  const pad = padding ? 'p-2' : '';

  if (block) {
    return (
      <div className={`flex h-full min-h-0 w-full flex-col overflow-hidden ${pad}`}>
        {children}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className={pad}>{children}</div>
    </div>
  );
}
