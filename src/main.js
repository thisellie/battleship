import 'modern-css-reset/src/reset.css'
import './styles/style.css'
import { Ship } from './modules/battleship'

const gameBoardContainer = document.querySelector('#gameboard-container')
const optionContainer = document.querySelector('.option-container ')
const flipButton = document.querySelector('#flip-button')

// Game options logic for flipping and starting buttons

let angle = 0

function flip () {
    const optionShips = Array.from(optionContainer.children)
    angle = angle === 0 ? 90 : 0
    optionShips.forEach(optionShips => optionShips.style.transform = `rotate(${angle}deg)`)
}

flipButton.addEventListener('click', flip)

// Creating gameboards for both players

const width = 10

function createBoard (color, user) {
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

const destroyer = new Ship(2)
const submarine = new Ship(3)
const cruiser = new Ship(3)
const battleship = new Ship(4)
const carrier = new Ship(5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

function addShipPiece() {
    const allBoardCells = document.querySelectorAll('#computer div')
}