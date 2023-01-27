import { Assets, Sprite } from "pixi.js";
import { Character } from ".";

export class Lemon {
	constructor() {}

	async init(): Promise<Character> {
		const { renderer } = window.bs.pixi;

		const texture = await Assets.load("img/lemon.png");
		const lemon = new Character("lemon", texture);

		lemon.x = renderer.width;
		lemon.y = renderer.height;

		return lemon;
	}
}
