/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client"
import '@ant-design/v5-patch-for-react-19';

interface Option {
    label: string;
    value: number | undefined;
}

// ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { Product, ProductMadeBy } from '@/types/product';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Switch,
//   Upload,
  Space,
  Card,
  Tag,
  message,
  Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ingredientService } from '@/services/ingredientService';
import { productService } from '@/services/productService';
import Image from 'next/image'
// import type { UploadChangeParam, UploadFile } from 'antd/es/upload';

const ProductPage: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [ingredients, setIngredients] = useState<Option[]>([]);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const columns: ColumnsType<Product> = [
    {
      title: '商品圖片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url?: string) => url ? (
        <Image src={url} alt="商品圖片" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ) : <span>無圖片</span>
    },
    {
      title: '商品名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '價格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`
    },{
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `$${cost}`
    },
    {
      title: '毛利率',
      key: 'profitMargin',
      render: (_, record: Product) => {
        const profitMargin = record.price > 0 
          ? ((record.price - parseFloat(record.cost || '0')) / record.price * 100)
          : 0;
        // 根據毛利率範圍返回不同顏色的標籤
        let color = 'red';
        if (profitMargin >= 50) {
          color = 'green';
        } else if (profitMargin >= 30) {
          color = 'blue';
        } else if (profitMargin >= 20) {
          color = 'orange';
        }
    
        return (
          <Tag color={color}>
            {profitMargin.toFixed(2)}%
          </Tag>
        );
      }
    },
    {
      title: '狀態',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: number) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? '上架中' : '已下架'}
        </Tag>
      )
    },
    {
      title: '使用材料',
      dataIndex: 'madeBy',
      key: 'madeBy',
      render: (madeBy: ProductMadeBy[]) => (
        <Space direction="vertical">
          {madeBy.map((item) => (
            <Tag key={item.id}>
              {item.name}: {item.quantity}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            編輯
          </Button>
          {/* <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            刪除
          </Button> */}
        </Space>
      )
    }
  ];

  const handleEdit = (record: Product) => {
    setEditingId(record.id);
    
    // 如果有圖片，設置 fileList
    // if (record.imageUrl) {
    //   setFileList([
    //     {
    //       uid: '-1',
    //       name: 'image.png',
    //       status: 'done',
    //       url: record.imageUrl,
    //     },
    //   ]);
    // } else {
    //   setFileList([]);
    // }

    form.setFieldsValue({
      ...record,
      ingredients: record.madeBy
    });
    setDrawerVisible(true);
  };

  // const handleDelete = (id: number) => {
  //   setProducts(products.filter(product => product.id !== id));
  //   message.success('商品已刪除');
  // };

  const onDrawerClose = () => {
    setDrawerVisible(false);
    // setFileList([]); // 清空文件列表
    form.resetFields();
    setEditingId(null);
  };

  interface FormValues {
    name: string;
    description: string;
    price: number;
    isAvailable: number;
    imageUrl?: string;
    ingredients: ProductMadeBy[];
  }

  const onFinish = async(values: FormValues) => {
    const formData = {
      ...values,
      id: editingId || Date.now(),
      madeBy: values.ingredients
    };
    if(!formData.madeBy.length) return message.error('至少填入一筆材料')
    try{
      await productService.updateProduct(formData)
      await getAllProducts()
      onDrawerClose();
    }catch(error: any){
      message.error(`${error}`)
    }
  };

//   const normFile = (e: any) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };

//   const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
//     const { fileList: newFileList, file } = info;
    
//     // 限制只能有一個文件，總是使用最新上傳的文件
//     const latestFile = newFileList[newFileList.length - 1];
//     const updatedFileList = latestFile ? [latestFile] : [];
//     setFileList(updatedFileList);
    
//     if (file.status === 'done') {
//       const imageUrl = file.response.url;
//       form.setFieldsValue({ imageUrl: imageUrl });
//       message.success('圖片上傳成功');
//     } else if (file.status === 'error') {
//       message.error('圖片上傳失敗');
//     }
//   };

const getAllProducts = async () => {
    const data = await productService.findAllProduct()
    setProducts(data)
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
    getAllProducts()
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="商品管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
          >
            新增商品
          </Button>
        }
      >
        <Table<Product>
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={editingId ? "編輯商品" : "新增商品"}
        width={720}
        onClose={onDrawerClose}
        open={drawerVisible}
        styles={{ body: { paddingBottom: 80 } }}
      >
        <Form<FormValues>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isAvailable: true }}
        >
          <Form.Item
            name="name"
            label="商品名稱"
            rules={[{ required: true, message: '請輸入商品名稱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: false, message: '請輸入商品描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="價格"
            rules={[{ required: true, message: '請輸入價格' }]}
          >
            <InputNumber
              min={0}
              prefix="$"
              style={{ width: '100%' }}
            />
          </Form.Item>
          {editingId && (
            <Form.Item
              name="isAvailable"
              label="商品狀態"
              valuePropName="checked"
            >
              <Switch checkedChildren="上架" unCheckedChildren="下架" />
            </Form.Item>
          )}
          
          {/* <Form.Item
            name="imageUrl"
            label="商品圖片"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              action={`${process.env.NEXT_PUBLIC_API_URL}/upload`}
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={1}
              onRemove={() => {
                setFileList([]);
                form.setFieldsValue({ imageUrl: undefined });
              }}
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('只能上傳 JPG/PNG 檔案!');
                  return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('圖片必須小於 2MB!');
                  return false;
                }
                return true;
              }}
            >
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item> */}

          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[{ required: true, message: '請選擇材料' }]}
                    >
                      <Select
                        placeholder="選擇材料"
                        style={{ width: 200 }}
                        onChange={(value) => {
                          const material = ingredients.find(m => m.value === value);
                          if (material) {
                            form.setFields([
                              {
                                name: ['ingredients', name, 'name'],
                                value: material.label
                              }
                            ]);
                          }
                        }}
                      >
                        {ingredients.map(material => (
                          <Select.Option key={material.value} value={material.value}>
                            {material.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: '請輸入數量' }]}
                    >
                      <InputNumber placeholder="數量" min={1} />
                    </Form.Item>
                    <Button onClick={() => remove(name)} icon={<DeleteOutlined />} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    新增材料
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button onClick={onDrawerClose}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductPage;