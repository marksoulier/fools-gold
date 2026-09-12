import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import {GameStore, gameStore, type Cup} from './GameStore'

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function initStore(gameStore: GameStore) {
  let xPos = 0;
  let yPos = 36;
  for (let i=0; i < 9; i++) {
    xPos += 40;
    if (xPos > 160) {
      xPos = 40;
      yPos += 36;
    }
    const acup: Cup = {
        gold: false, // Fools Gold = False / Real Gold = True
        position: {x:xPos, y:yPos},
        destination: {x:xPos, y:yPos},
        origin: {x:xPos, y:yPos}
    }
    gameStore.cups.push(acup)
  }
}

function GameLoop() {
  // State to keep track of vizualization, downClicked
  // State to keep track of each button press, returnClicked, upClicked, downClicked

  initStore(gameStore);

  //game loop always going
  while (true) {
    let currentTime = performance.now() // Current time of the round loop
    // Level, in mobx store
    const speed = 2 + gameStore.level * 3; //number of pixals to move along
    // Set number of cups dependent on level
    // 1 gold, if level above 3 then 2 gold, if level about 6 then 3 gold
    const cupWithGold = getRandomIntInclusive(0,8);
    gameStore.cups[cupWithGold].gold = true;

    // single round logic

    ///////DISPLAY PHASE /////////

    //Run for 3 seconds showing them the gold before hidding
    const displayStartTime = performance.now()
    while (currentTime < displayStartTime + 3*1000) {
      currentTime = performance.now();
    }
    gameStore.hiddenMode = true;
  
    ///////MOVING PHASE ///////// 

    const roundTime = 5 // 5 seconds is how long they are all moving around the screen
    const roundStartTime = performance.now() //Getting the start time of the round loop
    while (currentTime < roundStartTime + roundTime*1000) {
      // Keep array of destinations of each cup
      // for each of the cups move cup towards random position, take difference in x and y
      for (const cup of gameStore.cups) {
        // if destination is equal to position give new destination
        if (cup.destination.x === cup.position.x && cup.destination.y === cup.position.y) {
          const randomX = getRandomIntInclusive(20,140);
          const randomY = getRandomIntInclusive(20,124);
          cup.destination.x = randomX;
          cup.destination.y = randomY;
        }

        const deltaX = cup.destination.x - cup.position.x
        const deltaY = cup.destination.y - cup.position.y 
        const distanceToDestination = Math.sqrt(deltaX**2 + deltaY**2);
        const y = speed*deltaX/distanceToDestination
        const x = speed*deltaY/distanceToDestination
        cup.position.x += x;
        cup.position.y += y;
      }
      // if currentTime is within half second of termination time give final corrediante positions
      
      currentTime = performance.now();
    }

    ///////SELECTION PHASE /////////
    let correctSelection = false;
  
    gameStore.selectedCup = 0;

    while(true) {
      if (gameStore.pressingEnter) {
        break;
      }
    }
    gameStore.hiddenMode = false;

    // If selected the correct cup that is gold then good
    if (gameStore.selectedCup === cupWithGold) {
      correctSelection = true;
    }


    if (correctSelection) {
      gameStore.level += 1;
    } else {
      return;
    }
  }
}


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
