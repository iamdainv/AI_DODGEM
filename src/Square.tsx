/** @format */

import clsx from "clsx";
import React, { useCallback, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AppContext } from "./App";
import { OverlayType, Player } from "./const";
import { Overlay } from "./Overlay";
import "./scss/Square.scss";

interface SquareProps {
	player: Player;
	position?: number[];
}

export default function Square({ player, position = [0, 0] }: SquareProps) {
	const appContext = useContext(AppContext);

	const userMove = useCallback(() => {
		appContext.userMove(position[0], position[1]);
	}, [appContext, position]);

	const canMovePoint = useCallback(() => {
		return appContext.canLegalMove(position[0], position[1], player);
	}, [appContext, player, position]);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: Player.USER.toString(),
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: Player.USER.toString(),
			drop: userMove,
			canDrop: () => canMovePoint(),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		}),
		[position[0], position[1], appContext]
	);

	const compareArray = useCallback(
		(array) => JSON.stringify(position) === JSON.stringify(array),
		[position]
	);

	return (
		<div
			ref={drop}
			className={`${clsx(
				"square__container",
				compareArray([0, 0]) && "square_border_top_left",
				compareArray([0, 4]) && "square_border_top_right",
				compareArray([4, 0]) && "square_border_bottom_left",
				compareArray([4, 4]) && "square_border_bottom_right"
			)}`}
			onClick={() => {
				if (player !== Player.NONE) {
					appContext.changeCurrentSelectPosition(position[0], position[1]);
				}
			}}>
			{Player.NONE === player && (
				<>
					{isOver && !canDrop && (
						<Overlay type={OverlayType.IllegalMoveHover} />
					)}
					{!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
					{isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />}
				</>
			)}
			{Player.NONE !== player && (
				<div
					ref={drag}
					className={`${clsx(
						"square__wrapper",
						player === Player.COMPUTER && "square__computer",
						player === Player.USER && "square__user"
					)}`}
					style={{
						opacity: isDragging ? 0.5 : 1,
						cursor: "move",
					}}></div>
			)}
		</div>
	);
}
