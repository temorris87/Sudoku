let boardWidth = 9;
let divBoard = document.querySelector('#board');

class Cell {
    constructor(id, element) {
        this.id = id;
        this.element = element;
        this.notes = [false, false, false, false, false, false, false, false, false];
    }
}

class Board {
    constructor() {
        this.createCells();
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
}

board = new Board();