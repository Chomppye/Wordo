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
    clearRows();
    currentWord = fetchWord(selectedSquareAmount);
    console.log(currentWord)
    createRows(selectedSquareAmount);
    currentRow = 1;
    currentBox = 1;
    typedWord = [];
}

function start() {
    currentWord = fetchWord(selectedSquareAmount)
    createRows(selectedSquareAmount)
}

function revealResults(results = [], row) {
    results.forEach((value, index) => {
        let updatedNumber = index + 1;
        let currentSquare = document.getElementById(`${row}-${updatedNumber}`);
        
        if (!currentSquare) {
            console.error(`Element not found: ${row}-${updatedNumber}`);
            return;
        }

        try {
            switch(value) {
                case "correct":
                    currentSquare.classList.add(value);
                    break;
                case "present":
                    currentSquare.classList.add(value);
                    break;
                case "absent":
                    currentSquare.classList.add(value);
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.error("Error adding class:", e, "to element:", currentSquare);
        }
    });
}

function checkForWin(result = []) {
    return result.every(value => value === "correct");
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
        if (activeBox) {
            activeBox.innerText = keyPressed.toUpperCase()
            activeBox.classList.add("text")
            typedWord.push(keyPressed)
            currentBox++
        }
    }

    if (keyPressed === "Backspace" && currentBox > 1) {
        currentBox--
        const activeBox = document.getElementById(`${currentRow}-${currentBox}`);
        if (activeBox) {
            activeBox.innerText = ""
            typedWord.pop()
        }
    } 

    if (keyPressed === "Enter" && (currentBox - 1) === currentWord.length) {
        let result = checkGuess(currentWord, typedWord)
        revealResults(result, currentRow)
        let won = checkForWin(result)

        if (won) {
            console.log("stop playing")
            restart()
            return;
        }

        currentRow++
        if ((currentRow - 1) == 6) {
            console.log("pop up loss message")
        }
        currentBox = 1
        typedWord = []
    }

}

document.addEventListener("DOMContentLoaded", () => {
    start()
    restartBtn.addEventListener("click", restart);
    document.addEventListener("keydown", keyTracking)
    console.log(currentWord)
})
