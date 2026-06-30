/**
 * react-intl 装配。
 *
 * 维护一个「当前 intl 实例」holder，使 React 之外的代码（如 Axios 拦截器）
 * 也能按 code 取本地化文案。locale.store 切换语言时调用 setActiveIntl 更新。
 */
import { createIntl, createIntlCache, type IntlShape } from 'react-intl';

import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

export type AppLocale = 'zh-CN' | 'en-US';

export const DEFAULT_LOCALE: AppLocale = 'zh-CN';

export const LOCALE_MESSAGES: Record<AppLocale, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

const cache = createIntlCache();

export function createAppIntl(locale: AppLocale): IntlShape {
  return createIntl({ locale, messages: LOCALE_MESSAGES[locale] }, cache);
}

let activeIntl: IntlShape = createAppIntl(DEFAULT_LOCALE);

export function setActiveIntl(intl: IntlShape): void {
  activeIntl = intl;
}

/** React 之外按 key 取文案（拦截器用）。缺 key 时回落到 key 本身。 */
export function translate(id: string, values?: Record<string, string | number>): string {
  return activeIntl.formatMessage({ id, defaultMessage: id }, values);
}
