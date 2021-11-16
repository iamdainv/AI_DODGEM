/** @format */

export enum Player {
	NONE = 0,
	COMPUTER = -1,
	USER = 1,
	RIM = 2,
}

export const BOARD_SIZE = 5;

export enum OverlayType {
	IllegalMoveHover,
	LegalMoveHover,
	PossibleMove,
}
