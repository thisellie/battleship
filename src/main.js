import 'modern-css-reset/src/reset.css'
import './styles/style.css'
import { Ship } from './modules/battleship'

const gameBoardContainer = document.querySelector('#gameboard-container')
const optionContainer = document.querySelector('.option-container ')
const flipButton = document.querySelector('#flip-button')
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

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

function getValidity(allBoardCells, isHorizontal, startIndex, ship) {
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

  return { shipBlocks, valid, notTaken }
}

function addShipPiece(user, ship, startId) {
  const allBoardCells = document.querySelectorAll(`#${user} div`)
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = user === 'player' ? angle === 0 : randomBoolean
  let randomStartIndex = Math.floor(Math.random() * width * width)

  let startIndex = startId ? startId : randomStartIndex

  const { shipBlocks, valid, notTaken } = getValidity(allBoardCells, isHorizontal, startIndex, ship)

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name)
      shipBlock.classList.add('taken')
    })
  } else {
    if (user === 'computer') addShipPiece(user, ship, startId)
    else notDropped = true
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
  const ship = ships[draggedShip.id]
  highlightArea(e.target.id, ship)
}

function dropShip(e) {
  const startId = e.target.id
  const ship = ships[draggedShip.id]
  addShipPiece('player', ship, startId)

  if (!notDropped) draggedShip.remove()
}

// Add highlight
function highlightArea(startIndex, ship) {
  const allBoardCells = document.querySelectorAll('#player div')
  let isHorizontal = angle === 0

  const { shipBlocks, valid, notTaken } = getValidity(allBoardCells, isHorizontal, startIndex, ship)
  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add('hover')
      setTimeout(() => shipBlock.classList.remove('hover'), 500)
    })
  }
}

let gameOver = false
let playerTurn

function startGame() {
  if (optionContainer.children.length != 0) {
    infoDisplay.textContent = 'Please place all your pieces first!'
  } else {
    const allBoardCells = document.querySelectorAll('#computer div')
    allBoardCells.forEach(cell => cell.addEventListener('click', handleClick))
  }
}

startButton.addEventListener('click', startGame)

let playerHits = []
let computerHits = []

function handleClick(e) {

  if (!gameOver) {
    if (e.target.classList.contains('taken'))
      e.target.classList.add('boom')
    infoDisplay.textContent = 'You hit the computers ship!'
    let classes = Array.from(e.target.classList)
    classes = classes.filter(className => className !== 'cell')
    classes = classes.filter(className => className !== 'boom')
    classes = classes.filter(className => className !== 'taken')
    playerHits.push(...classes)

  }

  if (e.target.classList.contains('taken')) {
    infoDisplay.textContent = 'Nothing it this time.'
    e.target.classList.add('miss')
  }

  playerTurn = false
  const allBoardCells = document.querySelectorAll('#computer div')
  allBoardCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)))
  setTimeout(computerGo, 3000)
}

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers Go!'
    infoDisplay.textContent = 'The computer is thinking...'

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width)
      const allBoardCells = document.querySelectorAll('#player div')

      if (allBoardCells[randomGo].contains('taken') &&
        allBoardCells[randomGo].contains('boom')
      ) {
        computerGo()
        return
      } else if (
        allBoardCells[randomGo].contains('taken') &&
        allBoardCells[randomGo].contains('boom')) {
        allBoardCells[randomGo].add('boom')
        infoDisplay.textContent = 'The computer hit your ship!'
        let classes = Array.from(e.target.classList)
        classes = classes.filter(className => className !== 'cell')
        classes = classes.filter(className => className !== 'boom')
        classes = classes.filter(className => className !== 'taken')
        computerHits.push(...classes)
      } else {
        infoDisplay.textContent = 'Nothing hit this time...'
        allBoardCells[randomGo].classList.add('miss')
      }
    }, 3000)

    setTimeout(() => {
      playerTurn = true
      turnDisplay.textContent = 'Your turn!'
      infoDisplay.textContent = 'Please take a turn.'
      const allBoardCells = document.querySelectorAll('#computer div')
      allBoardCells.forEach(block => block.addEventListener('click', handleClick))
    }, 6000);
  }
}