/**
 * 用户新建/编辑抽屉 —— 本仓首个 DrawerForm，后续 feature 表单照此继承。
 *
 * 单组件双模式：mode='create' 走 createUser，mode='edit' 走 updateUser（预填 record）。
 * 雪花 ID（department_id / role_ids）全程持有字符串，原样提交，后端 Pydantic lax 无损
 * str→int（见 users.types 注释）。422 字段错误经 ApiError.fieldErrors 回落到对应表单项
 * （后端已剥 body 前缀，field 名与表单 name 1:1，见 janus-server exceptions.py）。
 * 成功后由父级 onSuccess 触发列表失效重取；成功 toast 在此按语境给。
 */
import { CloseOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Form } from 'antd';
import { useEffect } from 'react';

import {
  useCreateUserMutation,
  useUpdateUserMutation,
  departmentOptionsQuery,
  roleOptionsQuery,
} from '../api/users.queries';
import type { User, UserCreate, UserStatus, UserUpdate } from '../api/users.types';

import { USER_STATUS_META } from './userStatusMeta';

import { useT } from '@/hooks/useT';
import { ApiError } from '@/types/api';

/** 表单态：所有 ID 字段为字符串（与写入方向、精度安全一致）。 */
interface UserFormValues {
  username: string;
  employee_no: string;
  password?: string;
  real_name?: string;
  email?: string;
  mobile?: string;
  department_id?: string;
  status: UserStatus;
  preferred_locale: string;
  remark?: string;
  role_ids?: string[];
}

interface UserFormDrawerProps {
  open: boolean;
  /** 'create' 新建；'edit' 编辑（需传 record）。 */
  mode: 'create' | 'edit';
  /** 编辑目标；create 模式为 null。 */
  record: User | null;
  onOpenChange: (open: boolean) => void;
  /** 提交成功回调（父级据此收尾，如提示或聚焦）。列表失效已在 mutation 内做。 */
  onSuccess: () => void;
}

/** 空串归一为 undefined（可选文本字段留空即不提交该键）。 */
function blankToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function UserFormDrawer({
  open,
  mode,
  record,
  onOpenChange,
  onSuccess,
}: UserFormDrawerProps) {
  const t = useT();
  const { message } = App.useApp();
  const [form] = Form.useForm<UserFormValues>();

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  // 引用型下拉：抽屉打开时才拉（enabled=open），命中 5min 缓存不重复请求。
  const roleOptions = useQuery({ ...roleOptionsQuery(), enabled: open });
  const departmentOptions = useQuery({ ...departmentOptionsQuery(), enabled: open });

  const isEdit = mode === 'edit';

  // 打开或切换目标时重置表单为该模式初值（编辑预填 record，新建清空给默认）。
  useEffect(() => {
    if (!open) {
      return;
    }
    if (isEdit && record) {
      form.setFieldsValue({
        username: record.username,
        employee_no: record.employee_no,
        real_name: record.real_name ?? undefined,
        email: record.email ?? undefined,
        mobile: record.mobile ?? undefined,
        department_id: record.department_id ?? undefined,
        status: record.status,
        preferred_locale: record.preferred_locale,
        remark: record.remark ?? undefined,
        role_ids: record.role_ids,
        password: undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, isEdit, record, form]);

  const localeOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
  ];

  const statusOptions = USER_STATUS_META.map((m) => ({ label: t(m.labelKey), value: m.value }));

  /** 把 422 字段错误落到对应表单项；返回是否命中（命中则不再全局提示）。 */
  const applyFieldErrors = (error: unknown): boolean => {
    if (error instanceof ApiError && error.fieldErrors.length > 0) {
      form.setFields(
        error.fieldErrors.map((fe) => ({
          name: fe.field as keyof UserFormValues,
          errors: [fe.msg],
        })),
      );
      return true;
    }
    return false;
  };

  const handleFinish = async (values: UserFormValues): Promise<boolean> => {
    try {
      if (isEdit && record) {
        const payload: UserUpdate = {
          real_name: blankToUndefined(values.real_name) ?? null,
          email: blankToUndefined(values.email) ?? null,
          mobile: blankToUndefined(values.mobile) ?? null,
          department_id: values.department_id ?? null,
          status: values.status,
          preferred_locale: values.preferred_locale,
          remark: blankToUndefined(values.remark) ?? null,
          role_ids: values.role_ids ?? [],
        };
        // 编辑态密码留空 = 不改；填了才发。
        const password = blankToUndefined(values.password);
        if (password) {
          payload.password = password;
        }
        await updateMutation.mutateAsync({ id: record.id, payload });
        message.success(t('pages.user.updateSuccess'));
      } else {
        const payload: UserCreate = {
          username: values.username.trim(),
          employee_no: values.employee_no.trim(),
          password: blankToUndefined(values.password) ?? null,
          real_name: blankToUndefined(values.real_name) ?? null,
          email: blankToUndefined(values.email) ?? null,
          mobile: blankToUndefined(values.mobile) ?? null,
          department_id: values.department_id ?? null,
          status: values.status,
          preferred_locale: values.preferred_locale,
          remark: blankToUndefined(values.remark) ?? null,
          role_ids: values.role_ids ?? [],
        };
        await createMutation.mutateAsync(payload);
        message.success(t('pages.user.createSuccess'));
      }
      onSuccess();
      return true; // 关闭抽屉。
    } catch (error) {
      // 422 字段错误落到表单项，保持抽屉打开；其余错误拦截器已全局 toast。
      applyFieldErrors(error);
      return false;
    }
  };

  return (
    <DrawerForm<UserFormValues>
      form={form}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('pages.user.editTitle') : t('pages.user.createTitle')}
      width={480}
      layout="vertical"
      drawerProps={{
        destroyOnHidden: false,
        maskClosable: false,
        closable: false,
        extra: (
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => onOpenChange(false)}
            aria-label={t('common.cancel')}
          />
        ),
      }}
      submitTimeout={10_000}
      initialValues={{ status: 'active', preferred_locale: 'zh-CN', role_ids: [] }}
      onFinish={handleFinish}
    >
      <ProFormText
        name="username"
        label={t('common.username')}
        rules={[{ required: true, message: t('pages.user.usernameRequired') }]}
        fieldProps={{ maxLength: 64, disabled: isEdit }}
        tooltip={isEdit ? t('pages.user.usernameLocked') : undefined}
      />
      <ProFormText
        name="employee_no"
        label={t('pages.user.employeeNo')}
        rules={[{ required: true, message: t('pages.user.employeeNoRequired') }]}
        fieldProps={{ maxLength: 64, disabled: isEdit }}
      />
      <ProFormText.Password
        name="password"
        label={t('common.password')}
        rules={isEdit ? [] : [{ min: 8, message: t('pages.user.passwordMin') }]}
        placeholder={isEdit ? t('pages.user.passwordEditHint') : t('pages.user.passwordCreateHint')}
        fieldProps={{ autoComplete: 'new-password' }}
      />
      <ProFormText
        name="real_name"
        label={t('pages.user.realName')}
        fieldProps={{ maxLength: 64 }}
      />
      <ProFormText
        name="email"
        label={t('pages.user.email')}
        rules={[{ type: 'email', message: t('pages.user.emailInvalid') }]}
        fieldProps={{ maxLength: 255 }}
      />
      <ProFormText name="mobile" label={t('pages.user.mobile')} fieldProps={{ maxLength: 32 }} />
      <ProFormSelect
        name="department_id"
        label={t('pages.user.department')}
        options={departmentOptions.data ?? []}
        fieldProps={{
          loading: departmentOptions.isLoading,
          allowClear: true,
          showSearch: true,
          optionFilterProp: 'label',
        }}
      />
      <ProFormSelect
        name="role_ids"
        label={t('pages.user.roles')}
        mode="multiple"
        options={roleOptions.data ?? []}
        fieldProps={{ loading: roleOptions.isLoading, showSearch: true, optionFilterProp: 'label' }}
      />
      <ProFormSelect
        name="status"
        label={t('common.status')}
        options={statusOptions}
        rules={[{ required: true }]}
        allowClear={false}
      />
      <ProFormSelect
        name="preferred_locale"
        label={t('pages.user.preferredLocale')}
        options={localeOptions}
        rules={[{ required: true }]}
        allowClear={false}
      />
      <ProFormTextArea
        name="remark"
        label={t('pages.user.remark')}
        fieldProps={{ maxLength: 255, rows: 3, showCount: true }}
      />
    </DrawerForm>
  );
}
