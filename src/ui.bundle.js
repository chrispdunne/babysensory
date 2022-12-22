(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function roundToTwoPlaces(num) {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getMinMaxValues(array) {
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

function getPeakDistances(array, sampleRate) {
	const peaksDistanceArray = [];
	for (let i = 0; i < array.length; i++) {
		if (i > 0) {
			const diff = array[i] - array[i - 1];
			peaksDistanceArray.push(roundToTwoPlaces(diff / sampleRate));
		}
	}
	return peaksDistanceArray;
}

function groupPeaks(array) {
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

function ui() {
	const container = document.getElementById("url_input");
	const _input = document.getElementById("yt_url");
	const audio = document.getElementById("yt_audio");
	const _testBox = document.getElementById("box");
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const stopBtn = document.getElementById("stop_draw");

	// update youtube link
	_input.addEventListener("keyup", (e) => {
		if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(_input.value)) {
			container.classList.add("valid");
			audio.src = _input.value;
		} else {
			container.classList.remove("valid");
		}
	});

	_testBox.addEventListener("click", () => {
		init();
	});

	// stop logic
	let getAudioDataInterval;
	const stopAnalyzer = () => clearInterval(getAudioDataInterval);

	stopBtn.addEventListener("click", stopAnalyzer);

	const init = () => {
		// setup audio context
		const audioContext = new AudioContext();
		const audioSource = audioContext.createMediaElementSource(audio);

		// consts
		const _threshold = 0.9;
		const _filterFreq = 300;
		const _bufferSize = 32768; //@48khz = 0.682666 seconds

		// add low pass filter
		const loPassFilter = audioContext.createBiquadFilter();
		loPassFilter.type = "lowpass";
		loPassFilter.frequency.value = _filterFreq;
		loPassFilter.connect(audioContext.destination);

		// setup analyser
		const _sampleRate = audioContext.sampleRate; // 48000
		const _bufferLengthInSec = _bufferSize / _sampleRate; // 42.666ms or ~1/23 of a second
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = _bufferSize;
		audioSource.connect(analyser);
		analyser.connect(loPassFilter);
		// analyser.connect(audioContext.destination);

		// creates a an array of 2048 elements that can each be a value from 0 to 255
		var dataArray = new Uint8Array(_bufferSize);

		analyser.getByteTimeDomainData(dataArray);

		const peaksArray = [];
		let intervalCount = 0;
		/////////////////////
		// every (buffer length) seconds get more peaks
		/////////////////////
		getAudioDataInterval = setInterval(() => {
			analyser.getByteTimeDomainData(dataArray);
			const [min, max] = getMinMaxValues(dataArray);
			const _minVolumeThreshold = max * _threshold;
			// loop through data array item

			for (var i = 0; i < dataArray.length; i++) {
				const eightBitValue = dataArray[i];
				// do something if audio louder than threshold
				if (
					_minVolumeThreshold > 100 &&
					eightBitValue > _minVolumeThreshold
				) {
					if (peaksArray.length > 99) {
						peaksArray.shift();
					}
					peaksArray.push(intervalCount * _bufferSize + i);
					// skip forward 1/4 second (means we're assuming slower than 240bpm)
					i += _sampleRate / 4;
				}
			}

			getBpm();
			intervalCount++;
			// console.log({ peaksArray });
		}, _bufferLengthInSec * 1000);

		/////////////////////
		// if peaksArray has more than 10 peaks start calc bpm
		/////////////////////
		const getBpm = () => {
			if (peaksArray.length > 10) {
				const peakDistances = getPeakDistances(peaksArray, _sampleRate);
				// console.log({ peakDistances });
				const peakDistanceCounts = groupPeaks(peakDistances);
				// console.log({ peakDistanceCounts });
				const mostCommonInterval = Object.keys(
					peakDistanceCounts
				).reduce(
					(acc, curr) =>
						peakDistanceCounts[curr] > acc ? curr : acc,
					0
				);
				const theoreticalBpm = mostCommonInterval * 60;
				while (theoreticalBpm > 240) {
					theoreticalBpm / 2;
				}
				while (theoreticalBpm < 60) {
					theoreticalBpm * 2;
				}
				console.log({ theoreticalBpm });
				// console.log({ mostCommonInterval });
			}
		};
	};
}
ui();
module.exports = {
	ui,
};

},{}]},{},[1]);
