'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    ui.dropdown = function () {
        _createClass(Dropdown, null, [{
            key: 'testClickLocation',
            value: function testClickLocation(target, elem) {
                return target == elem[0] || elem.has(target).length > 0;
            }
        }, {
            key: 'getSelectionText',
            value: function getSelectionText() {
                var txt = void 0;
                if (txt = window.getSelection) {
                    // Не IE, используем метод getSelection
                    txt = window.getSelection().toString();
                } else {
                    // IE, используем объект selection
                    txt = document.selection.createRange().text;
                }
                return txt;
            }
        }, {
            key: 'getViewport',
            value: function getViewport() {
                var m = document.compatMode == 'CSS1Compat';
                return {
                    l: w.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
                    t: w.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
                    w: d.documentElement.clientWidth,
                    h: d.documentElement.clientHeight
                };
            }
        }]);

        function Dropdown(element, options) {
            _classCallCheck(this, Dropdown);

            this.nodes = {
                element: element
            };

            this.options = $.extend({}, Dropdown.options);

            if (this.nodes.element.hasAttr('data-preventdefaultinitnodes')) this.options.preventDefaultInitNodes = this.nodes.element.attr('data-preventdefaultinitnodes');
            if (this.nodes.element.hasAttr('data-preventdefaultiniteventaction')) this.options.preventDefaultInitEventAction = this.nodes.element.attr('data-preventdefaultiniteventaction');

            $.extend(this.options, options);

            if (Dropdown.beforeInit) this.nodes.element.on('tabs:beforeInit', Dropdown.beforeInit);
            if (this.options.beforeInit) this.nodes.element.on('tabs:beforeInit', this.options.beforeInit);
            if (Dropdown.init) this.nodes.element.on('tabs:init', Dropdown.init);
            if (this.options.init) this.nodes.element.on('tabs:init', this.options.init);
            if (Dropdown.afterInit) this.nodes.element.on('tabs:afterInit', Dropdown.beforeInit);
            if (this.options.afterInit) this.nodes.element.on('tabs:afterInit', this.options.afterInit);
            if (Dropdown.beforeOpen) this.parent.on('dropdown:beforeOpen', Dropdown.beforeOpen);
            if (this.options.beforeOpen) this.parent.on('dropdown:beforeOpen', this.options.beforeOpen);
            if (Dropdown.open) this.parent.on('dropdown:open', Dropdown.open);
            if (this.options.open) this.parent.on('dropdown:open', this.options.open);
            if (Dropdown.afterOpen) this.parent.on('dropdown:afterOpen', Dropdown.afterOpen);
            if (this.options.afterOpen) this.parent.on('dropdown:afterOpen', this.options.afterOpen);
            if (Dropdown.beforeClose) this.parent.on('dropdown:beforeClose', Dropdown.beforeClose);
            if (this.options.beforeClose) this.parent.on('dropdown:beforeClose', this.options.beforeClose);
            if (Dropdown.close) this.parent.on('dropdown:close', Dropdown.close);
            if (this.options.close) this.parent.on('dropdown:close', this.options.close);
            if (Dropdown.afterClose) this.parent.on('dropdown:afterClose', Dropdown.afterClose);
            if (this.options.afterClose) this.parent.on('dropdown:afterClose', this.options.afterClose);

            this.permission = true;

            this.nodes.element.trigger('dropdown:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                if (is.HTMLElement(this.options.trigger)) this.nodes.trigger = $(this.options.trigger);else if (is.$(this.options.caller)) this.nodes.trigger = this.options.trigger;else this.nodes.trigger = this.nodes.element.find(this.options.trigger);

                if (is.HTMLElement(this.options.window)) this.nodes.window = $(this.options.window);else if (is.$(this.options.window)) this.nodes.window = this.options.window;else this.nodes.window = this.nodes.element.find(this.options.window);
            }

            this.nodes.element.trigger('dropdown:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {

                if (this.nodes.element.hasClass('disabled') || this.options.disabled) {
                    this.nodes.element.addClass('disabled');
                    if (this.nodes.trigger.prop("tagName").toLowerCase() == 'input') this.nodes.trigger.attr('disabled', true);
                } else this.reanimate();
            }

            this.nodes.element.trigger('dropdown:afterInit', [this]);
        }

        _createClass(Dropdown, [{
            key: 'kill',
            value: function kill() {
                this.nodes.trigger.off('click', this.call);
            }
        }, {
            key: 'reanimate',
            value: function reanimate() {
                this.nodes.trigger.on('click', $.proxy(this.call, this));
            }
        }, {
            key: 'call',
            value: function call() {
                if (!this.permission) return;
                setTimeout(function () {
                    if (Dropdown.getSelectionText() == "") this.open();
                }.bind(this), 0);
            }
        }, {
            key: 'mousedown',
            value: function mousedown(e) {
                if (Dropdown.testClickLocation(e.target, this.nodes.window)) return;else if (this.options.closeOnClickTrigger == false && Dropdown.testClickLocation(e.target, this.nodes.trigger)) return;

                this.close();

                $(w).one('mouseup', function () {
                    this.permission = false;
                    setTimeout(function () {
                        this.permission = true;
                    }.bind(this), 0);
                }.bind(this));
            }
        }, {
            key: 'open',
            value: function open() {
                this.nodes.window.removeClass('top right bottom left');

                var viewport = Dropdown.getViewport();
                var rect = this.nodes.element[0].getBoundingClientRect();

                var windowSize = {
                    width: this.nodes.window.outerWidth(),
                    height: this.nodes.window.outerHeight()
                };

                if (viewport.h - rect.bottom > rect.top || windowSize.height < viewport.h - rect.bottom) {
                    this.nodes.window.addClass('bottom');

                    if (this.options.maxHeight == 'auto' && windowSize.height > viewport.h - rect.bottom) this.nodes.window.css('height', viewport.h - rect.bottom);
                } else {
                    this.nodes.window.addClass('top');

                    if (this.options.maxHeight == 'auto' && windowSize.height > rect.top) this.nodes.window.css('height', rect.top);
                }

                if (viewport.w - rect.left > viewport.h - rect.right || windowSize.width < viewport.h - rect.left) {
                    this.nodes.window.addClass('left');

                    if (this.options.maxWidth == 'auto' && windowSize.width > rect.left) this.nodes.window.css('width', rect.left);
                } else {
                    this.nodes.window.addClass('right');

                    if (this.options.maxWidth == 'auto' && windowSize.width > viewport.h - rect.right) this.nodes.window.css('width', viewport.w - rect.right);
                }

                Dropdown.effects.open.fade(this);

                this.nodes.element.trigger('open', [this]);

                $(w).one('mousedown', $.proxy(this.mousedown, this));
            }
        }, {
            key: 'close',
            value: function close() {
                Dropdown.effects.close.fade(this);

                this.nodes.element.trigger('close');

                $(document).off('mousedown', this.mousedown);
            }
        }, {
            key: 'disable',
            value: function disable() {
                this.kill();

                this.nodes.element.addClass('disabled');

                if (this.nodes.trigger.prop("tagName").toLowerCase() == 'input') this.caller.attr('disabled', true);

                if (this.nodes.element.hasClass('open')) this.close();
            }
        }, {
            key: 'enable',
            value: function enable() {
                this.reanimate();

                this.nodes.element.removeClass('disabled');

                if (this.nodes.trigger.prop("tagName").toLowerCase() == 'input') this.caller.removeAttr('disabled');
            }
        }]);

        return Dropdown;
    }();

    ui.dropdown.effects = {
        open: {
            fade: function fade(instance) {
                instance.nodes.element.addClass('open');
            }
        },
        close: {
            fade: function fade(instance) {
                instance.nodes.element.removeClass('open');
            }
        }
    };

    ui.dropdown.options = {
        disabled: false,

        trigger: '.trigger',
        window: '.window',

        closeOnClickTrigger: true,
        maxWidth: 'auto',
        maxHeight: 'auto',

        openEffect: 'fade',
        closeEffect: 'fade',

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

    $.fn.dropdown = function (options) {
        if (this.data('dropdown')) {
            var dropdown = this.data('dropdown');

            switch (arguments[0]) {
                case 'openEffect':
                    if ($.isFunction(arguments[1])) dropdown.effects.open = arguments[1];else console.error('Effect must be function');

                    break;
                case 'closeEffect':
                    if ($.isFunction(arguments[1])) dropdown.effects.close = arguments[1];else console.error('Effect must be function');

                    break;
                case 'open':
                    dropdown.open();

                    break;
                case 'close':
                    dropdown.close();

                    break;
                case 'disable':
                    dropdown.disable();

                    break;
                case 'enable':
                    dropdown.enable();

                    break;
            }
        } else this.each(function () {
            var element = $(this);
            element.data('dropdown', new ui.dropdown(element, options));
        });

        return this;
    };
})(window, document);