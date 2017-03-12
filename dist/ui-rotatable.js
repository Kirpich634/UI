'use strict';

(function (w, d) {
    var getAngle = function getAngle(ms, ctr) {
        var x = -ms.x + ctr.x,
            y = +ms.y - ctr.y,
            hyp = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2)),
            angle = Math.acos(y / hyp);

        if (x < 0) angle = 2 * Math.PI - angle;

        return angle;
    };

    var radToDeg = function radToDeg(r) {
        return r * (180 / Math.PI);
    };

    var init = function init(element, options) {
        this.element = element.data('rotatable', this).addClass('rotatable');

        this.options = {
            factor: 1,
            rotation: 0,

            init: false,
            beforeStart: false,
            start: false,
            afterStart: false,
            beforeRotate: false,
            rotate: false,
            afterRotate: false,
            end: false
        };

        $.extend(this.options, options);

        if (is.function(this.options.init)) this.element.on('rotatable:init', this.options.init);
        if (is.function(this.options.beforeStart)) this.element.on('rotatable:before-start', this.options.beforeStart);
        if (is.function(this.options.start)) this.element.on('rotatable:start', this.options.start);
        if (is.function(this.options.afterStart)) this.element.on('rotatable:after-start', this.options.afterStart);
        if (is.function(this.options.beforeRotate)) this.element.on('rotatable:before-drag', this.options.beforeRotate);
        if (is.function(this.options.rotate)) this.element.on('rotatable:rotate', this.options.rotate);
        if (is.function(this.options.afterRotate)) this.element.on('rotatable:after-drag', this.options.afterRotate);
        if (is.function(this.options.end)) this.element.on('rotatable:end', this.options.end);

        this.shift = false;

        this.handle = $('<div>').addClass('rotatable-handle').append($('<i class="material-icons">rotate_left</i>')).append($("<div>")).appendTo(this.element).on('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.element.trigger('rotatable:start', [this]);

            var coords = this.getCoords();

            this.deg = radToDeg(getAngle(coords.mouse, coords.center));

            $(document).on('mousemove', mousemove);

            $(document).on('keydown', shiftKeyDown);

            $(document).one('mouseup', function () {
                $(document).off('mousemove', mousemove);
                this.element.trigger('rotatable:end', [this]);
            }.bind(this));
        }.bind(this));

        var mousemove = function (e) {
            e.preventDefault();

            var coords = this.getCoords();

            var deg = radToDeg(getAngle(coords.mouse, coords.center));

            this.deg = this.shift ? Math.round(deg / 45) * 45 : deg;

            this.rotate(this.deg);

            this.element.trigger('rotatable:rotate', [this]);
        }.bind(this);

        var shiftKeyDown = function (e) {
            if (e.keyCode != 16) return;
            this.shift = true;

            $(document).on('keyup', shiftKeyUp);
            $(document).off('keydown', shiftKeyDown);
        }.bind(this);

        var shiftKeyUp = function (e) {
            if (e.keyCode != 16) return;
            this.shift = false;

            $(document).on('keydown', shiftKeyDown);
            $(document).off('keyup', shiftKeyUp);
        }.bind(this);

        this.element.trigger('rotatable:init', [this]);
    };

    init.prototype = {
        getCoords: function getCoords() {
            var e = event;
            return {
                center: {
                    x: this.element.offset().left + this.element.width() * 0.5,
                    y: this.element.offset().top + this.element.height() * 0.5
                },
                mouse: {
                    x: e.pageX,
                    y: e.pageY
                }
            };
        },

        rotate: function rotate(deg) {
            this.element.each(function () {
                this.style['-webkit-transform'] = 'rotate(' + deg + 'deg)';
                this.style['-o-transform'] = 'rotate(' + deg + 'deg)';
                this.style['-moz-transform'] = 'rotate(' + deg + 'deg)';
                this.style['transform'] = 'rotate(' + deg + 'deg)';
            });
        }
    };

    $.fn.rotatable = function () {
        if (this.data('rotatable')) {
            var rotatable = this.data('rotatable');

            switch (arguments[0]) {
                case 'rotate':
                    if (arguments[1] != undefined) {
                        rotatable.deg = arguments[1];
                        rotatable.rotate(rotatable.deg);
                    } else return rotatable.deg;

                    break;
            }
        } else {
            var options = arguments[0];

            this.each(function () {
                new init($(this), options);
            });
        }
        return this;
    };
})(window, document);