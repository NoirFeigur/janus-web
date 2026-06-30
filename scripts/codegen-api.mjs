// @ts-check
/**
 * codegen-api —— 从后端 OpenAPI 离线生成前端 API 类型(src/api/generated/types.ts)。
 *
 * 契约:后端出入参类型由 codegen 从 janus-server 的 OpenAPI 生成,前端**不手抄**
 * (避免漂移,见设计规范「类型安全」)。
 *
 * 为何离线导出而非抓 live 服务:`app.openapi()` 走的是同一张已注册路由表,产出的
 * schema 与 live 服务在 `/openapi.json` 暴露的**逐字节一致**,且不需要起 HTTP 服务、
 * 不连 DB/Redis(那些只在 lifespan 触发)。对 CI / 无基建环境同样可复现。
 *
 * 流程:`uv run python` 在后端仓库内 dump schema 到临时文件 → openapi-typescript
 * 生成 types → 删临时文件。
 *
 * 用法:node scripts/codegen-api.mjs
 *   可选环境变量 JANUS_SERVER_DIR 覆盖后端仓库根目录(默认同级 ../janus-server)。
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..');
const SERVER_DIR = process.env.JANUS_SERVER_DIR
  ? resolve(process.env.JANUS_SERVER_DIR)
  : resolve(WEB_ROOT, '..', 'janus-server');

const OUT_PATH = join(WEB_ROOT, 'src', 'api', 'generated', 'types.ts');

/** 在后端仓库内用其 uv 环境 dump app.openapi() 到指定文件。 */
function dumpSchema(schemaPath) {
  const py = [
    'import json, sys',
    'from src.main import app',
    'schema = app.openapi()',
    'dst = sys.argv[1]',
    "open(dst, 'w', encoding='utf-8').write(json.dumps(schema, ensure_ascii=False, indent=2))",
    'print(f\'paths={len(schema.get("paths", {}))}\')',
  ].join('; ');
  try {
    const out = execFileSync('uv', ['run', 'python', '-c', py, schemaPath], {
      cwd: SERVER_DIR,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    process.stdout.write(`✓ schema dumped (${out.trim()})\n`);
  } catch (err) {
    throw new Error(
      `从后端导出 OpenAPI schema 失败(cwd=${SERVER_DIR})。\n` +
        `请确认 janus-server 在 ${SERVER_DIR}(或设 JANUS_SERVER_DIR)且其 uv 环境可用。\n` +
        `原始错误:${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

/** 用 openapi-typescript 把 schema 文件生成为 types.ts。 */
function generateTypes(schemaPath) {
  // 直接用 node 跑 openapi-typescript 的 CLI 入口,绕开 Windows 下
  // execFileSync 执行 .cmd shim 抛 EINVAL 的限制(无需 shell:true)。
  const cli = join(WEB_ROOT, 'node_modules', 'openapi-typescript', 'bin', 'cli.js');
  execFileSync(process.execPath, [cli, schemaPath, '-o', OUT_PATH], {
    cwd: WEB_ROOT,
    encoding: 'utf-8',
    stdio: 'inherit',
  });
}

function main() {
  const tmp = mkdtempSync(join(tmpdir(), 'janus-openapi-'));
  const schemaPath = join(tmp, 'openapi.json');
  try {
    dumpSchema(schemaPath);
    generateTypes(schemaPath);
    process.stdout.write(`✓ API types → src/api/generated/types.ts\n`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

main();
