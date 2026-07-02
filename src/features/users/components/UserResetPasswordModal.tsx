/**
 * 重置用户密码弹窗 —— 管理员为指定用户设新密码（区别于用户自助改密）。
 *
 * 走 resetUserPassword mutation；成功后无需失效列表（密码不在列表展示）。
 * 后端密码强度校验失败以 422 回落到 password 表单项（field 名 1:1）；其余错误拦截器全局 toast。
 * 二次确认（confirm）纯前端比对,不发后端。
 */
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { App } from 'antd';

import { useResetUserPasswordMutation } from '../api/users.queries';
import type { User } from '../api/users.types';

import { useT } from '@/hooks/useT';
import { ApiError } from '@/types/api';

interface ResetPasswordValues {
  password: string;
  confirm: string;
}

interface UserResetPasswordModalProps {
  open: boolean;
  /** 目标用户；关闭态为 null。 */
  record: User | null;
  onOpenChange: (open: boolean) => void;
}

export function UserResetPasswordModal({
  open,
  record,
  onOpenChange,
}: UserResetPasswordModalProps) {
  const t = useT();
  const { message } = App.useApp();
  const resetMutation = useResetUserPasswordMutation();

  const handleFinish = async (values: ResetPasswordValues): Promise<boolean> => {
    if (!record) {
      return false;
    }
    try {
      await resetMutation.mutateAsync({ id: record.id, password: values.password });
      message.success(t('pages.user.resetPasswordSuccess'));
      return true;
    } catch (error) {
      // 后端强度校验 422 → 落到 password 项；其余拦截器已 toast。
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        // 字段错误由 ModalForm 内部 form 消费需 setFields，但 ModalForm 未透出 form 实例，
        // 故这里退化为全局提示强度错误（仍保留字段级 msg 文案）。
        void message.error(error.fieldErrors.map((fe) => fe.msg).join('；'));
      }
      return false;
    }
  };

  return (
    <ModalForm<ResetPasswordValues>
      open={open}
      onOpenChange={onOpenChange}
      title={
        record
          ? t('pages.user.resetPasswordTitle', { name: record.real_name ?? record.username })
          : t('pages.user.resetPasswordTitleGeneric')
      }
      width={420}
      layout="vertical"
      modalProps={{ destroyOnHidden: true, maskClosable: false }}
      submitTimeout={10_000}
      onFinish={handleFinish}
    >
      <ProFormText.Password
        name="password"
        label={t('pages.user.newPassword')}
        rules={[
          { required: true, message: t('pages.user.newPasswordRequired') },
          { min: 8, message: t('pages.user.passwordMin') },
        ]}
        fieldProps={{ autoComplete: 'new-password' }}
      />
      <ProFormText.Password
        name="confirm"
        label={t('pages.user.confirmPassword')}
        dependencies={['password']}
        rules={[
          { required: true, message: t('pages.user.confirmPasswordRequired') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('pages.user.passwordMismatch')));
            },
          }),
        ]}
        fieldProps={{ autoComplete: 'new-password' }}
      />
    </ModalForm>
  );
}
