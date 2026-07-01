/** layout 展示组件使用的菜单树窄类型，避免 components 反向依赖 features。 */
export interface LayoutMenuNode {
  name: string;
  path: string | null;
  menu_type: string;
  children: LayoutMenuNode[];
}
