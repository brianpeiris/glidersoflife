define(function () {
    'use strict';

    var gliderPatterns = [
        [
            [0,0,0,0,0],
            [0,0,1,0,0],
            [0,0,0,1,0],
            [0,1,1,1,0],
            [0,0,0,0,0]
        ],
        [
            [0,0,0,0,0],
            [0,1,0,1,0],
            [0,0,1,1,0],
            [0,0,1,0,0],
            [0,0,0,0,0]
        ],
        [
            [0,0,0,0,0],
            [0,0,0,1,0],
            [0,1,0,1,0],
            [0,0,1,1,0],
            [0,0,0,0,0]
        ],
        [
            [0,0,0,0,0],
            [0,1,0,0,0],
            [0,0,1,1,0],
            [0,1,1,0,0],
            [0,0,0,0,0]
        ]
    ];
    var rotate = function rotate (arr) {
        var newarr = [], x;
        for (x = 0; x < arr.length; x++) {
            newarr[x] = [];
        }
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l; j++) {
                newarr[i][j] = arr[l - j - 1][i];
            }
        }
        return newarr;
    };
    var rotaten = function rotaten (arr, n) {
        var newarr = arr;
        while(n--) {
            newarr = rotate(newarr);
        }
        return newarr;
    };
    var rotatedGliderPatterns = gliderPatterns.slice(0);
    for (var i = 0; i < gliderPatterns.length; i++) {
        for (var n = 0; n < 4; n++) {
            rotatedGliderPatterns.push(rotaten(gliderPatterns[i], n));
        }
    }
    gliderPatterns = rotatedGliderPatterns;

    var GliderOracle = function GliderOracle(board) {
        this.board = board;
        this.initGliderCells();
    };

    GliderOracle.prototype.initGliderCells = function initGliderCells() {
        var x, y;
        this.gliderCells = [];
        for (x = 0; x < this.board.size; x++) {
            this.gliderCells[x] = [];
        }

        for (x = 0; x < this.board.size; x++) {
            for (y = 0; y < this.board.size; y++) {
                this.gliderCells[x][y] = 0;
            }
        }
    };

    GliderOracle.prototype.matchesPattern =
    function matchesPattern(x, y, gliderPattern) {
        var i, j;
        for (i = 0; i < gliderPattern.length; i++) {
            for (j = 0; j < gliderPattern.length; j++) {
                var cell = this.board.currentBoard[x + i][y + j];
                if (gliderPattern[i][j] !== cell) {
                    return false;
                }
            }
        }
        return true;
    };

    GliderOracle.prototype.updateGliderCells =
    function updateGliderCells(x, y, gliderPattern) {
        var i, j;
        for (i = 0; i < gliderPattern.length; i++) {
            for (j = 0; j < gliderPattern.length; j++) {
                this.gliderCells[x + i][y + j] = gliderPattern[i][j];
            }
        }
    };

    GliderOracle.prototype.checkPatterns = function checkPatterns(x, y) {
        var i;
        for (i = 0; i < gliderPatterns.length; i++) {
            if (this.matchesPattern(x, y, gliderPatterns[i])) {
                this.updateGliderCells(x, y, gliderPatterns[i]);
                break;
            }
        }
    };

    GliderOracle.prototype.update = function update() {
        var x, y;
        this.initGliderCells();
        for (x = 1; x < this.board.size - 1; x++) {
            for (y = 1; y < this.board.size - 1; y++) {
                this.checkPatterns(x, y);
            }
        }
    };

    GliderOracle.prototype.isGliderCell = function isGliderCell(x, y) {
        return this.gliderCells[x][y];
    };

    return GliderOracle;
});
