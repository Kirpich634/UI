'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    ui.tabs = function () {
        function Tabs(element, options) {
            _classCallCheck(this, Tabs);

            this.options = $.extend({}, Tabs.options);

            var dataAttrOptions = 'preventdefaultinitnodes preventdefaultiniteventaction content windowClass closeButton substrate substrateClass openEffect openEffectApply closeEffect closeEffectApply'.split(' ');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = dataAttrOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dataAttrOption = _step.value;

                    if (element.hasAttr('data-modal.' + dataAttrOption)) this.options[dataAttrOption] = element.attr('data-modal.' + dataAttrOption);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            $.extend(this.options, options);

            var events = 'beforeInit init afterInit beforeSwitch switch afterSwitch'.split(' ');

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var event = _step2.value;

                    if (is.function(this.options[event])) element.on('tabs:' + event, this.options[event]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = events[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _event = _step3.value;

                    if (is.function(Tabs[_event])) element.on('tabs:' + _event, Tabs[_event]);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.nodes = {
                element: element
            };

            this.permissions = [];

            element.trigger('tabs:beforeInit', [this]);

            if (!this.options.preventDefaultInitNodes) {
                this.nodes.tablists = element.find('.tablist').grep(element.find('[data-ui~="tabs"] .tablist'));
                this.nodes.tabpanellists = element.find('.tabpanellist').grep(element.find('[data-ui~="tabs"] .tabpanellist'));
            }

            element.trigger('tabs:init', [this]);

            if (!this.options.preventDefaultInitEventAction) {
                this.nodes.tablists.each(function (i, tablist) {
                    tablist = $(tablist);

                    var tabs = tablist.find('.tab');
                    tabs.on('click', function (e) {
                        e.preventDefault();
                        var target = $(e.currentTarget);

                        if (this.permission) {
                            this.switch(target.attr('data-tabpanel') || tabs.index(target));
                        }
                    }.bind(this));
                }.bind(this));
            }

            element.trigger('tabs:afterInit', [this]);
        }

        _createClass(Tabs, [{
            key: 'switch',
            value: function _switch(s) {
                this.nodes.element.trigger('tabs:beforeSwitch');

                this.nodes.tablists.each(function (i, tablist) {
                    tablist = $(tablist);
                    var tabs = tablist.find('.tab');

                    var activeTab = tabs.filter('.active');
                    var newTab = is.number(s) ? tabs.eq(s) : tabs.filter('[data-tabpanel="' + s + '"]');

                    if (activeTab[0] == newTab[0]) return;

                    activeTab.removeClass('active').trigger('tabs:deactivate', [this]);
                    newTab.addClass('active').trigger('tabs:activate', [this]);
                }.bind(this));

                this.nodes.tabpanellists.each(function (i, tabpanellist) {
                    tabpanellist = $(tabpanellist);

                    var tabpanels = tabpanellist.find('.tabpanel').grep(tabpanellist.find('[data-ui~="tabs"] .tabpanel'));

                    var activeTabpanel = tabpanels.filter('.active');
                    var newTabpanel = is.number(s) ? tabpanels.eq(s) : tabpanels.filter('[name="' + s + '"], [data-name="' + s + '"]');

                    if (activeTabpanel[0] == newTabpanel[0]) return;

                    var tabpanelHeightDifference = activeTabpanel.outerHeight(true) != newTabpanel.outerHeight(true);
                    var delayFading = activeTabpanel.hasClass('delay-fading');

                    var permissionId = this.permissions.push(false) - 1;

                    if (tabpanelHeightDifference) {
                        tabpanellist.css('height', tabpanellist.height());

                        setTimeout(function () {
                            var temp = function (e) {
                                if (e.target != tabpanellist[0]) return;

                                tabpanellist.off('transitionend', temp).removeClass('smooth-height-transition').css('height', '');

                                if (!delayFading) {
                                    this.permissions[permissionId] = true;

                                    if (this.permission) this.nodes.element.trigger('tabs:afterSwitch', [this]);
                                }
                            }.bind(this);

                            tabpanellist.addClass('smooth-height-transition').on('transitionend', temp).css('height', newTabpanel.outerHeight(true));
                        }.bind(this), 0);
                    }

                    if (delayFading) activeTabpanel.addClass('old').one('transitionend', function () {
                        activeTabpanel.removeClass('old');

                        this.permissions[permissionId] = true;

                        if (this.permission) this.nodes.element.trigger('tabs:afterSwitch', [this]);
                    }.bind(this));

                    newTabpanel.addClass('active').trigger('tabs:activate', [this]);

                    activeTabpanel.removeClass('active').trigger('tabs:deactivate', [this]);

                    if (!tabpanelHeightDifference && !delayFading) this.permissions[permissionId] = true;
                }.bind(this));
            }
        }, {
            key: 'permission',
            get: function get() {
                var permission = true;
                for (var i = 0; i < this.permissions.length; i++) {

                    if (this.permissions[i] == false) {
                        permission = this.permissions[i];

                        break;
                    }
                }

                return permission;
            }
        }]);

        return Tabs;
    }();

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
        if (this.data('tabs')) {
            var tabs = this.data('tabs');

            switch (arguments[0]) {}
        } else this.each(function () {
            var element = $(this);
            element.data('tabs', new ui.tabs(element, options));
        });

        return this;
    };
})(window, document);