'use strict';

(function (w, d) {
    let ui = w.ui = function (node) {
        if (!(node instanceof $))
            node = $(node);

        let work = function (node) {
            let _arguments = arguments;
            node.attr('data-ui').split(' ').forEach(function (value) {
                if (ui.list[value]) {
                    let instance = node.data(value);
                    if (instance) {
                        let options = helper.slice(_arguments, 1);

                        if ( is.string(options[0]) )
                            if (instance.option)
                                instance.option.apply(null, options);
                        else
                            if (instance.options)
                                instance.options.apply(null, options);

                    } else {
                        if (node.attr('data-' + value + '-init') == 'false') return;
                        let newArguments = helper.slice(_arguments);
                        helper.unshift(newArguments, ui.list[value]);
                        node.data(value, new (ui.list[value].bind.apply(ui.list[value], newArguments))());
                    }
                }
            });
        };

        let optionsArray = helper.splice(arguments, 1);

        if( node.attr('data-ui') && node.attr('data-uiinit') != 'false' )
            work.apply(null, [node].concat(optionsArray));

        node.find('[data-ui]:not([data-uiinit="false"])').each(function () {
            work.apply(null, [$(this)].concat(optionsArray));
        });
    };

    ui.list = {};

    ui.ui = class UI {
        constructor(UIName, element, options = {}, initNodes, init) {
            this.UIName = UIName;
            this.nodes = {
                element: element
            };

            this.options = this.extendOptions([], ui.list[UIName].options, options);
            this.events = this.extendEvents(ui.list[UIName].events, options['events'] || {});
            this.preventDefault = $.extend({}, ui.list[UIName].preventDefaults, options['preventDefaults'] || {});

            this.permission = true;

            element.trigger(this.UIName + ':beforeInit', [this]);

            if (!this.preventDefault.initNodes)
                initNodes.bind(this)();

            if (!this.preventDefault.init)
                init.bind(this)();

            element.trigger(this.UIName + ':afterInit', [this]);
        }

        extendEvents(defaultEvents, userEvents = false) {
            let target = {};

            let setEvent = function(event) {
                if ( is.function(target[event]) )
                    this.nodes.element.on(this.UIName + ':' + event, target[event]);

                if (is.function(ui.list[this.UIName][event]))
                    this.nodes.element.on(this.UIName + ':' + event, ui.list[this.UIName][event]);
            }.bind(this);

            if (is.object(userEvents)) {
                for (let event of Object.keys(defaultEvents)) {
                    target[event] = userEvents[event] != undefined ? userEvents[event] : defaultEvents[event];

                    setEvent(event);
                }
            } else {
                for (let event of Object.keys(defaultEvents)) {
                    target[event] = defaultEvents[event];

                    setEvent(event);
                }
            }

            return target;
        }

        extendOptions(backtrace, defaultOptions, userOptions) {
            let target = {};

            for (let option of Object.keys(defaultOptions)) {

                if (userOptions[option] != undefined) {
                    if (is.object(userOptions[option])) {
                        backtrace.push(option);

                        target[option] = this.extendOptions(backtrace, defaultOptions[option], userOptions[option]);

                        backtrace.pop();
                    } else
                        target[option] = userOptions[option];
                } else {
                    let attr = this.nodes.element.attr('data-' + this.UIName + '-' + (backtrace.length > 0 ? backtrace.join('-') + '-' : "") + option);
                    if (attr != undefined) {
                        target[option] = $.normalizeAttrValue(attr);
                    } else if (is.object(defaultOptions[option])) {
                        backtrace.push(option);

                        target[option] = this.extendOptions(backtrace, defaultOptions[option], {});

                        backtrace.pop();
                    } else
                        target[option] = defaultOptions[option];
                }
            }


            return target;
        }
    };

    ui.add = function (name, c) {
        ui.list[name] = c;

        $.fn[name] = function () {
            if (this.data(name)) {
                let instance = this.data(name);

                if (arguments.length == 1) {
                    if (is.object(arguments[0])) {
                        if (instance.setOptions)
                            instance.setOptions(arguments[0]);
                    } else {
                        if (instance.getOption)
                            instance.getOption(arguments[0]);
                    }
                } else if (instance.setOption)
                    instance.setOption.apply(null, arguments);
            } else {
                let _arguments = arguments;

                this.each(function () {
                    let element = $(this);
                    let newArguments = helper.slice(_arguments);
                    helper.unshift(newArguments, c);
                    element.data(name, new (c.bind.apply(c, newArguments))());
                });

                return this;
            }
        };
    };

    ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };

    ui.mouseCoordinates = (function () {
        let coordinates = {
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0
        };

        $(d)
            .on('mousemove', function (e) {
                coordinates.clientX = e.clientX;
                coordinates.clientY = e.clientY;
                coordinates.pageX = e.pageX;
                coordinates.pageY = e.pageY;
            });

        return coordinates;
    })();

    $(d).on('DOMContentLoaded', function () {
        ui(d.body);
    });
})(window, document);