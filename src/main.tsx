/** createRoot 入口。 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
// 副作用：注册 Axios 拦截器（token / 语言 / 信封解包 / 错误归一化）。
import '@/lib/http/interceptors';
// 自托管 Inter 可变字体（拉丁 + 数字，含 tabular-nums）—— 内网离线可用，不走 CDN。
// 用显式 .css 路径:匹配 vite/client 的 `declare module '*.css'`,裸包名不以 .css 结尾无法被 TS 解析。
import '@fontsource-variable/inter/index.css';
import '@/styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('#root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
