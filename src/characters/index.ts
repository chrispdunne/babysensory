import gsap from "gsap";
import { AnimatedSprite, Resource, Texture } from "pixi.js";
import { getOffscreenPosition } from "./helpers";

export class Character extends AnimatedSprite {
	name: string;
	tweens: Record<string, gsap.core.Tween | gsap.core.Timeline>;

	constructor(name: string, animation: Texture<Resource>[]) {
		super(animation);
		const { renderer, stage } = window.bs.pixi;
		const [x, y] = getOffscreenPosition(
			renderer.width,
			renderer.height,
			this.width,
			this.height
		);
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);

		this.animationSpeed = 0.1;

		this.name = name;
		this.tweens = {};

		stage.addChild(this);
		this.enter(4);
		// this.play();

		window.addEventListener("stopAudio", () => {
			Object.values(this.tweens).forEach((tween) => tween.pause());
		});

		return this;
	}

	enter(duration: number) {
		const { renderer } = window.bs.pixi;
		this.tweens.enter = gsap.to(this, {
			x: renderer.width / 2,
			y: renderer.height / 2,
			duration,
		});
		this.bounce(duration);
	}
	exit(duration: number) {
		const { renderer } = window.bs.pixi;
		const [x, y] = getOffscreenPosition(
			renderer.width,
			renderer.height,
			this.width,
			this.height
		);
		this.tweens.exit = gsap.to(this, {
			x,
			y,
			duration,
		});
	}
	bounce(duration: number) {
		const tl = gsap.timeline();
		tl.fromTo(
			this,
			{
				rotation: -0.25,
			},
			{
				rotation: 0.25,
				duration: duration / 4,
				repeat: 4,
				yoyo: true,
				yoyoEase: true,
				ease: "elastic.out(1, 0.3)",
			}
		);
		tl.to(this, { rotation: 0 });

		this.tweens.bounce = tl;
	}
	nodAndSlide(duration: number) {
		const tl = gsap.timeline();

		tl.fromTo(
			this.scale,
			{
				x: 1,
				y: 1,
			},
			{
				x: 1.2,
				y: 1.2,
				duration: duration / 4,
				repeat: 4,
				ease: "power1.inOut",
				yoyo: true,
			}
		);
		tl.to(this.scale, {
			x: 1,
			y: 1,
			duration: duration / 4,
			ease: "power1.inOut",
		});
		tl.to(this, {
			x: this.x - 100,
			duration: duration / 4,
			ease: "power1.inOut",
		});
		this.tweens.nodAndSlide = tl;
	}
	blink() {
		this.gotoAndStop(1);
		setTimeout(() => {
			this.gotoAndStop(0);
		}, 100);
	}
	ooh() {
		this.gotoAndStop(2);
		setTimeout(() => {
			this.gotoAndStop(0);
		}, 1000);
	}
}
