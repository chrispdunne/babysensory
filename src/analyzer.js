export default function analyzer() {
	const mainAudio = document.getElementById("yt_audio");
	const canvas = document.getElementById("canvas");
	mainAudio.addEventListener("play", init);

	function init() {
		console.log("analyzer");
		const audioCtx = new (window.AudioContext ||
			window.webkitAudioContext)();

		const audioSource = audioCtx.createMediaElementSource(mainAudio);
		// const audioSource = audioCtx.createMediaStreamSource(mainAudio);
		const analyser = audioCtx.createAnalyser();

		audioSource.connect(analyser);
		console.log({ audioSource, analyzer });
		analyser.connect(audioCtx.destination);

		//   //
		//   analyser.fftSize = 128;
		//   const bufferLength = analyser.frequencyBinCount;
		//   const dataArray = new Uint8Array(bufferLength);
		//   const barWidth = canvas.width / bufferLength;
		//   //
		//   function animate() {
		//     mainAudio.play();
		//     let x = 0;
		//     const ctx = canvas.getContext("2d");
		//     ctx.clearRect(0, 0, canvas.width, canvas.height);
		//     analyser.getByteFrequencyData(dataArray);
		//     for (let i = 0; i < bufferLength; i++) {
		//       const barHeight = dataArray[i];
		//       ctx.fillStyle = "white";
		//       ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
		//       x += barWidth;
		//     }
		//     requestAnimationFrame(animate);
		//   }
		//   animate();

		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(dataArray);

		function draw() {
			const WIDTH = 300;
			const HEIGHT = 300;
			const canvas = document.getElementById("canvas");
			const canvasCtx = canvas.getContext("2d");

			//   drawVisual =

			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = "rgb(200, 200, 200)";
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "rgb(0, 0, 0)";

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
