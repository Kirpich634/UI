(function (w, d) {

    class Notice {
        constructor({type = false, title, content = false, size = false, hide = 2000}) {
            this.permission = true;

            this.time = {
                hide: hide,
                create: Date.now()
            };

            this.notice = $('<div>')
                .addClass('notice hide')
                .appendTo(Notice.notificationArea);

            if (type)
                this.notice.addClass(type);

            this.wrapper = $('<div>')
                .addClass('clearfix')
                .appendTo(this.notice);


            if (this.time.hide)
                this.wrapper
                    .on('mouseenter', function () {
                        this.permission = false;
                        this.time.hide -= Date.now() - this.time.create;

                        if (this.time.hide < 700)
                            this.time.hide = 700;

                        clearTimeout(this.timeout);
                    }.bind(this))
                    .on('mouseleave', function () {
                        this.permission = true;
                        this.setTimeout();
                    }.bind(this));

            this.closeButton = $('<button>')
                .addClass('close')
                .html('<i class="material-icons">close</i>')
                .on('click', function (e) {
                    clearTimeout(this.timeout);

                    this.remove();
                }.bind(this))
                .appendTo(this.wrapper);

            this.title = $('<h1>')
                .addClass('title')
                .html(title)
                .appendTo(this.wrapper);

            if (content)
                if (is.$(content)) {
                    if (!content.hasClass('content'))
                        content.addClass('content');

                    this.content = content.appendTo(this.wrapper);
                } else if (is.HTMLElement(content)) {
                    this.content = $(content).appendTo(this.wrapper);
                } else if (is.HTMLCollection(content)) {
                    this.content = $('<section>')
                        .addClass('content')
                        .append(content)
                        .appendTo(this.wrapper);
                } else {
                    this.content = $('<section>')
                        .addClass('content')
                        .html(content);
                }

            setTimeout(function () {
                if (this.time.hide)
                    this.wrapper.one('transitionend', function () {
                        if (Notice.notifications.push(this) < 3)
                            this.setTimeout();
                    }.bind(this));

                this.notice.removeClass('hide');
            }.bind(this), 0);
        };

        setTimeout() {
            this.timeout = setTimeout(function () {
                this.remove();
            }.bind(this), this.time.hide);
        }

        remove() {
            this.wrapper
                .one('transitionend', function () {
                    setTimeout(function () {
                        this.notice
                            .one('transitionend', function () {
                                this.notice
                                    .remove();

                                Notice.notifications.splice(Notice.notifications.indexOf(this), 1);


                                if (Notice.notifications[1] && Notice.notifications[1].time.hide && Notice.notifications[1].permission && !Notice.notifications[1].timeout) {
                                    if (Notice.notifications[1].time.hide - (Date.now() - Notice.notifications[1].time.create) < 0)
                                        Notice.notifications[1].time.hide = Notice.notifications[1].time.hide * .7;

                                    Notice.notifications[1].setTimeout();
                                }

                            }.bind(this))
                            .addClass('height-transition')
                            .css({
                                height: 0,
                                marginBottom: 0
                            });
                    }.bind(this), 0);

                }.bind(this));

            this.notice
                .css('height', this.notice.outerHeight())

                .addClass('hide');
        }
    }

    $(d).ready(function () {
        Notice.notificationArea = $('#notifications');
    });

    Notice.notifications = [];



    w.notice = function () {
        let noticeArgs = {};

        if ( arguments.length == 1 && is.object(arguments[0]) )
            noticeArgs = arguments[0];
        else {
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.info = function () {
        let noticeArgs = {};

        if ( arguments.length == 1 && is.object(arguments[0]) )
            noticeArgs = arguments[0];
        else {
            noticeArgs.type = 'info';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.success = function () {
        let noticeArgs = {};

        if ( arguments.length == 1 && is.object(arguments[0]) )
            noticeArgs = arguments[0];
        else {
            noticeArgs.type = 'success';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.attention = function () {
        let noticeArgs = {};

        if ( arguments.length == 1 && is.object(arguments[0]) )
            noticeArgs = arguments[0];
        else {
            noticeArgs.type = 'attention';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

    w.notice.error = function () {
        let noticeArgs = {};

        if ( arguments.length == 1 && is.object(arguments[0]) )
            noticeArgs = arguments[0];
        else {
            noticeArgs.type = 'error';
            if (arguments[0] != undefined) noticeArgs.title = arguments[0];
            if (arguments[1] != undefined) noticeArgs.content = arguments[1];
            if (arguments[2] != undefined) noticeArgs.size = arguments[2];
            if (arguments[3] != undefined) noticeArgs.hide = arguments[3];
        }

        return new Notice(noticeArgs);
    };

})(window, document);