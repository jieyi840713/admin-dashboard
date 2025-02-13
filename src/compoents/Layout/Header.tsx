"use client"
import React from 'react';
import { Layout, theme  } from 'antd';

const { Header: AntHeader } = Layout;


const Header = () => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();


  return (
    <AntHeader style={{ padding: 0, background: colorBgContainer }} />
  )
}

export default Header