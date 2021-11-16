/** @format */

import { OverlayType } from "./const";

// export let OverlayType;
// (function (OverlayType) {
// 	OverlayType["IllegalMoveHover"] = "Illegal";
// 	OverlayType["LegalMoveHover"] = "Legal";
// 	OverlayType["PossibleMove"] = "Possible";
// })(OverlayType || (OverlayType = {}));

interface OverlayProps {
	type: OverlayType;
}

export const Overlay = ({ type }: OverlayProps) => {
	const color = getOverlayColor(type);
	return (
		<div
			className='overlay'
			// role={type}
			style={{
				height: "100%",
				width: "100%",
				zIndex: 1,
				opacity: 0.5,
				backgroundColor: color,
			}}
		/>
	);
};
function getOverlayColor(type: OverlayType) {
	switch (type) {
		case OverlayType.IllegalMoveHover:
			return "red";
		case OverlayType.LegalMoveHover:
			return "green";
		case OverlayType.PossibleMove:
			return "yellow";
	}
}
