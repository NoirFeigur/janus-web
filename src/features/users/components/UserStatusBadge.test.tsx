/** UserStatusBadge 单测 —— 状态 label 走 i18n（切 locale 重算），圆点承载语义色调。 */
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RawIntlProvider } from 'react-intl';
import { describe, expect, it } from 'vitest';

import { UserStatusBadge } from './UserStatusBadge';

import { createAppIntl, type AppLocale } from '@/lib/i18n';

function wrapperFor(locale: AppLocale) {
  const intl = createAppIntl(locale);
  return ({ children }: { children: ReactNode }) => (
    <RawIntlProvider value={intl}>{children}</RawIntlProvider>
  );
}

describe('UserStatusBadge', () => {
  it('zh-CN 下 active 渲染中文 label + success 色圆点', () => {
    render(<UserStatusBadge status="active" />, { wrapper: wrapperFor('zh-CN') });
    const label = screen.getByText('启用');
    expect(label).toBeInTheDocument();
    // 圆点是 label 的兄弟节点，承载 success 语义色（双通道，非仅颜色）。
    const dot = label.previousElementSibling;
    expect(dot).toHaveClass('bg-success');
  });

  it('zh-CN 下 disabled 渲染中文 label + error 色圆点', () => {
    render(<UserStatusBadge status="disabled" />, { wrapper: wrapperFor('zh-CN') });
    const label = screen.getByText('禁用');
    expect(label).toBeInTheDocument();
    expect(label.previousElementSibling).toHaveClass('bg-error');
  });

  it('en-US 下同样的 code 渲染英文 label（切语言 label 重算）', () => {
    render(<UserStatusBadge status="active" />, { wrapper: wrapperFor('en-US') });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
