import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, ClearOutlined } from '@ant-design/icons';

interface GameResult {
  id: string;
  playerChoice: string;
  computerChoice: string;
  result: string;
  timestamp: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('rpsHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('rpsHistory');
    setHistory([]);
    message.success('Đã xóa lịch sử');
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Người chơi',
      dataIndex: 'playerChoice',
      key: 'playerChoice',
    },
    {
      title: 'Máy',
      dataIndex: 'computerChoice',
      key: 'computerChoice',
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (text: string) => (
        <span
          style={{
            color:
              text === 'Thắng'
                ? '#52c41a'
                : text === 'Thua'
                ? '#f5222d'
                : '#faad14',
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Lịch sử chơi"
      extra={
        <Popconfirm
          title="Bạn có chắc muốn xóa toàn bộ lịch sử?"
          onConfirm={clearHistory}
        >
          <Button type="primary" danger icon={<ClearOutlined />}>
            Xóa lịch sử
          </Button>
        </Popconfirm>
      }
    >
      <Table columns={columns} dataSource={history} rowKey="id" />
    </Card>
  );
};

export default History;
