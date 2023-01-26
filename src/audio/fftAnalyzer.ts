export default function fftAnalyzer() {
	const { analyser } = window.bs;
	if (!analyser) return;

	const _resolution = 5;
	const freqCount = 512; // this receives the low pass filter audio, so 512HZ is enough. // analyser.frequencyBinCount;

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
	function getFrequencyData() {
		const { width, height } = canvas;
		const blockHeight = height / dataArray.length;
		analyser.getByteFrequencyData(dataArray);
		for (let i = 0; i < dataArray.length; i++) {
			const vol = dataArray[i];
			if (count % _resolution === 0) {
				// ctx.fillStyle = `rgba(255, 0, 0, ${dataArray[i] / 255})`;

				if (vol === 0) {
					ctx.fillStyle = "#ff0";
				} else {
					ctx.fillStyle = `rgba(${vol}, ${(i / freqCount) * 255}, ${
						255 - vol
					}, ${vol / 255})`;
				}

				ctx.fillRect(
					count / _resolution,
					(freqCount - i) * blockHeight,
					1,
					1
				);
			}
		}
		count++;
		animationFrame = requestAnimationFrame(getFrequencyData);
	}
	getFrequencyData();
}
