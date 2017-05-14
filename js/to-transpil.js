'use strict';

(function (w, d) {
    ui.tabs = class Tabs {
        constructor(element, options) {
            this.element = element;

            this.options = $.extend({}, Tabs.options);

            if (this.element.hasAttr('data-preventdefaultinitnodes'))
                this.options.preventDefaultInitNodes = this.element.attr('data-preventdefaultinitnodes');
            if (this.element.hasAttr('data-preventdefaultiniteventaction'))
                this.options.preventDefaultInitEventAction = this.element.attr('data-preventdefaultiniteventaction');

            $.extend(this.options, options);

            if (Tabs.beforeInit) this.element.on('tabs:beforeInit', Tabs.beforeInit);
            if (this.options.beforeInit) this.element.on('tabs:beforeInit', this.options.beforeInit);
            if (Tabs.init) this.element.on('tabs:init', Tabs.init);
            if (this.options.init) this.element.on('tabs:init', this.options.init);
            if (Tabs.afterInit) this.element.on('tabs:afterInit', Tabs.beforeInit);
            if (this.options.afterInit) this.element.on('tabs:afterInit', this.options.afterInit);
            if (Tabs.beforeSwitch) this.element.on('tabs:beforeSwitch', Tabs.beforeSwitch);
            if (this.options.beforeSwitch) this.element.on('tabs:beforeSwitch', this.options.beforeSwitch);
            if (Tabs.afterSwitch) this.element.on('tabs:afterSwitch', Tabs.afterSwitch);
            if (this.options.afterSwitch) this.element.on('tabs:afterSwitch', this.options.afterSwitch);

            this.permissions = [];

            this.element.trigger('tabs:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                this.tablists = this.element.find('.tablist').grep( this.element.find('[data-ui~="tabs"] .tablist') );
                this.tabpanellists = this.element.find('.tabpanellist').grep(this.element.find('[data-ui~="tabs"] .tabpanellist'));
            }

            this.element.trigger('tabs:init', [this]);

            if (!this.options.preventDefaultInitEventAction)
                this.tablists.each(function (i, tablist) {
                    tablist = $(tablist);

                    let tabs = tablist.find('.tab');
                    tabs.on('click', function (e) {
                        e.preventDefault();
                        let target = $(e.currentTarget);

                        if (this.permission) {
                            this.switch( target.attr('data-tabpanel') || tabs.index(target) );
                        }

                    }.bind(this));
                }.bind(this));

            this.element.trigger('tabs:afterInit', [this]);
        }

        switch(s) {
            this.element.trigger('tabs:beforeSwitch');

            this.tablists.each(function (i, tablist) {
                tablist = $(tablist);
                let tabs = tablist.find('.tab');

                let activeTab = tabs.filter('.active');
                let newTab = is.number(s) ? tabs.eq(s) : tabs.filter('[data-tabpanel="' + s + '"]');

                if (activeTab[0] == newTab[0])
                    return;

                activeTab.removeClass('active').trigger('tabs:deactivate', [this]);
                newTab.addClass('active').trigger('tabs:activate', [this]);
            }.bind(this));

            this.tabpanellists.each(function (i, tabpanellist) {
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
                                    this.element.trigger('tabs:afterSwitch', [this]);
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
                                this.element.trigger('tabs:afterSwitch', [this]);
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