'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    var ui = w.ui = function (node) {
        if (!(node instanceof $)) node = $(node);

        var work = function work(node) {
            var _arguments = arguments;
            node.attr('data-ui').split(' ').forEach(function (value) {
                if (ui.list[value]) {
                    var instance = node.data(value);
                    if (instance) {
                        var options = helper.slice(_arguments, 1);

                        if (is.string(options[0])) if (instance.option) instance.option.apply(null, options);else if (instance.options) instance.options.apply(null, options);
                    } else {
                        if (node.attr('data-' + value + '-init') == 'false') return;
                        var newArguments = helper.slice(_arguments);
                        helper.unshift(newArguments, ui.list[value]);
                        node.data(value, new (ui.list[value].bind.apply(ui.list[value], newArguments))());
                    }
                }
            });
        };

        var optionsArray = helper.splice(arguments, 1);

        if (node.attr('data-ui') && node.attr('data-uiinit') != 'false') work.apply(null, [node].concat(optionsArray));

        node.find('[data-ui]:not([data-uiinit="false"])').each(function () {
            work.apply(null, [$(this)].concat(optionsArray));
        });
    };

    ui.list = {};

    ui.ui = function () {
        function UI(UIName, element) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var initNodes = arguments[3];
            var init = arguments[4];

            _classCallCheck(this, UI);

            this.UIName = UIName;
            this.nodes = {
                element: element
            };

            this.options = this.extendOptions([], ui.list[UIName].options, options);
            this.events = this.extendEvents(ui.list[UIName].events, options['events'] || {});
            this.preventDefault = $.extend({}, ui.list[UIName].preventDefaults, options['preventDefaults'] || {});

            this.permission = true;

            element.trigger(this.UIName + ':beforeInit', [this]);

            if (!this.preventDefault.initNodes) initNodes.bind(this)();

            if (!this.preventDefault.init) init.bind(this)();

            element.trigger(this.UIName + ':afterInit', [this]);
        }

        _createClass(UI, [{
            key: 'extendEvents',
            value: function extendEvents(defaultEvents) {
                var userEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var target = {};

                var setEvent = function (event) {
                    if (is.function(target[event])) this.nodes.element.on(this.UIName + ':' + event, target[event]);

                    if (is.function(ui.list[this.UIName][event])) this.nodes.element.on(this.UIName + ':' + event, ui.list[this.UIName][event]);
                }.bind(this);

                if (is.object(userEvents)) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Object.keys(defaultEvents)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var event = _step.value;

                            target[event] = userEvents[event] != undefined ? userEvents[event] : defaultEvents[event];

                            setEvent(event);
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
                } else {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(defaultEvents)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _event = _step2.value;

                            target[_event] = defaultEvents[_event];

                            setEvent(_event);
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
                }

                return target;
            }
        }, {
            key: 'extendOptions',
            value: function extendOptions(backtrace, defaultOptions, userOptions) {
                var target = {};

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Object.keys(defaultOptions)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var option = _step3.value;


                        if (userOptions[option] != undefined) {
                            if (is.object(userOptions[option])) {
                                backtrace.push(option);

                                target[option] = this.extendOptions(backtrace, defaultOptions[option], userOptions[option]);

                                backtrace.pop();
                            } else target[option] = userOptions[option];
                        } else {
                            var attr = this.nodes.element.attr('data-' + this.UIName + '-' + (backtrace.length > 0 ? backtrace.join('-') + '-' : "") + option);
                            if (attr != undefined) {
                                target[option] = $.normalizeAttrValue(attr);
                            } else if (is.object(defaultOptions[option])) {
                                backtrace.push(option);

                                target[option] = this.extendOptions(backtrace, defaultOptions[option], {});

                                backtrace.pop();
                            } else target[option] = defaultOptions[option];
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return target;
            }
        }]);

        return UI;
    }();

    ui.add = function (name, c) {
        ui.list[name] = c;

        $.fn[name] = function () {
            if (this.data(name)) {
                var instance = this.data(name);

                if (arguments.length == 1) {
                    if (is.object(arguments[0])) {
                        if (instance.setOptions) instance.setOptions(arguments[0]);
                    } else {
                        if (instance.getOption) instance.getOption(arguments[0]);
                    }
                } else if (instance.setOption) instance.setOption.apply(null, arguments);
            } else {
                var _arguments = arguments;

                this.each(function () {
                    var element = $(this);
                    var newArguments = helper.slice(_arguments);
                    helper.unshift(newArguments, c);
                    element.data(name, new (c.bind.apply(c, newArguments))());
                });

                return this;
            }
        };
    };

    ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };

    ui.mouseCoordinates = function () {
        var coordinates = {
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0
        };

        $(d).on('mousemove', function (e) {
            coordinates.clientX = e.clientX;
            coordinates.clientY = e.clientY;
            coordinates.pageX = e.pageX;
            coordinates.pageY = e.pageY;
        });

        return coordinates;
    }();

    $(d).on('DOMContentLoaded', function () {
        ui(d.body);
    });
})(window, document);