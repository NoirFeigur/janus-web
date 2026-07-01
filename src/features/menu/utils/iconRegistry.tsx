/**
 * 菜单图标注册表 —— 后端 menu.icon（kebab-case 字符串）→ AntD 图标组件。
 *
 * 后端只存稳定标识符（如 "team"），前端拥有具体图标组件（契约同 i18n/枚举）。
 * 未登记的 icon 回落 AppstoreOutlined（不崩，新图标按需登记）。
 */
import {
  ApiOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  KeyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

const ICON_REGISTRY: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  team: <TeamOutlined />,
  key: <KeyOutlined />,
  appstore: <AppstoreOutlined />,
  'deployment-unit': <DeploymentUnitOutlined />,
  'bar-chart': <BarChartOutlined />,
  api: <ApiOutlined />,
};

/** 按后端 icon 名取图标；未登记回落 appstore。null/未知均安全。 */
export function resolveIcon(icon: string | null): ReactNode {
  if (icon && icon in ICON_REGISTRY) {
    return ICON_REGISTRY[icon];
  }
  return <AppstoreOutlined />;
}
