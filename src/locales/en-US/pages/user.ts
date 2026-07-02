/** users module domain field labels (frontend-owned, pages.user.* namespace). */
const pageUser: Record<string, string> = {
  'pages.user.employeeNo': 'Employee No.',
  'pages.user.realName': 'Real name',
  'pages.user.email': 'Email',
  'pages.user.mobile': 'Mobile',
  'pages.user.department': 'Department',
  'pages.user.preferredLocale': 'Preferred locale',
  'pages.user.searchPlaceholder': 'Search username / name / employee no.',
  'pages.user.employeeNoPlaceholder': 'Filter by employee no.',
  'pages.user.emptyFiltered': 'No users match your filters. Try broadening them.',
  'pages.user.emptyDefault': 'No users yet',
  'pages.user.clearFilters': 'Clear filters',
  'pages.user.exportSelected': 'Export selected',
  'pages.user.exportComingSoon': 'Server-side export coming soon',
  'pages.user.clearSelection': 'Clear selection',
  'pages.user.selectedCount': 'Selected {count}',
  'pages.user.roles': 'Roles',
  'pages.user.remark': 'Remark',
  'pages.user.resetPassword': 'Reset password',
  'pages.user.batchDelete': 'Batch delete',
  // Drawer titles & field validation
  'pages.user.createTitle': 'New user',
  'pages.user.editTitle': 'Edit user',
  'pages.user.usernameRequired': 'Username is required',
  'pages.user.usernameLocked': 'Username cannot be changed after creation',
  'pages.user.employeeNoRequired': 'Employee no. is required',
  'pages.user.passwordMin': 'Password must be at least 8 characters',
  'pages.user.passwordCreateHint': 'Leave blank so the user cannot sign in yet',
  'pages.user.passwordEditHint': 'Leave blank to keep the current password',
  'pages.user.emailInvalid': 'Invalid email format',
  // Success feedback
  'pages.user.createSuccess': 'User created',
  'pages.user.updateSuccess': 'User updated',
  'pages.user.deleteSuccess': 'User deleted',
  // Delete confirmation
  'pages.user.deleteConfirmTitle': 'Delete this user?',
  'pages.user.deleteConfirmContent':
    'This will delete user "{name}". This action cannot be undone.',
  'pages.user.batchDeleteConfirmTitle': 'Delete selected users?',
  'pages.user.batchDeleteConfirmContent':
    'This will delete {count} selected users. This action cannot be undone.',
  'pages.user.batchDeleteSuccess': '{affected} users deleted',
  // Reset password modal
  'pages.user.resetPasswordTitle': 'Reset password for "{name}"',
  'pages.user.resetPasswordTitleGeneric': 'Reset password',
  'pages.user.resetPasswordSuccess': 'Password reset',
  'pages.user.newPassword': 'New password',
  'pages.user.newPasswordRequired': 'Please enter a new password',
  'pages.user.confirmPassword': 'Confirm password',
  'pages.user.confirmPasswordRequired': 'Please re-enter the password',
  'pages.user.passwordMismatch': 'The two passwords do not match',
};

export default pageUser;
