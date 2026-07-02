/**
 * AntD 5 主题 token —— Janus 视觉系统（设计规范 §2 / DESIGN.md）。
 * 三层结构：primitive（原始值）→ semantic（角色语义）→ component（组件覆盖）。
 * 颜色语义统一走 token，组件里不写裸 hex。
 *
 * 2025 重设计：靛蓝 #2D50C8 替代旧藏蓝、冷石墨中性阶、次要文字对比度修复、
 * 三档深度、radius base 8。视觉真值以 DESIGN.md 为准，改色只改本文件后重跑 pnpm codegen。
 */
import type { ThemeConfig } from 'antd';

export const PRIMARY_BLUE = '#2D50C8';

export const primitiveTokens = {
  colors: {
    // 品牌靛蓝 —— 白字 ~7.4:1，达标 AA。hover/active 为交互态明暗档。
    primaryBlue: PRIMARY_BLUE,
    primaryHover: '#3A5DD9',
    primaryActive: '#2543AE',
    // primary @ 8% / 20% —— 选中行 / 激活页签 / info 底 + 选中描边（rgba 无法无损由 hex 派生，就地锚定）。
    primarySubtle: 'rgba(45,80,200,.08)',
    primarySubtleBorder: 'rgba(45,80,200,.20)',
    // 侧栏 / 品牌深色面 —— 冷石墨，不再是饱和藏蓝，纯色不做渐变。
    graphite: '#1E2230',
    graphiteDeep: '#171B26',
    // 状态色基值 —— 贴合冷调基底、维持双通道（点+字）。
    success: '#2E8B57',
    warning: '#C77A0A',
    error: '#D23F3F',
    // info 复用品牌靛蓝 —— 信息态即品牌态。
    info: PRIMARY_BLUE,
    // 状态浅底 / 描边 —— 徽章、Alert、Tag 的填充与边框，绝不只靠前景色区分状态。
    successBg: '#ECF7F0',
    successBorder: '#CBE8D5',
    warningBg: '#FBF3E6',
    warningBorder: '#F2DDB8',
    errorBg: '#FBECEC',
    errorBorder: '#F3CDCD',
    infoBg: 'rgba(45,80,200,.08)',
    infoBorder: 'rgba(45,80,200,.20)',
    // 冷石墨中性阶 —— 微偏品牌 hue，让"灰"也属于品牌，而非通用灰。
    // 两值制配色（Restrained）：白（凸起面：卡片/输入/数据行）+ 单一凹陷灰（画布 +
    // 分段轨道）+ 靛蓝（仅动作/选中）。画布用凹陷灰，白卡才真正「浮」起来（figure-
    // ground），而非贴在近白上糊成一片。
    page: '#EAEDF5',
    // 分段控件轨道等「凹陷」语义复用同一灰；不再引入第 3、4 种近白灰。
    surfaceSunken: '#EAEDF5',
    // 行 hover：白卡内的极浅悬停填充（比画布浅，避免与画布同色）。
    tableRowHover: '#F4F6FA',
    // 斑马纹：偶数行的极浅冷调填充。介于纯白(奇数行)与 hover 之间的最弱一档，
    // 仅为长表扫读提供行锚，不打破「白为凸起面」的两值语言（差值 <2%，hover 仍能压过）。
    tableRowStripe: '#FAFBFD',
    white: '#FFFFFF',
    border: '#E3E6EE',
    borderSecondary: '#EEF0F5',
    fillHover: 'rgba(48,58,84,.04)',
    fillActive: 'rgba(48,58,84,.07)',
    // 文字阶 —— 冷近黑；secondary 提到 ~5.4:1 达标 AA 正文（旧值 3.5:1 不达标）。
    textPrimary: '#1A1F2E',
    textSecondary: '#5A6274',
    // tertiary：图标/占位/禁用等最弱一档；不用于正文（正文须 ≥4.5:1）。
    textTertiary: '#8A92A6',
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
    kpi: 28,
  },
  radius: {
    // base 卡片 8px（更当代），控件 6px。
    control: 6,
    card: 8,
    pill: 999,
  },
  shadow: {
    // 三档深度（DESIGN.md §5）—— 阴影带冷调 rgba(26,31,46,…)，非纯黑。
    card: '0 1px 2px rgba(26,31,46,.06)',
    overlay: '0 4px 12px rgba(26,31,46,.10)',
    dialog: '0 12px 32px rgba(26,31,46,.16)',
  },
} as const;

export const semanticTokens = {
  colors: {
    primary: primitiveTokens.colors.primaryBlue,
    primaryHover: primitiveTokens.colors.primaryHover,
    primaryActive: primitiveTokens.colors.primaryActive,
    primarySubtle: primitiveTokens.colors.primarySubtle,
    primarySubtleBorder: primitiveTokens.colors.primarySubtleBorder,
    link: primitiveTokens.colors.primaryBlue,
    emphasis: primitiveTokens.colors.primaryBlue,
    success: primitiveTokens.colors.success,
    warning: primitiveTokens.colors.warning,
    error: primitiveTokens.colors.error,
    info: primitiveTokens.colors.info,
    bgPage: primitiveTokens.colors.page,
    bgContainer: primitiveTokens.colors.white,
    surfaceSunken: primitiveTokens.colors.surfaceSunken,
    textPrimary: primitiveTokens.colors.textPrimary,
    textSecondary: primitiveTokens.colors.textSecondary,
    textTertiary: primitiveTokens.colors.textTertiary,
    border: primitiveTokens.colors.border,
    borderSecondary: primitiveTokens.colors.borderSecondary,
    fillHover: primitiveTokens.colors.fillHover,
    fillActive: primitiveTokens.colors.fillActive,
    // 行 hover 用独立的浅悬停填充；选中行用 primary-subtle。
    tableRowHover: primitiveTokens.colors.tableRowHover,
    tableRowSelected: primitiveTokens.colors.primarySubtle,
    tableRowStripe: primitiveTokens.colors.tableRowStripe,
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
    control: primitiveTokens.radius.control,
    card: primitiveTokens.radius.card,
    pill: primitiveTokens.radius.pill,
  },
  shadow: {
    card: primitiveTokens.shadow.card,
    overlay: primitiveTokens.shadow.overlay,
    dialog: primitiveTokens.shadow.dialog,
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
  '--brand-page': primitiveTokens.colors.page,
  '--brand-surface-sunken': primitiveTokens.colors.surfaceSunken,
  '--brand-primary': primitiveTokens.colors.primaryBlue,
  '--brand-primary-hover': primitiveTokens.colors.primaryHover,
  '--brand-primary-active': primitiveTokens.colors.primaryActive,
  '--brand-primary-subtle': primitiveTokens.colors.primarySubtle,
  '--brand-primary-subtle-border': primitiveTokens.colors.primarySubtleBorder,
  // 侧栏 / 品牌深色面 —— 冷石墨纯色（nav-deep 供登录品牌面用最深档）。
  '--brand-nav': primitiveTokens.colors.graphite,
  '--brand-nav-deep': primitiveTokens.colors.graphiteDeep,
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
  '--brand-table-row-stripe': semanticTokens.colors.tableRowStripe,
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
    // 侧栏冷石墨纯色（DESIGN.md §6，去饱和藏蓝渐变）。
    siderBg: primitiveTokens.colors.graphite,
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
    darkItemBg: primitiveTokens.colors.graphite,
    darkSubMenuItemBg: primitiveTokens.colors.graphite,
    darkItemSelectedBg: semanticTokens.colors.primary,
  },
  table: {
    rowHoverBg: semanticTokens.colors.tableRowHover,
    rowSelectedBg: semanticTokens.colors.tableRowSelected,
    // 表头白底（同数据行），靠底边框 + 弱化列名区分，不再用灰填充 → 彻底去掉卡内色带
    // （DESIGN.md §8：两张浮卡 + 白表头，靠结构而非填色分层）。
    headerBg: semanticTokens.colors.bgContainer,
    headerColor: semanticTokens.colors.textSecondary,
    headerSplitColor: 'transparent',
    // 行高呼吸感（DESIGN.md §4 rhythm）：middle 密度下把纵向内边距从默认 12 提到 14，
    // 数据密集但不逼仄；斑马纹 + hover 由 global.css 承载（AntD 无 stripe token）。
    cellPaddingBlock: 14,
  },
  segmented: {
    // 分段控件轨道用与表头同一沉降灰（收敛为单一凹陷灰，杜绝第 4 种近白灰与页面
    // 底色打架）；选中项为白色凸起胶囊，在灰轨道上清晰浮现（macOS 风格），选中文字
    // 用品牌墨色强调 —— 灰轨白丸的对比让「当前筛选」一眼可辨，替代原本几乎不可见的
    // 白丸浮白轨。
    trackBg: primitiveTokens.colors.surfaceSunken,
    itemSelectedBg: semanticTokens.colors.bgContainer,
    itemColor: semanticTokens.colors.textSecondary,
    itemSelectedColor: semanticTokens.colors.primary,
    itemHoverColor: semanticTokens.colors.textPrimary,
  },
} as const;

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: semanticTokens.colors.primary,
    colorPrimaryHover: semanticTokens.colors.primaryHover,
    colorPrimaryActive: semanticTokens.colors.primaryActive,
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
    boxShadowSecondary: semanticTokens.shadow.overlay,
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
      headerBg: componentTokens.table.headerBg,
      headerColor: componentTokens.table.headerColor,
      headerSplitColor: componentTokens.table.headerSplitColor,
      cellPaddingBlock: componentTokens.table.cellPaddingBlock,
    },
    Segmented: {
      trackBg: componentTokens.segmented.trackBg,
      itemSelectedBg: componentTokens.segmented.itemSelectedBg,
      itemColor: componentTokens.segmented.itemColor,
      itemSelectedColor: componentTokens.segmented.itemSelectedColor,
      itemHoverColor: componentTokens.segmented.itemHoverColor,
    },
  },
};
