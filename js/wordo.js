import { fetchWord } from "./modules/wordFetcher.js"

const menuBtn = document.querySelector("#menuBtn")
const hintBtn = document.querySelector("#hintBtn")
const restartBtn = document.querySelector("#restartBtn")

console.log(fetchWord(8))
