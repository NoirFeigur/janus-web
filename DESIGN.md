# Janus Web Design System

> **This file is the single source of truth for the Janus visual system.** Color / spacing / depth / motion / component appearance decisions live here and nowhere else.
>
> - Engineering conventions, domain contracts, API wire format, error codes, enum catalog → [`docs/前端设计规范.md`](docs/前端设计规范.md) and [`README.md`](README.md).
> - Color truth is implemented in `src/styles/theme.ts` (`primitiveTokens → semanticTokens → componentTokens`); Tailwind/CSS consume the codegen-derived `src/styles/brand-tokens.css`. To change a value, edit `theme.ts` and run `pnpm codegen` — never hand-edit `brand-tokens.css`.
> - This document describes the **target** system (2025 redesign). Where code still shows the previous navy-on-gray values, the code is what's being migrated toward this spec.

## 1. Atmosphere & Identity

Janus is a quiet instrument panel for people who already know what they're doing — platform engineers, finance operators, and team leads scanning dense tables, billing, and usage under bright office daylight, all day. It is not a product to be admired; it is a tool that disappears into the task.

Two consequences drive every decision below:

- **Light theme is the floor.** Bright ambient light + prolonged data reading → light surface, dark ink, high legibility, low glare. Dark mode is a deferred second skin (§9), not shipped in phase one.
- **Color strategy is Restrained.** A cool-neutral graphite ramp carries the surface; a single indigo accent is reserved for primary action, current selection, and state indication only — never decoration. Identity comes from the disciplined consistency of the whole system, not from any one signature color.

The visual signature is a **cool graphite neutral ramp** (tinted toward the brand hue, so even the "grays" belong to the brand) framing white data surfaces, with depth expressed through a real three-tier elevation scale rather than a single flat shadow.

## 2. Color

Defined in OKLCH, shipped as hex (AntD tokens require hex). Every value below must pass the contrast gate in §2.6 at implementation time — verified with tooling, never by eye.

### 2.1 Neutral ramp (cool graphite — the real identity)

Not AntD's default neutral gray. The whole ramp leans slightly cool (hue ≈ 255, chroma 0.005–0.02) toward the brand, so surfaces read as a coherent system rather than a generic admin theme.

| Role | Token | OKLCH | Hex | Usage |
|------|-------|-------|-----|-------|
| Page surface | `--color-page` / `colorBgLayout` | `oklch(0.982 0.004 255)` | `#F7F8FB` | App background — cleaner and cooler than flat gray |
| Container surface | `--color-card-bg` / `colorBgContainer` | `oklch(1 0 0)` | `#FFFFFF` | Cards, containers, data surfaces — pure white for max data contrast |
| Sunken surface | `--color-surface-sunken` | `oklch(0.968 0.005 255)` | `#F0F2F7` | Table headers, toolbars, filter bars — a subtle recessed second layer |
| Border | `--color-border` / `colorBorder` | `oklch(0.918 0.008 255)` | `#E3E6EE` | Default component and divider borders (same-hue cool, not neutral gray) |
| Border secondary | `--color-border-secondary` / `colorBorderSecondary` | `oklch(0.950 0.006 255)` | `#EEF0F5` | Subtle internal separators |
| Fill hover | `--color-fill-hover` / `colorFillTertiary` | `oklch(0.55 0.03 255 / 0.04)` | `rgba(48,58,84,.04)` | Quiet hover fills (a trace of brand cool, not raw black) |
| Fill active | `--color-fill-active` / `colorFillSecondary` | `oklch(0.55 0.03 255 / 0.07)` | `rgba(48,58,84,.07)` | Pressed/active fills |

### 2.2 Text ramp (contrast-corrected)

| Role | Token | Hex | On white | Usage |
|------|-------|-----|----------|-------|
| Text primary | `--color-text-primary` / `colorText` | `#1A1F2E` | ~14:1 | Body, labels, headings — cool near-black |
| Text secondary | `--color-text-secondary` / `colorTextSecondary` | `#5A6274` | ~**5.4:1** ✅ | Captions, secondary metadata — **raised from the old ~3.5:1 to pass AA body** |
| Text tertiary | `--color-text-tertiary` / `colorTextTertiary` | `#8A92A6` | ~3.2:1 | Icons, placeholders, disabled, dash-placeholder **only — never body text** |

> Placeholder text must reach 4.5:1. Do not let `Input` placeholders fall to the tertiary token; either lift them to secondary or give placeholders their own ≥4.5:1 value.

### 2.3 Brand accent

The previous navy (`#192E76`) read as dim, dated corporate. This is an **evolution, not a reset**: pushed toward a more saturated, awake indigo that keeps the infrastructure-trust association while shedding the mustiness. Low migration risk, brand continuity preserved.

| Role | Token | OKLCH | Hex | On accent | Usage |
|------|-------|-------|-----|-----------|-------|
| Primary | `--color-primary` / `colorPrimary` | `oklch(0.45 0.16 268)` | `#2D50C8` | white ~7.4:1 ✅ | Primary actions, current selection, links, focus ring |
| Primary hover | `--color-primary-hover` | `oklch(0.50 0.16 268)` | `#3A5DD9` | — | Primary button hover |
| Primary active | `--color-primary-active` | `oklch(0.40 0.15 268)` | `#2543AE` | — | Primary button press |
| Primary subtle | `--color-primary-subtle` / table selected | `oklch(0.45 0.16 268 / 0.08)` | `rgba(45,80,200,.08)` | — | Selected rows, active tags, info fill |
| Primary subtle border | `--color-primary-subtle-border` | `oklch(0.45 0.16 268 / 0.20)` | `rgba(45,80,200,.20)` | — | Selected-state outline |

### 2.4 State vocabulary

Three channels each — `base` (foreground/dot), `bg` (tint fill), `border` (tint outline) — so status is **never** signalled by color alone (badges pair a dot with text). Tuned slightly more saturated than the old set to sit correctly against the cooler neutral base.

| State | Base | Bg | Border | AntD |
|-------|------|----|--------|------|
| Success | `--color-success` `#2E8B57` | `--color-success-bg` `#ECF7F0` | `--color-success-border` `#CBE8D5` | `colorSuccess` |
| Warning | `--color-warning` `#C77A0A` | `--color-warning-bg` `#FBF3E6` | `--color-warning-border` `#F2DDB8` | `colorWarning` |
| Error | `--color-error` `#D23F3F` | `--color-error-bg` `#FBECEC` | `--color-error-border` `#F3CDCD` | `colorError` |
| Info | `--color-info` = `--color-primary` `#2D50C8` | `--color-info-bg` `rgba(45,80,200,.08)` | `--color-info-border` `rgba(45,80,200,.20)` | `colorInfo` (= brand) |

### 2.5 Rules
- JSX uses Tailwind color tokens: `bg-primary`, `text-primary`, `bg-page`, `bg-success`, `text-text-secondary`, etc. **No raw hex in JSX.**
- AntD component color/radius/sizing goes through `src/styles/theme.ts` component tokens — not Tailwind overrides on AntD internal class names.
- Extend `theme.ts` only when a durable semantic role is missing.

### 2.6 Contrast gate (enforced at implementation)
- Body / table text ≥ **4.5:1**; large text (≥18px or bold ≥14px) ≥ 3:1.
- Placeholder text ≥ 4.5:1 (does not use the tertiary token).
- Primary button white text ≥ 4.5:1 (indigo hits 7.4:1).
- State text on its own tint bg ≥ 4.5:1 (use the `base` dark channel, not the light one).
- Verify with tooling before delivery, not by eye.

### 2.7 Token pipeline (single source of truth)
Brand truth lives **only** in `src/styles/theme.ts` (`primitiveTokens → semanticTokens → componentTokens`). Two consumers derive from it with zero duplication:
- **AntD** reads the JS `antdTheme` object directly (`ConfigProvider`).
- **Tailwind / raw CSS** read `var(--brand-*)`: `brandCssVars` is code-generated into `src/styles/brand-tokens.css` (`:root`) by `pnpm codegen` (`codegen:brand`); `global.css` `@theme inline` maps each `--color-*` utility to its `var(--brand-*)`.
- `brand-tokens.css` is a generated artifact — **never hand-edit**. Change a color in `theme.ts`, re-run `pnpm codegen`.

## 3. Typography

One family carries everything (product UI needs no display/body pairing). Fixed rem scale, tight ratio (~1.2), so more type elements coexist without noise.

### Scale

| Level | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| KPI | 28px | 650 | 1.15 | Dashboard statistics |
| Page title | 18px | 600 | 1.35 | `PageContainer` / page main title |
| Section title | 15px | 600 | 1.4 | Card / drawer group titles |
| Body | 14px | 400 | 1.55 | Default UI text and table content |
| Caption | 12px | 450 | 1.4 | Help text, compact metadata |

### Font stack
- `"Inter Variable", "Inter", -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`.
- Inter self-hosted via `@fontsource-variable/inter` (imported in `main.tsx`) — offline/internal-safe, no CDN. Latin + digits; CJK falls back to system fonts.
- Defined once in `theme.ts` `semanticTokens.fontFamily` (fed to AntD `fontFamily` and `--brand-font-family`); `body` inherits it.

### Tabular numerals
- Table bodies enable `font-variant-numeric: tabular-nums` (`global.css` `@layer components`) so numbers, dates, and IDs align across rows. A readability requirement for a data-dense back office.

### Rules
- Compact fixed scale. **No display typography** inside the authenticated shell.
- Body text ≥ 14px on mobile.
- Ratio ~1.2 between steps; exaggerated contrast creates noise.

## 4. Spacing & Layout

### Rhythm scale (tiered — not one flat 8px)

| Tier | Value | Usage |
|------|-------|-------|
| In-component | 8px (`gap-2`) | Icon↔label, inline controls |
| Between elements | 12px (`gap-3`) | Form items, list items |
| Card padding | 20px (`p-5`) | Card / drawer content inset |
| Card gap | 16px (`gap-4`) | Gaps between cards in a grid |
| Page gutter | 16px (`p-4`) | Content's single outer gutter (unifies the current `p-2`/`p-4` drift) |
| Section spacing | 24px (`gap-6`) | Between large blocks |

### Shell dimensions

| Element | Value | Note |
|---------|-------|------|
| Header height | 56px (`h-14`) | Roomier touch targets for breadcrumb + user menu (≥44px) |
| TagsView height | 40px (`h-10`) | Unchanged |
| Sider expanded | 224px (`w-56`) | Wider for two-level CJK menu labels |
| Sider collapsed | 72px | Tighter icon rail |
| Content gutter | 16px | Title and body share one inset |

### Grid & responsiveness
- Breakpoints: mobile `<768px`, tablet `768–1023px`, desktop `≥1024px`.
- Desktop: 224px expanded sider / 72px collapsed rail.
- Tablet: auto-collapsed rail with temporary user expansion.
- Mobile: full-width content, navigation in a left Drawer.
- Responsive behavior is **structural** (collapse sider, internal table scroll, drawer nav) — never fluid typography.
- Tables scroll internally on narrow viewports instead of widening the page.

## 5. Depth & Surface

A semantic **elevation scale** (previously a single flat shadow), built from border + shadow rather than stacked shadows. Shadows carry a cool tint (`rgba(26,31,46,…)`), not raw black.

| Level | Value | Usage |
|-------|-------|-------|
| 0 Flat | `1px border` only | Tables, embedded regions — divided by border, not shadow |
| 1 Card | `0 1px 2px rgba(26,31,46,.06)` + `1px border` | Cards, Pro containers |
| 2 Overlay | `0 4px 12px rgba(26,31,46,.10)` | Dropdowns, Popover, Tooltip |
| 3 Dialog | `0 12px 32px rgba(26,31,46,.16)` | Modal, Drawer |

### z-index scale (semantic — no ad-hoc `z-10`/`z-999`)
```
dropdown 1000 → sticky-header 1010 → drawer 1200 → modal-backdrop 1300 → modal 1310 → toast 1400 → tooltip 1500
```

### Radius
- Base **8px** (up from 6 — more contemporary, not over-rounded).
- Controls (buttons/inputs) 6px.
- Pill 999 (badges/tags).

### Rules
- Avoid nested cards. Full-width page surfaces; repeated cards only for repeated content.
- Cards are not the lazy default — use them only where they're the best affordance.

## 6. Components

Every interactive component ships **all** of: default, hover, focus, active, disabled, loading, error. Don't ship half. Loading uses **skeletons**, not a spinner in the middle of content. Empty states **teach the interface**, never a dead-end "no data".

### App Shell
- **Structure**: AntD `Layout` — `Sider` + sticky `Header` (`h-14`) + `TagsView` (`h-10`) + padded `Content` (`p-4`).
- **Sider**: deep cool **graphite** `oklch(0.24 0.015 258) ≈ #1E2230` (no saturated navy, no gradient). Selected item = **filled pill** in translucent brand color + brand-lightened text; **no left side-stripe**. Hover = `rgba(255,255,255,.06)` fill. Logo strip keeps the bottom `inset 0 -1px rgba(255,255,255,.08)` divider.
- **States**: desktop collapse (persisted), tablet rail (session), mobile drawer.
- **Motion**: AntD sider/drawer transitions + fast color transitions on controls.

### Selection language (unified everywhere)
Selected state is always a **filled pill** — sider item, active TagsView tab, active `Segmented` option share the same vocabulary (`--color-primary-subtle` fill + brand text, or the inverse on the dark sider). Never a side-stripe, never color-only.

### PageContainer
- **Structure**: AntD Pro `PageContainer` wrapped by `src/components/PageContainer.tsx` (class `janus-page`).
- **Spacing**: Pro's horizontal inner padding is removed in `@layer components` so Content owns the single page gutter.
- **Depth**: white content surface on page gray, elevation level 1.

### Data table (flagship pattern — see §8 for the User page instance)
Every feature table inherits this. Details in §8.

### TagsView
- **Structure**: horizontally scrollable tab strip below the header, on the sunken surface.
- **States**: active tab = filled pill (`--color-primary-subtle` + brand text); inactive quiet, gains fill on hover.
- **Motion**: color/background/close-affordance transitions only.

### Login
- **Structure**: responsive split panel — graphite brand panel from `lg`, compact brand lockup below.
- **Identity**: a **static**, restrained portal line-mark (Janus gateway motif), low opacity, `aria-hidden`. **No rotation, no orchestrated entrance.**
- **Motion**: a single ≤200ms fade-in enhancing the already-visible default; instant under reduced-motion. The old 48s spinning ring and 560ms rise are removed.
- **Controls**: AntD form primitives, large inputs, primary submit.

## 7. Motion & Interaction

Product register: motion conveys state, never decoration. No orchestrated page-load sequences — users load into a task.

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120–160ms | ease-out | Button, tag, menu hover feedback |
| State change | 180–220ms | ease-out (quart/expo) | Drawer and sider state changes |
| Fade-in | ≤200ms | ease-out | Login card, first content paint |

### Rules
- Animate `transform / opacity / color / background / box-shadow` only — never layout properties manually.
- Every animation has a `@media (prefers-reduced-motion: reduce)` alternative (fade → instant).
- Removed: login spinning ring, 560ms rise, any decorative loop.
- Loading = skeleton, not a centered spinner.

## 8. User Management page (flagship data-table instance)

`features/users/components/UserTable.tsx` is the reference every feature table inherits from. It is a **list page**, not a master-detail page (no org tree in phase one — see [`docs/前端设计规范.md`](docs/前端设计规范.md) §11 gap list).

### Layout
- **One full-height white card** (elevation 1, radius 8px) filling the Content area; the card owns internal scroll, the page does not grow.
- Vertical structure: **sticky filter toolbar** (top, on sunken surface, `border-b`) → **scrollable table body** (fills remaining height, sticky header) → **pinned pagination** (bottom).
- Toolbar inset `px-4 py-3`; table rows at AntD `size="middle"` density with tabular-nums body.

### Filter toolbar (always-visible, not Pro's collapsed search)
- Debounced keyword input + employee-no input (`useDebouncedValue` → `params`); status `Segmented` control (point-select, no debounce).
- A **live result count** and a **reset** that enables only when a filter is active.
- Primary **Create** button (`system:user:add` gated) sits at the toolbar's trailing edge.
- ProTable runs `search={false} options={false} headerTitle={false}` — the toolbar fully owns filtering.

### Columns
- username / employee-no / real-name / email / status / created-at / actions.
- Null or empty cells render a tertiary-toned `—` dash-placeholder — never a blank cell.
- **Status column** = `UserStatusBadge`: colored dot **plus** text (dual-channel, never color-alone), tone from `USER_STATUS_META` (single source: status → `labelKey` → tone), drawn from the §2.4 state vocabulary.
- created-at uses `valueType: 'dateTime'`, tabular-nums aligned.
- **Actions column** (`fixed: 'right'`): `Edit` / `Reset password` / `Delete` as permission-gated (`<Access>`) link buttons; delete is `danger` and always confirms via modal.

### Interaction & states
- **Row hover**: `--color-table-row-hover` fill. **Row selected**: `--color-primary-subtle` fill.
- **Create / Edit** open a **right Drawer** (`UserFormDrawer`), not a full-page navigation — the list context is preserved. Reset password uses a focused modal.
- **Bulk actions**: `rowSelection` with the native alert bar; bulk delete + a reserved export control rendered **disabled with a "coming soon" tooltip** (never a silently-dead button).
- **Empty state** (`UserTableEmpty`): distinguishes "no filter match" (offers clear-filters) from "no data yet" — teaches the next step, never a dead-end.
- **Loading**: skeleton rows, not a centered spinner.
- **Destructive confirms**: single and batch delete both require modal confirmation with affected-count feedback.

### Delegation contract
This page defines the vocabulary for all future feature tables: always-visible filter bar → full-height card → sticky header + internal scroll → pinned pagination → dual-channel status → drawer for create/edit → teaching empty state → disabled-with-tooltip for unbuilt actions.

## 9. Dark mode (phase two — reserved only)

Phase one ships light only (§1 scene rationale). If dark mode lands later:
- Cool graphite base `oklch(0.20 0.015 258)`, card surface `oklch(0.24 0.015 258)` — lift by layer, not pure black.
- Accent **lifts** for dark contrast: `oklch(0.62 0.15 268) ≈ #6A8AF0`, verified ≥4.5:1.
- Borders/dividers get independent dark values (don't reuse light values).
- Same semantic tokens: add `algorithm: darkAlgorithm` + a dark override group in `theme.ts` — **no second color-truth source**.
