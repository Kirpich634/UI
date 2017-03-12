'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    var Notice = function () {
        function Notice(_ref) {
            var _ref$type = _ref.type,
                type = _ref$type === undefined ? false : _ref$type,
                title = _ref.title,
                _ref$content = _ref.content,
                content = _ref$content === undefined ? false : _ref$content,
                _ref$size = _ref.size,
                size = _ref$size === undefined ? false : _ref$size,
                _ref$hide = _ref.hide,
                hide = _ref$hide === undefined ? 2000 : _ref$hide;

            _classCallCheck(this, Notice);

            this.permission = true;

            this.time = {
                hide: hide,
                create: Date.now()
            };

            this.notice = $('<div>').addClass('notice hide').appendTo(Notice.notificationArea);

            if (type) this.notice.addClass(type);

            this.wrapper = $('<div>').addClass('clearfix').appendTo(this.notice);

            if (this.time.hide) this.wrapper.on('mouseenter', function () {
                this.permission = false;
                this.time.hide -= Date.now() - this.time.create;

                if (this.time.hide < 700) this.time.hide = 700;

                clearTimeout(this.timeout);
            }.bind(this)).on('mouseleave', function () {
                this.permission = true;
                this.setTimeout();
            }.bind(this));

            this.closeButton = $('<button>').addClass('close').html('<i class="material-icons">close</i>').on('click', function (e) {
                clearTimeout(this.timeout);

                this.remove();
            }.bind(this)).appendTo(this.wrapper);

            this.title = $('<h1>').addClass('title').html(title).appendTo(this.wrapper);

            if (content) if (is.$(content)) {
                if (!content.hasClass('content')) content.addClass('content');

                this.content = content.appendTo(this.wrapper);
            } else if (is.HTMLElement(content)) {
                this.content = $(content).appendTo(this.wrapper);
            } else if (is.HTMLCollection(content)) {
                this.content = $('<section>').addClass('content').append(content).appendTo(this.wrapper);
            } else {
                this.content = $('<section>').addClass('content').html(content);
            }

            setTimeout(function () {
                if (this.time.hide) this.wrapper.one('transitionend', function () {
                    if (Notice.notifications.push(this) < 3) this.setTimeout();
                }.bind(this));

                this.notice.removeClass('hide');
            }.bind(this), 0);
        }

        _createClass(Notice, [{
            key: 'setTimeout',
            value: function (_setTimeout) {
                function setTimeout() {
                    return _setTimeout.apply(this, arguments);
                }

                setTimeout.toString = function () {
                    return _setTimeout.toString();
                };

                return setTimeout;
            }(function () {
                this.timeout = setTimeout(function () {
                    this.remove();
                }.bind(this), this.time.hide);
            })
        }, {
            key: 'remove',
            value: function remove() {
                this.wrapper.one('transitionend', function () {
                    setTimeout(function () {
                        this.notice.one('transitionend', function () {
                            this.notice.remove();

                            Notice.notifications.splice(Notice.notifications.indexOf(this), 1);

                            if (Notice.notifications[1] && Notice.notifications[1].time.hide && Notice.notifications[1].permission && !Notice.notifications[1].timeout) {
                                if (Notice.notifications[1].time.hide - (Date.now() - Notice.notifications[1].time.create) < 0) Notice.notifications[1].time.hide = Notice.notifications[1].time.hide * .7;

                                Notice.notifications[1].setTimeout();
                            }
                        }.bind(this)).addClass('height-transition').css({
                            height: 0,
                            marginBottom: 0
                        });
                    }.bind(this), 0);
                }.bind(this));

                this.notice.css('height', this.notice.outerHeight()).addClass('hide');
            }
        }]);

        return Notice;
    }();

    $(d).ready(function () {
        Notice.notificationArea = $('#notifications');
    });

    Notice.notifications = [];

    w.notice = function () {
        var noticeArgs = {};

        if (arguments.length == 1 && is.object(arguments[0])) noticeArgs = arguments[0];else {
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.info = function () {
        var noticeArgs = {};

        if (arguments.length == 1 && is.object(arguments[0])) noticeArgs = arguments[0];else {
            noticeArgs.type = 'info';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.success = function () {
        var noticeArgs = {};

        if (arguments.length == 1 && is.object(arguments[0])) noticeArgs = arguments[0];else {
            noticeArgs.type = 'success';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.attention = function () {
        var noticeArgs = {};

        if (arguments.length == 1 && is.object(arguments[0])) noticeArgs = arguments[0];else {
            noticeArgs.type = 'attention';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.error = function () {
        var noticeArgs = {};

        if (arguments.length == 1 && is.object(arguments[0])) noticeArgs = arguments[0];else {
            noticeArgs.type = 'error';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };
})(window, document);