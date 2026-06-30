/** 全局 UI 态（侧栏折叠 / 主题）—— 纯客户端态，绝不放 server state。 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface UiState {
  siderCollapsed: boolean;
  theme: ThemeMode;
  toggleSider: () => void;
  setSiderCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      siderCollapsed: false,
      theme: 'light',
      toggleSider: () => set((s) => ({ siderCollapsed: !s.siderCollapsed })),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'janus.ui' },
  ),
);
