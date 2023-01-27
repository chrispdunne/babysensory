export const getStartingPosition = (w: number, h: number): [number, number] => {
	const startingPositions: [number, number][] = [
		[w / 2, 0], // N
		[w, 0], // NE
		[w, h / 2], // E
		[w, h], // SE
		[w / 2, h], // S
		[0, h], // SW
		[0, h / 2], // W
		[0, 0], // NW
	];
	const randomPosition = Math.floor(Math.random() * startingPositions.length);
	return startingPositions[randomPosition];
};
