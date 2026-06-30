/**
 * AntD 5 主题 token —— 取自 Aether v2.0 视觉系统（设计规范 §2.1）。
 * 颜色语义统一走 token，组件里不写裸 hex。
 */
import type { ThemeConfig } from 'antd';

export const LAPLACE_BLUE = '#192E76';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: LAPLACE_BLUE,
    colorSuccess: '#67C23A',
    colorWarning: '#E6A23C',
    colorError: '#F56C6C',
    borderRadius: 6,
    colorBgLayout: '#F5F6FA',
  },
  components: {
    Layout: {
      siderBg: '#142B70',
      headerBg: '#FFFFFF',
    },
    Menu: {
      darkItemBg: '#142B70',
      darkSubMenuItemBg: '#142B70',
      darkItemSelectedBg: LAPLACE_BLUE,
    },
  },
};
