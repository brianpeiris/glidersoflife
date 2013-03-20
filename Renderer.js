define(['GliderOracle'], function (GliderOracle) {
    'use strict';

    var Renderer = function Renderer(canvas, board) {
        this.canvas = canvas;
        this.board = board;

        this.cellSize = 6;
        this.cellGap = 1;

        var visibleSize = board.size - board.buffer;
        this.canvasSize = visibleSize * this.cellSize +
            visibleSize * this.cellGap;
        this.canvas.width = this.canvas.height = this.canvasSize;
        this.context = this.canvas.getContext('2d');

        this.gliderOracle = new GliderOracle(board);
    };

    Renderer.prototype.clear = function clear() {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvasSize, this.canvasSize);
    };

    Renderer.prototype.drawGridLine = function drawGridLine(x, y, x2, y2) {
        this.context.fillStyle = 'white';
        if (y === 1) {
            this.context.fillRect(
                x2 - this.cellGap, 0, this.cellGap, this.canvasSize);
        }
        if (x === 1){
            this.context.fillRect(
                0, y2 - this.cellGap, this.canvasSize, this.cellGap);
        }
    };

    Renderer.prototype.drawCell = function drawCell(x, y, x2, y2, color) {
        this.context.fillStyle = color;
        if (this.board.currentBoard[x][y]) {
            this.context.fillRect(
                x2, y2,
                this.cellSize, this.cellSize);
        }
    };

    Renderer.prototype.render = function render() {
        var x, y, x1, y1, x2, y2;

        this.gliderOracle.update();

        this.clear();

        for (x = 1; x < this.board.size - 1; x++) {
            for (y = 1; y < this.board.size - 1; y++) {
                x1 = x - 1;
                y1 = y - 1;

                x2 = x1 * this.cellSize + x1 * this.cellGap;
                y2 = y1 * this.cellSize + y1 * this.cellGap;

                this.drawGridLine(x, y, x2, y2);

                var isGliderCell = this.gliderOracle.isGliderCell(x, y);
                var color =  isGliderCell ? 'red' : 'black';
                this.drawCell(x, y, x2, y2, color);
            }
        }
        this.firstRun = false;
    };

    Renderer.prototype.pixelToBoard = function pixelToBoard(pos) {
        return Math.floor(pos / (this.cellSize + this.cellGap)) + 1;
    };

    return Renderer;

});
