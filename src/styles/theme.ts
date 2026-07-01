/**
 * AntD 5 主题 token —— 取自 Aether v2.0 视觉系统（设计规范 §2）。
 * 三层结构：primitive（原始值）→ semantic（角色语义）→ component（组件覆盖）。
 * 颜色语义统一走 token，组件里不写裸 hex。
 */
import type { ThemeConfig } from 'antd';

export const LAPLACE_BLUE = '#192E76';

export const aetherPrimitiveTokens = {
  colors: {
    laplaceBlue: LAPLACE_BLUE,
    siderNavy: '#142B70',
    siderNavyEnd: '#17327C',
    laplaceDeep: '#0F1F52',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C',
    pageGray: '#F5F6FA',
    white: '#FFFFFF',
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

export const aetherSemanticTokens = {
  colors: {
    primary: aetherPrimitiveTokens.colors.laplaceBlue,
    link: aetherPrimitiveTokens.colors.laplaceBlue,
    emphasis: aetherPrimitiveTokens.colors.laplaceBlue,
    success: aetherPrimitiveTokens.colors.success,
    warning: aetherPrimitiveTokens.colors.warning,
    error: aetherPrimitiveTokens.colors.error,
    bgPage: aetherPrimitiveTokens.colors.pageGray,
    bgContainer: aetherPrimitiveTokens.colors.white,
    textPrimary: 'rgba(0,0,0,.88)',
    textSecondary: 'rgba(0,0,0,.45)',
    tableRowHover: aetherPrimitiveTokens.colors.pageGray,
    // laplaceBlue(#192E76 = rgb(25,46,118)) @ 8% —— rgba 无法无损由 hex 派生，故就地锚定来源。
    tableRowSelected: 'rgba(25,46,118,.08)',
  },
  spacing: {
    grid: aetherPrimitiveTokens.spacing.sm,
    cardGap: aetherPrimitiveTokens.spacing.md,
    cardPadding: aetherPrimitiveTokens.spacing.lg,
  },
  fontFamily:
    '-apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  fontSize: {
    help: aetherPrimitiveTokens.fontSize.caption,
    body: aetherPrimitiveTokens.fontSize.body,
    table: aetherPrimitiveTokens.fontSize.body,
    cardTitle: aetherPrimitiveTokens.fontSize.title,
    kpi: aetherPrimitiveTokens.fontSize.kpi,
  },
  radius: {
    control: aetherPrimitiveTokens.radius.base,
    card: aetherPrimitiveTokens.radius.base,
    pill: aetherPrimitiveTokens.radius.pill,
  },
  shadow: {
    card: aetherPrimitiveTokens.shadow.card,
  },
} as const;

export const aetherComponentTokens = {
  layout: {
    siderBg: aetherPrimitiveTokens.colors.siderNavy,
    siderBgEnd: aetherPrimitiveTokens.colors.siderNavyEnd,
    headerBg: aetherSemanticTokens.colors.bgContainer,
    bodyBg: aetherSemanticTokens.colors.bgPage,
  },
  card: {
    bg: aetherSemanticTokens.colors.bgContainer,
    padding: aetherSemanticTokens.spacing.cardPadding,
    radius: aetherSemanticTokens.radius.card,
    shadow: aetherSemanticTokens.shadow.card,
  },
  menu: {
    darkItemBg: aetherPrimitiveTokens.colors.siderNavy,
    darkSubMenuItemBg: aetherPrimitiveTokens.colors.siderNavy,
    darkItemSelectedBg: aetherSemanticTokens.colors.primary,
  },
  table: {
    rowHoverBg: aetherSemanticTokens.colors.tableRowHover,
    rowSelectedBg: aetherSemanticTokens.colors.tableRowSelected,
  },
} as const;

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: aetherSemanticTokens.colors.primary,
    colorLink: aetherSemanticTokens.colors.link,
    colorSuccess: aetherSemanticTokens.colors.success,
    colorWarning: aetherSemanticTokens.colors.warning,
    colorError: aetherSemanticTokens.colors.error,
    colorBgLayout: aetherSemanticTokens.colors.bgPage,
    colorBgContainer: aetherSemanticTokens.colors.bgContainer,
    colorText: aetherSemanticTokens.colors.textPrimary,
    colorTextSecondary: aetherSemanticTokens.colors.textSecondary,
    fontFamily: aetherSemanticTokens.fontFamily,
    fontSize: aetherSemanticTokens.fontSize.body,
    fontSizeSM: aetherSemanticTokens.fontSize.help,
    fontSizeLG: aetherSemanticTokens.fontSize.cardTitle,
    borderRadius: aetherSemanticTokens.radius.control,
    borderRadiusLG: aetherSemanticTokens.radius.card,
    borderRadiusSM: aetherSemanticTokens.radius.control,
    controlHeightSM: 24,
    controlHeight: 32,
    controlHeightLG: 40,
    marginXXS: aetherPrimitiveTokens.spacing.xs,
    marginXS: aetherPrimitiveTokens.spacing.sm,
    marginSM: aetherPrimitiveTokens.spacing.md,
    margin: aetherPrimitiveTokens.spacing.md,
    marginMD: aetherPrimitiveTokens.spacing.lg,
    paddingXXS: aetherPrimitiveTokens.spacing.xs,
    paddingXS: aetherPrimitiveTokens.spacing.sm,
    paddingSM: aetherPrimitiveTokens.spacing.md,
    padding: aetherPrimitiveTokens.spacing.md,
    paddingMD: aetherPrimitiveTokens.spacing.lg,
    boxShadow: aetherSemanticTokens.shadow.card,
  },
  components: {
    Layout: {
      bodyBg: aetherComponentTokens.layout.bodyBg,
      siderBg: aetherComponentTokens.layout.siderBg,
      headerBg: aetherComponentTokens.layout.headerBg,
    },
    Card: {
      colorBgContainer: aetherComponentTokens.card.bg,
      borderRadiusLG: aetherComponentTokens.card.radius,
      paddingLG: aetherComponentTokens.card.padding,
      boxShadow: aetherComponentTokens.card.shadow,
    },
    Menu: {
      darkItemBg: aetherComponentTokens.menu.darkItemBg,
      darkSubMenuItemBg: aetherComponentTokens.menu.darkSubMenuItemBg,
      darkItemSelectedBg: aetherComponentTokens.menu.darkItemSelectedBg,
    },
    Table: {
      rowHoverBg: aetherComponentTokens.table.rowHoverBg,
      rowSelectedBg: aetherComponentTokens.table.rowSelectedBg,
      rowSelectedHoverBg: aetherComponentTokens.table.rowSelectedBg,
    },
  },
};
