export class Gameboard {

  missedAttack = 0
  sunkedShips = 0
  placedShips = 0
  #attackedCells = new Set()

  constructor() {
    // Initialize array of arrays with empty cells
    this.board = Array.from(Array(10), () => Array(10).fill(null))
  }

  placeShip(ship, row, col, vertical, axis) {
    const length = ship.length

    // Check if the placement is within the board boundaries
    switch (axis) {
      case 'up':
        if (vertical && row - length > 10)
          throw new Error('Ship placement out of bounds')
        break
      case 'down':
        if (vertical && row + length > 10)
          throw new Error('Ship placement out of bounds')
        break
      case 'left':
        if (!vertical && col - length < 0)
          throw new Error('Ship placement out of bounds')
        break;
      case 'right':
        if (!vertical && col + length > 10)
          throw new Error('Ship placement out of bounds')
        break;
      default:
        throw new Error('Invalid axis')
    }

    // Check if the cells are already occupied
    for (let i = 0; i < length; i++) {
      if (vertical) {
        if (axis === 'up' && this.board[row - i][col] !== null)
          throw new Error('Cell already occupied')
        else if (axis === 'down' && this.board[row + i][col] !== null)
          throw new Error('Cell already occupied')
      } else {
        if (axis === 'left' && this.board[row][col - i] !== null)
          throw new Error('Cell already occupied')
        else if (axis === 'right' && this.board[row][col + i] !== null)
          throw new Error('Cell already occupied')
      }

    }

    // Place the ship on the board
    for (let i = 0; i < length; i++) {
      if (vertical)
        if (axis === 'up') this.board[row - i][col] = ship
        else this.board[row + i][col] = ship
      else
        if (axis === 'left') this.board[row][col - i] = ship
        else this.board[row][col + i] = ship
    }

    this.placedShips++
  }

  receiveAttack(row, col) {
    // Checks the cell if it has already been attacked 
    if (this.#attackedCells.has(`${row}-${col}`))
      return 'Already attacked!'

    const ship = this.board[row][col]

    if (ship === null) {
      this.missedAttack++
      this.#attackedCells.add(`${row}-${col}`)
      return 'Missed!'
    }

    ship.hit()

    // Checks if the a ship is sunked then counts it and if all sinks are sunked
    if (ship.isSunk()) {
      this.sunkedShips++
      this.#attackedCells.add(`${row}-${col}`)
      if (this.sunkedShips === this.placedShips) return 'All ships sunked!'
      else return 'Ship sunked!'
    } else {
      this.#attackedCells.add(`${row}-${col}`)
      return 'Hit!'
    }
  }
}