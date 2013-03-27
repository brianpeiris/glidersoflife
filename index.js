/* jshint browser: true */
require(
['jquery', 'Board', 'GliderOracle', 'Renderer', 'Sparkline'],
function ($, Board, GliderOracle, Renderer, Sparkline) {
    'use strict';

    // TODO: 
    // - refactor entire file to clean up and reduce repitition.
    // - use AngularJS?

    var size = 100;
    var randomizeDensity = 0.2;
    var board = new Board(size, randomizeDensity);

    var gliderOracle = new GliderOracle(board);

    var cellSize = 3;
    var renderer = new Renderer($('#board')[0], board, gliderOracle, cellSize);

    var fps = new Sparkline($('#fps')[0], renderer.cellColor, 30);
    var gliders = new Sparkline(
        $('#gliders')[0], renderer.gliderColor, null, 180);
    var steps = $('#steps');
    var glidersTotal = new Sparkline(
            $('#glidersTotal')[0], renderer.gliderColor, null, 180);

    var render = function render() {
        gliderOracle.update();
        renderer.render();
        steps.text(board.steps);
    };

    var stepAndRender = function stepAndRender() {
        board.step();
        render();
    };

    var intervalId;
    var frames = 0;
    var glidersTotalCount = 0;
    var runBoard = function runBoard() {
        var now = function now() { return (new Date()).getTime(); };
        var start = now();
        intervalId = setInterval(function () {
            stepAndRender();

            frames++;

            glidersTotalCount += gliderOracle.gliderCount;
            glidersTotal.update(glidersTotalCount);

            gliders.update(gliderOracle.gliderCount);

            if (now() - start > 1000) {
                fps.update(frames);
                frames = 0;
                start = now();
            }
        }, 1000 / 24);
    };
    // runBoard();

    var resetStats = function resetStats() {
        frames = 0;

        glidersTotalCount = 0;
        glidersTotal.reset();

        fps.reset();
        gliders.reset();
    };

    var stop = function stop(){
        clearInterval(intervalId);
        toggle.text('start');
        board.paused = true;
    };

    var toggle = $('#toggle');
    toggle.click(function () {
        if (board.paused) {
            runBoard();
            toggle.text('stop');
            board.paused = false;
        }
        else {
            stop();
        }
    });

    var randomize = function randomize() {
        board.randomize();

        render();
        resetStats();
    };
    randomize();
    $('#randomize').click(randomize);

    $('#board').click(function (e) {
        var offset = $(e.target).offset();
        var
            x = renderer.pixelToBoard(e.pageX - offset.left),
            y = renderer.pixelToBoard(e.pageY - offset.top);
        board.toggleCell(x, y);

        render();
    });

    $('#clear').click(function () {
        board.clear();

        resetStats();
        render();
        stop();
    });

    $('#step').click(function () {
        board.paused = false;
        resetStats();
        stepAndRender();
        stop();
    });
});
