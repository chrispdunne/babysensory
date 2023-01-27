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
		this.anchor.set(0.5);

		this.name = name;

		return this;
	}

	enter(duration: number) {
		const { renderer } = window.bs.pixi;
		gsap.to(this, {
			x: renderer.width / 2,
			y: renderer.height / 2,
			duration,
		});
		gsap.fromTo(
			this,
			{
				rotation: -0.25,
			},
			{
				rotation: 0.25,
				duration: duration / 4,
				repeat: -1,
				yoyo: true,
				yoyoEase: true,
				ease: "elastic.out(1, 0.3)",
			}
		);
	}
}
