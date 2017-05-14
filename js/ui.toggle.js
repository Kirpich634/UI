(function (w, d) {
    ui.toggle = class Toggle {
        constructor(element, options) {
            this.element = element;
            this.options = $.extend({}, Toggle.options);

            $.extend(this.options, options);

            if (this.options.openStart) this.element.on('toggle', this.options.toggle.bind(this));

            this.input = element.find('input');

            this.element.on('click', function () {
                if( this.element.hasClass('on') )
                    this.on();
                else
                    this.off();
            }.bind(this));
        }

        on() {
            this.element.removeClass('on').addClass('off');
            this.input.val(0);
        }

        off() {
            this.element.removeClass('off').addClass('on');
            this.input.val(1);
        }
    };
    ui.toggle.options = {

    };

    $.fn.toggle = function (options) {
        if ( this.data('toggle') ) {
            let toggle = this.data('toggle');

            switch (arguments[0]) {
                case 'open':

                    break;

                case 'close':

                    break;

                case 'opened':

                    break;
            }

        } else this.each(function () {
            let element = $(this);
            element.data('toggle', new ui.toggle(element, options));
        });

        return this;
    };
})(window, document);