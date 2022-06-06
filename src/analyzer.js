export default function analyzer() {
	const mainAudio = document.getElementById("yt_audio");
	mainAudio.addEventListener("play", init);

	function init() {
		const audioCtx = new (window.AudioContext ||
			window.webkitAudioContext)();
		const audioSource = audioCtx.createMediaElementSource(mainAudio);
		const analyser = audioCtx.createAnalyser();
		audioSource.connect(analyser);
		analyser.connect(audioCtx.destination);

		// analyzer setup
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(dataArray);

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

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * HEIGHT) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
			requestAnimationFrame(draw);
		}

		draw();
	}
}
