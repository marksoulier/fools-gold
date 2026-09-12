import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import {gameStore} from './GameStore'


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
