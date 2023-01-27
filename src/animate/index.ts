import { Assets, Graphics, Sprite } from "pixi.js";
import { _bufferSize } from "../const";
import { roundToTwoPlaces } from "../audio/helpers";
import { isInRange } from "./helpers";
import { Lemon } from "../characters/lemon";

const drawSquare = () => {
	const { stage } = window.bs.pixi;

	const graphics = new Graphics();
	graphics.beginFill(0xff4444);
	graphics.drawRect(0, 100, 100, 100);
	stage.addChild(graphics);
	return graphics;
};

const drawMetronoe = () => {
	const gfx = drawSquare();
	setTimeout(() => {
		gfx.clear();
	}, 100);
};

const animate = async () => {
	const { renderer, stage } = window.bs.pixi;
	let roughBpm: number = Math.round(window.bs.bpm);
	let beatInterval: ReturnType<typeof setInterval>;

	console.log("animate pixi . js v2");

	// const texture = await Assets.load("img/lemon.png");
	//@ATTRIBUTION Image by <a href="https://www.freepik.com/free-vector/flat-design-fruit-collection_13643341.htm#query=fruit&position=8&from_view=search&track=sph">Freepik</a>

	// const lemon = new Sprite(texture);
	const lemon = await new Lemon().init();

	// const stageW = renderer.width;
	// const stageH = renderer.height;

	// lemon.x = stageW / 2 - lemon.width / 2;
	// lemon.y = stageH / 2 - lemon.height / 2;

	stage.addChild(lemon);

	setTimeout(() => {
		lemon.enter();
	}, 1000);

	// app.ticker.add((delta) => {

	// });
	// document.addEventListener("peak", (e) => {
	// 	lemon.x -= 44;
	// 	lemon.y -= 44;
	// 	const beatLength = (60 / (window.bs.bpm ?? 120)) * 1000;
	// 	const ms = beatLength / 2;
	// 	setTimeout(() => {
	// 		lemon.x += 44;
	// 		lemon.y += 44;
	// 	}, ms);
	// });

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

		// note: audio is delayed & played (_bufferLength) behind currentTime
		const now = roundToTwoPlaces(currentTime - _bufferSize / sampleRate);
		const roundedPeaks = peaks.map((peak) => roundToTwoPlaces(peak));
		// console.log({ now, roundedPeaks });

		if (roundedPeaks.includes(now)) {
			// console.log("PEAK MF!");
			const beatLengthInMs = (60 / (bpm ?? 120)) * 1000;
			// console.log({ beatLengthInMs });
			clearInterval(beatInterval);
			beatInterval = setInterval(() => {
				// bounceLemon();
				drawMetronoe();
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
