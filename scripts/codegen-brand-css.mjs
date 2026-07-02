// @ts-check
/**
 * codegen-brand-css —— 从 theme.ts 生成品牌 CSS 变量（单源桥，构建期产出）。
 *
 * 契约：品牌色「真值」的唯一来源是 `src/styles/theme.ts` 的 `brandCssVars`
 * （由 primitive / semantic token 派生）。本脚本读取该表，生成静态的
 * `src/styles/brand-tokens.css`（真实 `:root { --brand-* }` 声明），供 global.css
 * `@import`。这样 CSS 里有可被静态解析的定义（IDE 不再误报 Unresolved custom
 * property），同时不破坏单一数据源 —— 改色仍只改 theme.ts 后重跑 `pnpm codegen`。
 *
 * 相比旧的「main.tsx 运行时 setProperty 注入」：产物是初始 CSS 的一部分，
 * 消除 HTML 解析到 JS 执行之间 var(--brand-*) 为空的 FOUC 窗口。
 *
 * 产物**禁手改**：要改品牌色改 theme.ts 后重跑 `pnpm codegen`。
 *
 * 用法：node scripts/codegen-brand-css.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { brandCssVars } from '../src/styles/theme.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..');
const OUT_PATH = join(WEB_ROOT, 'src', 'styles', 'brand-tokens.css');

/** 把 brandCssVars 渲染成带「禁手改」头、稳定排序的 :root 块。 */
function renderBrandCss() {
  const header = [
    '/**',
    ' * 品牌 CSS 变量 —— 【codegen 自动生成，请勿手改】。',
    ' *',
    ' * 由 `pnpm codegen`（codegen:brand）从 src/styles/theme.ts 的 brandCssVars 生成。',
    ' * 品牌色真值唯一来源是 theme.ts（primitive / semantic token 派生）；此文件是派生产物。',
    ' * 要改品牌色：改 theme.ts 后重跑 `pnpm codegen`。',
    ' */',
  ];

  const lines = [...header, ':root {'];
  // Object.entries 保留插入序 —— 与 theme.ts 声明序一致，diff 稳定。
  for (const [name, value] of Object.entries(brandCssVars)) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

function main() {
  const source = renderBrandCss();
  writeFileSync(OUT_PATH, source, 'utf-8');
  const count = Object.keys(brandCssVars).length;
  console.log(`✓ ${count} 条品牌 CSS 变量 → src/styles/brand-tokens.css`);
}

main();
