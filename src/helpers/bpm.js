function getPeaksAtThreshold(data, threshold) {
	var peaksArray = [];
	var length = data.length;
	for (var i = 0; i < length; ) {
		if (data[i] > threshold) {
			peaksArray.push(i);
			// Skip forward ~ 1/4s to get past this peak.
			i += 10000;
		}
		i++;
	}
	return peaksArray;
}

function countIntervalsBetweenNearbyPeaks(peaks) {
	var intervalCounts = [];
	peaks.forEach(function (peak, index) {
		for (var i = 0; i < 10; i++) {
			var interval = peaks[index + i] - peak;
			var foundInterval = intervalCounts.some(function (intervalCount) {
				if (intervalCount.interval === interval)
					return intervalCount.count++;
			});
			//Additional checks to avoid infinite loops in later processing
			if (!isNaN(interval) && interval !== 0 && !foundInterval) {
				intervalCounts.push({
					interval: interval,
					count: 1,
				});
			}
		}
	});
	return intervalCounts;
}

function nearestPowerOf2(n) {
	return 1 << (32 - Math.clz32(n));
}

function groupNeighborsByTempo(intervalCounts) {
	var tempoCounts = [];
	intervalCounts.forEach(function (intervalCount) {
		//Convert an interval to tempo
		var theoreticalTempo = 60 / (intervalCount.interval / 48000);
		theoreticalTempo = Math.round(theoreticalTempo);
		if (theoreticalTempo === 0) {
			return;
		}
		// Adjust the tempo to fit within the 90-180 BPM range
		// while (theoreticalTempo < 90) theoreticalTempo *= 2;
		// while (theoreticalTempo > 180) theoreticalTempo /= 2;
		if (theoreticalTempo < 0) {
			theoreticalTempo = theoreticalTempo * -1;
		}
		if (theoreticalTempo < 90) {
			const ratio = nearestPowerOf2(90 / theoreticalTempo);
			theoreticalTempo = theoreticalTempo * ratio;
		}
		if (theoreticalTempo > 180) {
			// const diff = theoreticalTempo - 180;

			const ratio = nearestPowerOf2(theoreticalTempo / 180);
			// console.log({ ratio, theoreticalTempo });

			theoreticalTempo = theoreticalTempo / ratio;
		}
		theoreticalTempo = theoreticalTempo.toFixed(0);

		var foundTempo = tempoCounts.some(function (tempoCount) {
			if (tempoCount.tempo === theoreticalTempo)
				return (tempoCount.count += intervalCount.count);
		});
		if (!foundTempo) {
			tempoCounts.push({
				tempo: theoreticalTempo,
				count: intervalCount.count,
			});
		}
	});
	return tempoCounts;
}

module.exports = {
	groupNeighborsByTempo,
	countIntervalsBetweenNearbyPeaks,
	getPeaksAtThreshold,
};
