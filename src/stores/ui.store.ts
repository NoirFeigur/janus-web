/** 全局 UI 态（侧栏折叠 / 移动抽屉 / 主题）—— 纯客户端态，绝不放 server state。 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface UiState {
  siderCollapsed: boolean;
  mobileDrawerOpen: boolean;
  theme: ThemeMode;
  toggleSider: () => void;
  setSiderCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      siderCollapsed: false,
      mobileDrawerOpen: false,
      theme: 'light',
      toggleSider: () => set((s) => ({ siderCollapsed: !s.siderCollapsed })),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
      setMobileDrawerOpen: (mobileDrawerOpen) => set({ mobileDrawerOpen }),
      openMobileDrawer: () => set({ mobileDrawerOpen: true }),
      closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'janus.ui',
      partialize: (state) => ({
        siderCollapsed: state.siderCollapsed,
        theme: state.theme,
      }),
    },
  ),
);
