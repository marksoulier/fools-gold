/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */
import { useCallback, useEffect, useEffectEvent, useState } from "react";
import "./App.css";
import coinPNG from "../src/assets/coin.png";
import foolPNG from "../src/assets/fools_gold.png";
import { type Cup, type GameStore, gameStore } from "./GameStore";

const delay: (arg0: number) => Promise<null> = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const FRAMERATE = 30;
const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const BACKGROUND_COLOR = [250, 232, 188, 255];

type sprite = number[][][];
type position = [number, number];

const loadSprite = async (src: string) => {
	const img = new Image(24, 24);
	const pixels: sprite = [];
	let resolver: (value: sprite) => unknown = () => {};
	const pixelPromise = new Promise<sprite>((resolve) => {
		resolver = resolve;
	});
	img.onload = () => {
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const context = canvas.getContext("2d");
		if (context == null) return;
		context.drawImage(img, 0, 0);
		const rawPixels = context.getImageData(0, 0, img.width, img.height).data;
		const pixelsFlat: number[][] = [];
		for (let i = 0; i < rawPixels.length / 4; i++) {
			const color: number[] = [];
			for (let j = 0; j < 4; j++) {
				const index = i * 4 + j;
				color.push(rawPixels[index]);
			}
			pixelsFlat.push(color);
		}

		for (let i = 0; i < pixelsFlat.length / 24; i++) {
			const row: number[][] = [];
			for (let j = 0; j < 24; j++) {
				const index = i * 24 + j;
				row.push(pixelsFlat[index]);
			}
			pixels.push(row);
		}
		resolver(pixels);
	};
	img.src = src;
	return await pixelPromise;
};

const coinSprite = await loadSprite(coinPNG);
const foolsGoldSprite = await loadSprite(foolPNG);

const render = (sprite: sprite, position: position, screen: sprite) => {
	const spriteOffset: position = [-12, -12];
	for (let i = 0; i < 24; i++) {
		for (let j = 0; j < 24; j++) {
			// get the coords for each pixel: position + localPixel + offset
			const pixelPosition: position = [
				position[0] + i + spriteOffset[0],
				position[1] + j + spriteOffset[1],
			];
			// clamp to bounds of the screen
			if (
				pixelPosition[0] < 0 ||
				pixelPosition[0] >= SCREEN_HEIGHT ||
				pixelPosition[1] < 0 ||
				pixelPosition[1] >= SCREEN_WIDTH
			)
				return;

			screen[pixelPosition[0]][pixelPosition[1]] = sprite[i][j];
		}
	}
};

const wipeScreen = () => {
	const screen: sprite = [];
	for (let i = 0; i < SCREEN_HEIGHT; i++) {
		const row: number[][] = [];
		for (let j = 0; j < SCREEN_WIDTH; j++) {
			row.push(BACKGROUND_COLOR);
		}
		screen.push(row);
	}
	return screen;
};
const roundTime = 5; // 5 seconds is how long they are all moving around the screen

function App() {
	const [screenState, setScreenState] = useState<sprite>([]);

	console.log("app");

	useEffect(() => {
		console.log("event");
		initStore(gameStore);
		gameLoop();
	}, []);

	async function gameLoop() {
		const currentLoopStartTime = performance.now();

		const loop = () => {
			const nextLoopStartTime = currentLoopStartTime + 1000 / FRAMERATE;
			const now = performance.now();
			if (now > nextLoopStartTime) gameLoop();
			else
				setTimeout(() => {
					gameLoop();
				}, now - nextLoopStartTime);
		};

		console.log("looping");
		const screen = wipeScreen();
		// Level, in mobx store

		switch (gameStore.phase) {
			case "MENU":
				if (!gameStore.pressingEnter) {
					render(foolsGoldSprite, [100, 50], screen);
					setScreenState(screen);
					loop();
					break;
				}
				gameStore.phase = "SETUP";
				break;
			case "SETUP":
				{
					gameStore.speed = 2 + gameStore.level * 3; //number of pixals to move along
					// Set number of cups dependent on level
					// 1 gold, if level above 3 then 2 gold, if level about 6 then 3 gold
					const cupWithGold = getRandomIntInclusive(0, 8);
					gameStore.cups[cupWithGold].gold = true;
					render(coinSprite, [100, 50], screen);
					setScreenState(screen);
					await delay(3000);
					gameStore.hiddenMode = true;
				}
				break;
			// case "PLAYING":
			// 	{
			// 		const roundStartTime = performance.now(); //Getting the start time of the round loop
			// 		while (currentTime < roundStartTime + roundTime * 1000) {
			// 			// Keep array of destinations of each cup
			// 			// for each of the cups move cup towards random position, take difference in x and y
			// 			for (const cup of gameStore.cups) {
			// 				// if destination is equal to position give new destination
			// 				if (
			// 					cup.destination.x === cup.position.x &&
			// 					cup.destination.y === cup.position.y
			// 				) {
			// 					const randomX = getRandomIntInclusive(20, 140);
			// 					const randomY = getRandomIntInclusive(20, 124);
			// 					cup.destination.x = randomX;
			// 					cup.destination.y = randomY;
			// 				}

			// 				const deltaX = cup.destination.x - cup.position.x;
			// 				const deltaY = cup.destination.y - cup.position.y;
			// 				const distanceToDestination = Math.sqrt(
			// 					deltaX ** 2 + deltaY ** 2,
			// 				);
			// 				const y = (speed * deltaX) / distanceToDestination;
			// 				const x = (speed * deltaY) / distanceToDestination;
			// 				cup.position.x += x;
			// 				cup.position.y += y;
			// 			}
			// 			// if currentTime is within half second of termination time give final corrediante positions

			// 			currentTime = performance.now();
			// 		}
			// 	}
			// 	break;
			// case "SELECTION":
			// 	{
			// 		let correctSelection = false;

			// 		gameStore.selectedCup = 0;

			// 		while (true) {
			// 			if (gameStore.pressingEnter) {
			// 				break;
			// 			}
			// 		}
			// 		gameStore.hiddenMode = false;

			// 		// If selected the correct cup that is gold then good
			// 		if (gameStore.selectedCup === cupWithGold) {
			// 			correctSelection = true;
			// 		}

			// 		if (correctSelection) {
			// 			gameStore.level += 1;
			// 		} else {
			// 			return;
			// 		}
			// 		await delay(1000);
			// 		setScreenState(screen);
			// 	}
			// 	break;
		}
	}

	return (
		<div>
			{screenState.map((row) => (
				<div style={{ display: "flex", flexDirection: "row" }}>
					{row.map((pixel) => {
						console.log(`pixel ${pixel}`);
						return (
							<div
								style={{
									width: 5,
									height: 5,
									backgroundColor:
										pixel[0] === 0 && pixel[0] === 0 && pixel[0] === 0
											? "transparent"
											: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`,
								}}
							></div>
						);
					})}
				</div>
			))}
		</div>
	);
}

function getRandomIntInclusive(min: number, max: number) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function initStore(gameStore: GameStore) {
	let xPos = 0;
	let yPos = 36;
	for (let i = 0; i < 9; i++) {
		xPos += 40;
		if (xPos > 160) {
			xPos = 40;
			yPos += 36;
		}
		const acup: Cup = {
			gold: false, // Fools Gold = False / Real Gold = True
			position: { x: xPos, y: yPos },
			destination: { x: xPos, y: yPos },
			origin: { x: xPos, y: yPos },
		};
		gameStore.cups.push(acup);
	}
}

export default App;
