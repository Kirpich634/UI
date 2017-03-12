'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    ui.toggle = function () {
        function Toggle(element, options) {
            _classCallCheck(this, Toggle);

            this.element = element;
            this.options = $.extend({}, Toggle.options);

            $.extend(this.options, options);

            if (this.options.openStart) this.element.on('toggle', this.options.toggle.bind(this));

            this.input = element.find('input');

            this.element.on('click', function () {
                if (this.element.hasClass('on')) this.on();else this.off();
            }.bind(this));
        }

        _createClass(Toggle, [{
            key: 'on',
            value: function on() {
                this.element.removeClass('on').addClass('off');
                this.input.val(0);
            }
        }, {
            key: 'off',
            value: function off() {
                this.element.removeClass('off').addClass('on');
                this.input.val(1);
            }
        }]);

        return Toggle;
    }();
    ui.toggle.options = {};

    $.fn.toggle = function (options) {
        if (this.data('toggle')) {
            var toggle = this.data('toggle');

            switch (arguments[0]) {
                case 'open':

                    break;

                case 'close':

                    break;

                case 'opened':

                    break;
            }
        } else this.each(function () {
            var element = $(this);
            element.data('toggle', new ui.toggle(element, options));
        });

        return this;
    };
})(window, document);