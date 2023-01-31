export const getOffscreenPosition = (
	w: number,
	h: number,
	characterW: number,
	characterH: number
): [number, number] => {
	const startingPositions: [number, number][] = [
		[w / 2, 0 - characterH], // N
		[w + characterW, 0 - characterH], // NE
		[w + characterW, h / 2], // E
		[w + characterW, h + characterH], // SE
		[w / 2, h + characterH], // S
		[0 - characterW, h + characterH], // SW
		[0 - characterW, h / 2], // W
		[0 - characterW, 0 - characterH], // NW
	];
	const randomPosition = Math.floor(Math.random() * startingPositions.length);
	return startingPositions[randomPosition];
};
