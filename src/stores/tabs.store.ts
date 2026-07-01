/** 多页签访问记录 —— 纯客户端导航态。 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { paths } from '@/app/router/paths';

export interface TabItem {
  path: string;
  title: string;
  closable: boolean;
}

interface TabsState {
  visitedTabs: TabItem[];
  addTab: (tab: TabItem) => void;
  removeTab: (path: string) => string | null;
  removeOthers: (path: string) => void;
  removeLeft: (path: string) => void;
  removeRight: (path: string) => void;
  removeAll: () => void;
  clear: () => void;
}

const homeTab: TabItem = { path: paths.home, title: 'menu.home', closable: false };

const ensureHomeTab = (tabs: readonly TabItem[]): TabItem[] => {
  const withoutHome = tabs.filter((tab) => tab.path !== paths.home);
  return [homeTab, ...withoutHome];
};

const findNextPath = (tabs: readonly TabItem[], path: string): string | null => {
  const index = tabs.findIndex((tab) => tab.path === path);
  if (index < 0) {
    return null;
  }

  const nextTab = tabs[index + 1] ?? tabs[index - 1];
  return nextTab?.path ?? null;
};

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      visitedTabs: [homeTab],
      addTab: (tab) => {
        set((state) => {
          const normalizedTab: TabItem =
            tab.path === paths.home ? homeTab : { ...tab, closable: true };
          const exists = state.visitedTabs.some((item) => item.path === normalizedTab.path);
          if (exists) {
            return {
              visitedTabs: ensureHomeTab(
                state.visitedTabs.map((item) =>
                  item.path === normalizedTab.path ? { ...item, title: normalizedTab.title } : item,
                ),
              ),
            };
          }

          return { visitedTabs: ensureHomeTab([...state.visitedTabs, normalizedTab]) };
        });
      },
      removeTab: (path) => {
        const currentTabs = ensureHomeTab(get().visitedTabs);
        const targetTab = currentTabs.find((tab) => tab.path === path);
        if (!targetTab?.closable) {
          return null;
        }

        const nextPath = findNextPath(currentTabs, path);
        set({ visitedTabs: currentTabs.filter((tab) => tab.path !== path) });
        return nextPath;
      },
      removeOthers: (path) => {
        set((state) => ({
          visitedTabs: ensureHomeTab(
            state.visitedTabs.filter((tab) => !tab.closable || tab.path === path),
          ),
        }));
      },
      removeLeft: (path) => {
        set((state) => {
          const index = state.visitedTabs.findIndex((tab) => tab.path === path);
          if (index < 0) {
            return { visitedTabs: ensureHomeTab(state.visitedTabs) };
          }

          return {
            visitedTabs: ensureHomeTab(
              state.visitedTabs.filter((tab, tabIndex) => !tab.closable || tabIndex >= index),
            ),
          };
        });
      },
      removeRight: (path) => {
        set((state) => {
          const index = state.visitedTabs.findIndex((tab) => tab.path === path);
          if (index < 0) {
            return { visitedTabs: ensureHomeTab(state.visitedTabs) };
          }

          return {
            visitedTabs: ensureHomeTab(
              state.visitedTabs.filter((tab, tabIndex) => !tab.closable || tabIndex <= index),
            ),
          };
        });
      },
      removeAll: () => set({ visitedTabs: [homeTab] }),
      clear: () => set({ visitedTabs: [homeTab] }),
    }),
    { name: 'janus.tabs' },
  ),
);
