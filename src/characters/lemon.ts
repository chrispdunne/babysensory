import { Assets } from "pixi.js";
import { Character } from ".";

export class Lemon {
	constructor() {}

	async init(): Promise<Character> {
		const texture = await Assets.load("img/lemon.png");
		//@ATTRIBUTION Image by <a href="https://www.freepik.com/free-vector/flat-design-fruit-collection_13643341.htm#query=fruit&position=8&from_view=search&track=sph">Freepik</a>
		return new Character("lemon", texture);
	}
}
