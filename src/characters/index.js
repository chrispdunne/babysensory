export class Character {
	constructor(name) {
		this.age = 0;
		this.name = name;
	}
	updateAge(age) {
		this.age += age;
	}
}
