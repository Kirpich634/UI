'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {

    ui.spinner = function () {
        _createClass(Spinner, null, [{
            key: 'getChar',
            value: function getChar(e) {
                if (e.which == null) {
                    if (e.keyCode < 32) return null;
                    return String.fromCharCode(e.keyCode); // IE
                }

                if (e.which != 0 && e.charCode != 0) {
                    if (e.which < 32) return null;
                    return String.fromCharCode(e.which); // остальные
                }
            }
        }]);

        function Spinner(element, options) {
            _classCallCheck(this, Spinner);

            this.options = $.extend({}, Spinner.options);

            if (element.hasAttr('data-preventdefaultinitnodes')) element.options.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');

            if (element.hasAttr('data-preventdefaultiniteventaction')) this.options.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            if (element.hasClass('disabled')) this.options.enable = false;

            $.extend(this.options, options);

            var events = 'beforeInit init afterInit beforeSpin spin afterSpin startSpinUp beforeSpinUp spinUp afterSpinUp endSpinUp startSpinDown beforeSpinDown spinDown afterSpinDown endSpinDown focus keydown keypress input keyup blur change'.split(',');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var event = _step.value;

                    if (is.function(this.options[event])) element.on('spinner:' + event, this.options[event]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _event = _step2.value;

                    if (is.function(this.options[_event])) element.on('spinner:' + _event, Spinner[_event]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.nodes = {
                element: element,
                input: element.find('input').on('focus', this.focus.bind(this)).on('keydown', this.keydown.bind(this)).on('keypress', this.keypress.bind(this)).on('input', this.input.bind(this)).on('keyup', this.keyup.bind(this)).on('blur', this.blur.bind(this)).on('change', this.change.bind(this))
            };

            if (this.nodes.input.attr('type') != 'text') this.nodes.input.attr('type', 'text');

            if (this.options.value !== false) this.nodes.input.val(this.options.value);else if (!is.number(this.nodes.input.val())) this.nodes.input.val(0);

            this.speed = this.options.speed;

            var spinup = element.find('.spinup');
            if (spinup.length > 0) this.nodes.spinup = spinup.on('mousedown', function (e) {
                e.preventDefault();

                $(w).one('mouseup', function () {
                    clearTimeout(this.autorepeatTimeoutId);
                    this.speed = this.options.speed;
                }.bind(this));

                this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinUp.bind(this), this.speed);
            }.bind(this)).on('click', this.spinUp.bind(this));

            var spindown = element.find('.spindown');
            if (spindown.length > 0) spindown.on('mousedown', function (e) {
                e.preventDefault();

                $(w).one('mouseup', function () {
                    clearTimeout(this.autorepeatTimeoutId);
                    this.speed = this.options.speed;
                }.bind(this));

                this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinDown.bind(this), this.speed);
            }.bind(this)).on('click', this.spinDown.bind(this));

            this.options.enable ? this.enable() : this.disable();
        }

        _createClass(Spinner, [{
            key: 'enable',
            value: function enable() {
                this.nodes.element.addClass('enabled').removeClass('disabled');
                this.nodes.input.removeAttr('disabled');
            }
        }, {
            key: 'disable',
            value: function disable() {
                this.nodes.element.removeClass('enabled').addClass('disabled');
                this.nodes.input.attr('disabled', true);
            }
        }, {
            key: 'focus',
            value: function focus(e) {
                this.nodes.element.addClass('focus').trigger('spinner:focus', [this]);
            }
        }, {
            key: 'keydown',
            value: function keydown(e) {
                this.nodes.element.trigger('spinner:keydown', [this, e]);
            }
        }, {
            key: 'keypress',
            value: function keypress(e) {
                this.nodes.element.trigger('spinner:keypress', [this, e]);
                if (e.ctrlKey || e.altKey || e.metaKey) return;

                var chr = Spinner.getChar(e);

                // с null надо осторожно в неравенствах,
                // т.к. например null >= '0' => true
                // на всякий случай лучше вынести проверку chr == null отдельно
                if (chr == null) return;

                if (chr != '-' && (chr < '0' || chr > '9')) return false;
            }
        }, {
            key: 'input',
            value: function input(e) {
                this.nodes.element.trigger('spinner:input', [this, e]);
            }
        }, {
            key: 'keyup',
            value: function keyup(e) {
                this.nodes.element.trigger('spinner:keyup', [this, e]);
            }
        }, {
            key: 'blur',
            value: function blur(e) {
                this.nodes.element.removeClass('focus').trigger('spinner:blur', [this, e]);
            }
        }, {
            key: 'change',
            value: function change(e) {
                this.nodes.element.trigger('spinner:change', [this, e]);

                var value = parseFloat(this.nodes.input.val());

                this.normalizeValue(value);

                if (this.value != value) this.nodes.input.val(this.value);

                this.nodes.element.trigger('spinner:spin', [this, this.value]);
            }
        }, {
            key: 'spinUp',
            value: function spinUp() {
                var value = parseFloat(this.nodes.input.val());

                this.normalizeValue(value + 1);

                if (this.value != value) this.nodes.input.val(this.value);

                this.nodes.element.trigger('spinner:spinUp', [this, this.value]);
            }
        }, {
            key: 'spinDown',
            value: function spinDown() {
                var value = parseFloat(this.nodes.input.val());

                this.normalizeValue(value - 1);

                if (this.value != value) this.nodes.input.val(this.value);

                this.nodes.element.trigger('spinner:spinDown', [this, this.value]);
            }
        }, {
            key: 'autorepeatSpinUp',
            value: function autorepeatSpinUp() {
                this.spinUp();

                if (this.speed > this.options.maxSpeed) {
                    this.speed *= this.options.acceleration;

                    if (this.speed < this.options.maxSpeed) this.speed = this.options.maxSpeed;
                }

                this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinUp.bind(this), this.speed);
            }
        }, {
            key: 'autorepeatSpinDown',
            value: function autorepeatSpinDown() {
                this.spinDown();

                if (this.speed > this.options.maxSpeed) {
                    this.speed *= this.options.acceleration;

                    if (this.speed < this.options.maxSpeed) this.speed = this.options.maxSpeed;
                }

                this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinDown.bind(this), this.speed);
            }
        }, {
            key: 'normalizeValue',
            value: function normalizeValue(value) {
                value = value || 0;
                if (value < this.options.min) value = this.options.min;else if (value > this.options.max) value = this.options.max;

                if (this.options.round) {
                    var a = Math.pow(10, this.options.round);
                    value = Math.round(value * a) / a;
                }

                this.value = value;
            }
        }]);

        return Spinner;
    }();

    ui.spinner.options = {
        enable: true,
        min: 0,
        max: 100,
        speed: 200,
        maxSpeed: 50,
        acceleration: .93,

        round: false,
        value: 0,

        beforeInit: false,
        init: false,
        afterInit: false,
        beforeSpin: false,
        spin: false,
        afterSpin: false,

        startSpinUp: false,
        beforeSpinUp: false,
        spinUp: false,
        afterSpinUp: false,
        endSpinUp: false,

        startSpinDown: false,
        beforeSpinDown: false,
        spinDown: false,
        afterSpinDown: false,
        endSpinDown: false,

        focus: false,
        keydown: false,
        keypress: false,
        input: false,
        keyup: false,
        blur: false,
        change: false
    };

    $.fn.spinner = function (options) {
        if (this.data('spinner')) {
            var spinner = this.data('spinner');

            switch (arguments[0]) {
                case 'min':
                    if (arguments[1] != undefined) {
                        spinner.options.min = arguments[1];
                    } else return spinner.options.min;

                    break;
                case 'max':
                    if (arguments[1] != undefined) {
                        spinner.options.max = arguments[1];
                    } else return spinner.options.max;

                    break;
                case 'value':
                    if (arguments[1] != undefined) {
                        spinner.setValue(arguments[1]);
                    } else return spinner.value;

                    break;
                case 'disable':
                    spinner.disable();

                    break;
                case 'enable':
                    spinner.enable();

                    break;
            }
        } else this.each(function () {
            var element = $(this);
            element.data('spinner', new ui.spinner(element, options));
        });

        return this;
    };
})(window, document);