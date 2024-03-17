import 'modern-css-reset/src/reset.css'
import './styles/style.css'
import { Ship } from './modules/battleship'

const gameBoardContainer = document.querySelector('#gameboard-container')
const optionContainer = document.querySelector('.option-container ')
const flipButton = document.querySelector('#flip-button')

// Game options logic for flipping and starting buttons

let angle = 0

function flip() {
  const optionShips = Array.from(optionContainer.children)
  angle = angle === 0 ? 90 : 0
  optionShips.forEach(optionShips => optionShips.style.transform = `rotate(${angle}deg)`)
}

flipButton.addEventListener('click', flip)

// Creating gameboards for both players

const width = 10

function createBoard(color, user) {
  const boardContainer = document.createElement('div')
  boardContainer.classList.add('game-board')
  boardContainer.style.backgroundColor = color
  boardContainer.id = user

  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.id = i
    boardContainer.append(cell)
  }

  gameBoardContainer.append(boardContainer)
}

createBoard('yellow', 'player')
createBoard('pink', 'computer')

// Creating ships to be placed within the board

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]
let notDropped

function addShipPiece(user, ship, startId) {
  const allBoardCells = document.querySelectorAll(`#${user} div`)
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = user === 'player' ? angle === 0 : randomBoolean
  let randomStartIndex = Math.floor(Math.random() * width * width)

  let startIndex = startId ? startId : randomStartIndex

  let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex :
    width * width - ship.length :
    startIndex <= width * width - width * ship.length ? startIndex :
      startIndex - ship.length * width + width

  let shipBlocks = []

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardCells[Number(validStart) + i])
    } else {
      shipBlocks.push(allBoardCells[Number(validStart) + i * width])
    }
  }

  let valid

  if (isHorizontal) {
    shipBlocks.every((_shipBlock, index) =>
      valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
  } else {
    shipBlocks.every((_shipBlock, index) =>
      valid = shipBlocks[0].id < 90 + (width * index + 1))
  }

  const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name)
      shipBlock.classList.add('taken')
    })
  } else {
    if (user === 'computer') addShipPiece('computer', ship, startId)
    if (user === 'player') notDropped = true
  }
}

ships.forEach(ship => addShipPiece('computer', ship))

// Drag player ships
let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener('dragover', dragOver)
  playerBlock.addEventListener('drop', dropShip)
})

function dragStart(e) {
  notDropped = false
  draggedShip = e.target
}

function dragOver(e) {
  e.preventDefault()
}

function dropShip(e) {
  const startId = e.target.id
  const ship = ships[draggedShip.id]
  addShipPiece('player', ship, startId)

  if (!notDropped) draggedShip.remove()
}