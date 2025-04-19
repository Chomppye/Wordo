import { fetchWord } from "./modules/wordFetcher.js";
import { createRows, clearRows } from "./modules/createRows.js";

const menuBtn = document.querySelector("#menuBtn");
const hintBtn = document.querySelector("#hintBtn");
const restartBtn = document.querySelector("#restartBtn");
const closeBtn = document.querySelector(".close-btn")
const yesBtn = document.querySelector("#yesBtn")
const noBtn = document.querySelector("#noBtn")

const wordoBoard = document.querySelector("#rows-container");
const wordoRows = wordoBoard.querySelector(".row");
const popUpContainer = document.querySelector(".modal-content")
const restartPopUpContainer = document.querySelector(".restart-query")

let currentWord = [];
let typedWord = []
let selectedSquareAmount = 5;

let currentRow = 1;
let currentBox = 1;

function hintPopUp() {
    if (typedWord.length !== currentWord.length) {
        const unguessedLetters = currentWord.filter((letter, index) => {
            return !typedWord[index] || typedWord[index] !== letter;
        });
    
        if (unguessedLetters.length > 0) {
            const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
            const hintLetter = unguessedLetters[randomIndex];
            
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] === hintLetter && 
                    (!typedWord[i] || typedWord[i] !== hintLetter)) {
                    
                    const box = document.getElementById(`${currentRow}-${i + 1}`);
                    if (box && !box.classList.contains("correct")) {
                        box.innerText = hintLetter.toUpperCase();
                        box.classList.add("text", "hint");
                        break;
                    }
                }
            }
        }
        hintBtn.style.display = "none";
    }
}

function forceRestart() {
    clearRows();
    currentWord = fetchWord(selectedSquareAmount);
    console.log(currentWord)
    createRows(selectedSquareAmount);
    currentRow = 1;
    currentBox = 1;
    typedWord = [];
    hintBtn.style.display = "block"
}

function yesRestart() {
    clearRows();
    currentWord = fetchWord(selectedSquareAmount);
    console.log(currentWord)
    createRows(selectedSquareAmount);
    currentRow = 1;
    currentBox = 1;
    typedWord = [];

    restartPopUpContainer.style.display = "none"
    restartBtn.style.display = "block"
    hintBtn.style.display = "block"
}

function noRestart() {
    restartPopUpContainer.style.display = "none"
    restartBtn.style.display = "block"
}

function queryRestart() {
    if (currentRow !== 1) {
        restartPopUpContainer.style.display = "flex"
        restartBtn.style.display = "none"
    }
}

function winScreen() {
    let text = popUpContainer.querySelector(".centered-text");
    let dynamicText = currentRow === 1 ? "try!": "tries!"
    text.innerText = `Congratulations, you got it right in ${currentRow} ${dynamicText}`
    document.querySelector(".modal").style.display = "flex"
}

function loseScreen() {
    let text = popUpContainer.querySelector(".centered-text");
    text.innerText = `Good try, the correct word was ${currentWord.join("")}`
    document.querySelector(".modal").style.display = "flex"
}

function closePopUp() {
    document.querySelector(".modal").style.display = "none"
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
            winScreen()
            forceRestart()
            return;
        }

        currentRow++
        if ((currentRow - 1) == 6) {
            console.log("pop up loss message")
            loseScreen()
            forceRestart()
            return
        }
        currentBox = 1
        typedWord = []
    }

}

document.addEventListener("DOMContentLoaded", () => {
    start()
    restartBtn.addEventListener("click", queryRestart);
    hintBtn.addEventListener("click", hintPopUp);
    document.addEventListener("keydown", keyTracking);
    closeBtn.addEventListener("click", closePopUp);
    yesBtn.addEventListener("click", yesRestart);
    noBtn.addEventListener("click", noRestart);
    console.log(currentWord);
})
