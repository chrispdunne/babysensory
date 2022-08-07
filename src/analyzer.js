import { arrayMax, arrayMin } from "./helpers/array.js";
import {
	getPeaksAtThreshold,
	countIntervalsBetweenNearbyPeaks,
	groupNeighborsByTempo,
} from "./helpers/bpm.js";

export default function analyzer() {
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
		// analyser.getByteTimeDomainData(dataArray);
		const peaks = [];
		function draw() {
			const WIDTH = 300;
			const HEIGHT = 300;
			const canvas = document.getElementById("canvas");
			const canvasCtx = canvas.getContext("2d");

			analyser.getByteTimeDomainData(dataArray);

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
			// console.log({ peaks });

			const intervalCounts = countIntervalsBetweenNearbyPeaks(peaks);
			// console.log({ intervalCounts });

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
