import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, message, Typography } from 'antd';
import './Game.less';
import 'antd/dist/antd.less';

const { Title, Text } = Typography;

import keoImage from '../../assets/keo.png';
import buaImage from '../../assets/bua.png';
import baoImage from '../../assets/bao.png';

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

		const newGameResult: GameResult = {
			id: Date.now().toString(),
			playerChoice: choice,
			computerChoice: computer,
			result: result,
			timestamp: new Date().toLocaleString(),
		};

		saveToStorage([newGameResult, ...history].slice(0, 10));
		message.success(`Kết quả: ${result}`);
	};

	return (
		<Card
			title={
				<Title
					level={2}
					style={{
						fontWeight: 'bold',
						fontSize: '48px',
						margin: 0,
						color: '#e60000',
						borderBottom: '4px solid #e60000', // Thêm đường kẻ dưới tiêu đề
						paddingBottom: '10px', // Thêm khoảng cách dưới tiêu đề
					}}
				>
					Oẳn Tù Tì
				</Title>
			}
			className='card-container'
		>
			<Row gutter={[80, 80]} justify='center'>
				<Col span={19}>
					<Title
						level={4}
						style={{
							textAlign: 'center',
							fontSize: '28px',
							fontWeight: 'bold',
							color: '#e60000',
							marginBottom: '-8px',
						}}
					>
						Chọn của bạn:
					</Title>
				</Col>
				<Col>
					<Button size='large' onClick={() => handlePlay('Kéo')} className='choices-button scissors'>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0px' }}>
							<img src={keoImage} alt='Kéo' style={{ width: '60px', height: '60px' }} />
							<span style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>Kéo</span>
						</div>
					</Button>
				</Col>
				<Col>
					<Button size='large' onClick={() => handlePlay('Búa')} className='choices-button rock'>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0px' }}>
							<img src={buaImage} alt='Búa' style={{ width: '60px', height: '60px' }} />
							<span style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>Búa</span>
						</div>
					</Button>
				</Col>
				<Col>
					<Button size='large' onClick={() => handlePlay('Bao')} className='choices-button paper'>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0px' }}>
							<img src={baoImage} alt='Bao' style={{ width: '60px', height: '60px' }} />
							<span style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>Bao</span>
						</div>
					</Button>
				</Col>
			</Row>

			{playerChoice && (
				<Row gutter={[16, 16]} justify='center' style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text
							strong
							className={`result-text ${gameResult === 'Thắng' ? 'win' : gameResult === 'Thua' ? 'lose' : 'tie'}`}
						>
							Kết quả: {gameResult}
						</Text>
					</Col>
					<Col span={24}>
						<Text strong style={{ fontSize: '28px', fontWeight: 'bold', color: '#e60000' }}>
							{`Máy chọn: ${computerChoice}`}
						</Text>
					</Col>
					<Col span={24}>
						<Text
							strong
							style={{
								color: gameResult === 'Thắng' ? '#52c41a' : gameResult === 'Thua' ? '#f5222d' : '#faad14',
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
