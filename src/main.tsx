/** createRoot 入口。 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
// 副作用：注册 Axios 拦截器（token / 语言 / 信封解包 / 错误归一化）。
import '@/lib/http/interceptors';
import { brandCssVars } from '@/styles/theme';
import '@/styles/global.css';

// 品牌色单一来源桥：把 theme.ts 的真值注入 :root 的 --brand-* 变量。
// 在渲染前同步执行 —— global.css 的 @theme inline / 手写规则引用这些变量，零闪烁。
const { style } = document.documentElement;
for (const [name, value] of Object.entries(brandCssVars)) {
  style.setProperty(name, value);
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('#root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
