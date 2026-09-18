// One of four colors
export type Pixel = 0 | 1 | 2 | 3;
// Coordinates for a cup on the board
export type Coords = { x: number; y: number };
export interface Cup {
	gold: boolean; // Fools Gold = False / Real Gold = True
	position: Coords;
	destination: Coords;
	origin: Coords;
}
export type Phase = "MENU" | "SETUP" | "PLAYING" | "SELECTION" | "FINAL";

export type ButtonEvent = {
	kind: "enter" | "up" | "down" | "left" | "right";
	completed: boolean;
	timestamp: number;
	consumed: boolean;
};

export class GameStore {
	// The position of the cup is its index within the array
	cups: Cup[] = [];
	gameArray: Pixel[][] = [];
	level: number = 1;
	phase: Phase = "MENU";
	pressingEnter: boolean = false;
	pressingUp: boolean = false;
	pressingDown: boolean = false;
	pressingLeft: boolean = false;
	pressingRight: boolean = false;
	speed: number = 0;
	gameStartTime: number = 0;
	currentSelection: number = this.getRandomIntInclusive(0, 8);

	buttonEvents: ButtonEvent[] = [];
	cupWithGold = 0;

	getRandomIntInclusive(min: number, max: number) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
	}

	constructor() {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "Enter":
					this.buttonEvents.push({
						kind: "enter",
						completed: false,
						timestamp: performance.now(),
						consumed: false,
					});
					break;
				case "ArrowUp":
					this.buttonEvents.push({
						kind: "up",
						completed: false,
						timestamp: performance.now(),
						consumed: false,
					});
					break;
				case "ArrowDown":
					this.buttonEvents.push({
						kind: "down",
						completed: false,
						timestamp: performance.now(),
						consumed: false,
					});
					break;
				case "ArrowLeft":
					this.buttonEvents.push({
						kind: "left",
						completed: false,
						timestamp: performance.now(),
						consumed: false,
					});
					break;
				case "ArrowRight":
					this.buttonEvents.push({
						kind: "right",
						completed: false,
						timestamp: performance.now(),
						consumed: false,
					});
					break;
			}
		});
		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "Enter": {
					const event = this.buttonEvents.findLast((e) => e.kind === "enter");
					if (event) {
						event.completed = true;
						event.timestamp = performance.now();
					}
					break;
				}
				case "ArrowUp": {
					const event = this.buttonEvents.findLast((e) => e.kind === "up");
					if (event) {
						event.completed = true;
						event.timestamp = performance.now();
					}
					break;
				}
				case "ArrowDown": {
					const event = this.buttonEvents.findLast((e) => e.kind === "down");
					if (event) {
						event.completed = true;
						event.timestamp = performance.now();
					}
					break;
				}
				case "ArrowLeft": {
					const event = this.buttonEvents.findLast((e) => e.kind === "left");
					if (event) {
						event.completed = true;
						event.timestamp = performance.now();
					}
					break;
				}
				case "ArrowRight": {
					const event = this.buttonEvents.findLast((e) => e.kind === "right");
					if (event) {
						event.completed = true;
						event.timestamp = performance.now();
					}
					break;
				}
			}
		});
	}

	wasButtonPressed(
		kind: "enter" | "up" | "down" | "left" | "right",
	): ButtonEvent | undefined {
		// any event from the last two frames. a proper read would use the delta... but who cares
		const event = this.buttonEvents.findLast(
			(e) =>
				e.kind === kind &&
				e.completed &&
				!e.consumed &&
				e.timestamp > performance.now() - 1000 / 15,
		);
		if (!event) return;
		event.consumed = true;
		return event;
	}

	getlevel() {
		return this.level;
	}

	setlevel(level: number) {
		this.level = level;
	}

	getcups() {
		return this.cups;
	}
}

export const gameStore = new GameStore();
