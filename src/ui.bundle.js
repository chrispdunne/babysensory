(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { arrayMax, arrayMin } = require("./helpers/array.js");
const {
	getPeaksAtThreshold,
	countIntervalsBetweenNearbyPeaks,
	groupNeighborsByTempo,
} = require("./helpers/bpm.js");

function analyzer() {
	const mainAudio = document.getElementById("yt_audio");
	mainAudio.addEventListener("play", init);

	let animationFrameId;
	const stopDraw = () => cancelAnimationFrame(animationFrameId);
	const stopDrawButton = document.getElementById("stop_draw");
	stopDrawButton.addEventListener("click", stopDraw);

	function init() {
		const audioCtx = new window.AudioContext();
		const audioSource = audioCtx.createMediaElementSource(mainAudio);

		const analyser = audioCtx.createAnalyser();

		audioSource.connect(analyser);
		analyser.connect(audioCtx.destination);

		// analyzer setup
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount; //1024 half of fftSize
		const dataArray = new Uint8Array(bufferLength);

		const peaks = [];
		function draw() {
			const WIDTH = 300;
			const HEIGHT = 300;
			const canvas = document.getElementById("canvas");
			const canvasCtx = canvas.getContext("2d");

			analyser.getByteTimeDomainData(dataArray);
			// analyser.getByteFrequencyData(dataArray);

			canvasCtx.fillStyle = "rgb(0, 10, 10)";
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "rgb(10, 255, 100)";

			canvasCtx.beginPath();

			const sliceWidth = (WIDTH * 1.0) / bufferLength;
			let x = 0;

			// for 1024
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;

				const y = (v * HEIGHT) / 4;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			var max = arrayMax(dataArray);
			var min = arrayMin(dataArray);
			var threshold = min + (max - min) * 0.98;
			const newPeak = getPeaksAtThreshold(dataArray, threshold)[0];
			if (newPeak) {
				peaks.push(newPeak);
			}

			const intervalCounts = countIntervalsBetweenNearbyPeaks(peaks);

			const tempoCounts = groupNeighborsByTempo(intervalCounts);

			tempoCounts.sort(function (a, b) {
				return b.count - a.count;
			});
			if (tempoCounts.length) {
				document.getElementById("bpm").innerHTML = tempoCounts[0].tempo;
			}
			// if (tempoCounts.length > 1) {
			// 	cancelAnimationFrame(animationFrameId);
			// }

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
			animationFrameId = requestAnimationFrame(draw);
		}

		draw();
	}
}

module.exports = { analyzer };

},{"./helpers/array.js":2,"./helpers/bpm.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
function input() {
	const container = document.getElementById("url_input");
	const _input = document.getElementById("yt_url");
	const audio = document.getElementById("yt_audio");

	_input.addEventListener("keyup", (e) => {
		if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(_input.value)) {
			container.classList.add("valid");
			audio.src = _input.value;
		} else {
			container.classList.remove("valid");
		}
	});
}

module.exports = {
	input,
};

},{}],5:[function(require,module,exports){
// import input from "./input.js";
// import analyzer from "./analyzer.js";

const { input } = require("./input.js");
const { analyzer } = require("./analyzer.js");
input();
analyzer();
//1

},{"./analyzer.js":1,"./input.js":4}]},{},[5]);
