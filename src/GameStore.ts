import { makeAutoObservable } from 'mobx';


// One of four colors
export type Pixel = 0 | 1 | 2 | 3;
export interface Cup {
  gold: boolean; // Fools Gold = False / Real Gold = True
}


export class GameStore {

  // The position of the cup is its index within the array
  cups: Cup[] = [];
  selectedCup: number = 0;
  gameArray: Pixel[][] = [];
  level: number = 1;

  constructor() {
    makeAutoObservable(this);
  }
}
