(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
		console.log("clicky");
		init();
	});

	// stop logic
	let animationFrameId;
	const stopDisplay = () => cancelAnimationFrame(animationFrameId);
	stopBtn.addEventListener("click", stopDisplay);

	const init = () => {
		// setup audio context
		const audioContext = new AudioContext();
		const audioSource = audioContext.createMediaElementSource(audio);

		// add low pass filter
		const loPassFilter = audioContext.createBiquadFilter();
		loPassFilter.type = "lowpass";
		loPassFilter.connect(audioContext.destination);

		// setup analyser
		const analyser = audioContext.createAnalyser();
		const _fftSize = 2048;
		analyser.fftSize = _fftSize;
		audioSource.connect(analyser);
		analyser.connect(loPassFilter);
		// analyser.connect(audioContext.destination);

		// creates a an array of 2048 elements that can each be a value from 0 to 255
		var dataArray = new Uint8Array(_fftSize);

		analyser.getByteTimeDomainData(dataArray);

		var max = 0; //89
		var min = 255; //174

		// draw a box
		ctx.fillStyle = "blue";
		ctx.fillRect(10, 10, 100, 100);

		// display data
		function display() {
			// console.log("display");

			animationFrameId = requestAnimationFrame(display);

			// update data array
			analyser.getByteTimeDomainData(dataArray);

			// loop through data array
			dataArray.forEach((eightBitValue, i) => {
				if (eightBitValue > max) {
					max = eightBitValue;
				}
				if (eightBitValue < min) {
					min = eightBitValue;
				}
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// draw a new box
				ctx.fillStyle = "blue";
				ctx.fillRect(10, 10, eightBitValue, eightBitValue);
				// console.log({ max, min });
			});
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
