'use strict';

(function (w, d) {
    var init = function init(element, options) {
        this.element = element.data('resizable', this);

        this.options = {
            minWidth: 0,
            minHeight: 0,
            maxWidth: false,
            maxHeight: false,
            resizingX: true,
            resizingY: true,
            movable: 'element',
            position: false,
            borders: true,
            handles: true,
            factor: 1,
            rotation: 0,

            init: false,
            beforeStart: false,
            start: false,
            afterStart: false,
            resize: false,
            end: false
        };

        $.extend(this.options, options);

        if (this.options.borders === true || this.options.borders == 'all') {
            this.options.borders = {
                n: true,
                e: true,
                s: true,
                w: true
            };
        } else if (this.options.borders === false) {
            this.options.borders = {
                n: false,
                e: false,
                s: false,
                w: false
            };
        } else if (is.string(this.options.borders)) {

            var tempBorders = this.options.borders.split(' ');

            this.options.borders = {
                n: tempBorders.indexOf('n') != -1,
                e: tempBorders.indexOf('e') != -1,
                s: tempBorders.indexOf('s') != -1,
                w: tempBorders.indexOf('w') != -1
            };
        }

        if (this.options.handles === true || this.options.handles == 'all') {
            this.options.handles = {
                n: true,
                ne: true,
                e: true,
                es: true,
                s: true,
                sw: true,
                w: true,
                nw: true
            };
        } else if (this.options.handles === false) {
            this.options.borders = {
                n: false,
                ne: false,
                e: false,
                es: false,
                s: false,
                sw: false,
                w: false,
                nw: false
            };
        } else if (is.string(this.options.handles)) {

            var tempHandles = this.options.handles.split(' ');

            this.options.handles = {
                n: tempHandles.indexOf('n') != -1,
                ne: tempHandles.indexOf('ne') != -1,
                e: tempHandles.indexOf('e') != -1,
                es: tempHandles.indexOf('es') != -1,
                s: tempHandles.indexOf('s') != -1,
                sw: tempHandles.indexOf('sw') != -1,
                w: tempHandles.indexOf('w') != -1,
                nw: tempHandles.indexOf('nw') != -1
            };
        }

        if (this.options.movable == 'element') {
            this.movable = this.element;
        } else if (this.options.movable == 'parent') {
            this.movable = this.element.parent();
        } else {
            this.movable = this.element.closest(this.options.movable);
        }

        if (is.function(this.options.init)) this.element.on('resizable:init', this.options.init);
        if (is.function(this.options.beforeStart)) this.element.on('resizable:before-start', this.options.beforeStart);
        if (is.function(this.options.start)) this.element.on('resizable:start', this.options.start);
        if (is.function(this.options.afterStart)) this.element.on('resizable:after-start', this.options.afterStart);
        if (is.function(this.options.resize)) this.element.on('resizable:resize', this.options.resize);
        if (is.function(this.options.end)) this.element.on('resizable:end', this.options.end);

        this.element.addClass('resizable');

        this.border = {};

        if (this.options.borders.n) this.border.n = $('<div class="resizable-handle resizable-handle-n-border">').appendTo(this.element).on('mousedown', { direction: 'n' }, this.mousedown.bind(this));

        if (this.options.borders.e) this.border.e = $('<div class="resizable-handle resizable-handle-e-border">').appendTo(this.element).on('mousedown', { direction: 'e' }, this.mousedown.bind(this));

        if (this.options.borders.s) this.border.s = $('<div class="resizable-handle resizable-handle-s-border">').appendTo(this.element).on('mousedown', { direction: 's' }, this.mousedown.bind(this));

        if (this.options.borders.w) this.border.w = $('<div class="resizable-handle resizable-handle-w-border">').appendTo(this.element).on('mousedown', { direction: 'w' }, this.mousedown.bind(this));

        this.handle = {};

        if (this.options.handles.n) this.handle.n = $('<div class="resizable-handle resizable-handle-n">').appendTo(this.element).on('mousedown', { direction: 'n' }, this.mousedown.bind(this));

        if (this.options.handles.ne) this.handle.ne = $('<div class="resizable-handle resizable-handle-ne">').appendTo(this.element).on('mousedown', { direction: 'ne' }, this.mousedown.bind(this));

        if (this.options.handles.e) this.handle.e = $('<div class="resizable-handle resizable-handle-e">').appendTo(this.element).on('mousedown', { direction: 'e' }, this.mousedown.bind(this));

        if (this.options.handles.es) this.handle.es = $('<div class="resizable-handle resizable-handle-es">').appendTo(this.element).on('mousedown', { direction: 'es' }, this.mousedown.bind(this));

        if (this.options.handles.s) this.handle.s = $('<div class="resizable-handle resizable-handle-s">').appendTo(this.element).on('mousedown', { direction: 's' }, this.mousedown.bind(this));

        if (this.options.handles.sw) this.handle.sw = $('<div class="resizable-handle resizable-handle-sw">').appendTo(this.element).on('mousedown', { direction: 'sw' }, this.mousedown.bind(this));

        if (this.options.handles.w) this.handle.w = $('<div class="resizable-handle resizable-handle-w">').appendTo(this.element).on('mousedown', { direction: 'w' }, this.mousedown.bind(this));

        if (this.options.handles.nw) this.handle.nw = $('<div class="resizable-handle resizable-handle-nw">').appendTo(this.element).on('mousedown', { direction: 'nw' }, this.mousedown.bind(this));

        this.element.trigger('resizable:init', [this]);
    };

    init.prototype = {
        mousedown: function mousedown(e) {
            e.preventDefault();

            this.direction = e.data.direction;

            this.element.trigger('resizable:before-start', [this]);

            this.start = {
                x: e.pageX,
                y: e.pageY,
                width: parseFloat(this.element.css('width')) * this.options.factor,
                height: parseFloat(this.element.css('height')) * this.options.factor,
                top: this.options.position ? parseFloat(this.movable.css('top')) : parseFloat(this.movable.css('margin-top')) * this.options.factor,
                left: this.options.position ? parseFloat(this.movable.css('left')) : parseFloat(this.movable.css('margin-left')) * this.options.factor
            };

            this.graduation = {
                x: this.start.width - this.options.minWidth,
                y: this.start.height - this.options.minHeight
            };

            this.current = {
                x: this.start.x,
                y: this.start.y,
                difference: {
                    x: 0,
                    y: 0
                },
                width: this.start.width,
                height: this.start.height,
                top: this.start.top,
                left: this.start.left
            };

            this.element.trigger('resizable:start', [this]);

            $(d).on('mousemove', $.proxy(this.mousemove, this)).one('mouseup', $.proxy(this.mouseup, this));

            this.element.trigger('resizable:after-start', [this]);
        },

        mousemove: function mousemove(e) {
            this.element.trigger('resizable:before-resize', [this]);

            if (this.options.resizingX && (this.direction == 'e' || this.direction == 'w' || this.direction == 'ne' || this.direction == 'es' || this.direction == 'sw' || this.direction == 'nw')) {
                this.current.x = e.pageX;
                this.current.difference.x = (this.current.x - this.start.x) * this.options.factor;

                if (this.direction == 'w' || this.direction == 'sw' || this.direction == 'nw') {
                    this.current.difference.x *= -1;
                    this.current.left = this.start.left - this.current.difference.x;

                    if (this.current.difference.x + this.graduation.x < 0) this.current.left = this.start.left + this.graduation.x;
                }

                this.current.width = this.start.width + this.current.difference.x;

                if (this.current.width < this.options.minWidth) this.current.width = this.options.minWidth;else if (this.options.maxWidth && this.current.width > this.options.maxWidth) this.current.width = this.options.maxWidth;
            }

            if (this.options.resizingY && (this.direction == 'n' || this.direction == 's' || this.direction == 'ne' || this.direction == 'es' || this.direction == 'sw' || this.direction == 'nw')) {
                this.current.y = e.pageY;
                this.current.difference.y = (this.current.y - this.start.y) * this.options.factor;

                if (this.direction == 'n' || this.direction == 'ne' || this.direction == 'nw') {
                    this.current.difference.y *= -1;
                    this.current.top = this.start.top - this.current.difference.y;

                    if (this.current.difference.y + this.graduation.y < 0) this.current.top = this.start.top + this.graduation.y;
                }

                this.current.height = this.start.height + this.current.difference.y;

                if (this.current.height < this.options.minHeight) this.current.height = this.options.minHeight;else if (this.options.maxHeight && this.current.height > this.options.maxHeight) this.current.width = this.options.maxHeight;
            }

            this.element.trigger('resizable:resize', [this]);

            switch (this.direction) {
                case 'n':
                    if (this.options.position) this.movable.css('top', this.current.top + 'px');else this.movable.css('margin-top', this.current.top + 'px');

                    this.element.css('height', this.current.height + 'px');

                    break;
                case 'ne':
                    if (this.options.position) this.movable.css('top', this.current.top + 'px');else this.movable.css('margin-top', this.current.top + 'px');

                    this.element.css({
                        width: this.current.width + 'px',
                        height: this.current.height + 'px'
                    });

                    break;
                case 'e':
                    this.element.css('width', this.current.width + 'px');

                    break;
                case 'es':
                    this.element.css({
                        width: this.current.width + 'px',
                        height: this.current.height + 'px'
                    });

                    break;
                case 's':
                    this.element.css('height', this.current.height + 'px');

                    break;
                case 'sw':
                    if (this.options.position) this.movable.css('left', this.current.left + 'px');else this.movable.css('margin-left', this.current.left + 'px');

                    this.element.css({
                        width: this.current.width + 'px',
                        height: this.current.height + 'px'
                    });

                    break;
                case 'w':
                    if (this.options.position) this.movable.css('left', this.current.left + 'px');else this.movable.css('margin-left', this.current.left + 'px');

                    this.element.css('width', this.current.width + 'px');

                    break;

                case 'nw':

                    if (this.options.position) this.movable.css({
                        top: this.current.top + 'px',
                        left: this.current.left + 'px'
                    });else this.movable.css({
                        marginTop: this.current.top + 'px',
                        marginLeft: this.current.left + 'px'
                    });
                    this.element.css({
                        width: this.current.width + 'px',
                        height: this.current.height + 'px'
                    });

                    break;
            }

            this.element.trigger('resizable:after-resize', [this]);
        },

        mouseup: function mouseup(e) {
            this.element.trigger('resizable:end', [this]);
            $(d).off('mousemove', $.proxy(this.mousemove, this));
        }
    };

    $.fn.resizable = function () {
        if (this.data('resizable')) {
            var resizable = this.data('resizable');
            switch (arguments[0]) {
                case 'disable':
                    resizable.disable();

                    break;
                case 'enable':
                    resizable.enable();

                    break;
                case 'getUi':
                    return resizable;
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