/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */
import { useEffect, useState } from "react";
import "./App.css";
import coinPNG from "../src/assets/coin.png";
import {gameStore} from './GameStore'

function App() {
	const [coinPixelState, setCoinPixelState] = useState<number[][][]>([]);

	useEffect(() => {
		const img = new Image(24, 24);
		console.log("test");
		img.onload = () => {
			console.log("onload");
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
				console.log("yo");
			}
			const pixels: number[][][] = [];
			for (let i = 0; i < pixelsFlat.length / 24; i++) {
				const row: number[][] = [];
				for (let j = 0; j < 24; j++) {
					const index = i * 24 + j;
					row.push(pixelsFlat[index]);
				}
				pixels.push(row);
			}		setCoinPixelState(pixels);
		};
		img.src = coinPNG;
	}, []);

	return (
		<div>
			{coinPixelState.map((row) => (
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




function GameLoop() {
  // State to keep track of vizualization, downClicked
  // State to keep track of each button press, returnClicked, upClicked, downClicked

  //game loop always going
  while (true) {
    let currentTime = performance.now() // Current time of the round loop
    // Level, in mobx store
    const speed = 144 + gameStore.level * 5; //number of pixals to move along
    // Set number of cups dependent on level
    gameStore.cups.forEach()

    // single round logic

    ///////DISPLAY PHASE /////////

    //randomly select n number of cups to have gold, display gold
    const 



  
    ///////MOVING PHASE ///////// 


    const roundTime = 5 // 5 seconds is how long they are all moving around the screen
    const roundStartTime = performance.now() //Getting the start time of the round loop
    while (currentTime < roundStartTime + roundTime*1000) {
      // Keep array of destinations of each cup
      // for each of the cups move cup towards random position, take difference in x and y
      for cup in cups:
        const deltaX = 
        const deltaY = 
        const distanceToDestination = Math.sqrt(deltaX**2 + deltaY**2);
        const y = speed*deltaX/distanceToDestination
        const x = speed*deltaY/distanceToDestination
      // if at final position give a new final position
      // if currentTime is within half second of termination time give final corrediante positions
      

      return {
        //vizualizations
      }
    }

    ///////SELECTION PHASE /////////


    return {
      //vizualizations
    }
  }
}

	

export default App;
