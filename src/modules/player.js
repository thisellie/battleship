import { Gameboard } from "./gameboard";

export default class Player extends Gameboard {
  constructor() {
    super()
    this.turn = false
  }
}