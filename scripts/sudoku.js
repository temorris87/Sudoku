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

    createCell(id) {
        let element = document.createElement('div');
        element.id = id;
        element.classList.add('cell');
        divBoard.appendChild(element);

        this[id] = new Cell(id, element);
    }

    createCells() {
        let id;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                id = 'cell-' + i.toString() + j.toString();
                this.createCell(id);
            }
        }
    }
}

board = new Board();