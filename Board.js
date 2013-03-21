define(function () {
    'use strict';

    var Board = function Board() {
        this.buffer = 2;
        this.size = 20 + this.buffer;
        this.board1 = [];
        this.board2 = [];
        this.currentBoard = this.board1;
        this.phase1 = true;
        this.paused = false;

        this.clear();
        // this.randomizeBoard(this.board1);
    };

    Board.prototype.initBoard = function initBoard(board) {
        var x, y;

        for (x = 0; x < this.size; x++) {
            board[x] = [];
        }

        for (x = 0; x < this.size; x++) {
            for (y = 0; y < this.size; y++) {
                board[x][y] = 0;
            }
        }
    };

    Board.prototype.randomizeBoard = function randomizeBoard(board) {
        var x, y;
        for (x = 1; x < this.size - 1; x++) {
            for (y = 1; y < this.size - 1; y++) {
                board[x][y] = Math.random() <= 0.3;
            }
        }
    };

    Board.prototype.copyBoard = function copyBoard(fromBoard, toBoard) {
        var x, y;
        for (x = 1; x < this.size - 1; x++) {
            for (y = 1; y < this.size - 1; y++) {
                toBoard[x][y] = fromBoard[x][y];
            }
        }
    };

    Board.prototype.randomize = function randomize() {
        this.randomizeBoard(this.board1);
        this.copyBoard(this.board1, this.board2);
    };

    var countNeighbours = function countNeighbours(b, x, y) {
        var
            bxm = b[x - 1], bxp = b[x + 1], bx0 = b[x],
            ym = y - 1, yp = y + 1;
        return bxm[ym] + bxm[y] + bxm[yp] +
               bx0[ym]     +      bx0[yp] +
               bxp[ym] + bxp[y] + bxp[yp];
    };

    Board.prototype.life = function life(fromBoard, toBoard) {
        var x, y, numNeighbours = 0, size = this.size - 1, tbx, fbx;
        for (x = 1; x < size; x++) {
            tbx = toBoard[x];
            fbx = fromBoard[x];
            for (y = 1; y < size; y++) {
                numNeighbours = countNeighbours(fromBoard, x, y);
                tbx[y] = fbx[y];
                // under-population, over-population
                if (numNeighbours < 2 || numNeighbours > 3) { tbx[y] = 0; }
                // reproduction
                else if (numNeighbours === 3) { tbx[y] = 1; }
            }
        }
    };

    Board.prototype.step = function step() {
        var fromBoard, toBoard;
        if (this.paused) { return; }
        if (this.phase1) {
            fromBoard = this.board1;
            toBoard = this.board2;
        }
        else {
            fromBoard = this.board2;
            toBoard = this.board1;
        }
        this.life(fromBoard, toBoard);
        this.currentBoard = toBoard;
        this.phase1 = !this.phase1;
    };

    Board.prototype.toggleCell = function toggleCell(x, y) {
        var board = this.phase1 ? this.board1 : this.board2;
        board[x][y] = board[x][y] === 1 ? 0 : 1;
        var fromBoard = this.phase1 ? this.board1 : this.board2;
        var toBoard = this.phase1 ? this.board2 : this.board1;
        this.copyBoard(fromBoard, toBoard);
    };

    Board.prototype.clear = function clear() {
        this.initBoard(this.board1);
        this.initBoard(this.board2);
    };

    return Board;

});
