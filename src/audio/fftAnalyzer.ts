export default function fftAnalyzer() {
	// NOTE: SO far this seems not as suited to determing BPM because you need to
	// examine a decent chunk of time to get a good maximum amp value.
	// getByteFrequencyData is really cool for visualising frequencies, and
	// getting freq info.

	const { analyser } = window.bs;
	if (!analyser) return;

	const _resolution = 10;
	const freqCount = 512; // this receives the low pass filter audio, so 512HZ is enough. // analyser.frequencyBinCount;

	const _threshold = 0.95;

	const canvas = document.querySelector("#canvas_fft") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");

	// stop function
	let animationFrame: ReturnType<typeof requestAnimationFrame>;

	window.addEventListener("stopAudio", () =>
		cancelAnimationFrame(animationFrame)
	);

	// roughly 60 times a second get freq info
	// using 512 rather than frequencyBinCount (which is huuge)
	const dataArray = new Uint8Array(freqCount);
	let count = 0;

	///// kick drums 50hz-200hz
	///// snare 170-250
	const minFreq = 50;
	const maxFreq = 250;

	let maxAmpRecorded = 0;
	// const totalPossibleAmp = 255 * (maxFreq - minFreq);

	function getFrequencyData() {
		if (count % _resolution === 0) {
			const { width, height } = canvas;
			const blockHeight = height / dataArray.length;
			analyser.getByteFrequencyData(dataArray);

			let totalAmp = 0;
			for (let i = minFreq; i < maxFreq; i++) {
				const ampAtThisFreq = dataArray[i];
				totalAmp += ampAtThisFreq;
			}

			if (totalAmp > maxAmpRecorded) {
				maxAmpRecorded = totalAmp;
			}

			ctx.fillStyle =
				totalAmp / maxAmpRecorded > _threshold ? "#fa0" : "#007";
			ctx.fillRect(count / _resolution, 0, 1, height);

			// for (let i = 0; i < dataArray.length; i++) {

			// const vol = dataArray[i];
			// if (count % _resolution === 0) {
			// 	// ctx.fillStyle = `rgba(255, 0, 0, ${dataArray[i] / 255})`;

			// 	if (vol === 0) {
			// 		ctx.fillStyle = "#ff0";
			// 	} else {
			// 		ctx.fillStyle = `rgba(${vol}, ${(i / freqCount) * 255}, ${
			// 			255 - vol
			// 		}, ${vol / 255})`;
			// 	}

			// 	ctx.fillRect(
			// 		count / _resolution,
			// 		(freqCount - i) * blockHeight,
			// 		1,
			// 		1
			// 	);
			// }
			// }
		} // if resolution
		count++;
		animationFrame = requestAnimationFrame(getFrequencyData);
	}
	getFrequencyData();
}
