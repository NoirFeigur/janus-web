/** useUserStatusValueEnum 单测 —— 枚举 label 走 i18n，切 locale 时 label 重算。 */
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RawIntlProvider } from 'react-intl';
import { describe, expect, it } from 'vitest';

import { useUserStatusValueEnum } from './userStatusValueEnum';

import { createAppIntl, type AppLocale } from '@/lib/i18n';

function wrapperFor(locale: AppLocale) {
  const intl = createAppIntl(locale);
  return ({ children }: { children: ReactNode }) => (
    <RawIntlProvider value={intl}>{children}</RawIntlProvider>
  );
}

describe('useUserStatusValueEnum', () => {
  it('zh-CN 下 active/disabled 映射为中文 label + 状态色', () => {
    const { result } = renderHook(() => useUserStatusValueEnum(), {
      wrapper: wrapperFor('zh-CN'),
    });
    expect(result.current.get('active')).toEqual({ text: '启用', status: 'Success' });
    expect(result.current.get('disabled')).toEqual({ text: '禁用', status: 'Error' });
  });

  it('en-US 下同样的 code 映射为英文 label（切语言 label 重算）', () => {
    const { result } = renderHook(() => useUserStatusValueEnum(), {
      wrapper: wrapperFor('en-US'),
    });
    expect(result.current.get('active')).toMatchObject({ text: 'Active', status: 'Success' });
    expect(result.current.get('disabled')).toMatchObject({ text: 'Disabled', status: 'Error' });
  });
});
