'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

ui.add('reveal', function (w, d) {
    'use strict';

    return function (_ui$ui) {
        _inherits(Reveal, _ui$ui);

        _createClass(Reveal, null, [{
            key: 'preventDefaults',
            get: function get() {
                return {
                    initNodes: false,
                    init: false
                };
            }
        }, {
            key: 'options',
            get: function get() {
                return {
                    contentHidden: true,

                    viewport: {
                        within: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                        unlockEvent: false,
                        enter: {
                            once: false,
                            delay: 0
                        },
                        exit: {
                            once: false,
                            delay: 0
                        }
                    },

                    in: {
                        content: {
                            fade: {
                                easing: 'ease',
                                duration: 500,
                                delay: 100
                            },
                            translate: {
                                direction: 'lr',
                                easing: 'OutCubic',
                                duration: 1000,
                                value: 15,
                                units: '%',
                                delay: 0
                            }
                        },

                        revealer: {
                            color: '#000000',

                            in: {
                                fade: {
                                    easing: 'ease',
                                    duration: 300,
                                    delay: 0
                                },
                                scale: {
                                    direction: 'lr',
                                    easing: 'InOutQuintic',
                                    duration: 700,
                                    value: 15,
                                    units: '%',
                                    delay: 100
                                }
                            },

                            out: {
                                fade: {
                                    easing: 'ease',
                                    duration: 300,
                                    delay: 200
                                },
                                scale: {
                                    direction: 'lr',
                                    easing: 'InOutQuintic',
                                    duration: 500,
                                    value: 15,
                                    units: '%',
                                    delay: 0
                                }
                            }
                        }
                    },

                    out: {
                        content: {
                            fade: {
                                easing: 'ease',
                                duration: 700,
                                delay: 0
                            },
                            translate: {
                                direction: 'lr',
                                easing: 'InQuadratic',
                                duration: 700,
                                value: 15,
                                units: '%',
                                delay: 0
                            }
                        },

                        revealer: {
                            color: '#000000',

                            in: {
                                fade: {
                                    easing: 'ease',
                                    duration: 300,
                                    delay: 0
                                },
                                scale: {
                                    direction: 'lr',
                                    easing: 'InOutQuintic',
                                    duration: 700,
                                    value: 15,
                                    units: '%',
                                    delay: 0
                                }
                            },

                            out: {
                                fade: {
                                    easing: 'ease',
                                    duration: 300,
                                    delay: 200
                                },
                                scale: {

                                    direction: 'lr',
                                    easing: 'InOutQuintic',
                                    duration: 500,
                                    value: 15,
                                    units: '%',
                                    delay: 0
                                }
                            }
                        }
                    }
                };
            }
        }, {
            key: 'events',
            get: function get() {
                return {
                    beforeInitNodes: false,
                    afterInitNodes: false,
                    beforeInit: false,
                    afterInit: false,

                    beforeReveal: false,
                    onReveal: false,
                    afterReveal: false,

                    beforeRevealIn: false,

                    beforeRevealerInIn: false,
                    beforeRevealerInFadeIn: false,
                    beforeRevealerInScaleIn: false,

                    afterRevealerInIn: false,
                    afterRevealerInFadeIn: false,
                    afterRevealerInScaleIn: false,

                    beforeContentIn: false,
                    beforeContentFadeIn: false,
                    beforeContentTranslateIn: false,

                    afterContentIn: false,
                    afterContentFadeIn: false,
                    afterContentTranslateIn: false,

                    beforeRevealerInOut: false,
                    beforeRevealerInFadeOut: false,
                    beforeRevealerInScaleOut: false,

                    afterRevealerInOut: false,
                    afterRevealerInFadeOut: false,
                    afterRevealerInScaleOut: false,

                    afterRevealIn: false,

                    beforeRevealOut: false,

                    beforeRevealerOutIn: false,
                    beforeRevealerOutFadeIn: false,
                    beforeRevealerOutScaleIn: false,

                    afterRevealerOutIn: false,
                    afterRevealerOutFadeIn: false,
                    afterRevealerOutScaleIn: false,

                    beforeContentOut: false,
                    beforeContentFadeOut: false,
                    beforeContentTranslateOut: false,

                    afterContentOut: false,
                    afterContentFadeOut: false,
                    afterContentTranslateOut: false,

                    beforeRevealerOutOut: false,
                    beforeRevealerOutFadeOut: false,
                    beforeRevealerOutScaleOut: false,

                    afterRevealerOutOut: false,
                    afterRevealerOutFadeOut: false,
                    afterRevealerOutScaleOut: false,

                    afterRevealOut: false
                };
            }
        }]);

        function Reveal(element, options) {
            _classCallCheck(this, Reveal);

            return _possibleConstructorReturn(this, (Reveal.__proto__ || Object.getPrototypeOf(Reveal)).call(this, 'reveal', element, options, function () {
                var revealer = element.children('reveal-revealer');
                if (revealer.length > 0) this.nodes.revealer = revealer;else this.nodes.revealer = $('<div class="reveal-revealer">').appendTo(element);

                var content = element.children('reveal-content');
                if (content.length > 0) this.nodes.content = content;else this.nodes.content = $('<div class="reveal-content">').append(element.contents().grep(this.nodes.revealer)).appendTo(element);
            }, function () {
                this.nodes.content.css('opacity', 0);

                var initRevealOnEnterViewport = function () {
                    if (this.options.viewport && (this.options.viewport.enter || this.options.viewport.exit)) {
                        var watcher = scrollMonitor.create(this.nodes.element[0], this.options.viewport.within);

                        if (this.options.viewport.enter) watcher.enterViewport(function () {
                            if (this.options.viewport.enter.delay) setTimeout(function () {
                                this.in();
                            }.bind(this), this.options.viewport.enter.delay);else this.in();

                            if (this.options.viewport.enter.once) watcher.destroy();
                        }.bind(this));

                        if (this.options.viewport.exit) watcher.exitViewport(function () {
                            if (this.options.viewport.exit.delay) setTimeout(function () {
                                this.out();
                            }.bind(this), this.options.viewport.exit.delay);else this.out();

                            if (this.options.viewport.exit.once) watcher.destroy();
                        }.bind(this));
                    }
                }.bind(this);

                if (this.options.viewport.unlockEvent) $(d).on(this.options.viewport.unlockEvent, initRevealOnEnterViewport);else initRevealOnEnterViewport();
            }));
        }

        _createClass(Reveal, [{
            key: 'in',
            value: function _in() {
                if (!this.permission) return;
                this.permission = false;

                this.nodes.element.trigger('reveal:beforeReveal', [this]).trigger('reveal:beforeRevealIn', [this]);

                var callback = function () {
                    this.nodes.element.trigger('reveal:afterReveal', [this]).trigger('reveal:afterRevealIn', [this]);

                    this.permission = true;
                }.bind(this);

                if (!this.options.in.revealer.in.fade && !this.options.in.revealer.in.scale) {
                    if (!this.options.in.content.fade) this.nodes.content.css('opacity', 1);

                    this.contentIn(function () {
                        this.nodes.element.trigger('reveal:afterContentIn', [this]);
                        callback();
                    }.bind(this));
                } else {
                    this.nodes.element.trigger('reveal:beforeRevealerInIn', [this]);

                    this.revealerIn(this.options.in.revealer.color, this.options.in.revealer.in.scale ? {
                        before: function () {
                            if (!this.options.in.revealer.in.fade) this.nodes.revealer.css('opacity', 1);

                            this.nodes.element.trigger('reveal:deforeRevealerInScaleIn', [this]);
                        }.bind(this),
                        direction: this.options.in.revealer.in.scale.direction,
                        duration: this.options.in.revealer.in.scale.duration,
                        easing: this.options.in.revealer.in.scale.easing,
                        delay: this.options.in.revealer.in.scale.delay,
                        callback: function () {
                            this.nodes.element.trigger('reveal:afterRevealerInScaleIn', [this]);
                        }.bind(this)
                    } : false, this.options.in.revealer.in.fade ? {
                        before: function () {
                            this.nodes.element.trigger('reveal:deforeRevealerInFadeIn', [this]);
                        }.bind(this),
                        duration: this.options.in.revealer.in.fade.duration,
                        easing: this.options.in.revealer.in.fade.easing,
                        delay: this.options.in.revealer.in.fade.delay,
                        callback: function () {
                            this.nodes.element.trigger('reveal:afterRevealerInFadeIn', [this]);
                        }.bind(this)
                    } : false, function () {
                        this.nodes.element.trigger('reveal:afterRevealerInIn', [this]);

                        var lastCallback = true;

                        var runLastCallback = function () {
                            if (lastCallback) {
                                callback();
                            } else lastCallback = true;
                        }.bind(this);

                        if (!this.options.in.content.fade) this.nodes.content.css('opacity', 1);

                        this.contentIn(function () {
                            this.nodes.element.trigger('reveal:afterContentIn', [this]);

                            runLastCallback();
                        }.bind(this));

                        this.nodes.element.trigger('reveal:beforeRevealerInOut', [this]);
                        this.revealerOut(this.options.in.revealer.out.scale ? {
                            before: function () {
                                this.nodes.element.trigger('reveal:deforeRevealerInScaleOut', [this]);
                            }.bind(this),
                            direction: this.options.in.revealer.out.scale.direction,
                            duration: this.options.in.revealer.out.scale.duration,
                            easing: this.options.in.revealer.out.scale.easing,
                            delay: this.options.in.revealer.out.scale.delay,
                            callback: function () {
                                if (!this.options.in.revealer.out.fade) this.nodes.revealer.css('opacity', 0);

                                this.nodes.element.trigger('reveal:afterRevealerInFadeOut', [this]);
                            }.bind(this)
                        } : false, this.options.in.revealer.out.fade ? {
                            before: function () {
                                this.nodes.element.trigger('reveal:deforeRevealerInFadeOut', [this]);
                            }.bind(this),
                            duration: this.options.in.revealer.out.fade.duration,
                            easing: this.options.in.revealer.out.fade.easing,
                            delay: this.options.in.revealer.out.fade.delay,
                            callback: function () {
                                this.nodes.element.trigger('reveal:afterRevealerInFadeOut', [this]);
                            }.bind(this)
                        } : false, function () {
                            this.nodes.element.trigger('reveal:afterRevealerInOut', [this]);
                            runLastCallback();
                        }.bind(this));
                    }.bind(this));
                }
            }
        }, {
            key: 'out',
            value: function out() {
                if (!this.permission) return;
                this.permission = false;

                this.nodes.element.trigger('reveal:beforeReveal', [this]).trigger('reveal:beforeRevealOut', [this]);

                var callback = function () {
                    this.nodes.element.trigger('reveal:afterReveal', [this]).trigger('reveal:afterRevealOut', [this]);

                    this.permission = true;
                }.bind(this);

                var lastCallback = true;

                var runLastCallback = function () {
                    if (lastCallback) {
                        callback();
                    } else lastCallback = true;
                }.bind(this);

                this.nodes.element.trigger('reveal:beforeRevealerOutIn', [this]);
                this.revealerIn(this.options.out.revealer.color, this.options.out.revealer.in.scale ? {
                    before: function () {
                        if (!this.options.out.revealer.in.fade) this.nodes.revealer.css('opacity', 1);

                        this.nodes.element.trigger('reveal:deforeRevealerOutScaleIn', [this]);
                    }.bind(this),
                    direction: this.options.out.revealer.in.scale.direction,
                    duration: this.options.out.revealer.in.scale.duration,
                    easing: this.options.out.revealer.in.scale.easing,
                    delay: this.options.out.revealer.in.scale.delay,
                    callback: function () {
                        this.nodes.element.trigger('reveal:afterRevealerOutScaleIn', [this]);
                    }.bind(this)
                } : false, this.options.out.revealer.in.fade ? {
                    before: function () {
                        this.nodes.element.trigger('reveal:deforeRevealerOutFadeIn', [this]);
                    }.bind(this),
                    duration: this.options.out.revealer.in.fade.duration,
                    easing: this.options.out.revealer.in.fade.easing,
                    delay: this.options.out.revealer.in.fade.delay,
                    callback: function () {
                        if (!this.options.out.revealer.out.fade) this.nodes.revealer.css('opacity', 0);

                        this.nodes.element.trigger('reveal:afterRevealerOutFadeIn', [this]);
                    }.bind(this)
                } : false, function () {
                    this.nodes.element.trigger('reveal:afterRevealerOutIn', [this]);

                    if (!this.options.out.content.fade) this.nodes.content.css('opacity', 0);

                    this.nodes.element.trigger('reveal:beforeRevealerOutOut', [this]);
                    this.revealerOut(this.options.out.revealer.out.scale ? {
                        before: function () {
                            this.nodes.element.trigger('reveal:deforeRevealerOutScaleOut', [this]);
                        }.bind(this),
                        direction: this.options.out.revealer.out.scale.direction,
                        duration: this.options.out.revealer.out.scale.duration,
                        easing: this.options.out.revealer.out.scale.easing,
                        delay: this.options.out.revealer.out.scale.delay,
                        callback: function () {
                            this.nodes.element.trigger('reveal:afterRevealerOutScaleOut', [this]);
                        }.bind(this)
                    } : false, this.options.out.revealer.out.fade ? {
                        before: function () {
                            this.nodes.element.trigger('reveal:deforeRevealerOutFadeOut', [this]);
                        }.bind(this),
                        duration: this.options.out.revealer.out.fade.duration,
                        easing: this.options.out.revealer.out.fade.easing,
                        delay: this.options.out.revealer.out.fade.delay,
                        callback: function () {
                            this.nodes.element.trigger('reveal:afterRevealerOutFadeOut', [this]);
                        }.bind(this)
                    } : false, function () {
                        this.nodes.element.trigger('reveal:afterRevealerOutOut', [this]);

                        runLastCallback();
                    }.bind(this));
                }.bind(this));

                this.contentOut(function () {
                    this.nodes.element.trigger('reveal:afterContentOut', [this]);
                    runLastCallback();
                }.bind(this));
            }
        }, {
            key: 'contentIn',
            value: function contentIn(callback) {
                this.nodes.element.trigger('reveal:beforeContentIn', [this]);

                this.contentAnimate(this.options.in.content.fade ? {
                    before: function () {
                        this.nodes.element.trigger('reveal:beforeContentFadeIn', [this]);
                    }.bind(this),
                    duration: this.options.in.content.fade.duration,
                    easing: this.options.in.content.fade.easing,
                    delay: this.options.in.content.fade.delay,
                    progressDirection: function progressDirection(progress) {
                        return progress;
                    },
                    callback: function () {
                        this.nodes.element.trigger('reveal:afterContentFadeIn', [this]);
                    }.bind(this)
                } : false, this.options.in.content.translate ? {
                    before: function () {
                        this.nodes.element.trigger('reveal:beforeContentTranslateIn', [this]);
                    }.bind(this),
                    duration: this.options.in.content.translate.duration,
                    easing: this.options.in.content.translate.easing,
                    delay: this.options.in.content.translate.delay,
                    value: this.options.in.content.translate.value,
                    units: this.options.in.content.translate.units,
                    progressDirection: function progressDirection(progress) {
                        return 1 - progress;
                    },
                    callback: function () {
                        this.nodes.element.trigger('reveal:afterContentTranslateIn', [this]);
                    }.bind(this)
                } : false, function () {
                    var contentTransform = void 0;

                    switch (this.options.in.content.translate.direction) {
                        case 'tb':
                            contentTransform = function (progress) {
                                return 'translateY(' + -this.options.in.content.translate.value * progress + this.options.in.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'rl':
                            contentTransform = function (progress) {
                                return 'translateX(' + this.options.in.content.translate.value * progress + this.options.in.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'bt':
                            contentTransform = function (progress) {
                                return 'translateY(' + this.options.in.content.translate.value * progress + this.options.in.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'lr':
                        default:
                            contentTransform = function (progress) {
                                return 'translateX(' + -this.options.in.content.translate.value * progress + this.options.in.content.translate.units + ')';
                            }.bind(this);

                            break;
                    }

                    return contentTransform;
                }.bind(this), callback);
            }
        }, {
            key: 'contentOut',
            value: function contentOut(callback) {
                this.nodes.element.trigger('reveal:beforeContentOut', [this]);

                this.contentAnimate(this.options.out.content.fade ? {
                    before: function () {
                        this.nodes.element.trigger('reveal:beforeContentFadeOut', [this]);
                    }.bind(this),
                    duration: this.options.out.content.fade.duration,
                    easing: this.options.out.content.fade.easing,
                    delay: this.options.out.content.fade.delay,
                    progressDirection: function progressDirection(progress) {
                        return 1 - progress;
                    },
                    callback: function () {
                        this.nodes.element.trigger('reveal:afterContentFadeOut', [this]);
                    }.bind(this)
                } : false, this.options.out.content.translate ? {
                    before: function () {
                        this.nodes.element.trigger('reveal:beforeContentTranslateOut', [this]);
                    }.bind(this),
                    duration: this.options.out.content.translate.duration,
                    easing: this.options.out.content.translate.easing,
                    delay: this.options.out.content.translate.delay,
                    value: this.options.out.content.translate.value,
                    units: this.options.out.content.translate.units,
                    progressDirection: function progressDirection(progress) {
                        return progress;
                    },

                    callback: function () {
                        this.nodes.element.trigger('reveal:afterContentTranslateOut', [this]);
                    }.bind(this)
                } : false, function () {
                    var contentTransform = void 0;

                    switch (this.options.out.content.translate.direction) {
                        case 'tb':
                            contentTransform = function (progress) {
                                return 'translateY(' + -this.options.out.content.translate.value * progress + this.options.out.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'rl':
                            contentTransform = function (progress) {
                                return 'translateX(' + -this.options.out.content.translate.value * progress + this.options.out.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'bt':
                            contentTransform = function (progress) {
                                return 'translateY(' + -this.options.out.content.translate.value * progress + this.options.out.content.translate.units + ')';
                            }.bind(this);

                            break;
                        case 'lr':
                        default:
                            contentTransform = function (progress) {
                                return 'translateX(' + this.options.out.content.translate.value * progress + this.options.out.content.translate.units + ')';
                            }.bind(this);

                            break;
                    }

                    return contentTransform;
                }.bind(this), callback);
            }
        }, {
            key: 'contentAnimate',
            value: function contentAnimate(fade, translate, transform, callback) {
                if (!fade && !translate) {
                    callback();
                    return false;
                } else if (fade && translate && fade.duration == translate.duration && fade.easing == translate.easing && fade.delay == translate.delay) {
                    fade.before();
                    translate.before();

                    var contentTranslate = transform();

                    var contentAnimate = function () {
                        animate(fade.duration, fade.easing, function (progress) {
                            progress = fade.progressDirection(progress);
                            this.nodes.content.css({
                                'transform': contentTranslate(progress),
                                'opacity': progress
                            });
                        }.bind(this), function () {
                            fade.callback();
                            translate.callback();
                            callback();
                        }.bind(this));
                    }.bind(this);

                    if (fade.delay) {
                        setTimeout(contentAnimate, fade.delay);
                    } else contentAnimate();
                } else {
                    var lastCallback = false;

                    var runCallback = function () {
                        if (lastCallback) {
                            callback();
                        } else lastCallback = true;
                    }.bind(this);

                    if (fade) {
                        fade.before();

                        var contentAnimateFade = function () {
                            animate(fade.duration, fade.easing, function (progress) {
                                this.nodes.content.css('opacity', fade.progressDirection(progress));
                            }.bind(this), function () {
                                if (!translate) lastCallback = true;

                                fade.callback();
                                runCallback();
                            }.bind(this));
                        }.bind(this);

                        if (fade.delay) {
                            setTimeout(contentAnimateFade.bind(this), fade.delay);
                        } else contentAnimateFade();
                    }

                    if (translate) {
                        translate.before();

                        var _contentTranslate = transform();

                        var contentAnimateTranslate = function () {
                            animate(translate.duration, translate.easing, function (progress) {
                                this.nodes.content.css('transform', _contentTranslate(translate.progressDirection(progress)));
                            }.bind(this), function () {
                                if (!fade) lastCallback = true;

                                translate.callback();
                                runCallback();
                            }.bind(this));
                        }.bind(this);

                        if (translate.delay) {
                            setTimeout(contentAnimateTranslate.bind(this), translate.delay);
                        } else contentAnimateTranslate();
                    }
                }
            }
        }, {
            key: 'revealerIn',
            value: function revealerIn(color, scale, fade, callback) {
                this.nodes.element.trigger('reveal:beforeRevealer', [this]).trigger('reveal:beforeRevealerIn', [this]);

                this.nodes.revealer.css('background-color', color);

                this.revealerAnimate(function () {
                    switch (scale.direction) {
                        case 'tb':
                            this.nodes.revealer.css('transform-origin', '50% 0');
                            break;

                        case 'rl':
                            this.nodes.revealer.css('transform-origin', '100% 50%');

                            break;
                        case 'bt':
                            this.nodes.revealer.css('transform-origin', '50% 100%');

                            break;
                        case 'lr':
                        default:
                            this.nodes.revealer.css('transform-origin', '0 50%');

                            break;
                    }

                    if (scale.direction === 'tb' || scale.direction === 'bt') return function (progress) {
                        return 'scaleY(' + progress + ')';
                    };else return function (progress) {
                        return 'scaleX(' + progress + ')';
                    };
                }.bind(this), function (progress) {
                    return progress;
                }, scale, fade, callback);
            }
        }, {
            key: 'revealerOut',
            value: function revealerOut(scale, fade, callback) {
                this.revealerAnimate(function () {
                    switch (scale.direction) {
                        case 'tb':
                            this.nodes.revealer.css('transform-origin', '50% 100%');
                            break;

                        case 'rl':
                            this.nodes.revealer.css('transform-origin', '0 50%');

                            break;
                        case 'bt':
                            this.nodes.revealer.css('transform-origin', '50% 0');

                            break;
                        case 'lr':
                        default:
                            this.nodes.revealer.css('transform-origin', '100% 50%');

                            break;
                    }

                    if (scale.direction === 'tb' || scale.direction === 'bt') return function (progress) {
                        return 'scaleY(' + progress + ')';
                    };else return function (progress) {
                        return 'scaleX(' + progress + ')';
                    };
                }.bind(this), function (progress) {
                    return 1 - progress;
                }, scale, fade, callback);
            }
        }, {
            key: 'revealerAnimate',
            value: function revealerAnimate(revealerTransformConfigure, progressDirection, scale, fade, callback) {
                if (!scale && !fade) {
                    callback();
                    return false;
                } else if (scale && fade && scale.duration == fade.duration && scale.easing == fade.easing && scale.delay == fade.delay) {
                    var revealerTransform = revealerTransformConfigure();

                    var revealerAnimate = function () {
                        animate(scale.duration, scale.easing, function (progress) {
                            progress = progressDirection(progress);
                            this.nodes.revealer.css({
                                'transform': revealerTransform(progress),
                                'opacity': progress
                            });
                        }.bind(this), function () {
                            scale.callback();
                            fade.callback();
                            callback();
                        }.bind(this));
                    }.bind(this);

                    if (scale.delay) {
                        setTimeout(revealerAnimate, scale.delay);
                    } else revealerAnimate();
                } else {
                    var lastCallback = false;

                    var runCallback = function () {
                        if (lastCallback) callback();else lastCallback = true;
                    }.bind(this);

                    if (fade) {
                        fade.before();

                        var revealerAnimateFade = function () {
                            animate(fade.duration, fade.easing, function (progress) {
                                this.nodes.revealer.css('opacity', progressDirection(progress));
                            }.bind(this), function () {
                                if (!scale) lastCallback = true;

                                fade.callback();
                                runCallback();
                            }.bind(this));
                        }.bind(this);

                        if (fade) {
                            setTimeout(revealerAnimateFade.bind(this), fade.delay);
                        } else revealerAnimateFade();
                    }

                    if (scale) {
                        scale.before();

                        var _revealerTransform = revealerTransformConfigure();

                        var revealerAnimateScale = function () {
                            animate(scale.duration, scale.easing, function (progress) {
                                this.nodes.revealer.css('transform', _revealerTransform(progressDirection(progress)));
                            }.bind(this), function () {
                                if (!fade) lastCallback = true;

                                scale.callback();
                                runCallback();
                            }.bind(this));
                        }.bind(this);

                        if (scale.delay) {
                            setTimeout(revealerAnimateScale.bind(this), scale.delay);
                        } else revealerAnimateScale();
                    }
                }
            }
        }]);

        return Reveal;
    }(ui.ui);
}(window, document));