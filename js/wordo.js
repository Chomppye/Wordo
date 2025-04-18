import { fetchWord } from "./modules/wordFetcher.js";
import { createRows, clearRows } from "./modules/createRows.js";

const menuBtn = document.querySelector("#menuBtn");
const hintBtn = document.querySelector("#hintBtn");
const restartBtn = document.querySelector("#restartBtn");

const wordoBoard = document.querySelector("#rows-container");
const wordoRows = wordoBoard.querySelector(".row");

let currentWord = [];
let typedWord = []
let selectedSquareAmount = 5;

let currentRow = 1;
let currentBox = 1;

function restart() {
    clearRows()
    currentWord = fetchWord(selectedSquareAmount)
    createRows(selectedSquareAmount)
}

function start() {
    currentWord = fetchWord(selectedSquareAmount)
    createRows(selectedSquareAmount)
}

function revealResults(results =[], row) {
    results.forEach((value, index) => {
        let updatedNumber = index + 1
        let currentSquare = document.getElementById(`${row}-${updatedNumber}`)
        
        switch(value) {
            case "correct":
                console.log("make green #A6FFA1")
                currentSquare.classList.add(`${value}`)
            break;

            case "present":
                console.log("make mountbatten pink #7D6F86")
                currentSquare.classList.add(`${value}`)
            break;

            case "absent":
                console.log("make gray #B5D2CB")
                currentSquare.classList.add(`${value}`)
            break;

            default:
                console.log("return")
            break;
        }
    })
}

function checkGuess(current, typed) {
    const result = [];
    const currentCopy = [...current];

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentWord[i]) {
            result[i] = "correct";
            currentCopy[i] = null;
        }
    }

    for (let i = 0; i < typed.length; i++) {
        if (result[i]) continue;

        const index = currentCopy.indexOf(typed[i])
        if (index !== -1) {
            result[i] = "present";
            currentCopy[index] = null;
        } else {
            result[i] = "absent";
        }
    }

    return result;
}

function keyTracking(event) {
    let keyPressed = event.key;

    if (/^[a-z]$/.test(keyPressed) && currentBox <= currentWord.length) {
        const activeBox = document.getElementById(`${currentRow}-${currentBox}`);
        activeBox.innerText = keyPressed.toUpperCase()
        activeBox.classList.add("text")
        typedWord.push(keyPressed)
        currentBox++
    }

    if (keyPressed === "Backspace" && currentBox > 1) {
        currentBox--
        const activeBox = document.getElementById(`${currentRow}-${currentBox}`);
        activeBox.innerText = ""
    } 

    if (keyPressed === "Enter" && (currentBox - 1) === currentWord.length) {
        let result = checkGuess(currentWord, typedWord)
        revealResults(result, currentRow)
        console.log(result)
        currentRow++
        if ((currentRow - 1) == 6) {
            console.log("pop up loss message")
        }
        currentBox = 1
        typedWord = []
    }

}

restartBtn.addEventListener("click", restart)

start()
console.log(currentWord)

document.addEventListener("keydown", keyTracking)