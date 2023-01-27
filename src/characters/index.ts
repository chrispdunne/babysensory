import { Assets, Sprite, Texture } from "pixi.js";

export class Character extends Sprite {
	name: string;

	constructor(name: string, texture: Texture) {
		super(texture);

		this.name = name;

		return this;
	}

	enter() {
		this.x -= 500;
		this.y -= 500;
	}
}
