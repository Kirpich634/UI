'use strict';

(function ($) {

    var init = function init(parent, config) {

        this.config = {
            min: 0,
            max: 100,
            value: 0,
            orientation: 'horizontal'
        };

        $.extend(this.config, config);

        this.min = this.config.min;
        this.max = this.config.max;
        this.value = this.config.value;

        if (is.function(this.config.start)) parent.on('slidestart', this.config.start);
        if (is.function(this.config.slide)) parent.on('slide', this.config.slide);
        if (is.function(this.config.stop)) parent.on('slidestop', this.config.stop);

        parent.draggable({
            axis: this.config.orientation == 'vertical' ? 'y' : 'x',
            containment: parent,
            handle: parent,
            draggable: $('<div>').addClass('roller').appendTo(parent),
            start: $.proxy(this.start, this),
            drag: $.proxy(this.slide, this),
            stop: $.proxy(this.stop, this)
        });
        this.draggable = parent.data('draggable');
        parent.removeData('draggable');

        parent.data('slider', this);
    };

    init.prototype = {
        start: function start() {
            this.draggable.element.trigger('slidestart', [this]);
        },
        slide: function slide(e, ui) {
            console.log('slide');
            this.draggable.containmentFix(this.draggable.position);

            if (this.config.orientation == 'vertical') this.value = this.min + (this.max - this.min) * (this.draggable.position.top / (this.draggable.containment.outerHeight() - this.draggable.draggableSize.height));else this.value = this.min + (this.max - this.min) * (this.draggable.position.left / (this.draggable.containment.outerWidth() - this.draggable.draggableSize.width));

            if (this.config.round) {
                var a = Math.pow(10, this.config.round);
                this.value = Math.round(val * a) / a;
            }

            this.draggable.element.trigger('slide', [this]);
        },
        stop: function stop() {
            this.draggable.element.trigger('slidestop', [this]);
        }
    };

    $.fn.uislider = function () {
        if (this.data('slider')) {
            var slider = this.data('slider');
            switch (arguments[0]) {
                case 'min':
                    if (arguments[1] != undefined) slider.min = arguments[1];else return slider.min;

                    break;
                case 'max':
                    if (arguments[1] != undefined) slider.max = arguments[1];else return slider.max;

                    break;
                case 'value':
                    if (arguments[1] != undefined) {
                        if (arguments[1] < slider.min) slider.value = slider.min;else if (arguments[1] > slider.max) slider.value = slider.max;else slider.value = arguments[1];

                        var shift = 1 / (slider.max - slider.min) * (slider.value - slider.min) * (slider.draggable.handle.outerWidth() - slider.draggable.draggable.outerWidth());

                        if (slider.config.orientation == 'vertical') slider.draggable.css('transform', 'translateY(' + shift + 'px)');else slider.draggable.css('transform', 'translateX(' + shift + 'px)');
                    } else return slider.value;

                    break;
                case 'disable':
                    slider.draggable.disable();

                    break;
                case 'enable':
                    slider.draggable.enable();

                    break;
                case 'getUi':
                    return slider;

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
})(jQuery);