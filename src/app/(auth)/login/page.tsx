'use client'

import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Form, Input } from 'antd';
import { LoginCredentials } from '@/types/auth';
import { Col, Row } from 'antd';
import { loginService } from '@/services/loginService';
import { useDispatch } from 'react-redux'
import { setUser } from '../../lib/features/userSlice'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true)
    try{
      const {data} =await loginService.login(values)
      dispatch(setUser(data.user))
      router.push('/dashboard')
    }catch (error) {
      // 錯誤處理
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Row 
      justify="center"     // 水平置中
      align="middle"       // 垂直置中
      style={{
        minHeight: '100vh' // 讓容器佔滿整個視窗高度
      }}
    >
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ 
            maxWidth: 600,
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<LoginCredentials>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginCredentials>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    
  )
}