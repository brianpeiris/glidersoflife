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
        for (var n = 1; n < 4; n++) {
            rotatedGliderPatterns.push(rotaten(gliderPatterns[i], n));
        }
    }
    gliderPatterns = rotatedGliderPatterns;

    var GliderOracle = function GliderOracle(board) {
        this.board = board;
        this.initGliderCells();
    };
    GliderOracle.gliderPatterns = gliderPatterns;

    GliderOracle.prototype.resetGliderCells = function resetGliderCells() {
        var x, y, bs = this.board.size, gcx;
        for (x = 0; x < bs; x++) {
            gcx = this.gliderCells[x];
            for (y = 0; y < bs; y++) {
                gcx[y] = 0;
            }
        }
        this.gliderCount = 0;
    };

    GliderOracle.prototype.initGliderCells = function initGliderCells() {
        var x;
        this.gliderCells = [];
        for (x = 0; x < this.board.size; x++) {
            this.gliderCells[x] = [];
        }

        this.resetGliderCells();
    };

    GliderOracle.prototype.wrap = function wrap(n) {
        var bs = this.board.size;
        return n >= bs ? (n - bs) : n;
    };

    GliderOracle.prototype.matchesPattern =
    function matchesPattern(x, y, gliderPattern, shouldWrap) {
        var
            i, j, gpi, cbxi,
            cb = this.board.currentBoard,
            gpl = gliderPattern.length;
        for (i = 0; i < gpl; i++) {
            gpi = gliderPattern[i];
            cbxi = cb[shouldWrap ? this.wrap(x + i) : (x + i)];
            for (j = 0; j < gpl; j++) {
                if (gpi[j] !== cbxi[shouldWrap ? this.wrap(y + j) : (y + j)]) {
                    return false;
                }
            }
        }
        return true;
    };

    GliderOracle.prototype.updateGliderCells =
    function updateGliderCells(x, y, gliderPattern, shouldWrap) {
        var i, j, gpl = gliderPattern.length, gcxi, gpi;
        for (i = 0; i < gpl; i++) {
            gcxi = this.gliderCells[shouldWrap ? this.wrap(x + i) : (x + i)];
            gpi = gliderPattern[i];
            for (j = 0; j < gpl; j++) {
                gcxi[shouldWrap ? this.wrap(y + j) : (y + j)] = gpi[j];
            }
        }
    };

    GliderOracle.prototype.checkPatterns =
    function checkPatterns(x, y, shouldWrap) {
        var i, gpl = gliderPatterns.length;
        for (i = 0; i < gpl; i++) {
            var gliderPattern = gliderPatterns[i];
            if (this.matchesPattern(x, y, gliderPattern, shouldWrap)) {
                this.updateGliderCells(x, y, gliderPattern, shouldWrap);
                this.gliderCount++;
                break;
            }
        }
    };

    GliderOracle.prototype.update = function update() {
        var x, y;
        this.resetGliderCells();
        var bs = this.board.size - gliderPatterns[0].length;
        for (x = 0; x < bs; x++) {
            for (y = 0; y < bs; y++) {
                this.checkPatterns(x, y, false);
            }
        }
        var bs2 = this.board.size;
        for (x = 0; x < bs2; x++) {
            for (y = bs; y < bs2; y++) {
                this.checkPatterns(x, y, true);
            }
        }
        for (x = bs; x < bs2; x++) {
            for (y = 0; y < bs; y++) {
                this.checkPatterns(x, y, true);
            }
        }
    };

    GliderOracle.prototype.isGliderCell = function isGliderCell(x, y) {
        return this.gliderCells[x][y];
    };

    return GliderOracle;
});
