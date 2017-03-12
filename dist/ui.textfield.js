"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    ui.textfield = function () {
        function Textfield(element, options) {
            _classCallCheck(this, Textfield);

            this.options = $.extend({}, Textfield.options);

            if (element.hasAttr('data-preventdefaultinitnodes')) this.options.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');

            if (element.hasAttr('data-preventdefaultiniteventaction')) this.options.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            $.extend(this.options, options);

            var events = 'beforeInit init afterInit focus keydown keypress input keyup blur change'.split(',');

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

                    if (is.function(this.options[_event])) element.on('spinner:' + _event, Textfield[_event]);
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

            element.trigger('textfield:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                this.nodes = {
                    element: element,
                    placeholder: element.find('p')
                };

                var input = element.find('input');
                if (input.length > 0) this.nodes.input = input;
            }

            element.trigger('textfield:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {
                var textfield = this.nodes.element.find('div[contenteditable="true"]');

                this.nodes.textfield = textfield.length > 0 ? textfield : this.nodes.input;

                this.nodes.textfield.on('focus', this.focus.bind(this)).on('keydown', this.keydown.bind(this)).on('keypress', this.keypress.bind(this)).on('input', this.input.bind(this)).on('keyup', this.keyup.bind(this)).on('blur', this.blur.bind(this)).on('change', this.change.bind(this));
            }

            element.trigger('textfield:afterInit', [this]);
        }

        _createClass(Textfield, [{
            key: 'focus',
            value: function focus(e) {
                this.nodes.element.trigger('focus', [this]);

                this.nodes.placeholder.addClass('hidden');

                this.nodes.element.trigger('textfield:focus', [this]);
            }
        }, {
            key: 'keydown',
            value: function keydown(e) {
                this.nodes.element.trigger('textfield:keydown', [this]);
            }
        }, {
            key: 'keypress',
            value: function keypress(e) {
                this.nodes.element.trigger('textfield:keypress', [this]);
            }
        }, {
            key: 'input',
            value: function input(e) {
                this.nodes.input.val(this.textfield.html());

                this.nodes.element.trigger('textfield:input', [this]);
            }
        }, {
            key: 'keyup',
            value: function keyup(e) {
                this.nodes.element.trigger('textfield:keyup', [this]);
            }
        }, {
            key: 'blur',
            value: function blur(e) {
                this.nodes.element.trigger('blur', [this]);

                if (this.input.val() == '') this.placeholder.removeClass('hidden');

                this.nodes.element.trigger('textfield:blur', [this]);
            }
        }, {
            key: 'change',
            value: function change(e) {}
        }]);

        return Textfield;
    }();

    ui.textfield.options = {
        type: 'textfield'
    };

    $.fn.textfield = function (options) {
        if (this.data('textfield')) {
            var textfield = this.data('textfield');

            switch (arguments[0]) {}
        } else this.each(function () {
            var element = $(this);
            element.data('textfield', new ui.textfield(element, options));
        });

        return this;
    };
})(window, document);