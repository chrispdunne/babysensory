import { AnimatedSprite, Graphics } from "pixi.js";
import { _bufferSize } from "../const";
import { roundToTwoPlaces } from "../audio/helpers";
import { isInRange } from "./helpers";
import { Lemon } from "../characters/lemon";
import { spritesheet } from "./spritesheet";

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

	const lemon = await new Lemon().init();
	stage.addChild(lemon);
	lemon.enter(4);

	// 400 x 367
	await spritesheet.parse();
	const testAnim = new AnimatedSprite(spritesheet.animations.apple);
	testAnim.animationSpeed = 0.1;
	testAnim.play();
	stage.addChild(testAnim);

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
