/** 全局 Provider 聚合：QueryClient / AntD ConfigProvider(theme+locale) / react-intl。 */
import { StyleProvider } from '@ant-design/cssinjs';
import { createAppIntl, setActiveIntl } from '@lib/i18n';
import { queryClient } from '@lib/queryClient';
import { useLocaleStore } from '@stores/locale.store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import enUSAntd from 'antd/locale/en_US';
import zhCNAntd from 'antd/locale/zh_CN';
import { useEffect, useMemo, type ReactNode } from 'react';
import { RawIntlProvider } from 'react-intl';

import { antdTheme } from '@/styles/theme';

const ANTD_LOCALES = { 'zh-CN': zhCNAntd, 'en-US': enUSAntd } as const;

export function AppProviders({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  const intl = useMemo(() => createAppIntl(locale), [locale]);

  // 同步「React 之外」用的 intl holder（拦截器按 code 取文案）。
  useEffect(() => {
    setActiveIntl(intl);
  }, [intl]);

  return (
    <QueryClientProvider client={queryClient}>
      <RawIntlProvider value={intl}>
        {/* layer：把 antd 的 CSS-in-JS 落进 @layer antd，Tailwind 工具类才能覆盖（见 global.css）。 */}
        <StyleProvider layer>
          <ConfigProvider theme={antdTheme} locale={ANTD_LOCALES[locale]}>
            <AntdApp>{children}</AntdApp>
          </ConfigProvider>
        </StyleProvider>
      </RawIntlProvider>
    </QueryClientProvider>
  );
}
