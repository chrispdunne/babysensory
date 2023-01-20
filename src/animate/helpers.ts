const between = (x: number, min: number, max: number) => x >= min && x <= max;

export const isInRange = (x: number, y: number, range: number) =>
	between(x, y - range, y + range);
