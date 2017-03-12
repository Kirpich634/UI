(function (w, d) {
    'use strict';

    ui.scrollto = class ScrollTo {
        constructor(element, options) {
            this.element = element;

            this.options = $.extend({}, ScrollTo.options);

            $.extend(this.options, options);


            if (this.options.select) this.element.on('select', this.options.select.bind(this));


            this.element.on('click', this.scrollTo.bind(this));
        }

        scrollTo() {
            let scroll_el = this.element.attr('data-scrollto');
            if ($(scroll_el).length > 0)
                $(window).animate({scrollTop: $(scroll_el).offset().top}, 500);
        }

        enable() {

        }

        disable() {

        }
    };

    ui.impulse.options = {

    };

    $.fn.scrollto = function (options) {
        if ( this.data('scrollto') ) {
            let impulse = this.data('scrollto');

            switch (arguments[0]) {
                case 'disable':


                    break;
                case 'enable':


                    break;
            }

        } else this.each(function () {
            let element = $(this);
            element.data('scrollto', new ui.scrollto(element, options));
        });

        return this;
    };
})(window, document);
