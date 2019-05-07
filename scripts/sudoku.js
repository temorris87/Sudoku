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
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.id = this.getCellId(i, j);
        this.number = 0;
        this.element = document.createElement('div');

        this.element.id = this.id;
        this.element.classList.add('cell');

        this.notes = [false, false, false, false, false, false, false, false, false];
    }

    getCellId() {
        return `cell-${this.i}${this.j}`;
    }

    static getCellId(i, j) {
        return `cell-${i}${j}`;
    }

    static getCellIndices(cellId) {
        return { i: cellId[5], j: cellId[6] };
    }
}

class Board {
    constructor() {
        this.cellsFilled = 0;
        this.targetCell = null;
        this.createCells();
        this.initBoard(defaultBoard);
        this.startEventListeners();
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
                currentCell = this[Cell.getCellId(i, j)];
                currentCell.number = board[i][j];
                divBoard.appendChild(currentCell.element);

                if (board[i][j] === ' ') {
                    currentCell.element.classList.add('default');
                }
                else {
                    this.cellsFilled++;
                }
            }
        }
        this.redrawEntireBoard();
    }

    createCells() {
        let cell;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cell = new Cell(i, j);
                this[cell.id] = cell;
            }
        }
        this.addDividingLines();
    }

    redrawEntireBoard() {
        let currentCell;
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardWidth; j++) {
                currentCell = this[Cell.getCellId(i, j)];
                if (currentCell.number !== 0) {
                    currentCell.element.innerText = currentCell.number.toString();
                }
            }
        }
    }

    moveTargetCell(direction) {

    }

    setTargetCell(cell) {
        if (cell.classList.contains('cell')) {
            if (this.targetCell) {
                this.targetCell.element.classList.remove('target');
            }
            this.targetCell = this[cell.id];
            this.targetCell.element.classList.add('target');
        }
    }

    startEventListeners() {
        let body = document.querySelector('body');

        // Add key events for moving the target square around.
        body.addEventListener('mouseover', (event) => {
            if (event.target.classList.contains('cell')) {
                this.targetCell = this[event.target.id];
                this.targetCell.element.classList.add('target');

                if (event.target.classList.contains('default')) {
                    this.targetCell.element.innerText = '|';
                    this.targetCell.element.classList.add('blinking');
                }
            }
        });

        body.addEventListener('mouseout', (event) => {
            if (event.target.classList.contains('cell')) {
                event.target.classList.remove('target');
                event.target.classList.remove('blinking');
                this.targetCell.element.innerText = this[event.target.id].number;
                this.targetCell = null;
            }
        });
    }
}

board = new Board();