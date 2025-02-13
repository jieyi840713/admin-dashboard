 
"use client";
import '@ant-design/v5-patch-for-react-19';
import React, {useState, useEffect} from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  // PieChart, 
  // Pie, 
  // Cell 
} from 'recharts';
import { dashboardService } from '@/services/dashboardService';
import moment from 'moment';
const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const [lineData, setLineDate] = useState<{date: string, value: number}[]>([]);

  // 圓餅圖數據
  // const pieData = [
  //   { name: '分類A', value: 27 },
  //   { name: '分類B', value: 25 },
  //   { name: '分類C', value: 18 },
  //   { name: '分類D', value: 15 },
  //   { name: '其他', value: 15 },
  // ];

  // 圓餅圖顏色
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(()=>{
    const getSaleData = async()=>{
      const data = await dashboardService.getSaleData('', '')
      const formatLineData = data.map(({dataDate, salesRevenue})=>({value: salesRevenue, date: moment(dataDate).format('YYYY-MM-DD')}))
      setLineDate(formatLineData)
    }
    getSaleData()
  },[])

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard Overview</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="月度趨勢">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={lineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']}/>
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        {/* <Col xs={24} lg={12}>
          <Card title="分類分布">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default DashboardPage;