/** 当前语言 —— 纯 UI 态（Zustand）。切换时同步刷新 React intl。 */
import { type AppLocale, DEFAULT_LOCALE } from '@lib/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocaleState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'janus.locale' },
  ),
);
