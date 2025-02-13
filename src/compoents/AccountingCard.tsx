'use client'

import { Card, Row, Col, Typography, Divider, Button, Space, message } from 'antd'
import { CreditCardOutlined, NumberOutlined, FileTextOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { EntryType, TransactionType } from '@/types/transaction'



const { Text } = Typography


interface AccountingCardProps {
  transactionId: number;
  amount: number;
  type: TransactionType;
  referenceNo: string;
  description: string;
  debitEntries: EntryType[];
  creditEntries: EntryType[];
  onPost?: (transactionId: number) => Promise<void>;
  onVoid?: (transactionId: number) => Promise<void>;
}

const AccountingCard: React.FC<AccountingCardProps> = ({
  transactionId,
  amount,
  type,
  referenceNo,
  description,
  debitEntries,
  creditEntries,
  onPost,
  onVoid
}) => {
  const [status, setStatus] = useState<'pending' | 'posted' | 'voided'>('pending');
  const [loading, setLoading] = useState({
    post: false,
    void: false
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePost = async () => {
    try {
      setLoading(prev => ({ ...prev, post: true }));
      if (onPost) {
        await onPost(transactionId);
      }
      setStatus('posted');
      message.success('交易已入帳');
    } catch (error) {
        console.error(error)
      message.error('入帳失敗');
    } finally {
      setLoading(prev => ({ ...prev, post: false }));
    }
  };

  const handleVoid = async () => {
    try {
      setLoading(prev => ({ ...prev, void: true }));
      if (onVoid) {
        await onVoid(transactionId);
      }
      setStatus('voided');
      message.success('交易已作廢');
    } catch (error) {
        console.error(error)
      message.error('作廢失敗');
    } finally {
      setLoading(prev => ({ ...prev, void: false }));
    }
  };

  return (
    <Card 
      style={{ width: '100%', maxWidth: 800, margin: '20px auto' }}
      extra={
        <Space>
          <Button 
            type="primary"
            onClick={handlePost}
            loading={loading.post}
            disabled={status !== 'pending'}
          >
            入帳
          </Button>
          <Button 
            danger
            onClick={handleVoid}
            loading={loading.void}
            disabled={status !== 'pending'}
          >
            作廢
          </Button>
        </Space>
      }
    >
      {/* 狀態標籤 */}
      {status !== 'pending' && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: status === 'posted' ? '#52c41a' : '#ff4d4f',
          color: 'white',
          fontSize: '12px'
        }}>
          {status === 'posted' ? '已入帳' : '已作廢'}
        </div>
      )}

      {/* 上半部：交易資訊 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCardOutlined />
            <Text strong>類型：</Text>
            <Text>{type}</Text>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCardOutlined />
            <Text strong>金額：</Text>
            <Text>{formatAmount(amount)}</Text>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NumberOutlined />
            <Text strong>參考號碼：</Text>
            <Text>{referenceNo}</Text>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            <Text strong>附註：</Text>
            <Text>{description}</Text>
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      {/* 下半部：會計分錄 */}
      <Row gutter={24}>
        {/* 借方 */}
        <Col span={12}>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            height: '100%',
            opacity: status === 'voided' ? 0.5 : 1
          }}>
            <Text strong style={{ display: 'block', marginBottom: '12px' }}>借方</Text>
            {debitEntries.map((entry, index) => (
              <Row key={index} justify="space-between" style={{ marginBottom: '8px' }}>
                <Col>
                  <Text>{entry.chartCode}</Text>
                </Col>
                <Col>
                  <Text>{formatAmount(entry.amount)}</Text>
                </Col>
              </Row>
            ))}
          </div>
        </Col>

        {/* 貸方 */}
        <Col span={12}>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            height: '100%',
            opacity: status === 'voided' ? 0.5 : 1
          }}>
            <Text strong style={{ display: 'block', marginBottom: '12px' }}>貸方</Text>
            {creditEntries.map((entry, index) => (
              <Row key={index} justify="space-between" style={{ marginBottom: '8px' }}>
                <Col>
                  <Text>{entry.chartCode}</Text>
                </Col>
                <Col>
                  <Text>{formatAmount(entry.amount)}</Text>
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default AccountingCard;