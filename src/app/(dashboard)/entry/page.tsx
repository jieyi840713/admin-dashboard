/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, message, Col, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { chartOfAccountsService } from '@/services/chartOfAccountsService';
import { transactionService } from '@/services/transactionService';
import { EntryType, TransactionType } from '@/types/transaction';


interface Option {
    label: string;
    value: string;
}

const Entry: React.FC = () => {
  const [accountOptions, setAccountOptions]=  useState<Option[]>([])
  const [debitArr, setDebitArr] = useState<EntryType[]>([]);
  const [creditArr, setCreditArr] = useState<EntryType[]>([]);
  // 添加共用的 type 狀態
  const [entryType, setEntryType] = useState<string>('');
  const [description, setDescription] = useState<string>('')
  const [referenceNo, setReferenceNo] = useState<string>('')

  // type 選項
  const typeOptions: Option[] = [
    { label: '銷售', value: TransactionType.SALE },
    { label: '採購', value: TransactionType.PURCHASE },
    { label: '支出', value: TransactionType.PAYMENT },
    { label: '收入', value: TransactionType.RECEIPT },
    { label: '調整', value: TransactionType.ADJSUTMENT },
  ];
  const getAllChartOfAccounts = async() => {
    const data = await chartOfAccountsService.getAllChartOfAccounts()
    const options = data.map(({chartCode, chartName})=>({label: chartName, value: chartCode}))
    setAccountOptions(options)
  }

  // 新增列
  const handleAdd = (type: 'debit' | 'credit') => {
    const newKey = Date.now().toString();
    const newRow: EntryType = {
      key: newKey,
      amount: 0,
      chartCode: '',
      description: '',
    };
    if (type === 'debit') {
      setDebitArr([...debitArr, newRow]);
    } else {
      setCreditArr([...creditArr, newRow]);
    }
  };

  // 移除列
  const handleRemove = (type: 'debit' | 'credit', key: string) => {
    if (type === 'debit') {
      setDebitArr(debitArr.filter(item => item.key !== key));
    } else {
      setCreditArr(creditArr.filter(item => item.key !== key));
    }
  };

  const handleChange = (
    type: 'debit' | 'credit',
    key: string,
    field: keyof EntryType,
    value: string
  ) => {
    const setData = type === 'debit' ? setDebitArr : setCreditArr;
    const data = type === 'debit' ? debitArr : creditArr;
    
    setData(data.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const checkBalance = () => {
    const debitSum = debitArr.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const creditSum = creditArr.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return Math.abs(debitSum - creditSum) < 0.01;
  };

  const handleSubmit = () => {
    if (!checkBalance()) {
      message.error('借貸金額不平衡！');
      return;
    }
    
    const hasEmptyFields = [...debitArr, ...creditArr].some(
      item => !item.amount || !item.chartCode 
    );
    
    if (hasEmptyFields) {
      message.error('請填寫所有欄位！');
      return;
    }

    transactionService.createTransaction({debitArr, creditArr, type: entryType, description, referenceNo})
    .then(()=>{
        setDebitArr([])
        setCreditArr([])
        setEntryType('')
        setDescription('')
        setReferenceNo('')
        message.success('送出成功！');
    })
    .catch((error)=>{
        console.log(error.message)
        message.error(error.message)
    })
  };

  const getColumns = (type: 'debit' | 'credit') => [
    {
        title: '會計科目',
        dataIndex: 'account',
        key: 'account',
        width: '25%',
        render: (text: string, record: EntryType) => (
          <Select
            style={{ width: '100%' }}
            value={text || undefined}
            onChange={value => handleChange(type, record.key, 'chartCode', value)}
            options={accountOptions}
          />
        ),
      },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: (text: string, record: EntryType) => (
        <Input
          type="number"
          value={text}
          onChange={e => handleChange(type, record.key, 'amount', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '45%',
      render: (text: string, record: EntryType) => (
        <Input
          value={text}
          onChange={e => handleChange(type, record.key, 'description', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_: any, record: EntryType) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(type, record.key)}
        />
      ),
    },
  ];

  const debitTotal = debitArr.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const creditTotal = creditArr.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  useEffect(()=>{
    getAllChartOfAccounts()
  },[])

  return (
    <div className="p-4">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row>
            <Col span={24}>
                <Row style={{ marginBottom: '16px' }}>
                    <Col span={2} style={{ textAlign: 'right', paddingRight: '12px' }}>
                        <span>分錄類型：</span>
                    </Col>
                    <Col span={22}>
                        <Select
                        style={{ width: 200 }}
                        value={entryType}
                        onChange={setEntryType}
                        options={typeOptions}
                        placeholder="請選擇分錄類型"
                        />
                    </Col>
                </Row>
                <Row style={{ marginBottom: '16px' }}>
                    <Col span={2} style={{ textAlign: 'right', paddingRight: '12px' }}>
                        <span>描述：</span>
                    </Col>
                    <Col span={22}>
                        <Input
                        style={{ width: 200 }}
                        value={description}  // 注意：這裡原本用的是 entryType
                        onChange={(e)=>setDescription(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row style={{ marginBottom: '16px' }}>
                    <Col span={2} style={{ textAlign: 'right', paddingRight: '12px' }}>
                        <span>Reference No.：</span>
                    </Col>
                    <Col span={22}>
                        <Input
                        style={{ width: 200 }}
                        value={referenceNo}  // 注意：這裡原本用的是 entryType
                        onChange={(e)=>setReferenceNo(e.target.value)}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                <div>
                    <Button type="primary" onClick={() => handleAdd('debit')} style={{ marginBottom: 16 }}>
                        新增借方
                    </Button>
                    <Table
                        dataSource={debitArr}
                        columns={getColumns('debit')}
                        pagination={false}
                        bordered
                        summary={() => (
                        <Table.Summary>
                            <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>總計：{debitTotal}</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={3} />
                            </Table.Summary.Row>
                        </Table.Summary>
                        )}
                    />
                </div>
            </Col>
            <Col span={12}>
                <div>
                    <Button type="primary" onClick={() => handleAdd('credit')} style={{ marginBottom: 16 }}>
                        新增貸方
                    </Button>
                    <Table
                        dataSource={creditArr}
                        columns={getColumns('credit')}
                        pagination={false}
                        bordered
                        summary={() => (
                        <Table.Summary>
                            <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>總計：{creditTotal}</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={3} />
                            </Table.Summary.Row>
                        </Table.Summary>
                        )}
                    />
                </div>
            </Col>
        </Row>
        
        <Button 
          type="primary" 
          onClick={handleSubmit}
          size="large"
          style={{ width: '100%' }}
        >
          送出
        </Button>
      </Space>
    </div>
  );
};

export default Entry;