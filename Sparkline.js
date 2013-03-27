/* jshint browser: true */
define(
['jquery', 'jquery.sparkline'],
function ($) {
    'use strict';

    var Sparkline = function Sparkline(el, color, maxData, width){
        this.data = [];
        this.maxData = maxData;
        this.width = maxData ? maxData * 3 : width;
        this.options = {
            lineColor: color,
            fillColor: color,
            chartRangeMin: 0,
            width: this.width,
            spotRadius: 0
        };
        if (!this.options.width) {
            delete this.options.width;
        }
        this.el = $(el);
        this.el.wrap('<span class="sparkline" />');
        this.text = $('<span />');
        this.el.after(this.text);
    };

    Sparkline.prototype.render = function render(val) {
        this.el.sparkline(this.data, this.options);
        this.text.text(val === undefined ? '' : val);
    };

    Sparkline.prototype.update = function update(val) {
        this.data.push(val);
        if (this.maxData && this.data.length > this.maxData) {
            this.data.shift();
        }
        this.render(val);
    };

    Sparkline.prototype.reset = function reset() {
        this.data = [];
        this.render();
    };

    return Sparkline;

});
