# Janus Web Design System

## 1. Atmosphere & Identity

Janus is a restrained internal command center: dense, legible, and calm under repeated use. Its signature is Laplace navy framing a light operational workspace, with depth expressed through subtle shadows, tonal page backgrounds, and clear selected states rather than decoration.

## 2. Color

### Palette

| Role | Token | Light | Usage |
|------|-------|-------|-------|
| Page surface | `--color-page` / `colorBgLayout` | `#F5F6FA` | App background and table hover surface |
| Container surface | `--color-card-bg` / `colorBgContainer` | `#FFFFFF` | Cards, header, page containers |
| Brand primary | `--color-laplace` / `colorPrimary` | `#192E76` | Primary actions, selected state, links |
| Sider surface | `--color-laplace-sider` / `Layout.siderBg` | `#142B70` | Main navigation background |
| Deep brand surface | `--color-laplace-deep` | `#0F1F52` | Login brand panel and deepest navigation tone |
| Header surface | `--color-header-bg` / `Layout.headerBg` | `#FFFFFF` | Sticky app header |
| Text primary | `--color-text-primary` / `colorText` | `rgba(0,0,0,.88)` | Body, labels, headings |
| Text secondary | `--color-text-secondary` / `colorTextSecondary` | `rgba(0,0,0,.45)` | Captions and secondary metadata |
| Table selected | `--color-table-row-selected` | `rgba(25,46,118,.08)` | Selected table rows and active tags |

### Rules
- JSX uses Tailwind color tokens such as `bg-laplace`, `text-laplace`, `bg-page`, and `text-text-secondary`.
- Ant Design component color, radius, and sizing changes go through `src/styles/theme.ts` component tokens.
- Do not add raw color values in JSX. Extend `global.css` `@theme` or `theme.ts` only when a durable semantic role is missing.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| KPI | 32px | 600 | 1.2 | Dashboard statistics |
| Page title | 16px | 600 | 1.4 | Pro `PageContainer` titles |
| Body | 14px | 400 | 1.5715 | Default UI text and table content |
| Caption | 12px | 400-500 | 1.4 | Help text, compact metadata |

### Font Stack
- Primary: `-apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`

### Rules
- Product UI keeps a compact fixed scale. Do not introduce display typography into the authenticated shell.
- Body text must remain at least 14px on mobile.

## 4. Spacing & Layout

### Base Unit
All spacing derives from Tailwind's standard 4px scale. Use standard rungs such as `p-4` (16px), `p-6` (24px), `gap-4`, `h-10`, and `h-12`.

### Grid
- Breakpoints: mobile `<768px`, tablet `768-1023px`, desktop `>=1024px`.
- Desktop shell: 200px expanded sider, 80px collapsed rail.
- Tablet shell: auto-collapsed 80px rail with temporary user expansion allowed.
- Mobile shell: full-width content with navigation in a left Drawer.

### Rules
- Do not reintroduce custom Tailwind spacing variables in `@theme`.
- Page title and body content share the same inset.
- Tables scroll internally on narrow viewports instead of expanding page width.

## 5. Components

### App Shell
- **Structure**: AntD `Layout` with `Sider`, sticky `Header`, `TagsView`, and padded `Content`.
- **Spacing**: header `h-12`, tags `h-10`, content `p-4` by default.
- **States**: desktop collapse, tablet rail, mobile drawer open/closed.
- **Motion**: AntD sider/drawer transitions plus fast color transitions on controls.

### PageContainer
- **Structure**: AntD Pro `PageContainer` wrapped by `src/components/PageContainer.tsx` with class `janus-page`.
- **Spacing**: horizontal Pro inner padding is removed in `@layer components` so Content owns the page gutter.
- **Depth**: white content surface on page gray with subtle token shadow.

### TagsView
- **Structure**: horizontally scrollable tab strip below the header.
- **States**: active tag uses selected brand tint; inactive tags are quiet and gain emphasis on hover.
- **Motion**: color, background, and close affordance transitions only.

### Login
- **Structure**: responsive split panel; brand panel visible from `lg`, compact brand lockup on smaller viewports.
- **Identity**: keeps the Janus portal motif and rise animation.
- **Controls**: AntD form primitives, large inputs, primary submit.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120-180ms | ease-out | Button, tag, menu hover feedback |
| Standard | 200-300ms | ease-in-out | Drawer and sider state changes |
| Login entry | 560ms | cubic-bezier(0.22, 1, 0.36, 1) | Existing login form rise |

### Rules
- Prefer transform, opacity, color, background, and shadow transitions.
- Do not animate layout properties manually.
- Respect the existing `prefers-reduced-motion` guard in `global.css`.

## 7. Depth & Surface

### Strategy
Mixed, but restrained: tonal page separation plus the subtle AntD card shadow token `0 1px 2px rgba(0,0,0,.06)`.

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0 1px 2px rgba(0,0,0,.06)` | Cards and Pro containers |
| Header | `shadow-sm` | Sticky header separation |
| Drawer | AntD Drawer token shadow | Mobile navigation overlay |

### Rules
- Cards use radius 6px unless AntD component defaults require otherwise.
- Avoid nested cards. Use full-width page surfaces and repeated cards only where they represent repeated content.
