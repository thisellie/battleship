import { Gameboard } from "./gameboard";

export class Player extends Gameboard {
  constructor() {
    super()
    this.turn = false
  }
}