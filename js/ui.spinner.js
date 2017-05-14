(function (w, d) {

    ui.spinner = class Spinner {
        static getChar(e) {
            if (e.which == null) {
                if (e.keyCode < 32) return null;
                return String.fromCharCode(e.keyCode); // IE
            }

            if (e.which != 0 && e.charCode != 0) {
                if (e.which < 32) return null;
                return String.fromCharCode(e.which); // остальные
            }
        }

        constructor (element, options) {
            this.options = $.extend({}, Spinner.options);

            if (element.hasAttr('data-preventdefaultinitnodes'))
                element.options.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');

            if (element.hasAttr('data-preventdefaultiniteventaction'))
                this.options.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            if (element.hasClass('disabled'))
                this.options.enable = false;

            $.extend(this.options, options);

            let events = ('beforeInit init afterInit beforeSpin spin afterSpin startSpinUp beforeSpinUp spinUp afterSpinUp endSpinUp startSpinDown beforeSpinDown spinDown afterSpinDown endSpinDown focus keydown keypress input keyup blur change').split(',');

            for (let event of events)
                if ( is.function(this.options[event]) )
                    element.on('spinner:' + event, this.options[event]);

            for (let event of events)
                if ( is.function(this.options[event]) )
                    element.on('spinner:' + event, Spinner[event]);

            this.nodes = {
                element: element,
                input: element.find('input')
                    .on('focus', this.focus.bind(this))
                    .on('keydown', this.keydown.bind(this))
                    .on('keypress', this.keypress.bind(this))
                    .on('input', this.input.bind(this))
                    .on('keyup', this.keyup.bind(this))
                    .on('blur', this.blur.bind(this))
                    .on('change', this.change.bind(this))
            };

            if (this.nodes.input.attr('type') != 'text')
                this.nodes.input.attr('type', 'text');

            if (this.options.value !== false)
                this.nodes.input.val(this.options.value);
            else if ( !is.number(this.nodes.input.val()) )
                this.nodes.input.val(0);


            this.speed = this.options.speed;

            let spinup = element.find('.spinup');
            if (spinup.length > 0)
                this.nodes.spinup = spinup
                    .on('mousedown', function (e) {
                        e.preventDefault();

                        $(w).one('mouseup', function() {
                            clearTimeout(this.autorepeatTimeoutId);
                            this.speed = this.options.speed;
                        }.bind(this));

                        this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinUp.bind(this), this.speed);
                    }.bind(this))
                    .on('click', this.spinUp.bind(this));

            let spindown = element.find('.spindown');
            if (spindown.length > 0)
                spindown
                    .on('mousedown', function (e) {
                        e.preventDefault();

                        $(w).one('mouseup', function() {
                            clearTimeout(this.autorepeatTimeoutId);
                            this.speed = this.options.speed;
                        }.bind(this));

                        this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinDown.bind(this), this.speed);
                    }.bind(this))
                    .on('click', this.spinDown.bind(this));


            this.options.enable ? this.enable() : this.disable();
        }

        enable() {
            this.nodes.element.addClass('enabled').removeClass('disabled');
            this.nodes.input.removeAttr('disabled');
        }

        disable() {
            this.nodes.element.removeClass('enabled').addClass('disabled');
            this.nodes.input.attr('disabled', true);
        }

        focus(e) {
            this.nodes.element
                .addClass('focus')
                .trigger('spinner:focus', [this])
        }

        keydown(e) {
            this.nodes.element.trigger('spinner:keydown', [this, e]);
        }

        keypress(e) {
            this.nodes.element.trigger('spinner:keypress', [this, e]);
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            let chr = Spinner.getChar(e);

            // с null надо осторожно в неравенствах,
            // т.к. например null >= '0' => true
            // на всякий случай лучше вынести проверку chr == null отдельно
            if (chr == null) return;

            if (chr != '-' && (chr < '0' || chr > '9')) return false;
        }

        input(e) {
            this.nodes.element.trigger('spinner:input', [this, e]);
        }

        keyup(e) {
            this.nodes.element.trigger('spinner:keyup', [this, e]);
        }

        blur(e) {
            this.nodes.element
                .removeClass('focus')
                .trigger('spinner:blur', [this, e]);
        }

        change(e) {
            this.nodes.element.trigger('spinner:change', [this, e]);

            let value = parseFloat(this.nodes.input.val());

            this.normalizeValue(value);

            if (this.value != value)
                this.nodes.input.val(this.value);

            this.nodes.element.trigger('spinner:spin', [this, this.value])
        }

        spinUp() {
            let value = parseFloat(this.nodes.input.val());

            this.normalizeValue(value + 1);

            if (this.value != value)
                this.nodes.input.val(this.value);

            this.nodes.element.trigger('spinner:spinUp', [this, this.value])
        }

        spinDown() {
            let value = parseFloat(this.nodes.input.val());

            this.normalizeValue(value - 1);

            if (this.value != value)
                this.nodes.input.val(this.value);

            this.nodes.element.trigger('spinner:spinDown', [this, this.value])
        }

        autorepeatSpinUp() {
            this.spinUp();

            if (this.speed > this.options.maxSpeed) {
                this.speed *= this.options.acceleration;

                if (this.speed < this.options.maxSpeed)
                    this.speed = this.options.maxSpeed;
            }

            this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinUp.bind(this), this.speed);
        }

        autorepeatSpinDown() {
            this.spinDown();

            if (this.speed > this.options.maxSpeed) {
                this.speed *= this.options.acceleration;

                if (this.speed < this.options.maxSpeed)
                    this.speed = this.options.maxSpeed;
            }

            this.autorepeatTimeoutId = setTimeout(this.autorepeatSpinDown.bind(this), this.speed);
        }

        normalizeValue(value) {
            value = value || 0;
            if (value < this.options.min) value = this.options.min;
            else if (value > this.options.max) value = this.options.max;

            if (this.options.round) {
                let a = Math.pow(10, this.options.round);
                value = Math.round(value * a) / a;
            }

            this.value = value;
        }
    };

    ui.spinner.options = {
        enable: true,
        min: 0,
        max: 100,
        speed: 200,
        maxSpeed: 50,
        acceleration: .93,

        round: false,
        value: 0,

        beforeInit: false,
        init: false,
        afterInit: false,
        beforeSpin: false,
        spin: false,
        afterSpin: false,

        startSpinUp: false,
        beforeSpinUp: false,
        spinUp: false,
        afterSpinUp: false,
        endSpinUp: false,

        startSpinDown: false,
        beforeSpinDown: false,
        spinDown: false,
        afterSpinDown: false,
        endSpinDown: false,

        focus: false,
        keydown: false,
        keypress: false,
        input: false,
        keyup: false,
        blur: false,
        change: false
    };

    $.fn.spinner = function (options) {
        if ( this.data('spinner') ) {
            let spinner = this.data('spinner');

            switch (arguments[0]) {
                case 'min':
                    if (arguments[1] != undefined) {
                        spinner.options.min = arguments[1];

                    } else
                        return spinner.options.min;

                    break;
                case 'max':
                    if (arguments[1] != undefined) {
                        spinner.options.max = arguments[1];

                    } else
                        return spinner.options.max;

                    break;
                case 'value':
                    if (arguments[1] != undefined) {
                        spinner.setValue(arguments[1]);
                    } else
                        return spinner.value;

                    break;
                case 'disable':
                    spinner.disable();

                    break;
                case 'enable':
                    spinner.enable();

                    break;
            }

        } else this.each(function () {
            let element = $(this);
            element.data('spinner', new ui.spinner(element, options));
        });

        return this;
    };
})(window, document);