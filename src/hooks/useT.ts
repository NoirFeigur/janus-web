/**
 * useT —— React 组件内按 key 取本地化文案的薄封装。
 *
 * 统一替代各组件里散落的 `const t = (id) => intl.formatMessage({ id })`。
 * 签名对齐 lib/i18n 的非 React `translate()`（支持可选 values 插值），
 * 两条取文案路径（React 内 / 拦截器等 React 外）行为一致。
 */
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

export function useT(): (id: string, values?: Record<string, string | number>) => string {
  const intl = useIntl();
  return useCallback(
    (id: string, values?: Record<string, string | number>) => intl.formatMessage({ id }, values),
    [intl],
  );
}
