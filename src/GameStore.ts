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
export type Phase = "MENU" | "SETUP" | "PLAYING" | "SELECTION";

export type ButtonEvent = {
	kind: "enter" | "up" | "down" | "left" | "right";
	completed: boolean;
	timestamp: number;
};

export class GameStore {
	// The position of the cup is its index within the array
	cups: Cup[] = [];
	selectedCup: number = 0;
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

	buttonEvents: ButtonEvent[] = [];

	constructor() {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "Enter":
					this.buttonEvents.push({
						kind: "enter",
						completed: false,
						timestamp: Date.now(),
					});
					break;
				case "ArrowUp":
					this.buttonEvents.push({
						kind: "up",
						completed: false,
						timestamp: Date.now(),
					});
					break;
				case "ArrowDown":
					this.buttonEvents.push({
						kind: "down",
						completed: false,
						timestamp: Date.now(),
					});
					break;
				case "ArrowLeft":
					this.buttonEvents.push({
						kind: "left",
						completed: false,
						timestamp: Date.now(),
					});
					break;
				case "ArrowRight":
					this.buttonEvents.push({
						kind: "right",
						completed: false,
						timestamp: Date.now(),
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
					}
					break;
				}
				case "ArrowUp": {
					const event = this.buttonEvents.findLast((e) => e.kind === "up");
					if (event) {
						event.completed = true;
					}
					break;
				}
				case "ArrowDown": {
					const event = this.buttonEvents.findLast((e) => e.kind === "down");
					if (event) {
						event.completed = true;
					}
					break;
				}
				case "ArrowLeft": {
					const event = this.buttonEvents.findLast((e) => e.kind === "left");
					if (event) {
						event.completed = true;
					}
					break;
				}
				case "ArrowRight": {
					const event = this.buttonEvents.findLast((e) => e.kind === "right");
					if (event) {
						event.completed = true;
					}
					break;
				}
			}
		});
	}

	wasButtonPressed(
		kind: "enter" | "up" | "down" | "left" | "right",
	): ButtonEvent | undefined {
		return this.buttonEvents.findLast((e) => e.kind === kind && e.completed);
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
