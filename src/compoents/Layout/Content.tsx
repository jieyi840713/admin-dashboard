"use client"
import React, {ReactNode} from 'react';
import { Layout, theme } from 'antd';

const { Content: AntContent } = Layout;

interface ContentProps {
  children: ReactNode;
}


const Content = ({ children }: ContentProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntContent style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
    </AntContent>
  )
}

export default Content