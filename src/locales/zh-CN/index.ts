import common from './common';
import enums from './enum';
import error from './error';
import menu from './menu';
import pageDashboard from './pages/dashboard';
import pageLogin from './pages/login';
import pageUser from './pages/user';

const messages: Record<string, string> = {
  ...common,
  ...menu,
  ...error,
  ...enums,
  ...pageUser,
  ...pageDashboard,
  ...pageLogin,
};

export default messages;
