"use client"
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';  // 引入 useRouter
type MenuItem = Required<MenuProps>['items'][number];
const { Sider } = Layout;

interface ProductItem {
  items: MenuItem[];
}


const Sidebar: React.FC<ProductItem> = ({items}) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();  // 使用 router

  // 處理選單點擊
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(`/${e.key}`);  // 導航到對應路徑
  };

  return (
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        >
        <div className="demo-logo-vertical" />
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['dashboard']} 
          mode="inline" 
          items={items}
          onClick={handleMenuClick}  // 添加點擊事件處理
        />
      </Sider>
  )
}

export default Sidebar