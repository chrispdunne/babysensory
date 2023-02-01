import gsap from "gsap";
import { Character } from "../../characters";

export default function nodAndSlide(character: Character, duration: number) {
	const tl = gsap.timeline();

	tl.fromTo(
		character.scale,
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
	tl.to(character.scale, {
		x: 1,
		y: 1,
		duration: duration / 4,
		ease: "power1.inOut",
	});
	tl.to(character, {
		x: character.x - 100,
		duration: duration / 4,
		ease: "power1.inOut",
	});
	tl.fromTo(
		character.scale,
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
	tl.to(character.scale, {
		x: 1,
		y: 1,
		duration: duration / 4,
		ease: "power1.inOut",
	});
	tl.to(character, {
		x: character.x + 100,
		duration: duration / 4,
		ease: "power1.inOut",
	});
	return tl;
}
