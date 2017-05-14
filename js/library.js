"use strict";

(function (w, d) {
    // random START
    w.random = () => Math.random();
    random.float = (min, max) => Math.random() * (max - min) + min;
    random.int = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    // random END

    // is START
    let is = w.is = data => typeof data;
    is.null = data => data === null;
    is.array = Array.isArray;
    is.window = data => data === w;
    is.string = data => typeof data === 'string';
    is.symbol = data => typeof data === 'symbol';
    is.number = data => typeof data === 'number';
    is.boolean = data => typeof data === 'boolean';
    is.undefined = data => typeof data === 'undefined';
    is.object = data => typeof data === 'object';
    is.function = data => typeof data === 'function';
    // for (let dataType of 'string symbol number boolean undefined object function'.split(' '))
    //     is[dataType] = data => typeof data === dataType;
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

})(window, document);