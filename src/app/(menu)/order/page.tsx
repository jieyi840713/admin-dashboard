/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { Card, List, Tag, Button, Modal, Space, Typography, Badge, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
const ws = new WebSocket('ws://localhost:3000')
const { Title, Text } = Typography;

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [refresh, setRefresh] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAllPrepareOrder = async () => {
    const data = await orderService.getAllPrepareOrder()
    console.log(data);
    
    setOrders(data)
  }

  ws.onmessage = () => {
    setRefresh(!refresh)
};

  useEffect(() => {
    getAllPrepareOrder();
  }, [refresh]);

  const handleCompleteOrder = (orderId: number, referenceNO: string) => {
    Modal.confirm({
      title: '完成訂單',
      content: '確定要將此訂單標記為完成嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk: async() => {
        try{
          await orderService.updateOrderStatus(orderId, 'completed', referenceNO)
        }catch(error: any){
          message.error(`${error}`)
        }
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: 'completed' }
              : order
          )
        );
        message.success('訂單已完成');
      }
    });
  };

  const handleCancelOrder = (orderId: number, referenceNO: string) => {
    Modal.confirm({
      title: '取消訂單',
      content: '確定要取消此訂單嗎？',
      okText: '確定',
      cancelText: '返回',
      okType: 'danger',
      onOk: async() => {
        try{
          await orderService.updateOrderStatus(orderId, 'cancel', referenceNO)
        }catch(error: any){
          message.error(`${error}`)
        }
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        message.error('訂單已取消');
      }
    });
  };

  const showOrderDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: OrderResponse['status']) => {
    const statusConfig = {
      pending: { color: 'processing', text: '待處理', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: '已取消', icon: <CloseCircleOutlined /> }
    };

    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const formatTime = (dateString: string) => {
    return moment(dateString).format('YYYY-MM-DD')
  };


  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>內場訂單管理</Title>
      <Button color="cyan" variant="solid" onClick={() => setRefresh(!refresh)} style={{ marginBottom: 16 }}>
          <RedoOutlined />
      </Button>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={orders}
        renderItem={order => (
          <List.Item>
            <Badge.Ribbon 
              text={getStatusTag(order.status)}
              color={order.status === 'pending' ? 'blue' : 
                     order.status === 'completed' ? 'green' : 'red'}
            >
              <Card
                hoverable
                onClick={() => showOrderDetail(order)}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{order.referenceNo}</Text>
                    <Text type="secondary">{formatTime(order.createdAt)}</Text>
                  </div>
                }
              >
                <List
                  size="small"
                  dataSource={order.items}
                  renderItem={item => (
                    <List.Item>
                      <Text>{item.productName} x {item.quantity}</Text>
                    </List.Item>
                  )}
                />

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <Space>
                    <Button 
                      type="primary"
                      disabled={order.status !== 'pending'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteOrder(order.orderId, order.referenceNo);
                      }}
                    >
                      完成訂單
                    </Button>
                    <Button 
                      danger
                      disabled={order.status !== 'pending'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order.orderId, order.referenceNo);
                      }}
                    >
                      取消訂單
                    </Button>
                  </Space>
                </div>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />

      <Modal
        title="訂單詳情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p>訂單編號：{selectedOrder.referenceNo}</p>
            <p>訂單時間：{formatTime(selectedOrder.createdAt)}</p>
            <p>訂單狀態：{getStatusTag(selectedOrder.status)}</p>
            <Title level={5}>訂單項目：</Title>
            <List
              size="small"
              dataSource={selectedOrder.items}
              renderItem={item => (
                <List.Item>
                  <Text>{item.productName} x {item.quantity}</Text>
                </List.Item>
              )}
            />
            <div style={{ marginTop: '16px' }}>
              <Text strong>總金額：${selectedOrder.totalAmount}</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}