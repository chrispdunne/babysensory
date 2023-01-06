import { Carrot } from "../characters/carrot";
import { Application, Assets, Sprite } from "pixi.js";

const animate = async () => {
	console.log("animate pixi . js v2");

	// on init
	const app = new Application();

	document.body.appendChild(app.view);

	const texture = await Assets.load("img/lemon.png");
	//@ATTRIBUTION Image by <a href="https://www.freepik.com/free-vector/flat-design-fruit-collection_13643341.htm#query=fruit&position=8&from_view=search&track=sph">Freepik</a>

	const lemon = new Sprite(texture);
	lemon.x = app.renderer.width / 2;
	lemon.y = app.renderer.height / 2;

	app.stage.addChild(lemon);

	// app.ticker.add((delta) => {

	// });
	document.addEventListener("peak", (e) => {
		console.log("peak!", { e });
		console.log({ lemon });
		lemon.x -= 44;
		lemon.y -= 44;
		const beatLength = (60 / (window.bpm ?? 120)) * 1000;
		const ms = beatLength / 2;
		setTimeout(() => {
			lemon.x += 44;
			lemon.y += 44;
		}, ms);
	});

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
