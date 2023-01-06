import { Carrot } from "../characters/carrot";

export default function animate() {
	// on init
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	const carrot = new Carrot();
	console.log({ carrot });

	// rarely (every 8 or 16 bars?)

	//// remove any existing characters
	//// animate off screen for 1 or 2 bars,
	//// then remove from canvas

	//// either add multiple unique character types or multiple instances of the same character type
	//// of between 1 and 6 characters

	// often (every 1 or 2 bars?)
	// trigger a dance for characters
}
