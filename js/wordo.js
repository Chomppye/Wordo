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
    if (typedWord.length > 0) { // if the user typed more than 1 letter

        //see how many letters the user has typed into the current row
        let currentGuess = typedWord.length
        //if the user typed less than the max amount
        if (currentGuess < currentWord.length) {
            let currentWordClone = [...currentWord]
            // only give one hint from those indexes
             // do the currentGuess minus the currentWord length
            let availableIndexs = currentGuess - currentWord.length
            // using that number get the last values starting from the back
            let availableHints = currentWordClone.splice(availableIndexs)
            console.log(availableHints)
            // example word fluffy | current guess = flu | 
            // flu - fluffy = 3
            // first get y then f then another f
            // then choose a random letter from the three to give the hint
            let random = Math.floor(Math.random() * availableHints.length)
            let hint = availableHints[random]
            console.log(hint)
            // so if 2 is chosen the f before the ys div index is turned green
            for (let i = availableHints.length - 1; i > 0; i--) {
                if (currentWord[i] === hint) {
                    const box = document.getElementById(`${currentRow}-${i + 1}`);

                    if (box && !box.classList.contains("correct")) {
                        box.innerText = hint.toUpperCase();
                        box.classList.add("text")
                        box.classList.add("hint")
                        break;
                    }
                }
            }
            hintBtn.style.display = "none"
        }
        // else
        //gather all of the typed letters and pick a random one to give a hint for

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
