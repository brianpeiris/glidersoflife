define(function () {
    'use strict';

    /**
     * Represents a board of cells upon which the Game of Life takes place.
     * @class Board
     */
    var Board = function Board(size, randomizeDensity) {
        this.size = size;

        // Two boards are used to keep track of the Game of Life.
        // The currentBoard represents the current state and the
        // other board is used as a buffer to construct the next state based
        // on the current state.
        this.backBoard = [];
        this.currentBoard = [];

        this.paused = false;

        this.randomizeDensity = randomizeDensity;

        this.clear();
        this.randomizeBoard(this.currentBoard);
    };

    Board.prototype.initBoard = function initBoard(board) {
        var x, y, size = this.size;

        for (x = 0; x < size; x++) {
            board[x] = [];
        }

        for (x = 0; x < size; x++) {
            for (y = 0; y < size; y++) {
                board[x][y] = 0;
            }
        }
    };

    Board.prototype.randomizeBoard = function randomizeBoard(board) {
        var x, y, size = this.size;
        for (x = 0; x < size; x++) {
            for (y = 0; y < size; y++) {
                board[x][y] = Math.random() <= this.randomizeDensity;
            }
        }
    };

    Board.prototype.copyBoard = function copyBoard(fromBoard, toBoard) {
        var x, y, size = this.size;
        for (x = 0; x < size; x++) {
            for (y = 0; y < size; y++) {
                toBoard[x][y] = fromBoard[x][y];
            }
        }
    };

    Board.prototype.randomize = function randomize() {
        this.randomizeBoard(this.backBoard);
        this.copyBoard(this.backBoard, this.currentBoard);
    };

    Board.prototype.wrap = function wrap(n) {
        var s = this.size;
        return n === -1 ? (s - 1) : (n === s ? 0 : n);
    };

    Board.prototype.countNeighbours = function countNeighbours(b, x, y) {
        var
            ym = this.wrap(y - 1),
            yp = this.wrap(y + 1),
            bxm = b[this.wrap(x - 1)],
            bxp = b[this.wrap(x + 1)],
            bx0 = b[x];

        return bxm[ym] + bxm[y] + bxm[yp] +
               bx0[ym]     +      bx0[yp] +
               bxp[ym] + bxp[y] + bxp[yp];
    };

    Board.prototype.life = function life(fromBoard, toBoard) {
        var x, y, numNeighbours = 0, size = this.size, tbx, fbx;
        // TODO: Maybe replace all these for loops with iterators
        for (x = 0; x < size; x++) {
            tbx = toBoard[x];
            fbx = fromBoard[x];
            for (y = 0; y < size; y++) {
                numNeighbours = this.countNeighbours(fromBoard, x, y);
                tbx[y] = fbx[y];

                // under-population, over-population
                if (numNeighbours < 2 || numNeighbours > 3) { tbx[y] = 0; }
                // reproduction
                else if (numNeighbours === 3) { tbx[y] = 1; }
            }
        }
    };

    Board.prototype.step = function step() {
        var tempBoard;
        if (this.paused) { return; }
        this.life(this.currentBoard, this.backBoard);
        tempBoard = this.currentBoard;
        this.currentBoard = this.backBoard;
        this.backBoard = tempBoard;
        this.steps++;
    };

    Board.prototype.toggleCell = function toggleCell(x, y) {
        var board = this.currentBoard;
        board[x][y] = board[x][y] === 1 ? 0 : 1;
        this.copyBoard(this.currentBoard, this.backBoard);
    };

    Board.prototype.clear = function clear() {
        this.steps = 0;
        this.initBoard(this.currentBoard);
        this.initBoard(this.backBoard);
    };

    return Board;

});
