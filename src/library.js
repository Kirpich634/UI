"use strict";

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
    let is = w.is = data => typeof data;

    is.null = data => data === null;

    is.array = Array.isArray;

    is.window = data => data === window;

    for (let dataType of 'string symbol number boolean undefined object function'.split(' '))
        is[dataType] = data => typeof data === dataType;

    is.numeric = data => {
        let type = is(data);
        return ( type === "number" || type === "string" ) && !isNaN( data - parseFloat( data ) );
    };

    is.emptyObject = data => {
        if (data == null)
            return true;

        if (data.length > 0)
            return false;
        if (data.length === 0)
            return true;

        if (typeof data !== "object")
            return true;

        for (let key in data)
            if (Object.prototype.hasOwnProperty.call(data, key))
                return false;

        return true;
    };

    is.objectObject = (data) => is.object(data) === true && Object.prototype.toString.call(data) === '[object Object]';

    is.plainObject = (() => {
        let fnToString = Object.prototype.hasOwnProperty.toString;
        let ObjectFunctionString = fnToString.call( Object );

        return data => {
            if (!is.objectObject(data))
                return false;

            let proto = Object.getPrototypeOf(data);

            if (proto)
                return is.function(proto.constructor) && fnToString.call(proto.constructor) === ObjectFunctionString;
            else
                return true;
        }
    })();












    // is END

    // Array work

    let helpers = (function () {
        let methods = ('concat copyWithin entries every fill filter find findIndex forEach includes indexOf join keys lastIndexOf map pop push reduce reduceRight reverse shift slice some sort splice toLocaleString toString unshift').split(' ');

        let helpers = {};
        methods.forEach(function (value) {
            helpers[value] = function () {
                let method = Array.prototype[value];
                return (method.bind.apply(method, arguments))();
            }
        });

        return w.helper = helpers;
    })();

    // Array work end


    //animate START

    w.animate = (function () {
        let animations = [];

        let iteration = function () {
            let now = new Date();

            for (let animation of animations) {
                let passed = now - animation.start;

                animation.progress = passed / animation.duration;
                if ( animation.progress > 1)
                    animation.progress = 1;

                animation.render(animation.easing(animation.progress));

                if(animation.progress == 1) {
                    animations.splice(animations.indexOf(animation), 1);

                    if( is.function(animation.callback) )
                        animation.callback();
                }
            }

            if(animations.length > 0) requestAnimationFrame(iteration);
        };

        let Animate = function () {
            this.duration = 400;
            this.easing = animate.easing['ease'];
            this.render = false;
            this.callback = false;

            for (let argument of arguments) {
                if ( is.number(argument) )
                    this.duration = argument;
                else if ( is.string(argument) && is.function(animate.easing[argument]) ) {
                    this.easing = animate.easing[argument];
                } else if ( is.array(argument) ) {
                    this.easing = animate.bezier(argument[0], argument[1], argument[2], argument[3]);
                } else if ( is.function(argument) ) {
                    if( is.function(this.render) )
                        this.callback = argument;
                    else
                        this.render = argument;
                }
            }

            if ( !is.function(this.render) ) {
                console.log('render "' + is(this.render) + '" is not a Function!');
                return;
            }

            this.start = new Date();
            this.progress = 0;

            if (animations.length > 0)
                animations.push(this);
            else {
                animations.push(this);
                iteration();
            }
        };

        return function() {
            helper.unshift(arguments, Animate);
            return new (Animate.bind.apply(Animate, arguments))();
        };
    })();
    animate.bezier = (function(){
        let DEFAULT_DURATION = 400;
        let solveEpsilon = function(duration) {
            return 1.0 / (200.0 * duration);
        };

        return function(p1x, p1y, p2x, p2y) {
            let cx = 3.0 * p1x;
            let bx = 3.0 * (p2x - p1x) - cx;
            let ax = 1.0 - cx - bx;
            let cy = 3.0 * p1y;
            let by = 3.0 * (p2y - p1y) - cy;
            let ay = 1.0 - cy - by;

            let sampleCurveX = function (t) {
                return ((ax * t + bx) * t + cx) * t;
            };

            let sampleCurveY = function (t) {
                return ((ay * t + by) * t + cy) * t;
            };

            let sampleCurveDerivativeX = function (t) {
                return (3.0 * ax * t + 2.0 * bx) * t + cx;
            };

            let solveCurveX = function (x, epsilon) {
                let t0;
                let t1;
                let t2;
                let x2;
                let d2;
                let i;

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
                    if (x > x2) t0 = t2;
                    else t1 = t2;
                    t2 = (t1 - t0) * 0.5 + t0;
                }

                return t2;
            };

            let solve = function (x, epsilon) {
                return sampleCurveY(solveCurveX(x, epsilon));
            };

            return function (x, duration) {
                return solve(x, solveEpsilon(+duration || DEFAULT_DURATION));
            };
        };
    })();
    animate.easing = {
        linear: function(x) {
            return x;
        },
        ease: animate.bezier(0.25, 0.1, 0.25, 1.0),
        easeIn: animate.bezier(0.42, 0, 1.0, 1.0),
        easeOut: animate.bezier(0, 0, 0.58, 1.0),
        easeInOut: animate.bezier(0.42, 0, 0.58, 1.0),

        InApprox: function(x) {
            return Math.pow(x, 1.685);
        },
        InQuadratic: function(x) {
            return (x * x);
        },
        InCubic: function(x) {
            return (x * x * x);
        },
        OutApprox: function(x) {
            return 1 - Math.pow(1-x, 1.685);
        },
        OutQuadratic: function(x) {
            x -= 1;
            return 1 - (x * x);
        },
        OutCubic: function(x) {
            x -= 1;
            return 1 + (x * x * x);
        },
        InOutApprox: function(x) {
            if (x < 0.5) x = (2 * Math.pow(x, 1.685));
            else {
                x -= 1;
                return 1 - (2 * Math.pow(x, 1.685));
            }
            return x;
        },
        InOutQuadratic: function(x) {
            if (x < 0.5) return (2 * x * x);
            else {
                x -= 1;
                return 1 - (2 * x * x);
            }
        },
        InOutCubic: function(x) {
            if (x < 0.5) return (4 * x * x * x);
            else {
                x -= 1;
                return 1 + (4 * x * x * x);
            }
        },
        InOutQuartic: function(x) {
            if (x < 0.5) return (8 * x * x * x * x);
            else {
                x -= 1;
                return 1 + (8 * x * x * x * x);
            }
        },
        InOutQuintic: function(x) {
            if (x < 0.5) return (16 * x * x * x * x * x);
            else {
                x -= 1;
                return 1 + (16 * x * x * x * x * x);
            }
        }
    };

    //animate END


    $.normalizeAttrValue = function(value) {
        if (value === "true")
            return true;
        else if (value === "fasle")
            return false;
        else if (/^[-+\d]?\d+(\.\d+)?$/.test(value))
            return parseFloat(value);
        else
            return value;
    };

    // scrollSpy start


    (function () {
        let watchers = [];

        let iteration = function () {
            for (let watcher of watchers) {
                let rect = watcher.element.getBoundingClientRect();


            }
        };

        class scrollWatcher {
            constructor (element, enter, leave) {

                if (watchers.length > 0)
                    watchers.push(this);
                else {
                    watchers.push(this);
                    $(w).on('scroll', iteration);
                }
            }

            destroy() {
                watchers.splice(watchers.indexOf(this), 1);
                if (watchers.length == 0)
                    $(w).off('scroll', iteration);
            }
        }

        let watcher = function(element, enter, leave) {
            console.log(arguments);
            this.element = element;
            this.enter = enter;
            this.leave = leave;

            if (watchers.length > 0)
                watchers.push(this);
            else {
                watchers.push(this);
                $(w).on('scroll', iteration);
            }
        };


        $.fn.scrollWatcher = function () {
            if (this.data('scrollWatcher')) {
                let watcher = this.data('scrollWatcher');

                switch (arguments[0]) {

                }
            } else {
                let _arguments = arguments;
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
        let wrapper;
        let scrollTop;

        $(d).on('DOMContentLoaded', function () {
            let main = $('main');
            if (main.length)
                wrapper = main;
            else
                wrapper = $('body')
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

    $.fn.scrollParent = function( includeHidden ) {
        var position = this.css( "position" ),
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = this.parents().filter( function() {
                var parent = $( this );
                if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                    return false;
                }
                return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
            }).eq( 0 );

        return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
    };

    // $ library modification END

})(window, document);