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
	// offset is in frames aka samples
	const peaksDistanceArray = [];
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

export function groupPeaks(array) {
	const group = {};
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
