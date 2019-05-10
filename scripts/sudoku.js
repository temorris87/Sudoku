let boxWidth = 3;
let boardWidth = 9;
let numberOfCells = 81;
let divBoard = document.querySelector("#board");

class Animation {
    static setBlinkingCursor(target) {
        target.element.innerText = "|";
        target.element.classList.add("blinking");
    }
}

class Form {
    constructor(prompt, callback) {
        this.prompt = prompt;
        this.callback = callback;
        this.gameForm = document.querySelector('#custom-form');
        this.formText = document.querySelector('#form-prompt');
        this.yesButton = document.querySelector('#btn-new-game-yes');
        this.noButton = document.querySelector('#btn-new-game-no');

        this.initializeYesListener();
        this.initializeNoListener();
    }

    updatePrompt() {
        this.formText.innerText = this.prompt;
    }

    showForm() {
        this.updatePrompt();
        this.gameForm.style.display = "flex";
    }

    hideForm() {
        this.gameForm.style.display = "none";
    }

    initializeYesListener() {
        this.yesButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log('Calling callback');
            this.callback();
            this.hideForm();
        });
    }

    initializeNoListener() {
        this.noButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.hideForm();
        });
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

        this.noteCount = 0;
        this.notes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    clearNotes() {
        this.noteCount = 0;
        this.notes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    hasNotes() {
        return this.noteCount !== 0;
    }

    isNoted(number) {
        return this.notes[number - 1] !== 0;
    }

    addNumberNote(number) {
        if (!this.notes[number - 1]) {
            this.notes[number - 1] = number;
            this.noteCount++;
        }
    }

    removeNumberNote(number) {
        if (this.notes[number - 1]) {
            this.notes[number - 1] = 0;
            this.noteCount--;
        }

    }

    getNumberNote(i, j) {
        return this.notes[i * boxWidth + j];
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
        this.initBoard(getRandomBoard());
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
        this.cellsFilled = 0;
        let currentCell;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                currentCell = this[Cell.getCellId(i, j)];
                currentCell.clearNotes();
                currentCell.element.classList.remove('default');
                currentCell.element.classList.remove('note-cell-parent');
                currentCell.element.classList.remove('target');
                currentCell.element.classList.remove('blinking');
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

    addNote(number) {
        this.targetCell.addNumberNote(number);
    }

    removeNote(number) {
        this.targetCell.removeNumberNote(number);
    }
}

class Sudoku {
    constructor() {
        this.board = new Board();
        this.noteMode = false;
        this.startEventListeners();
        this.addDividingLines();
        Sudoku.initNoteIcon();
        Sudoku.initNewGameIcon();
        Sudoku.initCheckBoardIcon();
        this.redrawEntireBoard();

        let newBoardPrompt = "Are you sure you want to start a new game? All progress will be lost.";
        this.newBoardForm = new Form(newBoardPrompt, () => {
            this.initBoard();
            this.redrawEntireBoard();
        });

        let winnerPrompt = "You have solved this puzzle! Would you like to start a new one?";
        this.winnerForm = new Form(winnerPrompt, () => {
            this.initBoard();
            this.redrawEntireBoard();
        })
    }

    removeDefaultFromAllCells() {
        let cells = document.querySelectorAll('.cell');
        console.log(cells);
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove('default');
        }
    }

    updateToNewGame() {
        console.log('Entered update to new game.');
        this.removeDefaultFromAllCells();
        this.board = new Board();
        this.noteMode = false;
        this.redrawEntireBoard();
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

    static initNewGameIcon() {
        let newGameIcon = document.createElement('div');
        newGameIcon.id = 'new-game';
        newGameIcon.classList.add('icon');
        newGameIcon.innerHTML = '&#8853;';
        document.querySelector('#board').appendChild(newGameIcon);
    }

    static initNoteIcon() {
        let noteIcon = document.createElement('div');
        noteIcon.id = 'pencil';
        noteIcon.classList.add('pencil');
        noteIcon.classList.add('icon');
        noteIcon.innerHTML = '&#9998;';
        document.querySelector('#board').appendChild(noteIcon);
    }

    static initCheckBoardIcon() {
        let checkIcon = document.createElement('div');
        checkIcon.id = 'check-board';
        checkIcon.classList.add('notification');
        checkIcon.innerHTML = '✘';
        document.querySelector('#board').appendChild(checkIcon);
    }

    initBoard() {
        this.board.initBoard(getRandomBoard());
        this.redrawEntireBoard();
    }

    drawNoteCell(id) {
        let cell = this.board.getCell(id);
        if (cell.hasNotes()) {
            this.board.getCell(id).element.classList.add('note-cell-parent');
            for (let i = 0; i < boxWidth; i++) {
                for (let j = 0; j < boxWidth; j++) {
                    let noteCell = document.createElement('div');
                    noteCell.id = `${id}-${i}${j}`;
                    noteCell.classList.add('note-cell');

                    let noteFound = cell.getNumberNote(i, j);
                    if (noteFound) {
                        noteCell.innerText = noteFound;
                    }
                    cell.element.appendChild(noteCell);
                }
            }
        }
    }

    removeNoteCellDivs() {
        let cellDiv = this.board.targetCell.element;
        while (cellDiv.lastChild) {
            cellDiv.removeChild(cellDiv.lastChild);
        }
        cellDiv.classList.remove('note-cell-parent');
        // TODO Animation not working after removal of children, need to figure out why and fix.
        Animation.setBlinkingCursor(this.board.targetCell);
    }

    redrawEntireBoard() {
        let currentCell;
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardWidth; j++) {
                currentCell = this.board.getCell(Cell.getCellId(i, j));
                if (currentCell.number !== 0) {
                    currentCell.element.innerText = currentCell.number.toString();
                }
                else if (currentCell.hasNotes()) {
                    currentCell.element.innerText = "";
                    this.drawNoteCell(currentCell.id);
                }
                else {
                    currentCell.element.innerText = "";
                }
            }
        }
    }

    changeTargetCell(target) {
        this.board.targetCell = this.board.getCell(target.id);
        let targetClassList = this.board.targetCell.element.classList;
        if (this.noteMode) {
            targetClassList.add("target-note");
        }
        else {
            targetClassList.add("target");
        }

        if (!this.board.targetCell.hasNotes()) {
            if (!target.classList.contains("default") && this.board.getCell(target.id).number === 0) {
                Animation.setBlinkingCursor(this.board.targetCell);
            }
        }
    }

    removeTargetCell(target) {
        let targetClassList = this.board.targetCell.element.classList;
        if (this.noteMode) {
            targetClassList.remove("target-note");
        }
        else {
            targetClassList.remove("target");
        }
        target.classList.remove("blinking");
        this.board.targetCell = null;
        this.redrawEntireBoard();
    }

    keyPressUpdateTarget(i, j, target) {
        this.removeTargetCell(target);
        let id = Cell.getCellId(i, j);
        this.board.targetCell = this.board.getCell(id);
        this.changeTargetCell(this.board.getCell(id).element);
    }

    togglNoteMode() {
        document.querySelector('#pencil').classList.toggle('pencil-selected');
        this.noteMode ? this.noteMode = false : this.noteMode = true;

        if (this.board.targetCell != null) {
            let targetClassList = this.board.targetCell.element.classList;

            if (targetClassList.contains('target-note')) {
                targetClassList.remove('target-note');
                targetClassList.add('target');
            }
            else {
                targetClassList.remove('target');
                targetClassList.add('target-note');
            }
        }
    }

    hideWinningIcon() {
        let icon = document.querySelector('#check-board');
        icon.style.color = '#25274D';
    }

    highlightWinningIcon() {
        let icon = document.querySelector('#check-board');
        if (this.board.isValidBoard()) {
            icon.style.color = '#29648A';
        }
        else {
            icon.style.color = 'red';
        }
    }

    startEventListeners() {
        let body = document.querySelector("body");

        // Add key events for when the mouse enters a cell.
        body.addEventListener("mouseover", (event) => {
            if (event.target.classList.contains("cell")) {
                this.changeTargetCell(event.target);
            }
        });

        // Add key event for when the mouse leaves a cell.
        body.addEventListener("mouseout", (event) => {
            if (event.target.classList.contains("cell")) {
                this.removeTargetCell(event.target);
            }
        });

        // Add key events for when user types numbers 0 - 9.
        body.addEventListener("keydown", (event) => {
            if (isNonEmptyUserCellAndLegalKeypress(this.board.targetCell, event.key)) {
                if (this.noteMode) {
                    if (this.board.targetCell.isNoted(event.key)) {
                        this.board.removeNote(event.key);
                        if (!this.board.targetCell.hasNotes()) {
                            this.removeNoteCellDivs();
                        }
                        this.redrawEntireBoard();
                    }
                    else {
                        this.board.addNote(event.key);
                        this.board.targetCell.element.classList.remove("blinking");
                        this.redrawEntireBoard();
                    }
                }
                else {
                    if (this.board.targetCell.hasNotes()) {
                        this.board.targetCell.clearNotes();
                        this.removeNoteCellDivs();
                    }

                    this.board.enterNumber(this.board.targetCell.id, Number(event.key));
                    this.board.targetCell.element.classList.remove("blinking");
                    this.redrawEntireBoard();

                    if (this.board.isBoardFilled()) {
                        if (this.board.isValidBoard()) {
                            this.hideWinningIcon();
                            this.winnerForm.showForm();
                        }
                        else {
                            this.highlightWinningIcon();
                        }
                    }
                }
            }
            else if (event.key === "Backspace") {
                if (this.board.targetCell.hasNotes()) {
                    return;
                }

                this.hideWinningIcon();

                if (isNonEmptyUserCellForDelete(this.board, this.board.targetCell)) {
                    this.board.removeNumber(this.board.targetCell.id);
                    this.redrawEntireBoard();
                    Animation.setBlinkingCursor(this.board.targetCell);
                }
            }
            else if (event.key === "ArrowUp" || event.key === "k" || event.key === "w") {
                event.preventDefault();
                let i = this.board.targetCell.i - 1;
                let j = this.board.targetCell.j;
                if (i >= 0 && i < boardWidth) {
                    this.keyPressUpdateTarget(i, j, event.target);
                }
            }
            else if (event.key === "ArrowRight" || event.key === "l" || event.key === "d") {
                event.preventDefault();
                let i = this.board.targetCell.i;
                let j = this.board.targetCell.j + 1;
                if (j >= 0 && j < boardWidth) {
                    this.keyPressUpdateTarget(i, j, event.target);
                }
            }
            else if (event.key === "ArrowDown" || event.key === "j" || event.key === "s") {
                event.preventDefault();
                let i = this.board.targetCell.i + 1;
                let j = this.board.targetCell.j;
                if (i >= 0 && i < boardWidth) {
                    this.keyPressUpdateTarget(i, j, event.target);
                }
            }
            else if (event.key === "ArrowLeft" || event.key === "h" || event.key === "a") {
                event.preventDefault();
                let i = this.board.targetCell.i;
                let j = this.board.targetCell.j - 1;
                if (j >= 0 && j < boardWidth) {
                    this.keyPressUpdateTarget(i, j, event.target);
                }
            }
            else if (event.key === 'n') {
                this.togglNoteMode();
            }
        });

        body.addEventListener('click', (event) => {
            if (event.target.id === 'new-game') {
                this.newBoardForm.showForm();
                if (this.newBoardForm.selected) {
                    this.hideWinningIcon();
                    this.updateToNewGame();
//                    this.initBoard();
                }
            }
            else if (event.target.classList.contains('pencil')) {
                this.togglNoteMode();
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
