let boxWidth = 3;
let boardWidth = 9;
let numberOfCells = 81;
let divBoard = document.querySelector("#board");

let defaultBoard = [["4", " ", "8", " ", " ", "7", "2", " ", "1"],
    [" ", "3", " ", " ", "8", " ", "9", " ", " "],
    ["6", "7", "5", " ", "1", " ", " ", "3", " "],
    [" ", "5", " ", " ", " ", "4", " ", "2", "3"],
    ["3", " ", " ", "5", " ", " ", "1", "6", " "],
    [" ", " ", " ", " ", " ", " ", "7", " ", "5"],
    [" ", " ", "3", "9", " ", " ", " ", " ", "7"],
    [" ", " ", "1", "7", "6", "3", " ", "4", " "],
    ["5", " ", " ", " ", "4", "2", "3", " ", "9"]];

class Animation {
    static setBlinkingCursor(target) {
        target.element.innerText = "|";
        target.element.classList.add("blinking");
    }
}

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.id = this.getCellId(i, j);
        this.number = 0;
        this.element = document.createElement("div");

        this.element.id = this.id;
        this.element.classList.add("cell");

        this.notes = [false, false, false, false, false, false, false, false, false];
    }

    getCellId() {
        return `cell-${this.i}${this.j}`;
    }

    static getCellId(i, j) {
        return `cell-${i}${j}`;
    }
}

class Board {
    constructor() {
        this.cellsFilled = 0;
        this.targetCell = null;
        this.createCells();
        this.initBoard(defaultBoard);
    }

    getCell(id) {
        return this[id];
    }

    isBoardFilled() {
        return this.cellsFilled === numberOfCells;
    }

    isValidRow(i) {
        let numbersSeen = [false, false, false, false, false, false, false, false, false];
        for (let j = 0; j < boardWidth; j++) {
            numbersSeen[Number(this[Cell.getCellId(i, j)].number) - 1] = true;
        }

        return numbersSeen.every((item) => {
            return item === true;
        });
    }

    isValidColumn(j) {
        let numbersSeen = [false, false, false, false, false, false, false, false, false];
        for (let i = 0; i < boardWidth; i++) {
            numbersSeen[Number(this[Cell.getCellId(i, j)].number) - 1] = true;
        }

        return numbersSeen.every((item) => {
            return item === true;
        });
    }

    isValidBox(i, j) {
        let numbersSeen = [false, false, false, false, false, false, false, false, false];
        for (let boxI = i; boxI < i + boxWidth; boxI++) {
            for (let boxJ = j; boxJ < j + boxWidth; boxJ++) {
                numbersSeen[Number(this[Cell.getCellId(boxI, boxJ)].number) - 1] = true;
            }
        }

        return numbersSeen.every((item) => {
            return item === true;
        });
    }

    isValidBoard() {
        for (let i = 0; i < boardWidth; i++) {
            if (!(this.isValidRow(i) && this.isValidColumn(i))) {
                return false;
            }
        }

        for (let i = 0; i < boardWidth; i += 3) {
            for (let j = 0; j < boardWidth; j += 3) {
                if (!(this.isValidBox(i, j))) {
                    return false;
                }
            }
        }

        return true;
    }

    initBoard(board) {
        let currentCell;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                currentCell = this[Cell.getCellId(i, j)];
                board[i][j] === " " ? currentCell.number = 0 : currentCell.number = board[i][j];
                divBoard.appendChild(currentCell.element);

                if (board[i][j] !== " ") {
                    currentCell.element.classList.add("default");
                    this.cellsFilled++;
                }
            }
        }
    }

    createCells() {
        let cell;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cell = new Cell(i, j);
                this[cell.id] = cell;
            }
        }
    }

    setTargetCell(cell) {
        if (cell.classList.contains("cell")) {
            if (this.targetCell) {
                this.targetCell.element.classList.remove("target");
            }
            this.targetCell = this[cell.id];
            this.targetCell.element.classList.add("target");
        }
    }

    enterNumber(id, number) {
        if (this[id].number === 0) {
            this.cellsFilled++;
        }
        this[id].number = number;
    }

    removeNumber(id) {
        if (this[id].number !== 0) {
            this[id].number = 0;
            this.cellsFilled--;
        }
    }
}

class Sudoku {
    constructor() {
        this.board = new Board();
        this.startEventListeners();
        this.addDividingLines();
        this.redrawEntireBoard();
    }

    alertWinner() {
        if (this.board.isValidBoard()) {
            alert("Winner!");
        }
        else {
            alert("Sorry, you messed up somewhere.");
        }
    }

    addDividingLines() {
        for (let j = 0; j < boardWidth; j++) {
            let id = "cell-3" + j.toString();
            this.board.getCell(id).element.classList.add("top");

            id = "cell-5" + j.toString();
            this.board.getCell(id).element.classList.add("bottom");
        }

        for (let i = 0; i < boardWidth; i++) {
            let id = "cell-" + i.toString() + "3";
            this.board.getCell(id).element.classList.add("left");

            id = "cell-" + i.toString() + +"5";
            this.board.getCell(id).element.classList.add("right");
        }
    }

    redrawEntireBoard() {
        let currentCell;
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardWidth; j++) {
                currentCell = this.board.getCell(Cell.getCellId(i, j));
                if (currentCell.number !== 0) {
                    currentCell.element.innerText = currentCell.number.toString();
                }
                else {
                    currentCell.element.innerText = "";
                }
            }
        }
    }

    startEventListeners() {
        let body = document.querySelector("body");

        // Add key events for when the mouse enters a cell.
        body.addEventListener("mouseover", (event) => {
            if (event.target.classList.contains("cell")) {

                this.board.targetCell = this.board.getCell(event.target.id);
                this.board.targetCell.element.classList.add("target");

                if (!event.target.classList.contains("default") && this.board.getCell(event.target.id).number === 0) {
                    Animation.setBlinkingCursor(this.board.targetCell);
                }
            }
        });

        // Add key event for when the mouse leaves a cell.
        body.addEventListener("mouseout", (event) => {
            if (event.target.classList.contains("cell")) {
                event.target.classList.remove("target");
                event.target.classList.remove("blinking");
                this.board.targetCell = null;
                this.redrawEntireBoard();
            }
        });

        // Add key events for when user types numbers 0 - 9.
        body.addEventListener("keydown", (event) => {
            if (isNonEmptyUserCellAndLegalKeypress(this.board.targetCell, event.key)) {
                this.board.enterNumber(this.board.targetCell.id, Number(event.key));
                this.board.targetCell.element.classList.remove("blinking");
                this.redrawEntireBoard();

                if (this.board.isBoardFilled()) {
                    this.alertWinner();
                }
            }
            else if (event.key === "Backspace") {
                if (isNonEmptyUserCellForDelete(this.board, this.board.targetCell)) {
                    this.board.removeNumber(this.board.targetCell.id);
                    this.redrawEntireBoard();
                    Animation.setBlinkingCursor(this.board.targetCell);
                }
            }
        });

        function isNonEmptyUserCellAndLegalKeypress(target, key) {
            return target !== null &&
                !target.element.classList.contains("default") &&
                (key >= "1" && key <= "9");
        }

        function isNonEmptyUserCellForDelete(board, target) {
            return target !== null &&
                !target.element.classList.contains("default") &&
                board[target.id].number !== 0;
        }
    }
}

let game = new Sudoku();
