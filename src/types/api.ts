/**
 * 后端统一响应契约（方案 B：以 `success` 布尔字段判别的同构信封）。
 *
 * 真实 wire format 以 janus-server/src/responses.py、exceptions.py 为准：
 * - 成功 2xx：{ success: true, data: <T>, trace_id }
 * - 错误 4xx/5xx：{ success: false, code, params, trace_id, errors? }
 *
 * 注意：这**不是** RFC 9457 problem+json（README 旧表述有误，见设计规范 §5）。
 * 运行时类型最终以 `pnpm codegen` 生成的 src/lib/openapi 为准；此处是手写镜像。
 */

/** 成功响应信封。 */
export interface SuccessEnvelope<T> {
  success: true;
  data: T | null;
  trace_id: string;
}

/** 入参校验失败（422）时的字段级明细。 */
export interface FieldError {
  field: string;
  type: string;
  msg: string;
}

/** 错误响应信封（与成功同构，靠 `success` 判别）。 */
export interface ErrorEnvelope {
  success: false;
  /** 机器可读稳定错误码，如 'auth.invalid_token'（见设计规范 §6）。 */
  code: string;
  params: Record<string, unknown>;
  trace_id: string;
  /** 仅 422 入参校验失败时出现。 */
  errors?: FieldError[];
}

/** 判别联合：前端按 `success` 收窄。 */
export type ApiResponse<T> = SuccessEnvelope<T> | ErrorEnvelope;

/**
 * 列表分页信封（offset/limit，非 page/pageSize）。
 * 以 janus-server/src/core/pagination.py 的 Page[T] 为准。
 */
export interface Page<T> {
  items: T[];
  total: number;
  /** 每页条数，>= 1。 */
  limit: number;
  /** 偏移量，>= 0。 */
  offset: number;
}

/**
 * 归一化后的应用错误：拦截器把 ErrorEnvelope 转成它再抛出，
 * 供调用方（query/mutation/form）按 `code` 处理。
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly params: Record<string, unknown>;
  readonly fieldErrors: FieldError[];
  readonly traceId: string | undefined;

  constructor(args: {
    code: string;
    status: number;
    params?: Record<string, unknown>;
    fieldErrors?: FieldError[];
    traceId?: string;
    message?: string;
  }) {
    super(args.message ?? args.code);
    this.name = 'ApiError';
    this.code = args.code;
    this.status = args.status;
    this.params = args.params ?? {};
    this.fieldErrors = args.fieldErrors ?? [];
    this.traceId = args.traceId;
  }
}
