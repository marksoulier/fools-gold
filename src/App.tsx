/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */
import { useEffect, useState } from "react";
import "./App.css";
import coinPNG from "../src/assets/coin.png";
import foolPNG from "../src/assets/fools_gold.png";
import selectedCoinPNG from "../src/assets/selected_coin.png";
import selectedFoolsGoldPNG from "../src/assets/selected_fools_gold.png";
import { type Cup, type GameStore, gameStore } from "./GameStore";

type sprite = number[][][];
type position = [number, number];

const delay: (arg0: number) => Promise<null> = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const FRAMERATE = 30;
const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const BACKGROUND_COLOR = [250, 232, 188, 255];
const ROUND_TIME = 5000;

const CENTER: position = [72, 80];

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
const selectedCoinSprite = await loadSprite(selectedCoinPNG);
const selectedFooldsGoldSprite = await loadSprite(selectedFoolsGoldPNG);

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
				continue;

			if (sprite[i][j][3] === 0) continue;

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

let started = false;

function App() {
	const [screenState, setScreenState] = useState<sprite>([]);

	useEffect(() => {
		console.log("useeffect");
		if (!started) {
			started = true;
			initStore(gameStore);
			gameLoop();
		}
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

		console.log(gameStore.phase);
		const screen = wipeScreen();
		// Level, in mobx store

		switch (gameStore.phase) {
			case "MENU":
				if (!gameStore.wasButtonPressed("enter")) {
					render(coinSprite, CENTER, screen);
					break;
				}
				gameStore.phase = "SETUP";
				break;
			case "SETUP":
				{
					gameStore.speed = 1; //number of pixals to move along
					// Set number of cups dependent on level
					// 1 gold, if level above 3 then 2 gold, if level about 6 then 3 gold
					const cupWithGold = gameStore.getRandomIntInclusive(0, 8);
					console.log(cupWithGold);
					gameStore.cups[cupWithGold].gold = true;
					console.log(gameStore.cups[cupWithGold].gold);
					gameStore.cupWithGold = cupWithGold;
					for (const cup of gameStore.cups) {
						render(
							cup.gold ? coinSprite : foolsGoldSprite,
							[cup.position.y, cup.position.x],
							screen,
						);
					}
					setScreenState(screen);
					console.log("delaying 3s");
					await delay(3000);
					console.log("done");
					gameStore.gameStartTime = performance.now();
				}

				gameStore.phase = "PLAYING";
				break;
			case "PLAYING":
				{
					if (currentLoopStartTime > gameStore.gameStartTime + ROUND_TIME) {
						//5 second round
						gameStore.phase = "SELECTION";
						break;
					}
					// for each of the cups move cup towards random position, take difference in x and y
					for (const cup of gameStore.cups) {
						// if currentTime is within half second of termination time give final corrediante positions
						if (
							// if destination is equal to position give new destination
							cup.destination.x === cup.position.x &&
							cup.destination.y === cup.position.y
						) {
							const randomX = gameStore.getRandomIntInclusive(20, 140);
							const randomY = gameStore.getRandomIntInclusive(20, 124);
							cup.destination.x = randomX;
							cup.destination.y = randomY;
						}
						const deltaX = cup.destination.x - cup.position.x;
						const deltaY = cup.destination.y - cup.position.y;
						const distanceToDestination = Math.sqrt(deltaX ** 2 + deltaY ** 2);
						// If the distance to the goal loaction is close then just jump there

						const y = (gameStore.speed * deltaY) / distanceToDestination;
						const x = (gameStore.speed * deltaX) / distanceToDestination;
						cup.position.x += x;
						cup.position.y += y;

						if (distanceToDestination < 5) {
							cup.position.x = cup.destination.x;
							cup.position.y = cup.destination.y;
						}
						render(
							foolsGoldSprite,
							[Math.floor(cup.position.y), Math.floor(cup.position.x)],
							screen,
						);
					}
				}
				break;
			case "SELECTION":
				{
					if (gameStore.wasButtonPressed("up")) {
						gameStore.currentSelection += 1;
						if (gameStore.currentSelection > 8) {
							gameStore.currentSelection = 0;
						}
					}
					if (gameStore.wasButtonPressed("down")) {
						gameStore.currentSelection -= 1;
						if (gameStore.currentSelection < 0) {
							gameStore.currentSelection = 8;
						}
					}
					if (gameStore.wasButtonPressed("enter")) {
						console.log("enter pressed");
						gameStore.level += 1;
						gameStore.speed += 3;
						gameStore.phase = "FINAL";
						break;
					}

					//Display selected fools gold
					for (const cup of gameStore.cups) {
						if (gameStore.cups[gameStore.currentSelection] === cup) {
							render(
								selectedFooldsGoldSprite,
								[Math.floor(cup.position.y), Math.floor(cup.position.x)],
								screen,
							);
						} else {
							render(
								foolsGoldSprite,
								[Math.floor(cup.position.y), Math.floor(cup.position.x)],
								screen,
							);
						}
					}
				}
				break;
			case "FINAL":
				{
					const cup = gameStore.cups.find((cup) => cup.gold)!;
					render(
						coinSprite,
						[Math.floor(cup.position.y), Math.floor(cup.position.x)],
						screen,
					);
					setScreenState(screen);

					if (gameStore.wasButtonPressed("enter")) {
						gameStore.phase = "SETUP";
						break;
					}
				}
				break;
		}
		setScreenState(screen);
		loop();
	}

	return (
		<div>
			{screenState.map((row) => (
				<div style={{ display: "flex", flexDirection: "row" }}>
					{row.map((pixel) => {
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

function initStore(gameStore: GameStore) {
	let xPos = 0;
	let yPos = 36;
	for (let i = 0; i < 9; i++) {
		xPos += 40;
		if (xPos >= 160) {
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
