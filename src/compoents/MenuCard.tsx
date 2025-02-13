'use client'

import React, { useState } from 'react';
import { Card, Modal, InputNumber, Button, Typography, message } from 'antd';
import { Product } from '@/types/product';
import Image from 'next/image'

const { Meta } = Card;
const { Title } = Typography;


// 定義訂單項目類型
export interface OrderItem extends Product {
  quantity: number;
}

interface MenuCardProps {
  item: Product;
  onOrder: (item: Product, quantity: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onOrder }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleCardClick = () => {
    setIsModalVisible(true);
    setQuantity(1);
  };

  const handleOrder = () => {
    onOrder(item, quantity);
    setIsModalVisible(false);
    message.success(`已加入 ${quantity} 份 ${item.name}`);
  };

  return (
    <>
      <Card
        hoverable
        cover={
          item.imageUrl && (
            <Image
              alt={item.name}
              src={item.imageUrl}
              style={{ height: 200, objectFit: 'cover' }}
            />
          )
        }
        onClick={handleCardClick}
      >
        <Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span style={{ color: '#f5222d' }}>${item.price}</span>
            </div>
          }
          description={item.descript}
        />
      </Card>

      <Modal
        title={item.name}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOrder}
          >
            加入訂單 (${item.price * quantity})
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          <Title level={5}>請選擇數量</Title>
          <InputNumber
            min={1}
            max={99}
            value={quantity}
            onChange={(value) => setQuantity(value || 1)}
            style={{ width: '150px', marginTop: '20px' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default MenuCard;