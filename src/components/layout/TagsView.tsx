/** 多页签导航条 —— 访问过的页面、关闭与右键操作。 */
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Dropdown, type MenuProps } from 'antd';
import type { WheelEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { LayoutMenuNode } from './menuTree.types';

import { paths } from '@/app/router/paths';
import { useT } from '@/hooks/useT';
import { useTabsStore } from '@/stores/tabs.store';

interface TagsViewProps {
  menuTree: readonly LayoutMenuNode[];
}

const findTitleKey = (tree: readonly LayoutMenuNode[], pathname: string): string | null => {
  for (const node of tree) {
    if (node.menu_type !== 'button' && node.path === pathname) {
      return node.name;
    }

    const childTitle = findTitleKey(node.children, pathname);
    if (childTitle) {
      return childTitle;
    }
  }

  return null;
};

export function TagsView({ menuTree }: TagsViewProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const visitedTabs = useTabsStore((state) => state.visitedTabs);
  const addTab = useTabsStore((state) => state.addTab);
  const removeTab = useTabsStore((state) => state.removeTab);
  const removeOthers = useTabsStore((state) => state.removeOthers);
  const removeLeft = useTabsStore((state) => state.removeLeft);
  const removeRight = useTabsStore((state) => state.removeRight);
  const removeAll = useTabsStore((state) => state.removeAll);

  useEffect(() => {
    const titleKey = pathname === paths.home ? 'menu.home' : findTitleKey(menuTree, pathname);
    if (!titleKey) {
      return;
    }

    addTab({ path: pathname, title: titleKey, closable: pathname !== paths.home });
  }, [addTab, menuTree, pathname]);

  const closeTab = (path: string) => {
    const nextPath = removeTab(path);
    if (path === pathname && nextPath) {
      void navigate(nextPath, { replace: true });
    }
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollLeft += event.deltaY;
  };

  const refreshTab = (path: string) => {
    if (path === pathname) {
      // 当前页：让所有挂载中的 query 失效重取（服务端数据统一走 TanStack Query）。
      void queryClient.invalidateQueries({ refetchType: 'active' });
      return;
    }
    // 非当前页：切过去即可，目标页挂载时自然拉取新鲜数据。
    void navigate(path);
  };

  const buildMenuItems = (path: string, closable: boolean): MenuProps['items'] => [
    {
      key: 'refresh',
      icon: <ReloadOutlined />,
      label: t('common.tab.refresh'),
      onClick: () => refreshTab(path),
    },
    {
      key: 'close',
      label: t('common.tab.close'),
      disabled: !closable,
      onClick: () => closeTab(path),
    },
    {
      key: 'closeOthers',
      label: t('common.tab.closeOthers'),
      onClick: () => {
        removeOthers(path);
        void navigate(path, { replace: true });
      },
    },
    {
      key: 'closeLeft',
      label: t('common.tab.closeLeft'),
      onClick: () => {
        removeLeft(path);
        const pathIndex = visitedTabs.findIndex((tab) => tab.path === path);
        const currentIndex = visitedTabs.findIndex((tab) => tab.path === pathname);
        if (currentIndex < 0 || (pathIndex >= 0 && currentIndex < pathIndex)) {
          void navigate(path, { replace: true });
        }
      },
    },
    {
      key: 'closeRight',
      label: t('common.tab.closeRight'),
      onClick: () => {
        removeRight(path);
        const pathIndex = visitedTabs.findIndex((tab) => tab.path === path);
        const currentIndex = visitedTabs.findIndex((tab) => tab.path === pathname);
        if (currentIndex < 0 || (pathIndex >= 0 && currentIndex > pathIndex)) {
          void navigate(path, { replace: true });
        }
      },
    },
    {
      key: 'closeAll',
      label: t('common.tab.closeAll'),
      onClick: () => {
        removeAll();
        void navigate(paths.home, { replace: true });
      },
    },
  ];

  return (
    <div className="h-10 border-b border-border-secondary bg-card-bg px-2">
      <div
        ref={scrollRef}
        className="janus-tags-scroll flex h-full items-center gap-1 overflow-x-auto overflow-y-hidden"
        onWheel={onWheel}
      >
        {visitedTabs.map((tab) => {
          const active = tab.path === pathname;
          return (
            <Dropdown
              key={tab.path}
              trigger={['contextMenu']}
              menu={{ items: buildMenuItems(tab.path, tab.closable) }}
            >
              {/* group：叉在 hover 整枚 tab 时才「撑开」（w-0→w-4 折叠宽度，非原地淡入），
                  连带文字作为一组重新居中。justify-center + 对称 px-3 保证静息态文字真居中。
                  transition-all + 150ms ease-out（§7 micro）串起底色/文字/描边/按压缩放/叉展开；
                  cursor-pointer 明确可点（原生 button 在 preflight 下是箭头）。 */}
              <button
                type="button"
                className={[
                  'group relative my-1.5 flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-md px-3 text-sm',
                  'transition-all duration-150 ease-out active:scale-[0.97]',
                  'motion-reduce:transition-none motion-reduce:active:scale-100',
                  active
                    ? 'bg-primary-subtle text-primary ring-1 ring-inset ring-primary-subtle-border'
                    : 'text-text-secondary hover:bg-table-row-hover hover:text-primary',
                ].join(' ')}
                onClick={() => void navigate(tab.path)}
              >
                <span className="leading-none">{t(tab.title)}</span>
                {tab.closable ? (
                  // 叉：静息 w-0/ml-0/透明且 overflow-hidden 收起（不占位，文字得以居中）；
                  // hover 整枚 tab 时撑开为 16×16 圆形命中区 + 4px 间隙并淡入；hover 叉自身现底色 + 放大。
                  <span
                    aria-label={t('common.tab.close')}
                    className={[
                      'flex h-4 w-0 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] leading-none opacity-0',
                      'transition-all duration-150 ease-out',
                      'group-hover:ml-1 group-hover:w-4 group-hover:opacity-70',
                      'hover:scale-110 hover:bg-primary/15 hover:!opacity-100',
                    ].join(' ')}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.path);
                    }}
                  >
                    <CloseOutlined />
                  </span>
                ) : null}
              </button>
            </Dropdown>
          );
        })}
      </div>
    </div>
  );
}
