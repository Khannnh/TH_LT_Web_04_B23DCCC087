import React, { useState } from 'react';
import './GuessNumber.less';

const GuessNumber: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(10);

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num)) {
      setMessage('Vui lòng nhập số hợp lệ!');
      return;
    }

    if (num < randomNumber) {
      setMessage('Bạn đoán quá thấp!');
    } else if (num > randomNumber) {
      setMessage('Bạn đoán quá cao!');
    } else {
      setMessage('🎉 Chúc mừng! Bạn đã đoán đúng!');
      return;
    }

    setAttempts(attempts - 1);
    if (attempts - 1 === 0) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
    }
  };

  return (
    <div className="guess-number-container">
      <div className="guess-number-box">
        <h2>🎮 Trò chơi đoán số</h2>
        <p>Nhập số từ 1 đến 100:</p>
        <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} />
        <button onClick={handleGuess}>🔍 Đoán</button>
        <p className={`message ${message.includes('Chúc mừng') ? 'success' : 'error'}`}>{message}</p>
        <p>Lượt còn lại: {attempts}</p>
      </div>
    </div>
  );
};

export default GuessNumber;
