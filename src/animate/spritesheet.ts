import { BaseTexture, Spritesheet } from "pixi.js";

const fruits = [
	"apple",
	"avocado",
	"banana",
	"blackberry",
	"cherry",
	"lemon",
	"orange",
	"pear",
];

const getFrame = (count: number) => ({
	frame: { x: count * 400, y: 0, w: 400, h: 367 },
	sourceSize: { w: 400, h: 367 },
	spriteSourceSize: { x: 0, y: 0, w: 400, h: 367 },
});

const fruitFrames = fruits.reduce(
	(acc: Record<string, any>, fruit, index): Record<string, any> => {
		acc[fruit + "1"] = getFrame(index * 3);
		acc[fruit + "2"] = getFrame(index * 3 + 1);
		acc[fruit + "3"] = getFrame(index * 3 + 2);
		return acc;
	},
	{}
);

const atlasData = {
	frames: fruitFrames,
	// {
	// 	a: {},
	// 	enemy2: {
	// 		frame: { x: 400, y: 0, w: 400, h: 367 },
	// 		sourceSize: { w: 400, h: 367 },
	// 		spriteSourceSize: { x: 0, y: 0, w: 400, h: 367 },
	// 	},
	// },
	meta: {
		image: "img/spritesheet.png",
		format: "RGBA8888",
		size: { w: 9600, h: 367 },
		scale: "1",
	},
	animations: {
		apple: ["apple1", "apple2", "apple3"], //array of frames by name
	},
};

console.log({ atlasData });

export const spritesheet = new Spritesheet(
	BaseTexture.from(atlasData.meta.image),
	atlasData
);
