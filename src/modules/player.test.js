import { Player } from "./player"

test('Create a player', () => {
  const player = new Player()
  expect(player.turn).toBe(false)
})