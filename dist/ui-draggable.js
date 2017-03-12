'use strict';

(function (w, d) {
    var getReact = function getReact(element) {
        var rect = element.offset();
        rect.right = rect.left + element.outerWidth();
        rect.bottom = rect.top + element.outerHeight();

        return rect;
    };

    var init = function init(element, options) {
        this.element = element.data('draggable', this);

        this.options = {
            preventmove: false,
            axisX: true,
            axisY: true,
            containment: false,
            containmentFor: 'element',

            handle: false,

            factor: 1,
            rotation: 0,

            init: false,
            beforeStart: false,
            start: false,
            afterStart: false,
            beforeDrag: false,
            drag: false,
            afterDtag: false,
            end: false
        };

        $.extend(this.options, options);

        if (is.function(this.options.init)) this.element.on('draggable:init', this.options.init);
        if (is.function(this.options.beforeStart)) this.element.on('draggable:before-start', this.options.beforeStart);
        if (is.function(this.options.start)) this.element.on('draggable:start', this.options.start);
        if (is.function(this.options.afterStart)) this.element.on('draggable:after-start', this.options.afterStart);
        if (is.function(this.options.beforeDrag)) this.element.on('draggable:before-drag', this.options.beforeDrag);
        if (is.function(this.options.drag)) this.element.on('draggable:drag', this.options.drag);
        if (is.function(this.options.afterDtag)) this.element.on('draggable:after-drag', this.options.afterDtag);
        if (is.function(this.options.end)) this.element.on('draggable:end', this.options.end);

        this.setDraggable();
        this.setContainment();
        this.setHandle();

        this.element.trigger('draggable:init', [this]);
    };

    init.prototype = {
        setDraggable: function setDraggable(draggable) {
            if (draggable) this.options.draggable = draggable;

            if (is.string(this.options.draggable)) this.draggable = this.element.find(this.options.draggable);else if (is.$(this.options.draggable)) this.draggable = this.options.draggable;else if (is.HTMLElement(this.options.draggable)) this.draggable = $(this.options.draggable);else this.draggable = this.element;
        },

        setContainment: function setContainment(containment) {
            if (containment) this.options.containment = containment;

            if (is.string(this.options.containment)) this.containment = this.element.closest(this.options.containment);else if (is.$(this.options.containment)) this.containment = this.options.containment;else if (is.HTMLElement(this.options.containment)) this.containment = $(this.options.containment);
        },
        setHandle: function setHandle(handle) {
            if (handle) this.options.handle = handle;

            if (this.handle) this.disable();

            if (is.string(this.options.handle)) this.handle = this.element.find(this.options.handle);else if (is.$(this.options.handle)) this.handle = this.options.handle;else if (is.HTMLElement(this.options.handle)) this.handle = $(this.options.handle);else this.handle = this.element;

            if (!this.element.attr('disabled')) this.enable();
        },

        setLastPosition: function setLastPosition() {
            this.lastPosition.top = this.position.top;
            this.lastPosition.left = this.position.left;
        },

        getPosition: function getPosition() {
            var x = event.pageX;
            var y = event.pageY;
            y = this.offsetParentRect.top + (y - this.offsetParentRect.top) * this.options.factor;
            x = this.offsetParentRect.left + (x - this.offsetParentRect.left) * this.options.factor;

            return {
                top: y - this.offsetParentRect.top - this.prefix.top,
                left: x - this.offsetParentRect.left - this.prefix.left
            };
        },

        containmentFix: function containmentFix(position) {
            if (this.options.containmentFor == 'cursor') {

                if (this.offsetParentRect.top + position.top + this.prefix.top < this.containmentRect.top) position.top = this.containmentRect.top - this.offsetParentRect.top - this.prefix.top;else if (this.offsetParentRect.top + position.top + this.prefix.top > this.containmentRect.bottom) position.top = this.offsetParentSize.height + this.containmentRect.bottom - this.offsetParentRect.bottom - this.prefix.top;

                if (this.offsetParentRect.left + position.left + this.prefix.left < this.containmentRect.left) position.left = this.containmentRect.left - this.offsetParentRect.left - this.prefix.left;else if (this.offsetParentRect.left + position.left + this.prefix.left > this.containmentRect.right) position.left = this.offsetParentSize.width + this.containmentRect.right - this.offsetParentRect.right - this.prefix.left;
            } else {
                if (this.offsetParentRect.top + position.top < this.containmentRect.top) position.top = this.containmentRect.top - this.offsetParentRect.top;else if (this.offsetParentRect.top + position.top + this.draggableSize.height > this.containmentRect.bottom) position.top = this.offsetParentSize.height + this.containmentRect.bottom - this.offsetParentRect.bottom - this.draggableSize.height;

                if (this.offsetParentRect.left + position.left < this.containmentRect.left) position.left = this.containmentRect.left - this.offsetParentRect.left;else if (this.offsetParentRect.left + position.left + this.draggableSize.width > this.containmentRect.right) position.left = this.offsetParentSize.width + this.containmentRect.right - this.offsetParentRect.right - this.draggableSize.width;
            }
        },

        axisMove: function axisMove(position) {
            requestAnimationFrame(function () {
                if (this.options.axis == 'x') this.draggable.css('left', position.left);else if (this.options.axis == 'y') this.draggable.css('top', position.top);else this.draggable.css({ top: position.top, left: position.left });
            }.bind(this));
        },

        mousedown: function mousedown(e) {
            if (e.which != 1 || $(e.target).hasClass('resizable-handle')) return;
            e.preventDefault();

            this.element.trigger('draggable:start', [this]);

            var x = e.pageX,
                y = e.pageY;

            this.offsetParent = this.draggable.offsetParent();
            this.offsetParentRect = getReact(this.draggable.offsetParent());

            this.offsetParentSize = {
                width: this.offsetParent.outerWidth(),
                height: this.offsetParent.outerHeight()
            };
            if (this.containment) {
                this.containmentRect = getReact(this.containment);

                this.containmentSize = {
                    width: this.containment.outerWidth() * this.options.factor,
                    height: this.containment.outerHeight() * this.options.factor
                };

                this.containmentRect.bottom = this.containmentRect.top + this.containmentSize.height;
                this.containmentRect.right = this.containmentRect.left + this.containmentSize.width;
            }

            this.draggableSize = {
                width: this.draggable.outerWidth() * this.options.factor,
                height: this.draggable.outerHeight() * this.options.factor
            };

            var rect = this.draggable.offset();
            rect.right = rect.left + this.draggableSize.width;
            rect.bottom = rect.top + this.draggableSize.height;

            this.originPosition = {
                top: (rect.top - this.offsetParentRect.top) * this.options.factor,
                left: (rect.left - this.offsetParentRect.left) * this.options.factor
            };

            this.lastPosition = {
                top: this.originPosition.top,
                left: this.originPosition.left
            };

            this.prefix = {
                top: (y - rect.top) * this.options.factor,
                right: (rect.right - x) * this.options.factor,
                left: (x - rect.left) * this.options.factor,
                bottom: (rect.bottom - y) * this.options.factor
            };

            if (this.draggable.has(this.handle).length == 0 && this.draggable[0] != this.handle[0]) {
                if (x < rect.left || x > rect.left + this.draggable.outerWidth()) this.prefix.left = this.prefix.right = this.draggable.outerWidth() / 2;

                if (y < rect.top || y > rect.top + this.draggable.outerHeight()) this.prefix.top = this.prefix.bottom = this.draggable.outerHeight() / 2;

                if (x < rect.left || x > rect.left + this.draggable.outerWidth() || y < rect.top || y > rect.top + this.draggable.outerHeight()) {
                    this.position = this.getPosition();

                    this.element.trigger('draggable:drag', [this]);

                    this.setLastPosition();

                    this.axisMove(this.position);
                }
            }

            $(document).on('mousemove', $.proxy(this.move, this)).one('mouseup', function () {
                $(document).off('mousemove', $.proxy(this.move, this));

                this.element.trigger('draggable:end', [this]);
            }.bind(this));
        },

        move: function move(e) {
            this.position = this.getPosition();

            if (this.containment) this.containmentFix(this.position);

            this.element.trigger('draggable:drag', [this]);

            this.setLastPosition();

            if (this.options.preventmove == false) this.axisMove(this.position);
        },

        disable: function disable() {
            this.element.addClass('disabled');
            this.handle.off('mousedown', $.proxy(this.mousedown, this));
        },

        enable: function enable() {
            this.element.removeClass('disabled');
            this.handle.on('mousedown', $.proxy(this.mousedown, this));
        }
    };

    $.fn.draggable = function () {
        if (this.data('draggable')) {
            var draggable = this.data('draggable');
            switch (arguments[0]) {
                case 'preventmove':
                    if (arguments[1] != undefined) draggable.options.preventmove = arguments[1];else return draggable.options.preventmove;

                    break;
                case 'axis':
                    if (arguments[1] != undefined) draggable.options.axis = arguments[1];else return draggable.options.axis;

                    break;
                case 'containment':
                    if (arguments[1] != undefined) draggable.setContainment(arguments[1]);else return draggable.options.containment;

                    break;
                case 'containmentFor':
                    if (arguments[1] != undefined) draggable.options.containmentFor = arguments[1];else return draggable.options.containmentFor;

                    break;
                case 'handle':
                    if (arguments[1] != undefined) draggable.setHandle(arguments[1]);else return draggable.options.handle;

                    break;
                case 'draggable':
                    if (arguments[1] != undefined) draggable.setDraggable(arguments[1]);else return draggable.options.handle;

                    break;
                case 'disable':
                    draggable.disable();

                    break;
                case 'enable':
                    draggable.enable();

                    break;

                case 'getUi':
                    return draggable;
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