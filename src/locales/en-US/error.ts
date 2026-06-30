/** Business error copy. Keys = `error.${ErrorCode}`, aligned to backend's 23 ErrorCodes. */
const error: Record<string, string> = {
  'error.auth.invalid_token': 'Session expired, please log in again',
  'error.auth.token_revoked': 'Session revoked, please log in again',
  'error.auth.refresh_invalid': 'Login expired, please log in again',
  'error.auth.account_locked': 'Account locked, please try again later',
  'error.auth.password_too_weak': 'Password too weak',
  'error.auth.user_disabled': 'Account disabled',
  'error.auth.forbidden': 'You do not have permission for this action',
  'error.attach.not_found': 'Attachment not found',
  'error.attach.invalid_image': 'Unrecognized image format',
  'error.attach.too_large': 'File exceeds size limit',
  'error.model.not_granted': 'Model not granted to you',
  'error.model.not_found': 'Model not found or disabled',
  'error.model.unavailable': 'Model currently unavailable',
  'error.model.no_available_channel': 'No available channel for model',
  'error.quota.exceeded': 'Used {used}/{limit}, {period} quota exhausted',
  'error.rate_limit.exceeded': 'Too many requests, please slow down',
  'error.upstream.error': 'Upstream provider error',
  'error.upstream.timeout': 'Upstream timed out',
  'error.upstream.rate_limited': 'Upstream rate-limited, try again later',
  'error.request.invalid': 'Invalid request parameters',
  'error.request.conflict': 'Already exists or conflicts',
  'error.service.unavailable': 'Service unavailable, please retry',
  'error.internal.error': 'Internal error, please contact admin',
};

export default error;
