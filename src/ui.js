import animate from "./animate/index.js";
import {
	doubleIfBelowThreshold,
	halveIfAboveThreshold,
	getMinMaxValues,
	getPeakDistances,
	groupPeaks,
} from "./helpers.js";

function ui() {
	const container = document.getElementById("url_input");
	const _input = document.getElementById("yt_url");
	const audio = document.getElementById("yt_audio");
	const stopBtn = document.getElementById("stop_draw");
	const bpmDisplay = document.getElementById("bpm");

	// update youtube link
	_input.addEventListener("keyup", (e) => {
		if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(_input.value)) {
			container.classList.add("valid");
			audio.src = _input.value;
		} else {
			container.classList.remove("valid");
		}
	});
	console.log("NOW UPDATED v3");

	audio.addEventListener("play", () => {
		init();
	});

	// stop logic
	let getAudioDataInterval;
	const stopAnalyzer = () => clearInterval(getAudioDataInterval);

	stopBtn.addEventListener("click", stopAnalyzer);

	const init = () => {
		console.log("INIT");
		// new custom event "peak" which is probably a 1/4 note
		const peakEvent = new CustomEvent("peak");

		// setup audio context
		const audioContext = new AudioContext();
		const audioSource = audioContext.createMediaElementSource(audio);

		// consts
		const _threshold = 0.98;
		const _filterFreq = 350; // default 350
		const _bufferSize = 32768; //@48khz = 0.682666 seconds

		// setup analyser
		const _sampleRate = audioContext.sampleRate; // 48000
		const _bufferLengthInSec = _bufferSize / _sampleRate; // 42.666ms or ~1/23 of a second
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = _bufferSize;
		// audioSource.connect(analyser); // send audio from source to analyzer

		// add low pass filter
		const loPassFilter = audioContext.createBiquadFilter();
		loPassFilter.type = "lowpass";
		loPassFilter.frequency.value = _filterFreq;
		audioSource.connect(loPassFilter); // send audio to filter
		loPassFilter.connect(analyser); // send filter to analyzer

		// delay audio output by buffer length
		const delay = audioContext.createDelay(10);
		delay.delayTime.value = _bufferLengthInSec;
		audioSource.connect(delay); // send audio to delay
		delay.connect(audioContext.destination); // send delayed audio to speakers

		// audioSource.connect(audioContext.destination); // send unaffected audio source to speakers

		// creates an array of [_bufferSize] elements that can each be a value from 0 to 255
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
					document.dispatchEvent(peakEvent);
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
		}, _bufferLengthInSec * 1000);

		/////////////////////
		// if peaksArray has some values (10 ish) get bpm
		/////////////////////
		const getBpm = () => {
			if (peaksArray.length > 10) {
				const peakDistances = getPeakDistances(peaksArray, _sampleRate);

				// object - key = peak distance in seconds, value = count
				const peakDistanceCounts = groupPeaks(peakDistances);

				// get most common interval count
				const highestPeakCount = Math.max(
					...Object.values(peakDistanceCounts)
				);

				// get most common interval in seconds
				const mostCommonInterval = Object.keys(peakDistanceCounts).find(
					(key) => peakDistanceCounts[key] === highestPeakCount
				);

				// console.log({
				// 	highestPeakCount,
				// 	peakDistanceCounts,
				// 	mostCommonInterval,
				// });

				let bpm = (1 / mostCommonInterval) * 60;

				if (bpm > 200) {
					bpm = halveIfAboveThreshold(bpm, 200);
				}
				if (bpm < 90) {
					bpm = doubleIfBelowThreshold(bpm, 90);
				}
				// console.log({ bpm });
				window.bpm = bpm;
				bpmDisplay.innerHTML = bpm.toFixed(2);
			}
		};

		animate();
	};
}
ui();
