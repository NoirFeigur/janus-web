/**
 * AntD 5 主题 token —— Janus 视觉系统（设计规范 §2 / DESIGN.md）。
 * 三层结构：primitive（原始值）→ semantic（角色语义）→ component（组件覆盖）。
 * 颜色语义统一走 token，组件里不写裸 hex。
 */
import type { ThemeConfig } from 'antd';

export const PRIMARY_BLUE = '#192E76';

export const primitiveTokens = {
  colors: {
    primaryBlue: PRIMARY_BLUE,
    siderNavy: '#142B70',
    siderNavyEnd: '#17327C',
    navyDeep: '#0F1F52',
    // 状态色基值（Element 风格，比 antd 默认更柔和，贴合内部后台的克制基调）。
    success: '#3B9E4E',
    warning: '#D98A0B',
    error: '#DC4A4A',
    // info 复用品牌蓝 —— 与 antd colorInfo 默认对齐（信息态即品牌态）。
    info: PRIMARY_BLUE,
    // 状态浅底 / 描边 —— 徽章、Alert、Tag 的填充与边框，绝不只靠前景色区分状态。
    successBg: '#F0F9EB',
    successBorder: '#D8EFCC',
    warningBg: '#FDF6EC',
    warningBorder: '#FAE7C8',
    errorBg: '#FEF0F0',
    errorBorder: '#FBDADA',
    infoBg: 'rgba(25,46,118,.06)',
    infoBorder: 'rgba(25,46,118,.16)',
    pageGray: '#F5F6FA',
    white: '#FFFFFF',
    // 中性灰阶 —— 边框/分隔/填充/文字分层的单一来源，收敛此前散落的裸 rgba。
    border: '#E4E7ED',
    borderSecondary: '#EEF0F4',
    fillHover: 'rgba(0,0,0,.02)',
    fillActive: 'rgba(0,0,0,.04)',
    textPrimary: 'rgba(0,0,0,.88)',
    textSecondary: 'rgba(0,0,0,.45)',
    // tertiary：图标/占位/禁用等最弱一档;不用于正文（正文须 ≥4.5:1）。
    textTertiary: 'rgba(0,0,0,.25)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  fontSize: {
    caption: 12,
    body: 14,
    title: 16,
    kpi: 32,
  },
  radius: {
    base: 6,
    pill: 999,
  },
  shadow: {
    card: '0 1px 2px rgba(0,0,0,.06)',
  },
} as const;

export const semanticTokens = {
  colors: {
    primary: primitiveTokens.colors.primaryBlue,
    link: primitiveTokens.colors.primaryBlue,
    emphasis: primitiveTokens.colors.primaryBlue,
    success: primitiveTokens.colors.success,
    warning: primitiveTokens.colors.warning,
    error: primitiveTokens.colors.error,
    info: primitiveTokens.colors.info,
    bgPage: primitiveTokens.colors.pageGray,
    bgContainer: primitiveTokens.colors.white,
    textPrimary: primitiveTokens.colors.textPrimary,
    textSecondary: primitiveTokens.colors.textSecondary,
    textTertiary: primitiveTokens.colors.textTertiary,
    border: primitiveTokens.colors.border,
    borderSecondary: primitiveTokens.colors.borderSecondary,
    fillHover: primitiveTokens.colors.fillHover,
    fillActive: primitiveTokens.colors.fillActive,
    tableRowHover: primitiveTokens.colors.pageGray,
    // primaryBlue(#192E76 = rgb(25,46,118)) @ 8% —— rgba 无法无损由 hex 派生，故就地锚定来源。
    tableRowSelected: 'rgba(25,46,118,.08)',
  },
  // 状态语义组 —— 徽章/Tag/Alert 三档(前景/浅底/描边)统一取此，状态永不只靠颜色。
  status: {
    success: {
      base: primitiveTokens.colors.success,
      bg: primitiveTokens.colors.successBg,
      border: primitiveTokens.colors.successBorder,
    },
    warning: {
      base: primitiveTokens.colors.warning,
      bg: primitiveTokens.colors.warningBg,
      border: primitiveTokens.colors.warningBorder,
    },
    error: {
      base: primitiveTokens.colors.error,
      bg: primitiveTokens.colors.errorBg,
      border: primitiveTokens.colors.errorBorder,
    },
    info: {
      base: primitiveTokens.colors.info,
      bg: primitiveTokens.colors.infoBg,
      border: primitiveTokens.colors.infoBorder,
    },
  },
  spacing: {
    grid: primitiveTokens.spacing.sm,
    cardGap: primitiveTokens.spacing.md,
    cardPadding: primitiveTokens.spacing.lg,
  },
  // Inter 承载拉丁 + 数字(自托管，见 main.tsx),CJK 回退系统字体;数据列另加 tabular-nums。
  fontFamily:
    '"Inter Variable", "Inter", -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  fontSize: {
    help: primitiveTokens.fontSize.caption,
    body: primitiveTokens.fontSize.body,
    table: primitiveTokens.fontSize.body,
    cardTitle: primitiveTokens.fontSize.title,
    kpi: primitiveTokens.fontSize.kpi,
  },
  radius: {
    control: primitiveTokens.radius.base,
    card: primitiveTokens.radius.base,
    pill: primitiveTokens.radius.pill,
  },
  shadow: {
    card: primitiveTokens.shadow.card,
  },
} as const;

/**
 * 品牌 CSS 变量注入表 —— 单一数据源桥。
 *
 * Tailwind v4 的 @theme 是 CSS-first、AntD token 是 JS object，跨语言无法直接共享。
 * 此表把 JSX 里 Tailwind class（bg-* / text-*）真正用到的那一小撮值，从上面的
 * primitive / semantic（唯一真值）派生出来，运行时注入到 :root 的 --brand-* 变量。
 * global.css 的 @theme inline 与手写规则只引用 var(--brand-*)，不再镜像任何字面量。
 * 改色只改上面的 primitive / semantic 一处，AntD token 与 Tailwind class 同步生效。
 */
export const brandCssVars: Readonly<Record<`--brand-${string}`, string>> = {
  '--brand-page': primitiveTokens.colors.pageGray,
  '--brand-primary': primitiveTokens.colors.primaryBlue,
  '--brand-nav': primitiveTokens.colors.siderNavy,
  '--brand-nav-deep': primitiveTokens.colors.navyDeep,
  '--brand-header-bg': primitiveTokens.colors.white,
  '--brand-card-bg': primitiveTokens.colors.white,
  '--brand-text-primary': semanticTokens.colors.textPrimary,
  '--brand-text-secondary': semanticTokens.colors.textSecondary,
  '--brand-text-tertiary': semanticTokens.colors.textTertiary,
  '--brand-border': semanticTokens.colors.border,
  '--brand-border-secondary': semanticTokens.colors.borderSecondary,
  '--brand-fill-hover': semanticTokens.colors.fillHover,
  '--brand-fill-active': semanticTokens.colors.fillActive,
  '--brand-table-row-hover': semanticTokens.colors.tableRowHover,
  '--brand-table-row-selected': semanticTokens.colors.tableRowSelected,
  // 状态色 —— 徽章/Tag 的前景 + 浅底 + 描边三档。
  '--brand-success': semanticTokens.status.success.base,
  '--brand-success-bg': semanticTokens.status.success.bg,
  '--brand-success-border': semanticTokens.status.success.border,
  '--brand-warning': semanticTokens.status.warning.base,
  '--brand-warning-bg': semanticTokens.status.warning.bg,
  '--brand-warning-border': semanticTokens.status.warning.border,
  '--brand-error': semanticTokens.status.error.base,
  '--brand-error-bg': semanticTokens.status.error.bg,
  '--brand-error-border': semanticTokens.status.error.border,
  '--brand-info': semanticTokens.status.info.base,
  '--brand-info-bg': semanticTokens.status.info.bg,
  '--brand-info-border': semanticTokens.status.info.border,
  // 正文默认字号 —— body 裸文字继承此值；与 AntD fontSize token 同源，绝不双写。
  '--brand-font-base': `${primitiveTokens.fontSize.body}px`,
  // 全局字族 —— body 裸文字继承此值，与 AntD fontFamily token 同源。让整个应用(非
  // 仅 AntD 组件)统一走 Inter + CJK 回退,压过 Tailwind preflight 的默认 sans 栈。
  '--brand-font-family': semanticTokens.fontFamily,
};

export const componentTokens = {
  layout: {
    siderBg: primitiveTokens.colors.siderNavy,
    siderBgEnd: primitiveTokens.colors.siderNavyEnd,
    headerBg: semanticTokens.colors.bgContainer,
    bodyBg: semanticTokens.colors.bgPage,
  },
  card: {
    bg: semanticTokens.colors.bgContainer,
    padding: semanticTokens.spacing.cardPadding,
    radius: semanticTokens.radius.card,
    shadow: semanticTokens.shadow.card,
  },
  menu: {
    darkItemBg: primitiveTokens.colors.siderNavy,
    darkSubMenuItemBg: primitiveTokens.colors.siderNavy,
    darkItemSelectedBg: semanticTokens.colors.primary,
  },
  table: {
    rowHoverBg: semanticTokens.colors.tableRowHover,
    rowSelectedBg: semanticTokens.colors.tableRowSelected,
  },
} as const;

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: semanticTokens.colors.primary,
    colorLink: semanticTokens.colors.link,
    colorSuccess: semanticTokens.colors.success,
    colorWarning: semanticTokens.colors.warning,
    colorError: semanticTokens.colors.error,
    colorInfo: semanticTokens.colors.info,
    colorBgLayout: semanticTokens.colors.bgPage,
    colorBgContainer: semanticTokens.colors.bgContainer,
    colorText: semanticTokens.colors.textPrimary,
    colorTextSecondary: semanticTokens.colors.textSecondary,
    colorTextTertiary: semanticTokens.colors.textTertiary,
    colorBorder: semanticTokens.colors.border,
    colorBorderSecondary: semanticTokens.colors.borderSecondary,
    colorFillTertiary: semanticTokens.colors.fillHover,
    colorFillSecondary: semanticTokens.colors.fillActive,
    fontFamily: semanticTokens.fontFamily,
    fontSize: semanticTokens.fontSize.body,
    fontSizeSM: semanticTokens.fontSize.help,
    fontSizeLG: semanticTokens.fontSize.cardTitle,
    borderRadius: semanticTokens.radius.control,
    borderRadiusLG: semanticTokens.radius.card,
    borderRadiusSM: semanticTokens.radius.control,
    controlHeightSM: 24,
    controlHeight: 32,
    controlHeightLG: 40,
    marginXXS: primitiveTokens.spacing.xs,
    marginXS: primitiveTokens.spacing.sm,
    marginSM: primitiveTokens.spacing.md,
    margin: primitiveTokens.spacing.md,
    marginMD: primitiveTokens.spacing.lg,
    paddingXXS: primitiveTokens.spacing.xs,
    paddingXS: primitiveTokens.spacing.sm,
    paddingSM: primitiveTokens.spacing.md,
    padding: primitiveTokens.spacing.md,
    paddingMD: primitiveTokens.spacing.lg,
    boxShadow: semanticTokens.shadow.card,
  },
  components: {
    Layout: {
      bodyBg: componentTokens.layout.bodyBg,
      siderBg: componentTokens.layout.siderBg,
      headerBg: componentTokens.layout.headerBg,
    },
    Card: {
      colorBgContainer: componentTokens.card.bg,
      borderRadiusLG: componentTokens.card.radius,
      paddingLG: componentTokens.card.padding,
      boxShadow: componentTokens.card.shadow,
    },
    Menu: {
      darkItemBg: componentTokens.menu.darkItemBg,
      darkSubMenuItemBg: componentTokens.menu.darkSubMenuItemBg,
      darkItemSelectedBg: componentTokens.menu.darkItemSelectedBg,
    },
    Table: {
      rowHoverBg: componentTokens.table.rowHoverBg,
      rowSelectedBg: componentTokens.table.rowSelectedBg,
      rowSelectedHoverBg: componentTokens.table.rowSelectedBg,
    },
  },
};
