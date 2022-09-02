function arrayMin(arr) {
	var len = arr.length,
		min = Infinity;
	while (len--) {
		if (arr[len] < min) {
			min = arr[len];
		}
	}
	return min;
}

function arrayMax(arr) {
	var len = arr.length,
		max = -Infinity;
	while (len--) {
		if (arr[len] > max) {
			max = arr[len];
		}
	}
	return max;
}

module.exports = { arrayMin, arrayMax };
