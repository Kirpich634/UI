'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    'use strict';

    ui.impulse = function () {
        function Impulse(element, options) {
            _classCallCheck(this, Impulse);

            this.element = element;

            this.options = $.extend({}, Impulse.options);

            $.extend(this.options, options);

            this.element.on('mousedown', this.pulse.bind(this));
        }

        _createClass(Impulse, [{
            key: 'pulse',
            value: function pulse(e) {
                var tarRect = this.element[0].getBoundingClientRect();

                var size = Math.sqrt(Math.pow(Math.max(e.clientY - tarRect.top, tarRect.height - (e.clientY - tarRect.top)), 2) + Math.pow(Math.max(e.clientX - tarRect.left, tarRect.width - (e.clientX - tarRect.left)), 2));

                var hr = $('<hr>').addClass('impulse').css({
                    width: size + "px",
                    height: size + "px",
                    top: e.clientY - tarRect.top + "px",
                    left: e.clientX - tarRect.left + "px"
                }).appendTo(this.element);

                setTimeout(function () {
                    hr.css('transform', 'translateX(-50%) translateY(-50%) scale(2)');
                }.bind(this), 0);

                $(w).one('mouseup', function (e) {
                    hr.on('transitionend', function () {
                        hr.remove();
                    }).addClass('fade');
                }.bind(this));
            }
        }]);

        return Impulse;
    }();

    ui.impulse.options = {};

    $.fn.impulse = function (options) {
        if (this.data('impulse')) {
            var impulse = this.data('impulse');

            switch (arguments[0]) {}
        } else this.each(function () {
            var element = $(this);
            element.data('impulse', new ui.impulse(element, options));
        });

        return this;
    };
})(window, document);