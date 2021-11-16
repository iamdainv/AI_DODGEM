/** @format */

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { Player } from "./const";
import { game } from "./Helper/Game";
import "./scss/App.scss";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import axios from "axios";
import { io } from "socket.io-client";
import SockJS from "sockjs-client";
import Stomp, { Client } from "webstomp-client";
export const BOARD_INIT = [
	[Player.RIM, Player.RIM, Player.RIM, Player.RIM, Player.RIM],
	[Player.RIM, Player.USER, Player.NONE, Player.NONE, Player.RIM],
	[Player.RIM, Player.USER, Player.NONE, Player.NONE, Player.RIM],
	[Player.RIM, Player.NONE, Player.COMPUTER, Player.COMPUTER, Player.RIM],
	[Player.RIM, Player.RIM, Player.RIM, Player.RIM, Player.RIM],
];

export const White_Value = [
	[0, 85, 90, 100, 0],
	[0, 30, 35, 40, 0],
	[0, 15, 20, 25, 0],
	[0, 0, 5, 10, 0],
	[0, 0, 0, 0, 0],
];

export const Black_Value = [
	[0, 0, 0, 0, 0],
	[0, -10, -25, -40, -60],
	[0, -5, -20, -35, -50],
	[0, 0, -15, -30, -45],
	[0, 0, 0, 0, 0],
];

export type CurrentUserPlay = Player.COMPUTER | Player.USER;
var sockjs = new SockJS("http://localhost:8080/gs-guide-websocket");
let stompClient: Client | null = null;
console.log(sockjs);

interface AppContextType {
	currentUserPlay: Player;
	currentSelectPosition: number[];
	boardState: any;
	setCurrentUserPlay: () => void;
	userMove: (toX: number, toY: number) => void;
	changeCurrentSelectPosition: (x: number, y: number) => void;
	canLegalMove: (toX: number, toY: number, player: Player) => boolean;
}

export const AppContext = React.createContext<AppContextType>({
	currentUserPlay: Player.USER,
	currentSelectPosition: [] as number[],
	boardState: [],
	setCurrentUserPlay: () => {},
	userMove: (toX: number, toY: number) => {},
	changeCurrentSelectPosition: (x: number, y: number) => {},
	canLegalMove: (toX: number, toY: number, player: Player) => true,
});

const move = [];

function App() {
	const [currentUserPlay, setCurrentUserPlay] = useState<CurrentUserPlay>(
		Player.COMPUTER
	);
	const [currentSelectPosition, setCurrentSelectPosition] = useState<number[]>(
		[]
	);
	const [boardState, setBoardState] = useState(BOARD_INIT);
	const [level, setLevel] = useState<number>(3);
	const [isStart, setStart] = useState(false);
	const [isCloseModal, setIsCloseModal] = useState(false);
	const [winner, setWinner] = useState<Player | null>(null);

	const changeUserPlay = useCallback(() => {
		setCurrentUserPlay(
			currentUserPlay === Player.COMPUTER ? Player.USER : Player.COMPUTER
		);
	}, [currentUserPlay]);
	console.log("winner", winner);

	//move point
	const userMove = useCallback(
		(toX, toY) => {
			//Check if place dont have point to set new position of point select
			if (
				(boardState[toX][toY] === Player.NONE ||
					boardState[toX][toY] === Player.RIM) &&
				currentSelectPosition.length > 0
			) {
				const currentBoardValue = [...boardState];
				currentBoardValue[currentSelectPosition[0]][
					currentSelectPosition[1]
				] = 0;
				currentBoardValue[toX][toY] = currentUserPlay;
				setBoardState(currentBoardValue);

				if (game.isWinning(Player.USER)) {
					userWinning(Player.USER);
					return;
				}
				move.push(currentBoardValue);
				setCurrentSelectPosition([]);
				changeUserPlay();
				// game.getBestMovePoint(
				// 	boardState,
				// 	Player.USER,
				// 	(player: Player | null) => userWinning(player)
				// );
			}
		},
		[boardState, changeUserPlay, currentSelectPosition, currentUserPlay]
	);

	//check can move point
	const canMovePoint = useCallback(
		(toX, toY, player) => {
			const [cX, cY] = currentSelectPosition;
			const dx = toX - cX;
			const dy = toY - cY;

			if (currentUserPlay === Player.USER) {
				return (
					(Math.abs(dx) === 1 && Math.abs(dy) === 0) ||
					(Math.abs(dx) === 0 && dy === 1)
				);
			} else {
				return (
					(dx === -1 && Math.abs(dy) === 0) ||
					(Math.abs(dx) === 0 && Math.abs(dy) === 1)
				);
			}
		},
		[currentSelectPosition, currentUserPlay]
	);

	const changeCurrentSelectPosition = useCallback((x, y) => {
		setCurrentSelectPosition([x, y]);
	}, []);

	const handleToggleModal = useCallback((value: boolean) => {
		setIsCloseModal(value);
	}, []);

	const setLevelGame = useCallback((value: number) => {
		setLevel(value);
	}, []);

	const userWinning = (player: Player | null) => {
		if (player) {
			setWinner(player);
			handleToggleModal(true);
		}
	};
	const [files, setFiles] = useState<any>();

	const uploadComment = () => {
		const fileData = new FormData();
		const commentObj: any = {
			id_user: 1,
			id_product: 1,
			star: 5,
			comment: "xin chao",
		};
		files.forEach((file: any) => fileData.append("files", file.fileImage));
		fileData.append(
			"comment",
			new Blob([JSON.stringify(commentObj)], { type: "application/json" })
		);
		axios
			.post("http://localhost:8080/comment/create", fileData, {
				headers: {
					"Content-type": "multipart/form-data",
				},
			})
			.then(console.log);
	};

	useEffect(() => {
		if (currentUserPlay === Player.COMPUTER && isStart) {
			setBoardState(
				game.getBestMovePoint(
					boardState,
					Player.COMPUTER,
					(player: Player | null) => userWinning(player)
				)
			);
			changeUserPlay();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [boardState, changeUserPlay, currentUserPlay, handleToggleModal, isStart]);

	useEffect(() => {
		setStart(false);
		setBoardState(BOARD_INIT);
		setCurrentUserPlay(Player.COMPUTER);
		game.setLevel(level);
		setWinner(null);
	}, [level, setLevelGame]);

	return (
		<>
			<AppContext.Provider
				value={{
					currentUserPlay,
					currentSelectPosition,
					boardState: boardState,
					setCurrentUserPlay: changeUserPlay,
					userMove: userMove,
					changeCurrentSelectPosition: changeCurrentSelectPosition,
					canLegalMove: canMovePoint,
				}}>
				<div className='app__container'>
					<Board
						boardState={boardState}
						setStart={setStart}
						setLevel={setLevelGame}
						level={level}
					/>

					<div>
						{winner && (
							<pre className='app__winner'>
								{`Quân   `}
								<div
									className={`${clsx(
										"square__wrapper",
										winner === Player.COMPUTER && "square__computer",
										winner === Player.USER && "square__user"
									)}`}></div>
								{`   thắng`}
							</pre>
						)}
					</div>
				</div>
			</AppContext.Provider>
		</>
	);
}

export default App;
