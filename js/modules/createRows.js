const rowDiv = document.querySelector("#rows-container")

export function createRows(perRow = 4) {
    for (let i = 1; i < 7; i++) {
           for (let j = 0; j < perRow; j++) {
            let newDiv = document.createElement("div")
            newDiv.classList.add("box")
            newDiv.classList.add(`rows-${perRow}`)
            newDiv.classList.add(`scale-${perRow}`)
            newDiv.id =`${i}-${j + 1}`
            rowDiv.appendChild(newDiv)
        }
    }
}

export function clearRows() {
    let divs = rowDiv.querySelectorAll(".box")
    divs.forEach((div, index) => {
        div.remove()
    })
}

