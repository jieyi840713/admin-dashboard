/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import '@ant-design/v5-patch-for-react-19';

import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, theme, Button, List, Modal, message } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import MenuCard, { OrderItem }  from '@/compoents/MenuCard';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { orderService } from '@/services/orderService';
import { PaymentMethod } from '@/types/order';
const ws = new WebSocket('ws://localhost:3000')
const { Title, Text } = Typography;

export default function MenuPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { token } = theme.useToken();
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<Product[]>([])

  const getAllProducts = async() => {
    const data = await productService.findAllAvailableProduct();
    setMenuItems(data)
  }

  const handleOrder = (item: Product, quantity: number) => {
    setOrderItems(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + quantity }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: '確定要取消訂單嗎？',
      content: '取消訂單將清空購物車中的所有商品',
      okText: '確定取消',
      cancelText: '返回',
      onOk: () => {
        setOrderItems([]);
      }
    });
  };

  const handleSubmitOrder = () => {
    setIsSubmitModalVisible(true);
  };

  const createSaleInventoryTransaction = async () => {
      const items = orderItems.map(({id, quantity})=>({productId: id, quantity}))
      try{
        await orderService.createSaleInventoryTransaction({items, payMethod: PaymentMethod.Cash})
        ws.send(JSON.stringify({
          content: 'Send Order'
        }))
      }catch(error: any){
        message.error(`${error}`)
      }
  }

  const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(()=>{
    getAllProducts()
  },[])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 左側菜單區域 */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <Title level={2}>餐點菜單</Title>
        <Row gutter={[16, 16]}>
          {menuItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={8}>
              <MenuCard item={item} onOrder={handleOrder} />
            </Col>
          ))}
        </Row>
      </div>

      {/* 右側購物車面板 */}
      <div style={{
        width: 360,
        backgroundColor: token.colorBgContainer,
        borderLeft: `1px solid ${token.colorBorder}`,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${token.colorBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShoppingCartOutlined style={{ fontSize: '24px' }} />
            <Title level={4} style={{ margin: 0 }}>購物車</Title>
          </div>
        </div>

        {/* 購物車商品列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <List
            itemLayout="horizontal"
            dataSource={orderItems}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    key="delete" 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`$${item.price} x ${item.quantity}`}
                />
                <div style={{ color: token.colorTextSecondary }}>
                  ${item.price * item.quantity}
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* 總計和按鈕 */}
        <div style={{ 
          padding: '24px', 
          borderTop: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '16px'
          }}>
            <Text strong>總計：</Text>
            <Text strong type="danger">${totalAmount}</Text>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              danger 
              block 
              onClick={handleCancelOrder}
              disabled={orderItems.length === 0}
            >
              取消訂單
            </Button>
            <Button 
              type="primary" 
              block 
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0}
            >
              送出訂單
            </Button>
          </div>
        </div>
      </div>

      {/* 送出訂單確認 Modal */}
      <Modal
        title="確認訂單"
        open={isSubmitModalVisible}
        onCancel={() => setIsSubmitModalVisible(false)}
        onOk={() => {
          // 這裡處理訂單提交邏輯
          createSaleInventoryTransaction()
          setIsSubmitModalVisible(false);
          setOrderItems([]);
        }}
        okText="確認送出"
        cancelText="返回修改"
      >
        <div>
          <p>訂單總金額：${totalAmount}</p>
          <p>共 {orderItems.reduce((acc, item) => acc + item.quantity, 0)} 件商品</p>
          <p>確定要送出訂單嗎？</p>
        </div>
      </Modal>
    </div>
  );
}