import { Ship } from './battleship'

test('Create ship with length 4', () => {
  const battleship = new Ship(4)
  expect(battleship.length).toBe(4)
  expect(battleship.hits).toBe(0)
  expect(battleship.sunk).toBe(false)
})

test('Hit ship', () => {
  const battleship = new Ship(4)
  battleship.hit()
  expect(battleship.hits).toEqual(1)
})

test('Sink ship', () => {
  const battleship = new Ship(4)
  battleship.hit()
  battleship.hit()
  battleship.hit()
  battleship.hit()
  battleship.isSunk()
  expect(battleship.sunk).toBe(true)
})