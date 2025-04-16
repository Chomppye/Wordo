import { fetchWord } from "./modules/wordFetcher.js"
import { createRows, clearRows } from "./modules/createRows.js"

const menuBtn = document.querySelector("#menuBtn")
const hintBtn = document.querySelector("#hintBtn")
const restartBtn = document.querySelector("#restartBtn")

let currentWord = []
let selectedSquareAmount = 5

function restart() {
    clearRows()
    currentWord = fetchWord(selectedSquareAmount)
    createRows(selectedSquareAmount)
}

function start() {
    currentWord = fetchWord(selectedSquareAmount)
    createRows(selectedSquareAmount)
}

restartBtn.addEventListener("click", restart)

start()
console.log(currentWord)
