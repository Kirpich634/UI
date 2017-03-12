'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (w, d) {
    'use strict';

    ui.select = function (_ui$dropdown) {
        _inherits(Select, _ui$dropdown);

        function Select(element, options) {
            _classCallCheck(this, Select);

            var tempOptions = $.extend({}, Select.options);

            if (element.hasAttr('data-preventdefaultinitnodes')) tempOptions.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');
            if (element.hasAttr('data-preventdefaultiniteventaction')) tempOptions.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, element, $.extend(tempOptions, options)));

            if (Select.beforeInit) _this.nodes.element.on('tabs:beforeInit', Select.beforeInit);
            if (_this.options.beforeInit) _this.nodes.element.on('tabs:beforeInit', _this.options.beforeInit);
            if (Select.init) _this.nodes.element.on('tabs:init', Select.init);
            if (_this.options.init) _this.nodes.element.on('tabs:init', _this.options.init);
            if (Select.afterInit) _this.nodes.element.on('tabs:afterInit', Select.beforeInit);
            if (_this.options.afterInit) _this.nodes.element.on('tabs:afterInit', _this.options.afterInit);

            if (_this.options.select) _this.nodes.element.on('select', _this.options.select.bind(_this));

            _this.nodes.element.trigger('select:beforeInit', [_this]);

            if (!_this.options.preventDefaultInitNodes) {
                var input = _this.nodes.element.find('input[type="hidden"]');
                _this.nodes.input = input.length > 0 ? input : false;
            }

            _this.nodes.element.trigger('select:init', [_this]);

            if (!_this.options.preventDefaultInitEventAction) {
                _this.nodes.window.on('click', '.option', function (e) {
                    var option = $(e.currentTarget);
                    if (option.hasClass('disabled')) return;
                    this.select(option);
                }.bind(_this));
            }

            _this.nodes.element.trigger('select:afterInit', [_this]);
            return _this;
        }

        _createClass(Select, [{
            key: 'select',
            value: function select(option) {
                if (option.hasClass('active')) return;

                if (this.nodes.input) this.nodes.input.val(option.attr('data-value'));

                this.nodes.window.find('.option.active').removeClass('active');

                option.addClass('active');

                this.nodes.trigger.find('.option').one('transitionend', function (e) {
                    $(this).remove();
                }).addClass('hide ' + this.options.hideSubstitutionEffect);

                var className = this.options.showSubstitutionEffect;

                var newOption = $('<div class="option hide ' + className + '">').text(option.text()).appendTo(this.nodes.trigger);

                setTimeout(function () {
                    newOption.removeClass('hide ' + className);
                }, 20);

                if (this.nodes.element.hasClass('open')) this.close();
            }
        }]);

        return Select;
    }(ui.dropdown);

    ui.select.options = {
        disabled: false,

        trigger: '.select',
        window: '.optionlist',

        maxWidth: 'auto',
        maxHeight: 'auto',

        closeOnClickTrigger: true,

        openEffect: 'fade',
        closeEffect: 'fade',
        hideSubstitutionEffect: 'left',
        showSubstitutionEffect: 'right',

        beforeInit: false,
        init: false,
        afterInit: false,
        beforeOpen: false,
        open: false,
        afterOpen: false,
        beforeClose: false,
        close: false,
        afterClose: false
    };

    $.fn.select = function (options) {
        if (this.data('select')) {
            var select = this.data('select');

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
            element.data('select', new ui.select(element, options));
        });

        return this;
    };
})(window, document);