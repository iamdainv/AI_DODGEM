/** @format */

import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AppContext, BOARD_INIT } from "./App";
import { Player } from "./const";
import "./scss/Board.scss";
import Square from "./Square";
import { Slider, Switch } from "antd";

// -1 : black, 1 : white 0 : Square None

interface BoardProps {
	boardState: number[][];
	setStart: any;
	setLevel: any;
	level: number;
}

export default function Board({
	boardState,
	setStart,
	setLevel,
	level,
}: BoardProps) {
	const appContext = useContext(AppContext);

	return (
		<DndProvider backend={HTML5Backend}>
			<div
				className='board__container'
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<div
					style={{
						marginBottom: "20px",
					}}>
					<Button
						onClick={() => setStart(true)}
						variant='contained'
						color='success'
						style={{
							marginRight: "10px",
						}}>
						Bắt Đầu
					</Button>
					{/* <Button
						onClick={() => setLevel(3)}
						variant='contained'
						color='success'
						style={{
							marginRight: "10px",
						}}>
						Dễ
					</Button> */}
					{/* <Button
						onClick={() => setLevel(4)}
						variant='contained'
						style={{
							marginRight: "10px",
						}}>
						Trung bình
					</Button>
					<Button
						onClick={() => setLevel(5)}
						variant='contained'
						style={{
							marginRight: "10px",
						}}>
						Khó
					</Button> */}
					<Slider
						defaultValue={level}
						min={1}
						max={12}
						onChange={(value) => setLevel(value)}
					/>
				</div>
				{boardState.map((cells, idx) => (
					<Cells cells={cells} cellsNumber={idx} key={idx} />
				))}
			</div>
		</DndProvider>
	);
}

interface CellProps {
	cells: Player[];
	cellsNumber: number;
}

const Cells = ({ cells, cellsNumber }: CellProps) => (
	<div className='cell__container'>
		{cells.map((player, idx) => (
			<Square player={player} position={[cellsNumber, idx]} key={idx} />
		))}
	</div>
);
