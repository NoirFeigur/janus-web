/**
 * 基础 HTTP 层：Axios 实例 + baseURL。
 * 拦截器在 interceptors.ts 中挂载（保持本文件只负责实例创建）。
 */
import axios from 'axios';

const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});
