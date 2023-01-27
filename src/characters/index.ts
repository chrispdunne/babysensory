import gsap from "gsap";
import { Assets, Sprite, Texture } from "pixi.js";
import { getStartingPosition } from "./helpers";

export class Character extends Sprite {
	name: string;

	constructor(name: string, texture: Texture) {
		super(texture);
		const { renderer } = window.bs.pixi;
		const [x, y] = getStartingPosition(renderer.width, renderer.height);
		this.x = x;
		this.y = y;

		this.name = name;

		return this;
	}

	// enter() {
	// 	this.x -= 500;
	// 	this.y -= 500;
	// 	gsap.to(this, {
	// 		x: 500,
	// 		y: 500,
	// 		duration: 2,
	// 		repeat: -1,
	// 		yoyo: true,
	// 	});
	// }
	enter(duration: number) {
		const { renderer } = window.bs.pixi;
		gsap.to(this, {
			x: renderer.width / 2 - this.width / 2,
			y: renderer.height / 2 - this.height / 2,
			duration,
			// repeat: -1,
			yoyo: true,
		});
		gsap.to(this, {
			rotation: 0.5,
			duration: duration / 4,
			repeat: 4,
			// yoyo: true,
		});
	}
}
