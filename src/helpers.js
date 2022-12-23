export function doubleIfBelowThreshold(num, threshold) {
	const newNum = num * 2;
	if (newNum >= threshold) {
		return newNum;
	}
	return doubleIfBelowThreshold(newNum, threshold);
}
export function halveIfAboveThreshold(num, threshold) {
	const newNum = num / 2;
	if (newNum <= threshold) {
		return newNum;
	}
	return halveIfAboveThreshold(newNum, threshold);
}

export function roundToTwoPlaces(num) {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function roundToThreePlaces(num) {
	return Math.round((num + Number.EPSILON) * 1000) / 1000;
}

export function getMinMaxValues(array) {
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

export function getPeakDistances(array, sampleRate) {
	const peaksDistanceArray = [];
	for (let i = 0; i < array.length; i++) {
		if (i > 0) {
			const diff = array[i] - array[i - 1];
			peaksDistanceArray.push(roundToThreePlaces(diff / sampleRate));
		}
	}
	return peaksDistanceArray;
}

export function groupPeaks(array) {
	const group = {};
	array.forEach((item) => {
		if (!group[item]) {
			group[item] = 1;
		} else {
			group[item]++;
		}
	});
	return group;
}
