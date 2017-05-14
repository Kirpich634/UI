"use strict";

(function (w, d) {
    ui.textfield = class Textfield {
        constructor(element, options) {
            this.options = $.extend({}, Textfield.options);

            if (element.hasAttr('data-preventdefaultinitnodes'))
                this.options.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');

            if (element.hasAttr('data-preventdefaultiniteventaction'))
                this.options.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            $.extend(this.options, options);

            let events = ('beforeInit init afterInit focus keydown keypress input keyup blur change').split(',');

            for (let event of events)
                if ( is.function(this.options[event]) )
                    element.on('spinner:' + event, this.options[event]);

            for (let event of events)
                if ( is.function(this.options[event]) )
                    element.on('spinner:' + event, Textfield[event]);


            element.trigger('textfield:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                this.nodes = {
                    element: element,
                    placeholder: element.find('p')
                };

                let input = element.find('input');
                if (input.length > 0)
                    this.nodes.input = input;
            }

            element.trigger('textfield:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {
                let textfield = this.nodes.element.find('div[contenteditable="true"]');

                this.nodes.textfield = textfield.length > 0 ? textfield : this.nodes.input;

                this.nodes.textfield
                    .on('focus', this.focus.bind(this))
                    .on('keydown', this.keydown.bind(this))
                    .on('keypress', this.keypress.bind(this))
                    .on('input', this.input.bind(this))
                    .on('keyup', this.keyup.bind(this))
                    .on('blur', this.blur.bind(this))
                    .on('change', this.change.bind(this));
            }

            element.trigger('textfield:afterInit', [this]);
        }

        focus(e) {
            this.nodes.element.trigger('focus', [this]);

            this.nodes.placeholder.addClass('hidden');

            this.nodes.element.trigger('textfield:focus', [this]);
        }

        keydown(e) {
            this.nodes.element.trigger('textfield:keydown', [this]);
        }

        keypress(e) {
            this.nodes.element.trigger('textfield:keypress', [this]);
        }

        input(e) {
            this.nodes.input.val( this.textfield.html() );

            this.nodes.element.trigger('textfield:input', [this]);
        }

        keyup(e) {
            this.nodes.element.trigger('textfield:keyup', [this]);
        }

        blur(e) {
            this.nodes.element.trigger('blur', [this]);

            if (this.input.val() == '')
                this.placeholder.removeClass('hidden');

            this.nodes.element.trigger('textfield:blur', [this]);
        }

        change(e) {

        }
    };

    ui.textfield.options = {
        type: 'textfield'
    };

    $.fn.textfield = function (options) {
        if ( this.data('textfield') ) {
            let textfield = this.data('textfield');

            switch (arguments[0]) {

            }

        } else this.each(function () {
            let element = $(this);
            element.data('textfield', new ui.textfield(element, options));
        });

        return this;
    };
})(window, document);