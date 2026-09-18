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

	constructor() {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "Enter":
					this.pressingEnter = true;
					break;
				case "ArrowUp":
					this.pressingUp = true;
					break;
				case "ArrowDown":
					this.pressingDown = true;
					break;
				case "ArrowLeft":
					this.pressingLeft = true;
					break;
				case "ArrowRight":
					this.pressingRight = true;
					break;
			}
		});
		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "Enter":
					this.pressingEnter = false;
					break;
				case "ArrowUp":
					this.pressingUp = false;
					break;
				case "ArrowDown":
					this.pressingDown = false;
					break;
				case "ArrowLeft":
					this.pressingLeft = false;
					break;
				case "ArrowRight":
					this.pressingRight = false;
					break;
			}
		});
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
