'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    'use strict';

    ui.scrollto = function () {
        function ScrollTo(element, options) {
            _classCallCheck(this, ScrollTo);

            this.element = element;

            this.options = $.extend({}, ScrollTo.options);

            $.extend(this.options, options);

            if (this.options.select) this.element.on('select', this.options.select.bind(this));

            this.element.on('click', this.scrollTo.bind(this));
        }

        _createClass(ScrollTo, [{
            key: 'scrollTo',
            value: function scrollTo() {
                var scroll_el = this.element.attr('data-scrollto');
                if ($(scroll_el).length > 0) $(window).animate({ scrollTop: $(scroll_el).offset().top }, 500);
            }
        }, {
            key: 'enable',
            value: function enable() {}
        }, {
            key: 'disable',
            value: function disable() {}
        }]);

        return ScrollTo;
    }();

    ui.impulse.options = {};

    $.fn.scrollto = function (options) {
        if (this.data('scrollto')) {
            var impulse = this.data('scrollto');

            switch (arguments[0]) {
                case 'disable':

                    break;
                case 'enable':

                    break;
            }
        } else this.each(function () {
            var element = $(this);
            element.data('scrollto', new ui.scrollto(element, options));
        });

        return this;
    };
})(window, document);