'use strict';

/**
 * Created by Stas on 16.12.2016.
 */

/**
 * Created by Alex on 12.09.2016.
 */

ui.sticky = function (w, d) {
    var init = function init(element, options) {
        this.container = element.data('sticky', this);
        this.sticky = element.children();

        this.options = {
            stuck: false,
            tack: false
        };

        $.extend(this.options, options);

        if (this.options.stuck) this.parent.on('sticky:stuck', this.options.stuck);
        if (this.options.tack) this.parent.on('sticky:tack', this.options.tack);

        //тут будет чудо
    };

    init.prototype = {
        stick: function stick() {},

        unstick: function unstick() {}
    };

    return function (element, options) {
        if (element.data('sticky')) {
            var tabs = element.data('sticky');

            switch (arguments[0]) {
                case 'stick':
                    tabs.stick();

                    break;

                case 'unstick':
                    tabs.unstick();

                    break;
            }
        } else new init(element, options);
    };
}(window, document);