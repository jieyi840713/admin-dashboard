import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import Sidebar from '@/compoents/Layout/Sidebar';
import Header from '@/compoents/Layout/Header';
import Content from '@/compoents/Layout/Content';
import Footer from '@/compoents/Layout/Footer';
import {
  DesktopOutlined,
  EditOutlined,
  ReadOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  BorderOuterOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const getItem =(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <DesktopOutlined />),
  getItem('商品', 'product', <BorderOuterOutlined />),
  getItem('存貨', 'inventory', <ExclamationCircleOutlined />),
  getItem('材料', 'ingredient', <CheckSquareOutlined />),
  getItem('入帳', 'posting', <ReadOutlined />),
  getItem('分錄', 'entry', <EditOutlined />),
  getItem('損益表', 'incomeStatement', <BarChartOutlined />),
];

const RootLayout = ({ children }: React.PropsWithChildren) => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar items={items}/>
      <Layout>
        <Header />
        <Content>
          <AntdRegistry>{children}</AntdRegistry>
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  )
};

export default RootLayout;