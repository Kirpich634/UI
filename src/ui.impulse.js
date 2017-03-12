(function (w, d) {
    'use strict';

    ui.impulse = class Impulse {
        constructor(element, options) {
            this.element = element;

            this.options = $.extend({}, Impulse.options);

            $.extend(this.options, options);

            this.element.on('mousedown',this.pulse.bind(this));
        }

        pulse(e) {
            let tarRect = this.element[0].getBoundingClientRect();

            let size = Math.sqrt(
                Math.pow(Math.max(
                    e.clientY - tarRect.top,
                    tarRect.height - (e.clientY - tarRect.top)
                ), 2) + Math.pow(Math.max(
                    e.clientX - tarRect.left,
                    tarRect.width -  (e.clientX - tarRect.left)
                ), 2)
            );

            let hr = $('<hr>')
                .addClass('impulse')
                .css({
                    width: size + "px",
                    height: size + "px",
                    top: e.clientY - tarRect.top + "px",
                    left: e.clientX - tarRect.left + "px"
                })
                .appendTo(this.element);

            setTimeout(function () {
                hr.css('transform', 'translateX(-50%) translateY(-50%) scale(2)');
            }.bind(this), 0);

            $(w)
                .one('mouseup', function (e) {
                    hr
                        .on('transitionend', function () {
                            hr.remove();
                        })
                        .addClass('fade')
                }.bind(this));

        }
    };

    ui.impulse.options = {

    };

    $.fn.impulse = function (options) {
        if ( this.data('impulse') ) {
            let impulse = this.data('impulse');

            switch (arguments[0]) {

            }

        } else this.each(function () {
            let element = $(this);
            element.data('impulse', new ui.impulse(element, options));
        });

        return this;
    };
})(window, document);