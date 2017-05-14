'use strict';

(function (w, d) {
	ui.tabs = class Tabs {
        constructor(element, options) {
            this.options = $.extend({}, Tabs.options);

            let dataAttrOptions = ('preventdefaultinitnodes preventdefaultiniteventaction content windowClass closeButton substrate substrateClass openEffect openEffectApply closeEffect closeEffectApply').split(' ');

            for (let dataAttrOption of dataAttrOptions)
                if ( element.hasAttr('data-modal.' + dataAttrOption) )
                    this.options[dataAttrOption] =  element.attr('data-modal.' + dataAttrOption);

            $.extend(this.options, options);

            let events = ('beforeInit init afterInit beforeSwitch switch afterSwitch').split(' ');

            for (let event of events)
                if ( is.function(this.options[event]) )
                    element.on('tabs:' + event, this.options[event]);

            for (let event of events)
                if (is.function(Tabs[event]))
                    element.on('tabs:' + event, Tabs[event]);


            this.nodes = {
                element: element
            };

            this.permissions = [];

            element.trigger('tabs:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                this.nodes.tablists = element.find('.tablist').grep( element.find('[data-ui~="tabs"] .tablist') );
                this.nodes.tabpanellists = element.find('.tabpanellist').grep(element.find('[data-ui~="tabs"] .tabpanellist'));
            }

            element.trigger('tabs:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {
                this.nodes.tablists.each(function (i, tablist) {
                    tablist = $(tablist);

                    let tabs = tablist.find('.tab');
                    tabs.on('click', function (e) {
                        e.preventDefault();
                        let target = $(e.currentTarget);

                        if (this.permission) {
                            this.switch(target.attr('data-tabpanel') || tabs.index(target));
                        }

                    }.bind(this));
                }.bind(this));
            }

            element.trigger('tabs:afterInit', [this]);
		}

        switch(s) {
            this.nodes.element.trigger('tabs:beforeSwitch');

            this.nodes.tablists.each(function (i, tablist) {
                tablist = $(tablist);
                let tabs = tablist.find('.tab');
                
                let activeTab = tabs.filter('.active');
                let newTab = is.number(s) ? tabs.eq(s) : tabs.filter('[data-tabpanel="' + s + '"]');

                if (activeTab[0] == newTab[0])
                    return;

                activeTab.removeClass('active').trigger('tabs:deactivate', [this]);
                newTab.addClass('active').trigger('tabs:activate', [this]);
            }.bind(this));

            this.nodes.tabpanellists.each(function (i, tabpanellist) {
                tabpanellist = $(tabpanellist);

                let tabpanels = tabpanellist.find('.tabpanel').grep( tabpanellist.find('[data-ui~="tabs"] .tabpanel'));

                let activeTabpanel = tabpanels.filter('.active');
                let newTabpanel = is.number(s) ? tabpanels.eq(s) : tabpanels.filter('[name="' + s + '"], [data-name="' + s + '"]');

                if (activeTabpanel[0] == newTabpanel[0])
                    return;

                let tabpanelHeightDifference = activeTabpanel.outerHeight(true) != newTabpanel.outerHeight(true);
                let delayFading = activeTabpanel.hasClass('delay-fading');

                let permissionId = this.permissions.push(false) - 1;

                if (tabpanelHeightDifference) {
                    tabpanellist.css('height', tabpanellist.height());

                    setTimeout(function () {
                        let temp = function (e) {
                            if (e.target != tabpanellist[0])
                                return;

                            tabpanellist
                                .off('transitionend', temp)
                                .removeClass('smooth-height-transition')
                                .css('height', '');

                            if (!delayFading) {
                                this.permissions[permissionId] = true;

                                if (this.permission)
                                    this.nodes.element.trigger('tabs:afterSwitch', [this]);
                            }
                        }.bind(this);

                        tabpanellist
                            .addClass('smooth-height-transition')
                            .on('transitionend', temp)
                            .css('height', newTabpanel.outerHeight(true));
                    }.bind(this), 0);
                }

                if (delayFading)
                    activeTabpanel
                        .addClass('old')
                        .one('transitionend', function () {
                            activeTabpanel.removeClass('old');

                            this.permissions[permissionId] = true;

                            if (this.permission)
                                this.nodes.element.trigger('tabs:afterSwitch', [this]);
                        }.bind(this));

                newTabpanel
                    .addClass('active')
                    .trigger('tabs:activate', [this]);

                activeTabpanel
                    .removeClass('active')
                    .trigger('tabs:deactivate', [this]);

                if (!tabpanelHeightDifference && !delayFading)
                    this.permissions[permissionId] = true;
            }.bind(this));
        }

        get permission () {
            let permission = true;
            for (let i = 0; i < this.permissions.length; i++) {

                if (this.permissions[i] == false) {
                    permission = this.permissions[i];

                    break;
                }
            }

            return permission;
        }
	};

    ui.tabs.options = {
        preventDefaultInitNodes: false,
        preventDefaultInitEventAction: false,

        beforeInit: false,
        init: false,
        afterInit: false,
        beforeSwitch: false,
        afterSwitch: false
    };

    $.fn.tabs = function (options) {
        if ( this.data('tabs') ) {
            let tabs = this.data('tabs');

            switch (arguments[0]) {

            }

        } else this.each(function () {
            let element = $(this);
            element.data('tabs', new ui.tabs(element, options));
        });

        return this;
    };
})(window, document);