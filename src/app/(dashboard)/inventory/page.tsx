'use client'
import '@ant-design/v5-patch-for-react-19';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Form, Select, InputNumber, Button, Typography, Tag, Divider, message } from 'antd';
import { PlusCircleOutlined, DollarOutlined, FileSearchOutlined } from '@ant-design/icons';
import { ingredientService } from '@/services/ingredientService';
import { inventoryService } from '@/services/inventoryService';
import { PaymentMethod } from '@/types/order';
import { Inventory } from '@/types/inventory';

const { Title, Text } = Typography;

interface Option {
    label: string;
    value: number | undefined;
}

// 將表單值類型定義清楚
interface FormValues {
  itemId: number;
  quantity: number;
  costPerUnit: number;
}

const InventoryManagement: React.FC = () => {
  // 移動 form 初始化到組件內部
  const [form] = Form.useForm<FormValues>();
  const [ingredients, setIngredients] = useState<Option[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [inventory, setInventory] = useState<Inventory[]>([])

  // 監聽表單值變化
  const watchFormValues = Form.useWatch(['quantity', 'costPerUnit'], form);

  useEffect(() => {
    // 計算總成本
    const [quantity, costPerUnit] = watchFormValues || [0, 0];
    if (quantity && costPerUnit) {
      setTotalCost(quantity * costPerUnit);
    } else {
      setTotalCost(0);
    }
  }, [watchFormValues]);

  const columns = [
    {
      title: '材料名稱',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
    },
    {
      title: '庫存數量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <Text>
          {quantity}
          {quantity < 20 && <Tag color="error" style={{ marginLeft: 8 }}>庫存不足</Tag>}
        </Text>
      ),
    },
    {
      title: '單位成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `$${cost}`,
    }
  ];

  const handleItemSelect = (itemId: number) => {
    form.setFieldsValue({ itemId });
  };

  const onFinish = async (values: FormValues) => {
    try {
      const { itemId, quantity, costPerUnit } = values;
      const items = [{ 
        ingredientId: itemId,
        quantity,
        cost: costPerUnit
    }]
      await inventoryService.createPurchaseInvertoryTransaction({
        items,
        payMethod: PaymentMethod.Cash
      });
      getAllInventory()
      message.success('庫存更新成功');
      form.resetFields();
    } catch (error) {
      message.error(`${error}`);
    }
  };

  const getAllInventory = async () => {
    const data = await inventoryService.getAllInventory()
    setInventory(data)
  }

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await ingredientService.getAllIngredient();
        const options = data.map(({ name, id }) => ({
          label: name,
          value: id
        }));
        setIngredients(options);
      } catch (error) {
        message.error(`${error}`);
      }
    };

    fetchIngredients();
    getAllInventory()
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>庫存管理</Title>
      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileSearchOutlined style={{ marginRight: 8 }} />
                目前庫存狀況
              </div>
            }
            bordered={false}
          >
            <Table
              columns={columns}
              dataSource={inventory} // 替換成實際的庫存數據
              rowKey="id"
              pagination={false}
              scroll={{ y: 400 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PlusCircleOutlined style={{ marginRight: 8 }} />
                新增進貨
              </div>
            }
            bordered={false}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark="optional"
              initialValues={{ quantity: 0, costPerUnit: 0 }}
            >
              <Form.Item
                label="選擇材料"
                name="itemId"
                rules={[{ required: true, message: '請選擇材料' }]}
              >
                <Select
                  placeholder="請選擇材料"
                  onChange={handleItemSelect}
                  showSearch
                  optionFilterProp="children"
                  options={ingredients}
                />
              </Form.Item>

              <Form.Item
                label="進貨數量"
                name="quantity"
                rules={[{ required: true, message: '請輸入進貨數量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  addonAfter={'單位'}
                  placeholder="請輸入數量"
                />
              </Form.Item>

              <Form.Item
                label="進貨成本"
                name="costPerUnit"
                rules={[{ required: true, message: '請輸入單位成本' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="$"
                  precision={2}
                  placeholder="請輸入單位成本"
                />
              </Form.Item>

              {totalCost > 0 && (
                <>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ marginBottom: 24 }}>
                    <Text type="secondary">預計總成本：</Text>
                    <Text strong style={{ fontSize: 16, marginLeft: 8 }}>
                      ${totalCost.toFixed(2)}
                    </Text>
                  </div>
                </>
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<DollarOutlined />} block>
                  確認進貨
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryManagement;