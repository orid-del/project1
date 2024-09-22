var gBoard = []
var gLevel = { SIZE: 8, MINES: 4 }
var freeToMove = true
var firstClickIndicetor = false
var lives = 3
function onInit() {
    buildBoard()
    renderBoard(gBoard)
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            console.log('cell [', i, '] [', j, '] has ', gBoard[i][j].minesAroundCount, ' mines around')
        }
    }
}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
        }
    }
    return gBoard
}

function createRandomMines(gBoard) {
    if (!firstClickIndicetor) {
        for (var i = 0; i < gLevel.MINES; i++) {
            var randomXLocation = Math.floor(Math.random() * (gLevel.SIZE))
            var randomYLocation = Math.floor(Math.random() * (gLevel.SIZE))
            gBoard[randomXLocation][randomYLocation].isMine = true
        }
    }
    firstClickIndicetor = true
}

function renderBoard(gBoard) {
    if (freeToMove) {


        var elBoard = document.querySelector('table')
        var strHTML = ''
        for (var i = 0; i < gBoard.length; i++) {
            strHTML += '<tr>'
            for (var j = 0; j < gBoard[0].length; j++) {
                var cell = gBoard[i][j]
                if (cell.isMine && cell.isShown) {
                    strHTML += `<td class="bomb"></td>`
                }
                else if (!cell.isShown) {
                    strHTML += `<td class="cellHide" onClick="onCellClicked(this,${i},${j})"></td>`
                }
                else {
                    if (gBoard[i][j].minesAroundCount === 0 ) {
                        strHTML += `<td class="cellShown"></td>`
                    }
                    else{
                        strHTML += `<td class="cellShown">${gBoard[i][j].minesAroundCount}</td>`
                    }

                }
            }
            strHTML += '</tr>'
        }
        elBoard.innerHTML = strHTML
    }
}

function setMinesNegsCount(gBoard) {
    for (var x = 0; x < gLevel.SIZE; x++) {
        for (var y = 0; y < gLevel.SIZE; y++) {
            if (gBoard[x][y].isMine) {
                console.log('cell [', x, '] [', y, '] is mine!')
                continue
            }
            for (var i = x - 1; i <= x + 1; i++) {
                if (i < 0 || i >= gBoard.length) continue
                for (var j = y - 1; j <= y + 1; j++) {
                    if (j < 0 || j >= gBoard[0].length) continue
                    if (i === x && j === y) continue
                    if (gBoard[i][j].isMine === true) {
                        gBoard[x][y].minesAroundCount++
                    }
                }
            }
        }
    }
    firstClickIndicetor = true
}

function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    if (!firstClickIndicetor) {
        createRandomMines((gBoard))
        setMinesNegsCount(gBoard)
    }
    renderBoard(gBoard)
    if (gBoard[i][j].isMine) {
        var elButton = document.querySelector('span')
        elButton.innerText = '🤯'
        alert('You stepped on a mine')
        setTimeout(() => {
            elButton.innerText = '😃'
        }, 3000)
        if (lives === 1) {
            freeToMove = false
        }
        lives--
    }
    else if(gBoard[i][j].minesAroundCount === 0 ){
        for (var iOffSet = -1 ; iOffSet <= 1 ; iOffSet++ ){
            for (var jOffSet = -1 ; jOffSet <= 1 ; jOffSet++){
                if (i + iOffSet >= 0 && i +iOffSet < gLevel.SIZE && j + jOffSet >= 0 && j +jOffSet <gLevel.SIZE){
                    if (gBoard[i][j].isShown  && !gBoard[i][j].isMine ){
                        onCellClicked(elCell,i + iOffSet , j +jOffSet)   
                    }
                }
            }
        }
    }


}


