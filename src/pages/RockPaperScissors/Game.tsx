import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, message, Typography } from 'antd';
import { ScissorOutlined, BorderOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface GameResult {
  id: string;
  playerChoice: string;
  computerChoice: string;
  result: string;
  timestamp: string;
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [playerChoice, setPlayerChoice] = useState<string>('');
  const [computerChoice, setComputerChoice] = useState<string>('');
  const [gameResult, setGameResult] = useState<string>('');

  useEffect(() => {
    const storedHistory = localStorage.getItem('rpsHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const saveToStorage = (newHistory: GameResult[]) => {
    localStorage.setItem('rpsHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const getComputerChoice = () => {
    const choices = ['Kéo', 'Búa', 'Bao'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) return 'Hòa';
    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }
    return 'Thua';
  };

  const handlePlay = (choice: string) => {
    const computer = getComputerChoice();
    const result = determineWinner(choice, computer);
    
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setGameResult(result);

    const gameResult: GameResult = {
      id: Date.now().toString(),
      playerChoice: choice,
      computerChoice: computer,
      result: result,
      timestamp: new Date().toLocaleString(),
    };

    saveToStorage([gameResult, ...history].slice(0, 10));
    message.success(`Kết quả: ${result}`);
  };

  return (
    <Card title="Oẳn Tù Tì">
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Chọn của bạn:
          </Title>
        </Col>
        <Col>
          <Button
            size="large"
            icon={<ScissorOutlined />}
            onClick={() => handlePlay('Kéo')}
          >
            Kéo
          </Button>
        </Col>
        <Col>
          <Button
            size="large"
            icon={<StopOutlined />}
            onClick={() => handlePlay('Búa')}
          >
            Búa
          </Button>
        </Col>
        <Col>
          <Button
            size="large"
            icon={<BorderOutlined />}
            onClick={() => handlePlay('Bao')}
          >
            Bao
          </Button>
        </Col>
      </Row>

      {playerChoice && (
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
          <Col span={24}>
            <Text strong>Bạn chọn: {playerChoice}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Máy chọn: {computerChoice}</Text>
          </Col>
          <Col span={24}>
            <Text
              strong
              style={{
                color:
                  gameResult === 'Thắng'
                    ? '#52c41a'
                    : gameResult === 'Thua'
                    ? '#f5222d'
                    : '#faad14',
              }}
            >
              Kết quả: {gameResult}
            </Text>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default Game;
