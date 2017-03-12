'use strict';

ui.details = function (w, d) {
    var init = function init(parent, options) {
        console.log('Создан details');

        this.parent = parent.data('details', this);

        this.heading = parent.find('[role="heading"]');
        this.article = parent.find('[role="article"]');

        this.options = {};

        $.extend(this.options, options);

        if (this.options.openStart) this.element.on('toggle', this.options.toggle.bind(this));

        this.article.addClass('clearfix');

        this.heading.on('click', function () {
            if (this.parent.hasClass('opened')) this.hide();else this.show();
        }.bind(this));
    };

    init.prototype = {
        show: function show() {
            this.article.css('opacity', 0);
            this.parent.css('height', this.parent.height()).one('transitionend', function () {
                this.article.css('opacity', '');
                this.parent.css('height', '');
            }.bind(this)).addClass('opened').css('height', this.heading.outerHeight() + this.article.outerHeight());
        },

        hide: function hide() {
            this.article.css('display', 'block').one('transitionend', function () {
                setTimeout(function () {
                    this.parent.one('transitionend', function (e) {
                        this.article.css('display', '');
                        this.parent.css('height', '');
                    }.bind(this)).css('height', this.heading.outerHeight());
                }.bind(this), 0);
            }.bind(this));

            this.parent.css('height', this.parent.height()).removeClass('opened');
        }
    };

    return function (parent, options) {
        if (parent.data('details')) {

            var details = parent.data('toggle');

            switch (arguments[0]) {
                case 'open':

                    break;

                case 'close':

                    break;

                case 'opened':

                    break;
            }
        } else new init(parent, options);
    };
}(window, document);