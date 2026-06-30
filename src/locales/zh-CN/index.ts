import common from './common';
import enums from './enum';
import error from './error';
import menu from './menu';
import pageDashboard from './pages/dashboard';
import pageUser from './pages/user';

const messages: Record<string, string> = {
  ...common,
  ...menu,
  ...error,
  ...enums,
  ...pageUser,
  ...pageDashboard,
};

export default messages;
