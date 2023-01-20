import { Carrot } from "../characters/carrot";
import { Application, Assets, Sprite } from "pixi.js";
import { _bufferSize } from "../const";
import { roundToTwoPlaces } from "../audio/helpers";
import { isInRange } from "./helpers";
const animate = async () => {
	let roughBpm: number = Math.round(window.bs.bpm);
	let beatInterval: ReturnType<typeof setInterval>;

	console.log("animate pixi . js v2");

	const texture = await Assets.load("img/lemon.png");
	//@ATTRIBUTION Image by <a href="https://www.freepik.com/free-vector/flat-design-fruit-collection_13643341.htm#query=fruit&position=8&from_view=search&track=sph">Freepik</a>

	const lemon = new Sprite(texture);
	lemon.x = window.bs.pixi.renderer.width / 2;
	lemon.y = window.bs.pixi.renderer.height / 2;

	window.bs.pixi.stage.addChild(lemon);

	// app.ticker.add((delta) => {

	// });
	document.addEventListener("peak", (e) => {
		lemon.x -= 44;
		lemon.y -= 44;
		const beatLength = (60 / (window.bpm ?? 120)) * 1000;
		const ms = beatLength / 2;
		setTimeout(() => {
			lemon.x += 44;
			lemon.y += 44;
		}, ms);
	});

	const checkBpmAndPeaks = () => {
		const {
			peaks,
			bpm,
			audioContext: { currentTime, sampleRate },
		} = window.bs;

		//maybe update rough BPM
		if (!isInRange(roughBpm, bpm, 4)) {
			console.log("NEW BPM");
			roughBpm = Math.round(bpm);
		}

		// console.log({ roughBpm });
		const now = roundToTwoPlaces(currentTime - _bufferSize / sampleRate);
		const roundedPeaks = peaks.map((peak) => roundToTwoPlaces(peak));
		// console.log({ now, roundedPeaks });

		if (roundedPeaks.includes(now)) {
			console.log("PEAK MF!");
			const beatLengthInMs = (60 / (bpm ?? 120)) * 1000;
			console.log({ beatLengthInMs });
			clearInterval(beatInterval);
			beatInterval = setInterval(() => {
				bounceLemon();
			}, beatLengthInMs);
		}

		requestAnimationFrame(checkBpmAndPeaks);
	};
	checkBpmAndPeaks();

	const bounceLemon = () => {
		lemon.x -= 100;
		lemon.y -= 100;
		// const beatLength = (60 / (bpm ?? 120)) * 1000;
		// const ms = beatLength / 2;
		setTimeout(() => {
			lemon.x += 100;
			lemon.y += 100;
		}, 100);
	};

	// rarely (every 8 or 16 bars?)

	//// remove any existing characters
	//// animate off screen for 1 or 2 bars,
	//// then remove from canvas

	//// either add multiple unique character types or multiple instances of the same character type
	//// of between 1 and 6 characters

	// often (every 1 or 2 bars?)
	// trigger a dance for characters
};

export default animate;
