/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */
import { useEffect, useState } from "react";
import "./App.css";
import coinPNG from "../src/assets/coin.png";
import foolPNG from "../src/assets/fools_gold.png";
import { gameStore } from "./GameStore";

const delay: (arg0: number) => Promise<null> = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const FRAMERATE = 30;

const loadSprite = (src: string) => {
	const img = new Image(24, 24);
	const pixels: number[][][] = [];
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
	};
	img.src = src;
	return pixels;
};

const coinSprite = loadSprite(coinPNG);
const foolsGoldSprite = loadSprite(foolPNG);

function App() {
	const [coinPixelState, setCoinPixelState] = useState<number[][][]>([]);
	const [screenState, setScreenState] = useState<number[][][]>([]);

	const gameLoop = async () => {
		while (true) {
			await delay(1000 / FRAMERATE);
		}
	};

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

export default App;
