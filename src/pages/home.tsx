/**
 * 固定首页 / 门户 —— 非动态菜单，静态注册于 '/'（与 login/404 同类的框架页）。
 * 现阶段：问候语 + 由动态菜单驱动的快捷入口卡片（点击跳对应功能页）。
 * 后续可在此生长门户级内容（公告 / 待办 / 常用入口等）。
 */
import { currentMenusOptions } from '@features/menu/api/menu.queries';
import { buildMenuTree } from '@features/menu/utils/buildMenuTree';
import { resolveIcon } from '@features/menu/utils/iconRegistry';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { BasicContainer } from '@/components/BasicContainer';
import { useT } from '@/hooks/useT';

export default function HomePage() {
  const t = useT();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const greetingName = user?.realName ?? user?.username ?? '';

  // 快捷入口取动态菜单里的一级 menu 节点（有 path 的），点击直达。
  const { data: menus } = useQuery(currentMenusOptions());
  const entries = useMemo(
    () =>
      (menus ? buildMenuTree(menus) : [])
        .filter((n) => n.menu_type === 'menu' && n.path !== null)
        .map((n) => ({ path: n.path as string, name: n.name, icon: n.icon })),
    [menus],
  );

  return (
    <BasicContainer>
      <Typography.Title level={4} className="!mb-1">
        {t('pages.home.greeting', { name: greetingName })}
      </Typography.Title>
      <Typography.Paragraph type="secondary" className="!mb-6">
        {t('pages.home.subtitle')}
      </Typography.Paragraph>

      <Typography.Title level={5} className="!mb-3">
        {t('pages.home.quickEntry')}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {entries.map((entry) => (
          <Col key={entry.path} xs={12} sm={8} md={6}>
            <Card hoverable onClick={() => void navigate(entry.path)} className="text-center">
              <div className="text-2xl">{resolveIcon(entry.icon)}</div>
              <div className="mt-2">{t(entry.name)}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </BasicContainer>
  );
}
