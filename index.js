/* jshint browser: true */
require(
['jquery', 'Board', 'Renderer', 'stats'],
function ($, Board, Renderer, Stats) {
    'use strict';

    var board = new Board();
    var renderer = new Renderer($('#board_')[0], board);
    var stats = new Stats();

    $('body').append(stats.domElement);

    setInterval(function () {
        stats.begin();
        board.step();
        renderer.render();
        stats.end();
    }, 1000 / 24);

    $('#toggle').click(function () {
        board.paused = !board.paused;
    });

    $('#randomize').click(function () {
        board.randomize();
        renderer.render();
    });

    $('#board_').click(function (e) {
        var offset = $(e.target).offset();
        var
            x = renderer.pixelToBoard(e.pageX - offset.left),
            y = renderer.pixelToBoard(e.pageY - offset.top);
        board.toggleCell(x, y);
        renderer.render();
    });

    $('#clear').click(function () {
        board.clear();
        renderer.render();
    });

    $('#step').click(function () {
        board.paused = false;
        board.step();
        renderer.render();
        board.paused = true;
    });
});
