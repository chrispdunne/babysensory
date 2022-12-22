(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function ui() {
	const _threshold = 0.9;
	const _filterFreq = 300;
	const _bufferSize = 2048;

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
		console.log("clicky");
		init();
	});

	// stop logic
	let animationFrameId;
	let resetMaxMinInterval;
	const stopDisplay = () => {
		cancelAnimationFrame(animationFrameId);
		clearInterval(resetMaxMinInterval);
	};

	stopBtn.addEventListener("click", stopDisplay);

	const init = () => {
		// setup audio context
		const audioContext = new AudioContext();
		const audioSource = audioContext.createMediaElementSource(audio);

		// add low pass filter
		const loPassFilter = audioContext.createBiquadFilter();
		loPassFilter.type = "lowpass";
		loPassFilter.frequency.value = _filterFreq;
		loPassFilter.connect(audioContext.destination);

		// setup analyser
		const _sampleRate = audioContext.sampleRate; // 48000
		const analyser = audioContext.createAnalyser();
		const bufferLengthInSec = _bufferSize / _sampleRate; // 42.666ms or ~1/23 of a second
		analyser.fftSize = _bufferSize;
		audioSource.connect(analyser);
		analyser.connect(loPassFilter);
		// analyser.connect(audioContext.destination);

		// creates a an array of 2048 elements that can each be a value from 0 to 255
		var dataArray = new Uint8Array(_bufferSize);

		analyser.getByteTimeDomainData(dataArray);

		var max = 0; //174  ... 196
		var min = 255; //89 ... 39
		var getLimit = () => max * _threshold;
		// after 5 seconds reset max and min
		// resetMaxMinInterval = setInterval(() => {
		// 	max = 0;
		// 	min = 255;
		// }, 5000);

		var peaksArray = [];
		var frameCount = 0;

		// display data
		// each call of display we update the data array with 2048 (buffer size) values of 0 - 255
		function display() {
			animationFrameId = requestAnimationFrame(display);

			// update data array
			analyser.getByteTimeDomainData(dataArray);

			// loop through data array
			dataArray.forEach((eightBitValue, i) => {
				const limit = getLimit();
				if (eightBitValue > max) {
					max = eightBitValue;
				}
				if (eightBitValue < min) {
					min = eightBitValue;
				}

				// do something if audio louder than threshold
				if (frameCount > 1 && limit > 100 && eightBitValue > limit) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					// draw a new box
					ctx.fillStyle = "blue";
					ctx.fillRect(10, 10, eightBitValue, eightBitValue);
					// console.log({ max, min });

					peaksArray.push(frameCount * _bufferSize + i);
				}
			});
			frameCount++;
			console.log({ peaksArray });
		}
		display();
	};
}
ui();
module.exports = {
	ui,
};

// use canvas for performance
// calc peaks

},{}]},{},[1]);
