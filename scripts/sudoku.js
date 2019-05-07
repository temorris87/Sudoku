let boardWidth = 9;
let divBoard = document.querySelector('#board');

let defaultBoard = [['4', ' ', '8', ' ', ' ', '7', '2', ' ', '1'],
                    [' ', '3', ' ', ' ', '8', ' ', '9', ' ', ' '],
                    ['6', '7', '5', ' ', '1', ' ', ' ', '3', ' '],
                    [' ', '5', ' ', ' ', ' ', '4', ' ', '2', '3'],
                    ['3', ' ', ' ', '5', ' ', ' ', '1', '6', ' '],
                    [' ', ' ', ' ', ' ', ' ', ' ', '7', ' ', '5'],
                    [' ', ' ', '3', '9', ' ', ' ', ' ', ' ', '7'],
                    [' ', ' ', '1', '7', '6', '3', ' ', '4', ' '],
                    ['5', ' ', ' ', ' ', '4', '2', '3', ' ', '9']];

class Cell {
    constructor(id, element) {
        this.id = id;
        this.number = 0;
        this.element = element;
        this.notes = [false, false, false, false, false, false, false, false, false];
    }
}

class Board {
    constructor() {
        this.cellsFilled = 0;
        this.targetCell = null;
        this.createCells();
        this.initBoard(defaultBoard);
    }

    addDividingLines() {
        for (let j = 0; j < boardWidth; j++) {
            let id = 'cell-3' + j.toString();
            this[id].element.classList.add('top');

            id = 'cell-5' + j.toString();
            this[id].element.classList.add('bottom');
        }

        for (let i = 0; i < boardWidth; i++) {
            let id = 'cell-' + i.toString() + '3';
            this[id].element.classList.add('left');

            id = 'cell-' + i.toString() + + '5';
            this[id].element.classList.add('right');
        }
    }

    isBoardFilled() {
        return this.cellsFilled === 81;
    }

    initBoard(board) {
        let currentCell;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                currentCell = this.getCell(i, j);
                currentCell.number = board[i][j];

                if (board[i][j] === ' ') {
                    currentCell.element.classList.add('default');
                }
                else {
                    this.cellsFilled++;
                }
            }
        }
        this.setTargetCell(this.getCell(0, 0));
        this.redrawEntireBoard();
    }

    getCell(i, j) {
        return this[`cell-${i}${j}`];
    }

    createCell(i, j) {
        let id = 'cell-' + i.toString() + j.toString();
        let element = document.createElement('div');

        element.id = id;
        element.classList.add('cell');
        divBoard.appendChild(element);

        this[id] = new Cell(id, element);
    }

    createCells() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.createCell(i, j);
            }
        }
        this.addDividingLines();
    }

    redrawEntireBoard() {
        let currentCell;
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardWidth; j++) {
                currentCell = this.getCell(i, j);
                if (currentCell.number !== 0) {
                    currentCell.element.innerText = currentCell.number.toString();
                }
            }
        }
    }

    setTargetCell(cell) {
        if (this.targetCell) {
            this.targetCell.element.classList.remove('target');
        }
        this.targetCell = cell;
        cell.element.classList.add('target');
        this.redrawEntireBoard();
    }
}

board = new Board();