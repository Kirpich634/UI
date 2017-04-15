"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    // random START

    w.random = function () {
        return Math.random();
    };
    random.float = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    random.int = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // random END


    // is START
    var is = w.is = function (data) {
        return typeof data === 'undefined' ? 'undefined' : _typeof(data);
    };

    is.null = function (data) {
        return data === null;
    };

    is.array = Array.isArray;

    is.window = function (data) {
        return data === window;
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var dataType = _step.value;

            is[dataType] = function (data) {
                return (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === dataType;
            };
        };

        for (var _iterator = 'string symbol number boolean undefined object function'.split(' ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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

    is.numeric = function (data) {
        var type = is(data);
        return (type === "number" || type === "string") && !isNaN(data - parseFloat(data));
    };

    is.emptyObject = function (data) {
        if (data == null) return true;

        if (data.length > 0) return false;
        if (data.length === 0) return true;

        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== "object") return true;

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) return false;
        }return true;
    };

    is.objectObject = function (data) {
        return is.object(data) === true && Object.prototype.toString.call(data) === '[object Object]';
    };

    is.plainObject = function () {
        var fnToString = Object.prototype.hasOwnProperty.toString;
        var ObjectFunctionString = fnToString.call(Object);

        return function (data) {
            if (!is.objectObject(data)) return false;

            var proto = Object.getPrototypeOf(data);

            if (proto) return is.function(proto.constructor) && fnToString.call(proto.constructor) === ObjectFunctionString;else return true;
        };
    }();

    // is END

    // Array work

    var helpers = function () {
        var methods = 'concat copyWithin entries every fill filter find findIndex forEach includes indexOf join keys lastIndexOf map pop push reduce reduceRight reverse shift slice some sort splice toLocaleString toString unshift'.split(' ');

        var helpers = {};
        methods.forEach(function (value) {
            helpers[value] = function () {
                var method = Array.prototype[value];
                return method.bind.apply(method, arguments)();
            };
        });

        return w.helper = helpers;
    }();

    // Array work end


    //animate START

    w.animate = function () {
        var animations = [];

        var iteration = function iteration() {
            var now = new Date();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = animations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var animation = _step2.value;

                    var passed = now - animation.start;

                    animation.progress = passed / animation.duration;
                    if (animation.progress > 1) animation.progress = 1;

                    animation.render(animation.easing(animation.progress));

                    if (animation.progress == 1) {
                        animations.splice(animations.indexOf(animation), 1);

                        if (is.function(animation.callback)) animation.callback();
                    }
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

            if (animations.length > 0) requestAnimationFrame(iteration);
        };

        var Animate = function Animate() {
            this.duration = 400;
            this.easing = animate.easing['ease'];
            this.render = false;
            this.callback = false;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = arguments[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var argument = _step3.value;

                    if (is.number(argument)) this.duration = argument;else if (is.string(argument) && is.function(animate.easing[argument])) {
                        this.easing = animate.easing[argument];
                    } else if (is.array(argument)) {
                        this.easing = animate.bezier(argument[0], argument[1], argument[2], argument[3]);
                    } else if (is.function(argument)) {
                        if (is.function(this.render)) this.callback = argument;else this.render = argument;
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

            if (!is.function(this.render)) {
                console.log('render "' + is(this.render) + '" is not a Function!');
                return;
            }

            this.start = new Date();
            this.progress = 0;

            if (animations.length > 0) animations.push(this);else {
                animations.push(this);
                iteration();
            }
        };

        return function () {
            helper.unshift(arguments, Animate);
            return new (Animate.bind.apply(Animate, arguments))();
        };
    }();
    animate.bezier = function () {
        var DEFAULT_DURATION = 400;
        var solveEpsilon = function solveEpsilon(duration) {
            return 1.0 / (200.0 * duration);
        };

        return function (p1x, p1y, p2x, p2y) {
            var cx = 3.0 * p1x;
            var bx = 3.0 * (p2x - p1x) - cx;
            var ax = 1.0 - cx - bx;
            var cy = 3.0 * p1y;
            var by = 3.0 * (p2y - p1y) - cy;
            var ay = 1.0 - cy - by;

            var sampleCurveX = function sampleCurveX(t) {
                return ((ax * t + bx) * t + cx) * t;
            };

            var sampleCurveY = function sampleCurveY(t) {
                return ((ay * t + by) * t + cy) * t;
            };

            var sampleCurveDerivativeX = function sampleCurveDerivativeX(t) {
                return (3.0 * ax * t + 2.0 * bx) * t + cx;
            };

            var solveCurveX = function solveCurveX(x, epsilon) {
                var t0 = void 0;
                var t1 = void 0;
                var t2 = void 0;
                var x2 = void 0;
                var d2 = void 0;
                var i = void 0;

                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = sampleCurveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return t2;

                    d2 = sampleCurveDerivativeX(t2);
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }

                t0 = 0.0;
                t1 = 1.0;
                t2 = x;

                if (t2 < t0) return t0;
                if (t2 > t1) return t1;

                while (t0 < t1) {
                    x2 = sampleCurveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return t2;
                    if (x > x2) t0 = t2;else t1 = t2;
                    t2 = (t1 - t0) * 0.5 + t0;
                }

                return t2;
            };

            var solve = function solve(x, epsilon) {
                return sampleCurveY(solveCurveX(x, epsilon));
            };

            return function (x, duration) {
                return solve(x, solveEpsilon(+duration || DEFAULT_DURATION));
            };
        };
    }();
    animate.easing = {
        linear: function linear(x) {
            return x;
        },
        ease: animate.bezier(0.25, 0.1, 0.25, 1.0),
        easeIn: animate.bezier(0.42, 0, 1.0, 1.0),
        easeOut: animate.bezier(0, 0, 0.58, 1.0),
        easeInOut: animate.bezier(0.42, 0, 0.58, 1.0),

        InApprox: function InApprox(x) {
            return Math.pow(x, 1.685);
        },
        InQuadratic: function InQuadratic(x) {
            return x * x;
        },
        InCubic: function InCubic(x) {
            return x * x * x;
        },
        OutApprox: function OutApprox(x) {
            return 1 - Math.pow(1 - x, 1.685);
        },
        OutQuadratic: function OutQuadratic(x) {
            x -= 1;
            return 1 - x * x;
        },
        OutCubic: function OutCubic(x) {
            x -= 1;
            return 1 + x * x * x;
        },
        InOutApprox: function InOutApprox(x) {
            if (x < 0.5) x = 2 * Math.pow(x, 1.685);else {
                x -= 1;
                return 1 - 2 * Math.pow(x, 1.685);
            }
            return x;
        },
        InOutQuadratic: function InOutQuadratic(x) {
            if (x < 0.5) return 2 * x * x;else {
                x -= 1;
                return 1 - 2 * x * x;
            }
        },
        InOutCubic: function InOutCubic(x) {
            if (x < 0.5) return 4 * x * x * x;else {
                x -= 1;
                return 1 + 4 * x * x * x;
            }
        },
        InOutQuartic: function InOutQuartic(x) {
            if (x < 0.5) return 8 * x * x * x * x;else {
                x -= 1;
                return 1 + 8 * x * x * x * x;
            }
        },
        InOutQuintic: function InOutQuintic(x) {
            if (x < 0.5) return 16 * x * x * x * x * x;else {
                x -= 1;
                return 1 + 16 * x * x * x * x * x;
            }
        }
    };

    //animate END


    $.normalizeAttrValue = function (value) {
        if (value === "true") return true;else if (value === "fasle") return false;else if (/^[-+\d]?\d+(\.\d+)?$/.test(value)) return parseFloat(value);else return value;
    };

    // scrollSpy start


    (function () {
        var watchers = [];

        var iteration = function iteration() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = watchers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _watcher = _step4.value;

                    var rect = _watcher.element.getBoundingClientRect();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        };

        var scrollWatcher = function () {
            function scrollWatcher(element, enter, leave) {
                _classCallCheck(this, scrollWatcher);

                if (watchers.length > 0) watchers.push(this);else {
                    watchers.push(this);
                    $(w).on('scroll', iteration);
                }
            }

            _createClass(scrollWatcher, [{
                key: 'destroy',
                value: function destroy() {
                    watchers.splice(watchers.indexOf(this), 1);
                    if (watchers.length == 0) $(w).off('scroll', iteration);
                }
            }]);

            return scrollWatcher;
        }();

        var watcher = function watcher(element, enter, leave) {
            console.log(arguments);
            this.element = element;
            this.enter = enter;
            this.leave = leave;

            if (watchers.length > 0) watchers.push(this);else {
                watchers.push(this);
                $(w).on('scroll', iteration);
            }
        };

        $.fn.scrollWatcher = function () {
            if (this.data('scrollWatcher')) {
                var _watcher2 = this.data('scrollWatcher');

                switch (arguments[0]) {}
            } else {
                var _arguments = arguments;
                this.each(function () {
                    helper.unshift(_arguments, this);
                    helper.unshift(_arguments, watcher);
                    $(this).data('scrollWatcher', new (watcher.bind.apply(watcher, _arguments))());
                });
            }
        };
    })();

    //scrollSpy end


    // scroll lock START

    (function () {
        var wrapper = void 0;
        var scrollTop = void 0;

        $(d).on('DOMContentLoaded', function () {
            var main = $('main');
            if (main.length) wrapper = main;else wrapper = $('body');
        });

        $.scrollLock = function () {
            scrollTop = $(w).scrollTop();

            wrapper.css({
                position: 'fixed',
                top: -scrollTop
            });
        };

        $.scrollUnlock = function () {
            wrapper.css({
                position: '',
                top: ''
            });

            $(w).scrollTop(scrollTop);

            scrollMonitor.recalculateLocations();
        };
    })();

    // scroll lock END

    // $ library modification START

    $.fn.grep = function (innerOb) {
        return this.filter(function (i, v) {
            return !innerOb.is(this);
        });
    };

    $.fn.hasAttr = function (name) {
        return this[0].hasAttribute(name);
    };

    $.fn.scrollParent = function (includeHidden) {
        var position = this.css("position"),
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = this.parents().filter(function () {
            var parent = $(this);
            if (excludeStaticParent && parent.css("position") === "static") {
                return false;
            }
            return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
        }).eq(0);

        return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
    };

    // $ library modification END
})(window, document);