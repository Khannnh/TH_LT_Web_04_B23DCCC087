import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Progress } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
const { Title, Text } = Typography;

const GuessingGame: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('');
  const maxAttempts = 10;

  // Khởi tạo trò chơi mới
  const initializeGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(0);
    setGameOver(false);
    setGameMessage('Hãy đoán một số từ 1 đến 100');
    setGuess('');
  };

  // Khởi tạo game khi component được mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Xử lý đoán số
  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      message.error("Vui lòng nhập một số từ 1 đến 100");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === randomNumber) {
      setGameMessage(`Chúc mừng! Bạn đã đoán đúng sau ${newAttempts} lần đoán!`);
      setGameOver(true);
    } else if (newAttempts >= maxAttempts) {
      setGameMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
      setGameOver(true);
    } else if (guessNum < randomNumber) {
      setGameMessage(`Bạn đoán quá thấp! Còn ${maxAttempts - newAttempts} lượt.`);
    } else {
      setGameMessage(`Bạn đoán quá cao! Còn ${maxAttempts - newAttempts} lượt.`);
    }

    setGuess('');
  };

  return (
    <PageContainer>
      <Card className={styles.gameContainer}>
        <Title level={2}>Trò Chơi Đoán Số</Title>
        
        <Progress 
          percent={attempts * 10} 
          status={gameOver ? (randomNumber === parseInt(guess) ? "success" : "exception") : "active"}
          format={() => `${maxAttempts - attempts} lượt còn lại`}
        />

        <div className={styles.gameContent}>
          <Text>{gameMessage}</Text>
          
          <div className={styles.inputSection}>
            <Input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Nhập số của bạn"
              disabled={gameOver}
              onPressEnter={handleGuess}
              className={styles.input}
            />
            
            <Button 
              type="primary"
              onClick={handleGuess}
              disabled={gameOver}
              className={styles.button}
            >
              Đoán
            </Button>
          </div>

          {gameOver && (
            <Button 
              type="primary"
              onClick={initializeGame}
              className={styles.newGameButton}
            >
              Chơi lại
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default GuessingGame;
