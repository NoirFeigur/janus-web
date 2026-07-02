/**
 * 表格 overlay 滚动条 —— 给 AntD 表格的横向滚动容器（.ant-table-body）挂 OverlayScrollbars。
 *
 * 为什么表格要单独走 OS 而非全局 webkit 伪元素：表格体内有 tr.ant-table-row 自带 hover，
 * 会抢走容器的 hover 语义，叠加 Blink「后代 hover 不重绘祖先滚动条」的十几年缺陷
 * （WebKit #109230），纯 CSS 的 hover-reveal 在表格上不可靠（指针进入行区域滑块即消失）。
 * OverlayScrollbars 自绘 overlay 滑块，用自己的事件驱动显隐（autoHide:'leave'，VS Code 式：
 * hover/滚动才显、鼠标离开即隐），彻底绕开该缺陷，且真 overlay 不占槽位、无箭头。
 *
 * 非破坏性接入：以 AntD 已有的 .ant-table-body 作为 target 初始化，不重构其 DOM，保住
 * ProTable 的 sticky 表头 / fixed 列 / measure-row 机制；OS 保留原生滚动事件，AntD 的
 * 表头横向同步照常工作。
 */
import { OverlayScrollbars } from 'overlayscrollbars';
import { useEffect, type RefObject } from 'react';

const TABLE_BODY_SELECTOR = '.ant-table-body';

/**
 * overlay 横条高度（= --os-size）。有横向溢出时给表体留出等高的底部「排水沟」，
 * 让悬浮横条落在末行下方的独立空间，而不是骑在最后一行的下边缘上。
 */
const SCROLLBAR_GUTTER = '10px';

/**
 * @param rootRef 表格卡片的滚动根（UserTable 的 scrollRef），OS 挂在其内部的 .ant-table-body 上。
 */
export function useTableOverlayScrollbar(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let instance: OverlayScrollbars | null = null;

    const attach = () => {
      const body = root.querySelector<HTMLElement>(TABLE_BODY_SELECTOR);
      if (!body) {
        return false;
      }
      // 已初始化（同一 body 节点）则跳过，避免重复挂载。
      if (OverlayScrollbars.valid(instance) && instance?.elements().target === body) {
        return true;
      }
      instance?.destroy();
      instance = OverlayScrollbars(
        { target: body, elements: { viewport: body } },
        {
          scrollbars: {
            theme: 'os-theme-janus',
            // VS Code 式：hover/滚动时显，鼠标离开滚动区即隐（100ms 缓冲防抖）。
            autoHide: 'leave',
            autoHideDelay: 100,
            clickScroll: true,
          },
          // 表格只需横向 overlay 条；纵向交给外层卡片滚动根，避免双层滚动条。
          overflow: { x: 'scroll', y: 'hidden' },
        },
        {
          // 悬浮横条落在末行下方而非骑在其上：仅当真有横向溢出时才留底部排水沟，
          // 无溢出（无条）时不留白边。hasOverflow.x 表示横轴存在可滚动溢出。
          updated: (osInstance) => {
            const { hasOverflow } = osInstance.state();
            body.style.paddingBottom = hasOverflow.x ? SCROLLBAR_GUTTER : '';
          },
        },
      );
      return true;
    };

    // ProTable 数据变化会重建 .ant-table-body，用 MutationObserver 侦测并重新挂载。
    const observer = new MutationObserver(() => {
      if (!OverlayScrollbars.valid(instance) || instance?.elements().target?.isConnected === false) {
        attach();
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    attach();

    return () => {
      observer.disconnect();
      instance?.destroy();
      instance = null;
    };
  }, [rootRef]);
}
