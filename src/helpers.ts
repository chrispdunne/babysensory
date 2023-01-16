export interface PeakItem {
	interval: number;
	location: number;
}
export function doubleIfBelowThreshold(num: number, threshold: number): number {
	const newNum = num * 2;
	if (newNum >= threshold) {
		return newNum;
	}
	return doubleIfBelowThreshold(newNum, threshold);
}
export function halveIfAboveThreshold(num: number, threshold: number): number {
	const newNum = num / 2;
	if (newNum <= threshold) {
		return newNum;
	}
	return halveIfAboveThreshold(newNum, threshold);
}

export function roundToTwoPlaces(num: number): number {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function roundToThreePlaces(num: number): number {
	return Math.round((num + Number.EPSILON) * 1000) / 1000;
}

export function getMinMaxValues(array: Uint8Array): [number, number] {
	let max = 0;
	let min = 255;
	array.forEach((item) => {
		if (item < min) {
			min = item;
		}
		if (item > max) {
			max = item;
		}
	});
	return [min, max];
}

export function getPeakDistances(
	array: number[],
	sampleRate: number
): PeakItem[] {
	// offset is in frames aka samples
	const peaksDistanceArray: PeakItem[] = [];
	for (let i = 0; i < array.length; i++) {
		if (i > 0) {
			const diff = array[i] - array[i - 1];
			peaksDistanceArray.push({
				interval: roundToThreePlaces(diff / sampleRate), // distance from previous peak in seconds
				location: roundToThreePlaces(array[i] / sampleRate), // location in peaks array
			});
		}
	}
	return peaksDistanceArray;
}

export function groupPeaks(array: PeakItem[]): Record<number, PeakItem[]> {
	const group: Record<number, PeakItem[]> = {};
	array.forEach((item) => {
		const { interval } = item;
		if (!group[interval]) {
			// ex item = {interval: 0.5, location: 23}
			group[interval] = [item];
		} else {
			group[interval].push(item);
		}
	});
	return group;
}
