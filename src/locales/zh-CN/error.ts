/**
 * 业务错误文案。键 = `error.${ErrorCode}`，严格对齐后端 23 个 ErrorCode
 * （janus-server/src/enums.py，见设计规范 §6）。{占位符} 由后端 params 插值。
 */
const error: Record<string, string> = {
  'error.auth.invalid_token': '登录已失效，请重新登录',
  'error.auth.token_revoked': '会话已失效，请重新登录',
  'error.auth.refresh_invalid': '登录状态已过期，请重新登录',
  'error.auth.account_locked': '账号已锁定，请稍后再试',
  'error.auth.password_too_weak': '密码强度不足',
  'error.auth.user_disabled': '账号已禁用',
  'error.auth.forbidden': '无权限执行此操作',
  'error.attach.not_found': '附件不存在',
  'error.attach.invalid_image': '图片格式无法识别',
  'error.attach.too_large': '文件超出大小限制',
  'error.model.not_granted': '未获该模型使用权限',
  'error.model.not_found': '模型不存在或已禁用',
  'error.model.unavailable': '模型当前不可用',
  'error.model.no_available_channel': '模型无可用渠道',
  'error.quota.exceeded': '已用 {used}/{limit}，{period} 配额耗尽',
  'error.rate_limit.exceeded': '请求过于频繁，请稍后再试',
  'error.upstream.error': '上游服务异常',
  'error.upstream.timeout': '上游响应超时',
  'error.upstream.rate_limited': '上游限流，请稍后再试',
  'error.request.invalid': '请求参数有误',
  'error.request.conflict': '已存在或存在冲突',
  'error.service.unavailable': '服务暂不可用，请重试',
  'error.internal.error': '系统错误，请联系管理员',
};

export default error;
