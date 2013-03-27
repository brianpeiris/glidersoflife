/* jshint browser: true */
require(
['jquery', 'Board', 'GliderOracle', 'Renderer', 'Sparkline'],
function ($, Board, GliderOracle, Renderer, Sparkline) {
    'use strict';

    // TODO: 
    // - refactor entire file to reduce repitition.
    // - use AngularJS?

    var size = 150;
    var randomizeDensity = 0.4;
    var board = new Board(size, randomizeDensity);

    var gliderOracle = new GliderOracle(board);

    var cellSize = 2;
    var renderer = new Renderer($('#board_')[0], board, gliderOracle, cellSize);

    var fps = new Sparkline($('#fps')[0], renderer.cellColor, 30);
    var gliders = new Sparkline(
        $('#gliders')[0], renderer.gliderColor, null, 180);
    var steps = $('#steps');
    var glidersTotal = new Sparkline(
            $('#glidersTotal')[0], renderer.gliderColor, null, 180);

    var intervalId;
    var frames = 0;
    var glidersTotalCount = 0;
    var runBoard = function runBoard() {
        var now = function now() { return (new Date()).getTime(); };
        var start = now();
        intervalId = setInterval(function () {
            board.step();
            gliderOracle.update();
            renderer.render();
            frames++;
            steps.text(board.steps);
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
    runBoard();

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

    $('#randomize').click(function () {
        board.randomize();
        gliderOracle.update();
        renderer.render();

        resetStats();
    });

    $('#board_').click(function (e) {
        var offset = $(e.target).offset();
        var
            x = renderer.pixelToBoard(e.pageX - offset.left),
            y = renderer.pixelToBoard(e.pageY - offset.top);
        board.toggleCell(x, y);
        gliderOracle.update();
        renderer.render();
    });

    $('#clear').click(function () {
        board.clear();
        gliderOracle.update();
        renderer.render();
        steps.text(board.steps);

        resetStats();
        stop();
    });

    $('#step').click(function () {
        board.paused = false;
        board.step();
        gliderOracle.update();
        renderer.render();
        steps.text(board.steps);
        board.paused = true;

        resetStats();
        stop();
    });
});
