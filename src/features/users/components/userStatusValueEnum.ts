/**
 * 用户状态 valueEnum —— hook 形态（架构决策 6.12.5 ④ 反模式规避）。
 *
 * 必须在组件/hook 内用 intl 构建，不能在模块顶层固化 label，
 * 否则切语言时表头/枚举不重渲染（业内最高频 i18n 生产事故）。
 * label 走 enum.* key（codegen 同步目标，见 locales/{lang}/enum.ts）；
 * 状态色对齐 §2.1 token 语义。
 */
import type { ProSchemaValueEnumMap } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export function useUserStatusValueEnum(): ProSchemaValueEnumMap {
  const intl = useIntl();
  return useMemo(
    () =>
      new Map([
        [
          'active',
          { text: intl.formatMessage({ id: 'enum.userStatus.active' }), status: 'Success' },
        ],
        [
          'disabled',
          { text: intl.formatMessage({ id: 'enum.userStatus.disabled' }), status: 'Error' },
        ],
      ]),
    [intl],
  );
}
