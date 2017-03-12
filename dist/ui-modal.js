'use strict';

(function ($) {
    var testClickLocation = function testClickLocation(target, elem) {
        return target != elem[0] && elem.has(target).length == 0;
    };

    var create = {
        container: function container(target) {
            var screen = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };

            var targetRect = target.getBoundingClientRect();

            var cs = getComputedStyle(target);

            return $('<section>').addClass('ui').addClass('modal').addClass('container').css({
                top: targetRect.top + "px",
                left: targetRect.left + "px",
                width: targetRect.right - targetRect.left + "px",
                height: targetRect.bottom - targetRect.top + "px",
                borderRadius: cs.borderRadius,
                backgroundColor: cs.backgroundColor != "rgba(0, 0, 0, 0)" ? cs.backgroundColor : "#FAFAFA"
            });
        },
        blackout: function blackout() {
            return $('<hr>').addClass('ui').addClass('modal').addClass('blackout').css({
                width: 100 + "%",
                height: 100 + "%"
            });
        }
    };

    var init = function init(target, opt) {
        var _this = this;

        _this.target = target;
        _this.css = opt.css;
        _this.content = opt.content;

        target.data('modal', this).click(function () {
            _this.open();
        });
    };

    init.prototype = {
        open: function open() {
            var _this = this;

            _this.content.css({ opacity: 0 });

            _this.blackout = create.blackout().appendTo('body').fadeIn().click(function () {
                _this.close();
            });

            _this.container = create.container(_this.target[0]).append(_this.content).appendTo('body').fadeIn(100, function () {
                _this.target.css({ opacity: 0 });

                var screen = {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                };

                var cw = parseInt(_this.content.outerWidth(true));
                var ch = parseInt(_this.content.outerHeight(true));

                var styleList = {
                    width: cw,
                    height: ch,
                    top: (screen.height - ch) / 2,
                    left: 0
                };

                for (var kay in _this.css) {
                    if (kay != "width" || kay != "height" || kay != "top" || kay != "left") styleList[kay] = _this.css[kay];
                }_this.container.animate(styleList, 300, 'easeInOutQuad');

                setTimeout(function () {
                    _this.content.animate({ opacity: 1 }, 200);
                }, 200);
            });
        },

        close: function close() {
            var _this = this;

            var offset = _this.target.offset();

            var styleList = {
                width: _this.target.outerWidth(),
                height: _this.target.outerHeight(),
                top: offset.top,
                left: offset.left,
                borderRadius: _this.target.css('borderRadius'),
                border: _this.target.css('border')
            };

            if (_this.css.backgroundColor && _this.target.css('backgroundColor') != "rgba(0, 0, 0, 0)") styleList.backgroundColor = _this.target.css('backgroundColor');

            _this.container.children().animate({ opacity: 0 }, 100);

            _this.blackout.fadeOut(200, function () {
                this.remove();
                _this.blackout = false;
            });

            _this.container.animate(styleList, 300, 'easeInOutQuad', function () {
                _this.target.css({ opacity: 1 });
                _this.container.fadeOut(200, function () {
                    this.remove();
                    _this.container = false;
                });
            });
        }
    };

    $.fn.uimodal = function () {

        if (this.data('modal')) {
            var modal = this.data('modal');

            switch (arguments[0]) {
                case 'open':
                    modal.open();

                    break;

                case 'close':
                    modal.close();

                    break;

                case 'opened':

                    break;
            }
        } else new init(this, arguments[0]);

        return this;
    };
})(jQuery);