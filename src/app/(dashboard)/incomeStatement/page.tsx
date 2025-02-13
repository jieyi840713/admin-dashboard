"use client"
import '@ant-design/v5-patch-for-react-19';

// pages/profit-loss.tsx
import React, { useState } from 'react';
import { Table, DatePicker, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { dashboardService } from '@/services/dashboardService';

const { RangePicker } = DatePicker;

interface DataItem {
  key: string;
  item: string;
  amount: number | null;
  isSubtotal?: boolean;
  isHeader?: boolean;
  indent?: boolean;
}

const ProfitLossTable: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataItem[]>();

//   const data: DataItem[] = [
//     { key: '1', item: '營業收入', amount: 160000 },
//     { key: '2', item: '營業成本', amount: -64000 },
//     { key: '3', item: '營業毛利', amount: 96000, isSubtotal: true },
//     { key: '4', item: '營業費用', amount: null, isHeader: true },
//     { key: '5', item: '薪資支出', amount: 30000, indent: true },
//     { key: '6', item: '租金支出', amount: 30000, indent: true },
//     { key: '7', item: '文具用品', amount: 1500, indent: true },
//     { key: '8', item: '水電瓦斯費', amount: 1000, indent: true },
//     { key: '9', item: '折舊費用', amount: 4000, indent: true },
//     { key: '10', item: '營業費用總計', amount: -66500, isSubtotal: true },
//     { key: '11', item: '營業淨利', amount: 29500, isSubtotal: true },
//   ];

  const formatAmount = (value: number | null) => {
    if (value === null) return '';
    const isNegative = value < 0;
    const formattedValue = Math.abs(value).toLocaleString();
    return isNegative ? `(${formattedValue})` : formattedValue;
  };

  const handleSearch = async() => {
    if (!dateRange[0] || !dateRange[1]) {
      return;
    }
    setLoading(true);
    const result = await dashboardService.getIncomeStatementData(dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD'))
    const {salesRevenue, costOfGoodSold, salary, rentExpense, otherExpense, utilityExpense, dereceationExpense} = result
    const grossProfit = (+salesRevenue) - (+costOfGoodSold)
    const sumExpense = (+salary) + (+rentExpense) + (+otherExpense) + (+utilityExpense) + (+dereceationExpense);
    const profit = grossProfit - sumExpense;
    setData([
        { key: '1', item: '營業收入', amount: salesRevenue },
        { key: '2', item: '營業成本', amount: -costOfGoodSold },
        { key: '3', item: '營業毛利', amount: grossProfit, isSubtotal: true },
        { key: '4', item: '營業費用', amount: null, isHeader: true },
        { key: '5', item: '薪資支出', amount: salary, indent: true },
        { key: '6', item: '租金支出', amount: rentExpense, indent: true },
        { key: '7', item: '其他支出', amount: otherExpense, indent: true },
        { key: '8', item: '水電瓦斯費', amount: utilityExpense, indent: true },
        { key: '9', item: '折舊費用', amount: dereceationExpense, indent: true },
        { key: '10', item: '營業費用總計', amount: -sumExpense, isSubtotal: true },
        { key: '11', item: '營業淨利', amount: profit, isSubtotal: true },
      ])
    setLoading(false);

  };

  const columns: ColumnsType<DataItem> = [
    {
      title: '項目',
      dataIndex: 'item',
      key: 'item',
      render: (text, record) => (
        <span style={{
          marginLeft: record.indent ? '2em' : '0',
          fontWeight: record.isSubtotal || record.isHeader ? 600 : 400
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
          color: value && value < 0 ? '#ff4d4f' : undefined,
          fontWeight: record.isSubtotal ? 600 : 400
        }}>
          {formatAmount(value)}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker 
          onChange={(dates) => {
            setDateRange(dates as [Dayjs | null, Dayjs | null]);
          }}
          style={{ width: '320px' }}
          placeholder={['開始日期', '結束日期']}
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

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        loading={loading}
      />
    </div>
  );
};

export default ProfitLossTable;