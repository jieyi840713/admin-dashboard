'use client'
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { Form, Input, Select, Button, Card, Typography, message } from 'antd';
import { ingredientService } from '@/services/ingredientService';

const { TextArea } = Input;
const { Title } = Typography;

// 定義材料分類選項
const CATEGORY_OPTIONS = [
  { label: '主餐', value: 'main' },
  { label: '前菜', value: 'appetizer' },
  { label: '飲料', value: 'beverage' },
  { label: '甜點', value: 'dessert' },
  { label: '酒類', value: 'alcohol' }
];

// 定義材料介面
interface Ingredient {
  name: string;
  description?: string;
  category: 'main' | 'appetizer' | 'beverage' | 'dessert' | 'alcohol';
}

const IngredientForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: Ingredient) => {
    try {
      console.log('提交的值:', values);
      // 這裡可以加入 API 呼叫
      await ingredientService.createIngredient(values)
      
      message.success('材料新增成功');
      form.resetFields();
    } catch (error) {
      message.error('材料新增失敗');
      console.error('錯誤:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>
          新增材料
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* 材料名稱 */}
          <Form.Item
            label="材料名稱"
            name="name"
            rules={[
              { required: true, message: '請輸入材料名稱' },
              { min: 2, message: '名稱至少需要 2 個字元' },
              { max: 50, message: '名稱不能超過 50 個字元' }
            ]}
          >
            <Input placeholder="請輸入材料名稱" />
          </Form.Item>

          {/* 材料分類 */}
          <Form.Item
            label="材料分類"
            name="category"
            rules={[{ required: true, message: '請選擇材料分類' }]}
          >
            <Select
              placeholder="請選擇材料分類"
              options={CATEGORY_OPTIONS}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          {/* 材料描述 */}
          <Form.Item
            label="材料描述"
            name="description"
            rules={[
              { max: 500, message: '描述不能超過 500 個字元' }
            ]}
          >
            <TextArea
              placeholder="請輸入材料描述（選填）"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* 提交按鈕 */}
          <Form.Item>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                新增材料
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default IngredientForm;