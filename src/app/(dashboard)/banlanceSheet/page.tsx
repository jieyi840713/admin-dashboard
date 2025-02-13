'use client'
import '@ant-design/v5-patch-for-react-19';

import React, { useState } from 'react';
import { Table, Row, Col, DatePicker, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

interface BalanceSheetItem {
  key: string;
  item: string;
  amount: number;
  isTotal?: boolean;
  isSubtotal?: boolean;
  indent?: boolean;
}

const BalanceSheet: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const formatAmount = (value: number) => {
    return value.toLocaleString();
  };

  const handleSearch = () => {
    if (!selectedDate) {
      return;
    }
    setLoading(true);
    // 這裡可以添加實際的搜尋邏輯
    console.log('搜尋日期:', selectedDate.format('YYYY-MM-DD'));
    
    // 模擬 API 請求
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const columns: ColumnsType<BalanceSheetItem> = [
    {
      title: '項目',
      dataIndex: 'item',
      key: 'item',
      render: (text, record) => (
        <span style={{
          marginLeft: record.indent ? '2em' : '0',
          fontWeight: (record.isTotal || record.isSubtotal) ? 600 : 400
        }}>
          {text}
        </span>
      ),
    },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (value, record) => (
        <span style={{
          fontWeight: (record.isTotal || record.isSubtotal) ? 600 : 400
        }}>
          {formatAmount(value)}
        </span>
      ),
    },
  ];

  const assetsData: BalanceSheetItem[] = [
    // 流動資產
    { key: 'currentAssets', item: '流動資產', amount: 0, isSubtotal: true },
    { key: 'cash', item: '現金及約當現金', amount: 0, indent: true },
    { key: 'bank', item: '銀行存款', amount: 0, indent: true },
    { key: 'ar', item: '應收帳款', amount: 0, indent: true },
    { key: 'nr', item: '應收票據', amount: 0, indent: true },
    { key: 'bad_debt', item: '減：壞帳準備', amount: 0, indent: true },
    { key: 'prepaid', item: '預付費用', amount: 0, indent: true },
    { key: 'inventory', item: '存貨', amount: 0, indent: true },
    { key: 'shortInvest', item: '短期投資', amount: 0, indent: true },
    
    // 非流動資產
    { key: 'nonCurrentAssets', item: '非流動資產', amount: 0, isSubtotal: true },
    { key: 'longInvest', item: '長期投資', amount: 0, indent: true },
    { key: 'fixedAssets', item: '固定資產', amount: 0, indent: true, isSubtotal: true },
    { key: 'land', item: '土地', amount: 0, indent: true },
    { key: 'buildings', item: '建築物', amount: 0, indent: true },
    { key: 'equipment', item: '機器設備', amount: 0, indent: true },
    { key: 'depreciation', item: '減：累計折舊', amount: 0, indent: true },
    { key: 'intangible', item: '無形資產', amount: 0, indent: true },
    { key: 'goodwill', item: '商譽', amount: 0, indent: true },
    
    { key: 'totalAssets', item: '資產總計', amount: 0, isTotal: true },
  ];

  const liabilitiesEquityData: BalanceSheetItem[] = [
    // 流動負債
    { key: 'currentLiab', item: '流動負債', amount: 0, isSubtotal: true },
    { key: 'ap', item: '應付帳款', amount: 0, indent: true },
    { key: 'np', item: '應付票據', amount: 0, indent: true },
    { key: 'unearned', item: '預收收入', amount: 0, indent: true },
    { key: 'accrued', item: '應付費用', amount: 0, indent: true },
    { key: 'shortLoans', item: '短期借款', amount: 0, indent: true },
    
    // 非流動負債
    { key: 'nonCurrentLiab', item: '非流動負債', amount: 0, isSubtotal: true },
    { key: 'longLoans', item: '長期借款', amount: 0, indent: true },
    { key: 'bonds', item: '應付公司債', amount: 0, indent: true },
    { key: 'deferred_tax', item: '遞延稅款負債', amount: 0, indent: true },
    
    { key: 'totalLiab', item: '負債總計', amount: 0, isTotal: true },
    
    // 權益
    { key: 'equity', item: '股東權益', amount: 0, isSubtotal: true },
    { key: 'capital', item: '股本', amount: 0, indent: true },
    { key: 'capitalSurplus', item: '資本公積', amount: 0, indent: true },
    { key: 'retained', item: '保留盈餘', amount: 0, indent: true },
    { key: 'legalReserve', item: '法定盈餘公積', amount: 0, indent: true },
    { key: 'currentEarnings', item: '本期損益', amount: 0, indent: true },
    
    { key: 'totalEquity', item: '權益總計', amount: 0, isTotal: true },
    { key: 'totalLiabEquity', item: '負債及權益總計', amount: 0, isTotal: true },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker 
          onChange={(date) => setSelectedDate(date)}
          placeholder="選擇日期"
          style={{ width: 200 }}
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
        >
          搜尋
        </Button>
      </Space>

      <Row gutter={24}>
        <Col span={12}>
          <Table
            title={() => <h3 style={{ margin: 0 }}>資產</h3>}
            columns={columns}
            dataSource={assetsData}
            pagination={false}
            bordered
            size="small"
            loading={loading}
          />
        </Col>
        <Col span={12}>
          <Table
            title={() => <h3 style={{ margin: 0 }}>負債及股東權益</h3>}
            columns={columns}
            dataSource={liabilitiesEquityData}
            pagination={false}
            bordered
            size="small"
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BalanceSheet;