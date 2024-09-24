var gBoard
var levels = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 14 }, { SIZE: 12, MINES: 32 }]
var gLevel
var freeToMove
var firstClickIndicetor
var lives

function onInit(userOption) {
    gLevel = levels[userOption]
    gBoard = []
    freeToMove = true
    firstClickIndicetor = false
    lives = 3
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
                isMarked: false
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
                    strHTML += `<td class="bomb">💣</td>`
                }
                else if (cell.isMarked) {
                    strHTML += `<td class="cellMarked" oncontextmenu = "onCellMarked(this,${i},${j})" onClick="onCellClicked(this,${i},${j})"> ⚑</td>`
                }
                else if (!cell.isShown) {
                    strHTML += `<td class="cellHide" oncontextmenu = "onCellMarked(this,${i},${j})" onClick="onCellClicked(this,${i},${j})"></td>`
                }
                else {
                    if (gBoard[i][j].minesAroundCount === 0) {
                        strHTML += `<td class="cellShown"></td>`
                    }
                    else {
                        strHTML += `<td class="cellShown">${gBoard[i][j].minesAroundCount}</td>`
                    }
                }
            }
            strHTML += '</tr>'
        }
        elBoard.innerHTML = strHTML
    }
    var elLives = document.querySelector('.lives')
    elLives.innerText = 'lives : ' + lives
    var checkVictory = checkGameOver()
    if (checkVictory === true) {
        alert('You won!')
        var elButton = document.querySelector('span')
        elButton.innerText = '😎'
        freeToMove = false
        return
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
    if (i < 0 || i >= gLevel.SIZE || j < 0 || j >= gLevel.SIZE || gBoard[i][j].isShown) {
        return
    }
    gBoard[i][j].isShown = true
    if (!firstClickIndicetor) {
        createRandomMines((gBoard))
        setMinesNegsCount(gBoard)
    }
    if (gBoard[i][j].isMine) {
        var elButton = document.querySelector('span')
        elButton.innerText = '🤯'
        alert('You stepped on a mine')
        setTimeout(() => {
            elButton.innerText = '😃'
        }, 3000)
        if (lives < 1) {
            freeToMove = false
            return
        }
        lives--
    }
    else if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    }
    renderBoard(gBoard)
}

function expandShown(gBoard, elCell, i, j) {
    for (var iOffSet = -1; iOffSet <= 1; iOffSet++) {
        for (var jOffSet = -1; jOffSet <= 1; jOffSet++) {
            if (i + iOffSet >= 0 && i + iOffSet < gLevel.SIZE && j + jOffSet >= 0 && j + jOffSet < gLevel.SIZE) {
                if (gBoard[i][j].isShown === true && !gBoard[i][j].isMine) {
                    onCellClicked(elCell, i + iOffSet, j + jOffSet)
                }
            }
        }
    }
}

function checkGameOver() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                if (!gBoard[i][j].isMarked) {
                    return false
                }
            }
            else {
                if (!gBoard[i][j].isShown) {
                    return false
                }
            }
        }
    }
    return true
}

function onCellMarked(ev, i, j) {
    window.oncontextmenu = function () {
        if (!gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = true
            renderBoard(gBoard)
        }
        else {
            gBoard[i][j].isMarked = false
            gBoard[i][j].isShown = false
            renderBoard(gBoard)
        }
        return false
    }, false
}