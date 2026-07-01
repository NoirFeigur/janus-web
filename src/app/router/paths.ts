/** 路由路径常量 —— 给 useNavigate / Link 用，组件里不写裸路径串。 */
export const paths = {
  login: '/login',
  home: '/',
  dashboard: '/dashboard',
  users: '/users',
  credentials: '/credentials',
  catalog: '/catalog',
  grants: '/grants',
  usage: '/usage',
  quota: '/quota',
  notFound: '/404',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
