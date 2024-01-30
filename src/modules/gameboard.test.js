import { Gameboard } from "./gameboard"
import { Ship } from "./battleship"

test('Create gameboard', () => {
  const game = new Gameboard()
  expect(game.board[0][0]).toBeNull()
  expect(game.board[9][9]).toBeNull()
})

describe('Place a ship', () => {
  afterAll(() => console.table(game.board))

  const game = new Gameboard()

  test('Up', () => {
    const carrier = new Ship(5)
    game.placeShip(carrier, 4, 4, true, 'up')
    expect(game.board[4][4]).toBe(carrier)
  })

  test('Down', () => {
    const carrier = new Ship(5)
    game.placeShip(carrier, 4, 5, true, 'down')
    expect(game.board[8][5]).toBe(carrier)
  })

  test('Left', () => {
    const battleship = new Ship(4)
    game.placeShip(battleship, 9, 9, false, 'left')
    expect(game.board[9][6]).toBe(battleship)
  })

  test('Right', () => {
    const battleship = new Ship(3)
    game.placeShip(battleship, 0, 0, false, 'right')
    expect(game.board[0][2]).toBe(battleship)
  })

  test('Up and out of bounds', () => {
    expect(() => game.placeShip(new Ship(3), 1, 9, true, 'up')).toThrow()
  })

  test('Down and out of bounds', () => {
    expect(() => game.placeShip(new Ship(3), 9, 0, true, 'down')).toThrow()
  })

  test('Left and out of bounds', () => {
    expect(() => game.placeShip(new Ship(3), 1, 0, false, 'left')).toThrow()
  })

  test('Right and out of bounds', () => {
    expect(() => game.placeShip(new Ship(3), 0, 9, false, 'right')).toThrow()
  })

  test('Invalid axis', () => {
    expect(() => game.placeShip(new Ship(3), 0, 9, false, 'east')).toThrow()
  })

  test('That overlaps to another', () => {
    expect(() => game.placeShip(new Ship(4), 3, 3, false, 'right')).toThrow()
  })

  test('In an occupied cell', () => {
    expect(() => game.placeShip(new Ship(2), 9, 6, true, 'up')).toThrow()
  })

  test('Check ships count', () => {
    expect(game.placedShips).toBe(4)
  })

})

describe('Attack a ship', () => {
  afterAll(() => {
    console.table(game.board)
  })

  const game = new Gameboard()
  game.placeShip(new Ship(5), 4, 4, true, 'up')
  game.placeShip(new Ship(2), 0, 0, true, 'down')
  const target = game.board[0][4]

  test('Hit a ship', () => {
    expect(game.receiveAttack(0, 4)).toBe("Hit!")
    expect(target.hits).toBe(1)
  })

  test('Miss an attack', () => {
    expect(game.receiveAttack(7, 4)).toBe('Missed!')
    expect(game.missedAttack).toBe(1)
  })

  test('Attack the same cell again', () => {
    expect(game.receiveAttack(0, 4)).toBe('Already attacked!')
  })

  test('Check if the ship sunk', () => {
    game.receiveAttack(1, 4)
    game.receiveAttack(2, 4)
    game.receiveAttack(3, 4)
    expect(game.receiveAttack(4, 4)).toBe('Ship sunked!')
    expect(game.sunkedShips).toBe(1)
  })

  test('Report if all the ships are sunk', () => {
    game.receiveAttack(0, 0)
    expect(game.receiveAttack(1, 0)).toBe('All ships sunked!')
  })
})
