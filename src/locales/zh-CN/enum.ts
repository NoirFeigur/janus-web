/**
 * 枚举 label —— 【codegen 自动生成，请勿手改】。
 *
 * 由 `pnpm codegen` 从 janus-server 的 `src/locales/zh-CN/enums.json`
 * 生成（架构决策 G16 / 6.12：枚举 label 后端单源，与服务端导出共享译文）。
 * 要改 label：改后端 enums.json 后重跑 `pnpm codegen`。
 *
 * 键名约定：`enum.{枚举名小驼峰}.{code}`。
 */
const enums: Record<string, string> = {
  // ActiveStatus
  'enum.activeStatus.active': '启用',
  'enum.activeStatus.disabled': '禁用',
  // UsageStatus
  'enum.usageStatus.success': '成功',
  'enum.usageStatus.error': '错误',
  'enum.usageStatus.timeout': '超时',
  // AuditOutcome
  'enum.auditOutcome.success': '成功',
  'enum.auditOutcome.failure': '失败',
  // LoginFailureReason
  'enum.loginFailureReason.bad_credentials': '账号或密码错误',
  'enum.loginFailureReason.user_disabled': '账号已禁用',
  'enum.loginFailureReason.user_not_found': '用户不存在',
  'enum.loginFailureReason.account_locked': '账号已锁定',
  // UserStatus
  'enum.userStatus.active': '启用',
  'enum.userStatus.disabled': '禁用',
  // OauthSource
  'enum.oauthSource.wecom': '企业微信',
  // ApiKeyStatus
  'enum.apiKeyStatus.active': '启用',
  'enum.apiKeyStatus.disabled': '禁用',
  // MenuType
  'enum.menuType.catalog': '目录',
  'enum.menuType.menu': '菜单',
  'enum.menuType.button': '按钮',
  // ChannelStatus
  'enum.channelStatus.active': '启用',
  'enum.channelStatus.disabled': '禁用',
  // ChannelKeyStatus
  'enum.channelKeyStatus.active': '启用',
  'enum.channelKeyStatus.disabled': '禁用',
  // GrantScope
  'enum.grantScope.user': '用户',
  'enum.grantScope.department': '部门',
  // QuotaScope
  'enum.quotaScope.user': '用户',
  'enum.quotaScope.department': '部门',
  'enum.quotaScope.global': '全局',
  // QuotaPeriod
  'enum.quotaPeriod.daily': '每日',
  'enum.quotaPeriod.monthly': '每月',
  'enum.quotaPeriod.total': '总量',
  // QuotaMetric
  'enum.quotaMetric.tokens': 'Token',
  'enum.quotaMetric.requests': '请求数',
  'enum.quotaMetric.cost': '成本',
  // RateLimitScope
  'enum.rateLimitScope.user': '用户',
  'enum.rateLimitScope.department': '部门',
  'enum.rateLimitScope.global': '全局',
  'enum.rateLimitScope.api_key': 'API Key',
  // ConfigValueType
  'enum.configValueType.string': '字符串',
  'enum.configValueType.int': '整数',
  'enum.configValueType.bool': '布尔',
  'enum.configValueType.json': 'JSON',
  // AttachBizType
  'enum.attachBizType.avatar': '头像',
  'enum.attachBizType.attachment': '附件',
};

export default enums;
