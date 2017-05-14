(function (w, d) {
    'use strict';

    ui.select = class Select extends ui.dropdown {
        constructor (element, options) {
            let tempOptions = $.extend({}, Select.options);

            if (element.hasAttr('data-preventdefaultinitnodes'))
                tempOptions.preventDefaultInitNodes = element.attr('data-preventdefaultinitnodes');
            if (element.hasAttr('data-preventdefaultiniteventaction'))
                tempOptions.preventDefaultInitEventAction = element.attr('data-preventdefaultiniteventaction');

            super(element, $.extend(tempOptions, options));

            if (Select.beforeInit) this.nodes.element.on('tabs:beforeInit', Select.beforeInit);
            if (this.options.beforeInit) this.nodes.element.on('tabs:beforeInit', this.options.beforeInit);
            if (Select.init) this.nodes.element.on('tabs:init', Select.init);
            if (this.options.init) this.nodes.element.on('tabs:init', this.options.init);
            if (Select.afterInit) this.nodes.element.on('tabs:afterInit', Select.beforeInit);
            if (this.options.afterInit) this.nodes.element.on('tabs:afterInit', this.options.afterInit);

            if (this.options.select) this.nodes.element.on('select', this.options.select.bind(this));


            this.nodes.element.trigger('select:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                let input = this.nodes.element.find('input[type="hidden"]');
                this.nodes.input = input.length > 0 ? input : false;
            }

            this.nodes.element.trigger('select:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {
                this.nodes.window
                    .on('click', '.option', function (e) {
                        let option = $(e.currentTarget);
                        if (option.hasClass('disabled')) return;
                        this.select(option);
                    }.bind(this));
            }

            this.nodes.element.trigger('select:afterInit', [this]);
        }

        select(option) {
            if (option.hasClass('active'))
                return;

            if (this.nodes.input)
                this.nodes.input.val( option.attr('data-value') );

            this.nodes.window.find('.option.active').removeClass('active');

            option.addClass('active');

            this.nodes.trigger.find('.option')
                .one('transitionend', function (e) {
                    $(this).remove();
                })
                .addClass('hide ' + this.options.hideSubstitutionEffect);


            let className = this.options.showSubstitutionEffect;

            let newOption = $('<div class="option hide ' + className + '">')
                .text( option.text() )
                .appendTo( this.nodes.trigger );

            setTimeout(function () {
                newOption.removeClass('hide ' + className)
            }, 20);

            if ( this.nodes.element.hasClass('open') )
                this.close();
        }
    };

    ui.select.options = {
        disabled: false,

        trigger: '.select',
        window: '.optionlist',

        maxWidth: 'auto',
        maxHeight: 'auto',

        closeOnClickTrigger: true,

        openEffect: 'fade',
        closeEffect: 'fade',
        hideSubstitutionEffect: 'left',
        showSubstitutionEffect: 'right',

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

    $.fn.select = function (options) {
        if ( this.data('select') ) {
            let select = this.data('select');

            switch (arguments[0]) {
                case 'open':

                    break;

                case 'close':

                    break;

                case 'opened':

                    break;
            }

        } else this.each(function () {
            let element = $(this);
            element.data('select', new ui.select(element, options));
        });

        return this;
    };
})(window, document);