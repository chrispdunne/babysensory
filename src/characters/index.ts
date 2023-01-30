import gsap from "gsap";
import { AnimatedSprite, Resource, Texture } from "pixi.js";
import { getStartingPosition } from "./helpers";

export class Character extends AnimatedSprite {
	name: string;

	constructor(name: string, animation: Texture<Resource>[]) {
		super(animation);
		const { renderer, stage } = window.bs.pixi;
		const [x, y] = getStartingPosition(renderer.width, renderer.height);
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);

		this.animationSpeed = 0.1;

		this.name = name;

		stage.addChild(this);
		this.enter(4);
		// this.play();
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
