# Janus Web

> 公司统一内部 AI 基础设施平台 —— 管理后台前端。
>
> 平台工程师 / 财务 / 团队 leader 每天用的内部中后台：用户管理、账单、用量统计、模型分配、号池/模型目录维护。

本仓库是前端 SPA，经 REST 对接后端 [`janus-server`](../janus-server)。

---

## 定位与边界

- **内网中后台，非对外站点**：数据密集 CRUD + 仪表盘，无 SEO / SSR 需求，故选 **SPA**，不上 Next.js。
- **前后端分离**：后端只做纯 JSON API，前端独立演进、独立部署。
- **账单是内部用量核算**：展示成本点/用量聚合，不接支付。

---

## 技术栈（G15）

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | **React 19 + TypeScript** | — |
| 构建 | **Vite 7** | 比 AntD Pro 默认的 UmiJS 更轻；二选一取 Vite |
| UI 组件 | **Ant Design 5 + Ant Design Pro** | `ProTable`（分页/筛选/排序/批量/导出）、`ProForm`（联动/校验/分步）、`ProLayout`（权限菜单布局） |
| 样式 | **Tailwind CSS 4** | 统一样式方案：布局/间距/一次性微调走工具类，**取代散落的内联 `style={{}}`**；AntD 组件主题仍走 token。见「样式规范」 |
| 客户端状态 | **Zustand** | UI 态（主题/侧栏/弹窗开关等） |
| **服务端状态** | **TanStack Query（React Query）** | 表格数据/缓存/失效重取，套在 Axios 上 |
| HTTP | **Axios** | 统一请求层（拦截器挂 token / 错误码处理） |
| 路由 | **React Router v7** | — |
| 图标 | **@ant-design/icons** | 与 AntD 配套 |
| 国际化 | **react-intl** + AntD `ConfigProvider` locale | 见「i18n」 |
| Lint / 格式化 | **ESLint + Prettier** | — |
| 测试 | **Vitest + React Testing Library** | 单元 + 组件 |
| 包管理 | **pnpm** | — |

> **头号规范：客户端状态（Zustand）与服务端状态（TanStack Query）分治。** 表格/列表/详情这类来自后端的数据**一律走 TanStack Query**，不让 Zustand 扛 server state。

**为何 AntD Pro 而非 shadcn/ui**：本后台清一色密集表格 + 表单 + 仪表盘，`ProTable`/`ProForm` 把 CRUD 脚手架开箱封装，工程量最小。shadcn/ui + TanStack Table 是「现代可组装」路线（对外 SaaS / 求独特设计），headless 需手工拼 data-table，对几十张表格的内部后台是场景错配。

---

## 目录结构

**Feature-based 布局**（参考 [bulletproof-react](https://github.com/alan2207/bulletproof-react)；API 自动生成对齐 [Ant Design Pro](https://github.com/ant-design/ant-design-pro) 的 OpenAPI codegen；query key 工厂对齐 [TkDodo](https://tkdodo.eu/blog/effective-react-query-keys)）。业务代码以**功能模块**为第一组织单元，每个 feature 自带 `api / components / hooks`，跨 feature 复用的下沉到 `shared`。

> 取 bulletproof-react 的务实 feature 切分，**不上完整 FSD 七层**（entities/widgets 等层对内部后台是过度分层）。规模真涨起来再按需引入。

```
janus-web/
├── public/
├── src/
│   ├── main.tsx                  # createRoot 入口
│   ├── App.tsx                   # Router + QueryClientProvider + AntD ConfigProvider 装配
│   │
│   ├── app/                      # 应用级装配（薄）
│   │   ├── providers.tsx         # 全局 Provider 聚合（QueryClient / i18n / Theme）
│   │   └── router/
│   │       ├── index.tsx         # createBrowserRouter 路由树（懒加载）
│   │       ├── routes.tsx        # 私有/公开路由定义
│   │       ├── guards.tsx        # AuthGuard / PermissionGuard
│   │       └── paths.ts          # 路由路径常量（给 useNavigate 用）
│   │
│   ├── features/                 # 功能模块（业务代码主体，按领域对齐后端）
│   │   ├── users/                # 用户/角色/部门管理
│   │   │   ├── api/
│   │   │   │   ├── users.api.ts      # Axios 请求函数（调 lib/openapi 类型）
│   │   │   │   ├── users.queries.ts  # query key 工厂 + queryOptions（TanStack Query）
│   │   │   │   └── users.types.ts    # 该模块本地类型（表单态等，API 类型来自 lib/openapi）
│   │   │   ├── components/           # UserTable / UserForm / UserDrawer…
│   │   │   ├── hooks/                # useUserFilters…
│   │   │   └── stores/               # 模块级 Zustand（罕见，多数态是 server state）
│   │   ├── credentials/          # api_key 管理
│   │   ├── catalog/              # 逻辑模型 / 渠道 / 号池
│   │   ├── grants/               # 模型分配
│   │   ├── usage/                # 用量统计 / 内部账单（图表 + ProTable）
│   │   └── quota/                # 配额配置
│   │
│   ├── pages/                    # 路由页（薄）—— 只编排 feature，不写业务逻辑
│   │   ├── login.tsx
│   │   ├── users/index.tsx
│   │   ├── usage/index.tsx
│   │   └── 404.tsx
│   │
│   ├── components/               # 跨 feature 复用业务组件（非 AntD 原语）
│   │   ├── PageContainer.tsx
│   │   ├── StatCard.tsx
│   │   └── RightContent.tsx      # 顶栏用户菜单 + 语言切换
│   │
│   ├── stores/                   # 全局 Zustand —— 仅客户端/UI 态
│   │   ├── auth.store.ts         # token / 当前用户 / 权限
│   │   ├── ui.store.ts           # 侧栏折叠 / 主题 / 活动 tab
│   │   └── locale.store.ts       # 当前语言
│   │
│   ├── lib/                      # 预接线的库实例 + 基础设施层
│   │   ├── queryClient.ts        # TanStack QueryClient（默认 staleTime / 重试）
│   │   ├── i18n.ts               # react-intl 装配
│   │   ├── http/                 # 基础 HTTP 层
│   │   │   ├── client.ts         # Axios 实例 + baseURL
│   │   │   └── interceptors.ts   # 挂 token / 解析 RFC 9457 problem+json / 统一错误
│   │   └── openapi/              # OpenAPI codegen 产物（自动生成，禁手改）
│   │       └── types.ts          # 后端 schema 生成的类型
│   │
│   ├── locales/                  # i18n 资源
│   │   ├── zh-CN/
│   │   │   ├── common.ts         # Save/Cancel/Delete/确认/无数据…
│   │   │   ├── menu.ts           # 菜单名（menu.system.user）
│   │   │   └── error.ts          # 按后端 ErrorCode 建 key（auth.invalid_token…）
│   │   └── en-US/
│   │       ├── common.ts
│   │       ├── menu.ts
│   │       └── error.ts
│   │
│   ├── hooks/                    # 跨 feature 共享 hooks
│   ├── utils/                    # 纯函数工具（formatDate / formatCost…）
│   ├── types/                    # 全局类型（ApiResponse<T> / 分页包装）
│   └── styles/                   # 全局样式 + AntD 主题变量
│
├── tests/                        # 跨模块/集成测试（单元测试可 co-locate 在 feature 内）
│   └── setup.ts                  # Vitest setup（jsdom / RTL matchers）
├── .env.example                  # 仅非敏感前端变量（VITE_*，如 API base path）
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 路径别名（tsconfig.json + vite）

```jsonc
"paths": {
  "@/*":         ["./src/*"],
  "@features/*": ["./src/features/*"],
  "@stores/*":   ["./src/stores/*"],
  "@lib/*":      ["./src/lib/*"]
}
```

`import { userQueries } from '@features/users/api/users.queries'` —— 显式、无 `../../../` 链。

---

## 开发规范

### 状态分治（硬约束）

- **服务端数据 → TanStack Query**：用 `useQuery` / `useMutation`，靠 query key 管缓存与失效。绝不把列表数据塞进 Zustand。
- **纯 UI 态 → Zustand**：主题、侧栏折叠、弹窗开关、token。每块状态就近 owner，跨页共享才提到全局 `stores/`。
- 不把状态穿三层 props——叶子组件直接订阅 atom / query。

### query key 工厂（每个 feature）

```typescript
// features/users/api/users.queries.ts
export const userQueries = {
  all: () => ['users'] as const,
  lists: () => [...userQueries.all(), 'list'] as const,
  list: (filters: UserFilters) => [...userQueries.lists(), { filters }] as const,
  detail: (id: string) => [...userQueries.all(), 'detail', id] as const,
};
```

组件里**绝不写裸字符串 query key**，一律引 `userQueries`；失效用 `queryClient.invalidateQueries({ queryKey: userQueries.lists() })` 按层级级联。

### API 三层

```
lib/openapi/           ← OpenAPI codegen（后端类型，禁手改）
   ↓
features/<m>/api/*.api.ts    ← 业务请求函数，调 lib/http 客户端 + lib/openapi 类型，是人写的边界
   ↓
features/<m>/api/*.queries.ts ← queryOptions + key 工厂
```

请求统一经 `lib/http/client.ts` 的 Axios 实例；拦截器挂 token、解析 `problem+json` 的 `code` → 查 i18n → toast/表单级提示。

### 类型安全

- **禁止 `any` / `@ts-ignore`**；`tsc --noEmit`（`pnpm type-check`）必须干净。
- 公共 props / 共享对象用 `interface`；扩展 React 原生用 `React.ComponentProps<'button'>` / `Omit<...>` / `Pick<...>`。
- 后端出入参类型走 codegen 从 `janus-server` OpenAPI 生成，**不手抄**（避免漂移）。

### i18n（G16，与后端契约）

- **后端只发稳定标识符，前端拥有展示文本。**
  - **枚举值**（状态/类型）：后端发 `StrEnum` code，前端用 ProComponents `valueEnum` 映射本地化 label。
  - **业务错误**：后端发 RFC 9457 `problem+json` 的 `code` + 结构化 `params`，前端按 `code` 查 `locales/*/error.ts` 文案、用 `params` 插值（如 `已用 {used}/{limit}，{period} 配额耗尽`）。
  - **菜单/按钮/字段 label**：前端 i18n 静态资源，按 `menu.system.user` 两层命名空间组织 key。

### 样式规范（Tailwind CSS 4）

样式统一用 **Tailwind CSS 4**（CSS-first 配置，无 `tailwind.config.js`，靠 `@tailwindcss/vite` 插件 + CSS 内 `@theme`）。

**与 AntD 的分工（别打架）**：

- **AntD 组件外观走 token**：颜色/圆角/组件级样式改 `ConfigProvider` theme（`src/styles/theme.ts`），**不要**用 Tailwind 去覆盖 AntD 组件内部类名。
- **Tailwind 管「组件之间」**：布局（flex/grid）、间距、对齐、尺寸、一次性微调——**取代内联 `style={{}}`**。原来 `style={{ marginTop: 16 }}` 一律改 `className="mt-4"`。
- **裸 hex 收口**：品牌色映射进 `@theme`（`--color-laplace` 等），用 `bg-laplace` / `text-laplace`，不在 JSX 里写 `#192E76`。

**AntD 5 + Tailwind 4 共存（关键，否则 AntD 组件样式被打乱）**：

1. `@layer` 声明顺序把 antd 压在 utilities 之前——Tailwind 工具类天然能覆盖 antd，且 preflight 不会重置 antd 组件：

   ```css
   /* src/styles/global.css */
   @layer theme, base, antd, components, utilities;
   @import 'tailwindcss';
   ```

2. 用 `<StyleProvider layer>`（`@ant-design/cssinjs`）把 antd 的 CSS-in-JS 产物落进 `antd` 层（已在 `app/providers.tsx` 装配）。

> 详见 [AntD 兼容 Tailwind v4 官方文档](https://ant.design/docs/react/compatible-style-cn)。

### 代码风格

- ESLint + Prettier；提交前 `pnpm lint` + `pnpm type-check` 必须干净。
- 表格驱动优于条件梯队（映射 id/路由/视图时用表，不用 if/else 长链）。
- 副作用回调用终态简写：`onClick={() => void save()}`、`onState={st => void setState(st)}`。
- **不用 barrel 文件**（`index.ts` 全量 re-export）——伤 Vite tree-shaking，按需直接 import。

### 模块边界（ESLint 强制）

feature-based 布局只有在**边界被工具强制**时才不退化成大泥球。用 ESLint [`import/no-restricted-paths`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md) 把分层与隔离做成 CI 门禁，而非口头约定：

- **feature 之间不互相 import**：`features/users` 不得直接 import `features/usage`。跨 feature 复用一律下沉到 `components/` / `hooks/` / `utils/`。需要组合多个 feature 时在 `pages/` 编排。
- **依赖只向下**：`features → (api / stores / lib / components / utils)`，下层绝不反向 import `features`（`utils` import `features` 即报错）。
- **`pages` 可 import `features`，`features` 不得 import `pages`**：页面是编排层，处于依赖链顶端。
- **`lib/openapi/` 是叶子**：禁止它 import 项目内任何其他目录（codegen 产物只被依赖、不依赖业务）。

```javascript
// eslint.config.js（flat config）—— import/no-restricted-paths zones
{
  target: './src/features/*/**',
  from:   './src/features',
  except: ['./*/**'],            // 仅禁跨 feature；允许 import 本 feature 内部
  message: 'feature 之间禁止直接 import；复用请下沉到 components/hooks/utils。',
},
{
  target: ['./src/stores', './src/lib', './src/components', './src/utils', './src/hooks'],
  from:   './src/features',
  message: '下层不得反向依赖 features。',
},
{
  target: './src/features',
  from:   './src/pages',
  message: 'features 不得 import pages（页面是顶层编排层）。',
},
```

> 配合路径别名：跨层 import 一律走 `@features/* @stores/* @lib/*`，eslint zones 按这些根目录划线，违例在 `pnpm lint` 直接红。

---

## 单元 / 组件测试规范

**框架**：[Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)（+ `@testing-library/user-event`）；网络层用 [MSW](https://mswjs.io/) mock。

### 布局与命名

- **单元/组件测试 co-locate 在 feature 内**：`features/users/components/UserForm.tsx` 旁放 `UserForm.test.tsx`。跨模块/集成测试放根 `tests/`。
- 文件 `*.test.ts(x)`；描述用行为语言（`it('提交无效邮箱时禁用保存按钮')`）。

### 测哪些

| 对象 | 测什么 | 怎么测 |
|---|---|---|
| 纯函数 / utils | 输入→输出、边界 | 直接断言 |
| hooks | 状态转移、副作用 | `renderHook` |
| 组件 | 用户视角行为（点击/输入/可见性），**非实现细节** | RTL `render` + `userEvent`，按 role/text 查 |
| query/mutation | 请求参数、缓存失效、错误处理 | MSW mock 后端，断言 UI 反应 |

### 原则

- **测行为，不测实现**：按 `getByRole` / `getByText` 查，不断言内部 state / 不快照整棵 DOM。
- **避免脆快照**：不用大而全的 `toMatchSnapshot()`（无意义快照一改就炸）；要快照只快照小而稳的输出。
- **MSW mock 网络**，不打真实后端；不 mock React Query 本身（测真实缓存行为）。
- 新增组件/修 bug **必带测试**。

### 门禁

```bash
pnpm test                 # 跑一遍
pnpm test --watch         # watch
pnpm test --coverage      # 覆盖率
pnpm lint && pnpm type-check
```

覆盖率参考线 **≥ 70%**（utils / 关键业务组件应更高）。

---

## 提交规范

遵循 **[Conventional Commits](https://www.conventionalcommits.org/)**（与 `janus-server` 一致）。格式：

```
<type>(<scope>): <subject>
```

### type

`feat` / `fix` / `refactor` / `perf` / `test` / `docs` / `style`（纯格式，不改逻辑）/ `build` / `ci` / `chore`。

> 注意 `style` 在前端指**代码格式**（Prettier 等），不是 CSS 改动；UI/样式改动用 `feat` / `fix`。

### scope（建议填，对齐 feature）

`users` / `credentials` / `catalog` / `grants` / `usage` / `quota` / `api` / `router` / `i18n` / `ui`（共享组件）/ `deps`。

### 约定

- **subject 用中文，祈使句、≤ 50 字、不加句号**：如 `feat(usage): 用量页加按模型维度的成本柱状图`。
- **原子提交**：一个提交只干一件事。
- **绝不提交密钥**：`.env*` 已被 `.gitignore`（注意 Vite 的 `VITE_*` 变量会打进前端包，**严禁放真实密钥**）。
- 仅在明确需要时提交；不擅自 `--amend` 已推送提交、不 force push。

示例：

```
feat(users): ProTable 接入用户列表 + 分页筛选

list 走 TanStack Query（userQueries.list），筛选条件进 query key；
新建/编辑用 ProForm Drawer，成功后 invalidate userQueries.lists()。
```

---

## 快速开始

```bash
# 1. 装依赖
pnpm install

# 2. 配置（仅非敏感变量，如 API base path；严禁放密钥——Vite 会打进前端包）
cp .env.example .env.local

# 3. 开发
pnpm dev            # 默认 http://localhost:5173

# 4. 构建 / 预览
pnpm build
pnpm preview

# 质量门
pnpm lint
pnpm type-check     # tsc --noEmit
pnpm test
```

> 开发期跨域：在 `vite.config.ts` 配 `server.proxy` 把 `/api` 代理到 `janus-server`（默认 `http://localhost:8000`）。
>
> 后端契约同步：`pnpm codegen` 一次跑两步——`codegen:enums`（读 `janus-server` 的 `src/locales/{lang}/enums.json` 重生枚举 label 单源 `src/locales/{lang}/enum.ts`）+ `codegen:api`（从后端 `app.openapi()` **离线导出** schema 再经 `openapi-typescript` 生成 `src/lib/openapi/types.ts`）。离线导出与 live 服务 `/openapi.json` 逐字节一致，且不需起服务/连 DB/Redis，对 CI 友好。两步均默认读同级 `../janus-server`，可用 `JANUS_SERVER_DIR` 覆盖。

---

## 相关文档

- 后端仓库：[`janus-server`](../janus-server)
- 架构决策（前端栈 G15 / i18n G16）：`统一AI网关后台-架构决策.md`
