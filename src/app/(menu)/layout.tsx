import 'antd/dist/reset.css'
import { Layout } from 'antd';
import Sidebar from '@/compoents/Layout/Sidebar';
import type { MenuProps } from 'antd';
import {
    OrderedListOutlined,
    ContainerOutlined
  } from '@ant-design/icons';

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
    getItem('菜單', 'menu', <OrderedListOutlined />),
    getItem('訂單', 'order', <ContainerOutlined />)
  ];

export default function MenuLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar items={items}/>
            <Layout>
                {children}
            </Layout>
        </Layout>
    )
  }