'use strict';

(function (w, d) {
    var testClickLocation = function testClickLocation(target, elem) {
        return target == elem[0] || elem.has(target).length > 0;
    };

    var init = function init(element, options) {
        this.element = element.data('modal', this);

        this.options = {
            ajaxContent: false,
            content: 'modal window',
            substrate: true,
            effect: 'transform',
            substrateClass: 'dark',
            windowClass: '',
            closeButton: false,

            init: false,
            openStart: false,
            open: false,
            openEnd: false,
            closeStart: false,
            close: false,
            closeEnd: false
        };

        $.extend(this.options, options);

        this.scrollParent = this.element.scrollParent();

        if (this.options.init) this.element.on('modal:init', this.options.init.bind(this));
        if (this.options.openStart) this.element.on('modal:openStart', this.options.openStart.bind(this));
        if (this.options.open) this.element.on('modal:open', this.options.open.bind(this));
        if (this.options.openEnd) this.element.on('modal:openEnd', this.options.openEnd.bind(this));
        if (this.options.closeStart) this.element.on('modal:closeStart', this.options.closeStart.bind(this));
        if (this.options.close) this.element.on('modal:close', this.options.close.bind(this));
        if (this.options.closeEnd) this.element.on('modal:closeEnd', this.options.closeEnd.bind(this));

        this.permission = true;

        this.element.click(function (e) {
            e.preventDefault();
            if (this.permission) this.open();
        }.bind(this));

        this.element.trigger('modal:init', [this]);
    };

    init.prototype = {
        resize: function resize() {
            var substrateHeight = this.substrate.outerHeight();

            if (this.window.outerHeight(true) > substrateHeight) {
                this.heightFix = true;

                this.window.css('marginTop', '');

                this.marginTop = parseInt(this.window.css('marginTop'));
                this.marginBottom = parseInt(this.window.css('marginBottom'));
            } else {
                this.window.css({
                    marginTop: (substrateHeight - this.window.outerHeight()) / 2
                });

                this.heightFix = false;
            }
        },

        open: function open() {
            this.permission = false;
            this.heightFix = false;
            this.element.trigger('modal:openStart', [this]);
            w.scrollLock();

            if (is.nodeList(this.options.content) || is.text(this.options.content)) {
                this.window = $('<div>').append(this.options.content);
            } else if (is.HTMLElement(this.options.content)) {
                this.window = $(this.options.content.children);
            } else if (is.$(this.options.content)) {

                if (this.options.content.length > 1) {
                    this.window = $('<div>').append(this.options.content);
                } else this.window = this.options.content;
            } else {
                console.error('Неверный контент');
                console.error(this.options.content);
            }

            this.window.addClass('modal window container ' + this.options.windowClass);

            if (this.options.substrate) this.substrate = $('<div>').append(this.window).addClass('modal substrate fade transparent ' + this.options.substrateClass).on('click', function (e) {
                if (!testClickLocation(e.target, this.window) && this.permission) this.close();
            }.bind(this));

            if (this.options.closeButton) this.closeButton = this.window.find(this.options.closeButton).on('click', function (e) {
                e.preventDefault();

                if (this.permission) this.close();
            }.bind(this));

            var openEffect;
            if (is.function(this.options.effect)) openEffect = this.options.effect;else if (is.string(this.options.effect) && is.function(effects.open[this.options.effect])) openEffect = effects.open[this.options.effect];else if (is.object(this.options.effect) && is.function(this.options.effect.open)) openEffect = this.options.effect.open;else if (is.object(this.options.effect) && is.string(this.options.effect.open) && is.function(effects.open[this.options.effect.open])) openEffect = effects.open[this.options.effect.open];else openEffect = effects.open['transform'];

            this.element.trigger('modal:open', [this]);

            openEffect(this, function () {
                if (this.substrate) this.substrate.appendTo('body');else this.window.appendTo('body');

                this.resize();
                $(window).on('resize', $.proxy(this.resize, this));
            }.bind(this), function () {
                this.element.trigger('modal:openEnd', [this]);
                this.permission = true;
            }.bind(this));
        },

        close: function close() {
            this.permission = false;
            this.element.trigger('modal:closeStart', [this]);
            $(window).off('resize', $.proxy(this.resize, this));

            var closeEffect;
            if (is.function(this.options.effect)) closeEffect = this.options.effect;else if (is.string(this.options.effect) && is.function(effects.close[this.options.effect])) closeEffect = effects.close[this.options.effect];else if (is.object(this.options.effect) && is.function(this.options.effect.close)) closeEffect = this.options.effect.close;else if (is.object(this.options.effect) && is.string(this.options.effect.close) && is.function(effects.close[this.options.effect.close])) closeEffect = effects.close[this.options.effect.close];else closeEffect = effects.close['transform'];

            this.element.trigger('modal:close', [this]);

            closeEffect(this, function () {
                w.scrollUnlock();
                this.window.removeClass().remove();
                delete this.window;
                this.substrate.removeClass().remove();
                delete this.substrate;
                this.element.trigger('modal:closeEnd', [this]);
                this.permission = true;
            }.bind(this));
        }
    };

    $.fn.modal = function (options) {
        if (this.data('modal')) {
            var modal = this.data('modal');

            switch (arguments[0]) {
                case 'open':
                    modal.open();
                    break;
                case 'close':
                    modal.close();
                    break;
            }
        } else this.each(function () {
            if (is.HTMLTemplateElement(options.content)) options.content = $(options.content.content.childNodes);else if (is.documentFragment(options.content)) options.content = $(options.content.childNodes);else if (is.$(options.content) && options.content.length == 1 && is.HTMLTemplateElement(options.content[0])) options.content = $(options.content[0].content.childNodes);else if (is.$(options.content) && options.content.length == 1 && is.documentFragment(options.content[0])) options.content = $(options.content[0].childNodes);

            new init($(this), options);
        });

        return this;
    };
})(window, document);