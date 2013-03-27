define(function () {
    'use strict';

    /**
     * Renders a Board.
     * @class Renderer
     */
    var Renderer = function Renderer(canvas, board, gliderOracle, cellSize) {
        this.canvas = canvas;
        this.board = board;

        this.cellColor = '#C5D3DB';
        this.gliderColor = '#D52A22';

        this.cellSize = cellSize;
        // TODO: Cellgap is currently unused.
        this.cellGap = 0;

        this.canvasSize = board.size * this.cellSize +
            board.size * this.cellGap;
        this.canvas.width = this.canvas.height = this.canvasSize;

        this.context = this.canvas.getContext('2d');

        this.gliderOracle = gliderOracle;
    };

    Renderer.prototype.clear = function clear() {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvasSize, this.canvasSize);
    };

    Renderer.prototype.drawCell = function drawCell(x, y) {
        this.context.fillRect(x, y, this.cellSize, this.cellSize);
    };

    // TODO: Grid line code is currently unused and broken.
    Renderer.prototype.drawGridLine = function drawGridLine(x, y, x1, y1) {
        if (y === 0) {
            this.context.fillRect(
                x1 - this.cellGap, 0, this.cellGap, this.canvasSize);
        }
        if (x === 0){
            this.context.fillRect(
                0, y1 - this.cellGap, this.canvasSize, this.cellGap);
        }
    };

    Renderer.prototype.drawGridLines = function drawGridLines() {
        var x, y, x1, y1, bs = this.board.size;
        this.context.fillStyle = '#EEE';
        for (x = 0; x < bs; x++) {
            x1 = x * this.cellSize + x * this.cellGap;
            for (y = 0; y < bs; y++) {
                y1 = y * this.cellSize + y * this.cellGap;
                this.drawGridLine(x, y, x1, y1);
            }
        }
    };

    Renderer.prototype.render = function render() {
        var x, y, x1, y1, cbx, isGliderCell, bs = this.board.size;

        this.clear();

        // this.drawGridLines();

        this.context.fillStyle = this.cellColor;
        for (x = 0; x < bs; x++) {
            x1 = x * this.cellSize + x * this.cellGap;
            cbx = this.board.currentBoard[x];
            for (y = 0; y < bs; y++) {
                if (!cbx[y]) { continue; }
                y1 = y * this.cellSize + y * this.cellGap;

                isGliderCell = this.gliderOracle.isGliderCell(x, y);
                if (isGliderCell) {
                    this.context.fillStyle = this.gliderColor;
                }
                this.drawCell(x1, y1);
                if (isGliderCell) {
                    this.context.fillStyle = this.cellColor;
                }
            }
        }
    };

    /**
     * Converts a pixel coordinate to a cell coordinate.
     * (Only requires one parameter since the board is always square.)
     * @method pixelToBoard
     * @param {Number} pos A pixel coordinate from 0 to canvasSize.
     * @return {Number} The coordinate of the corresponding cell on
     * the board.
     */
    Renderer.prototype.pixelToBoard = function pixelToBoard(pos) {
        return Math.floor(pos / (this.cellSize + this.cellGap));
    };

    return Renderer;
});
