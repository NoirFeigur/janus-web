/** createRoot 入口。 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
// 副作用：注册 Axios 拦截器（token / 语言 / 信封解包 / 错误归一化）。
import '@/api/interceptors';
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
