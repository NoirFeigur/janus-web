/** MSW Node server —— 测试期拦截网络请求。handlers 各 feature 测试内按需追加。 */
import { setupServer } from 'msw/node';

export const server = setupServer();
