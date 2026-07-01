/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 开发期把 /api 代理到 janus-server，规避跨域。
      // 后端路由挂在根路径（api_prefix=""），故转发前剥掉 /api 前缀
      // （/api 仅是前端侧命名空间；生产由反向代理做同样的 rewrite）。
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // 只统计 src 下的源码;排除构建产物、配置、脚本、类型声明与入口装配
      // （入口/壳只做装配，无独立逻辑，纳入只会稀释真实业务覆盖率）。
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        'tests/**',
        'src/lib/openapi/**',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/App.tsx',
      ],
    },
  },
});
