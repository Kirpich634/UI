ui.add('modal', (function (w, d) {
    'use strict';

    return class Modal extends ui.ui {
        static get preventDefaults() {
            return {
                initNodes: false,
                init: false
            };
        }

        static get options() {
            return {
                ajaxContent: false,
                content: false,
                substrate: true,

                openEffect: 'classes',
                openEffectApply: 'fade slide-right',

                closeEffect: 'class',
                closeEffectApply: false,

                substrateClass: 'dark',
                windowClass: '',
                closeButton: false,
            }
        }

        static get events() {
            return {
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
        }

        static get openEffects() {
            return {
                transform(modal, insert, callback) {
                    return function () {
                        modal.transform = $('<div>').addClass('modal transform transparent');
                        modal.window.addClass('invisible');

                        insert();

                        var elementRect = modal.element[0].getBoundingClientRect();
                        var substrateWidth = modal.substrate.outerWidth();
                        var substrateHeight = modal.substrate.outerHeight();

                        modal.transform
                            .css({
                                top: elementRect.top + 'px',
                                right: substrateWidth - elementRect.right + 'px',
                                bottom: substrateHeight - elementRect.bottom + 'px',
                                left: elementRect.left + 'px',
                                borderRadius: modal.element.css('borderRadius'),
                                borderWidth: modal.element.css('borderWidth'),
                                borderColor: modal.element.css('borderColor'),
                                backgroundColor: modal.element.css('backgroundColor'),
                                boxShadow: modal.element.css('boxShadow')
                            })
                            .appendTo(modal.substrate)
                            .one('transitionend', function () {
                                modal.element.css('visibility', 'hidden');

                                var windowRect = modal.window[0].getBoundingClientRect();

                                var bottom = substrateHeight - windowRect.bottom;
                                var sizeFix = false;
                                if (bottom < 0) {
                                    bottom = 0;
                                    sizeFix = true;
                                }

                                var transformEndCSS = {
                                    top: windowRect.top + 'px',
                                    right: substrateWidth - windowRect.right + 'px',
                                    bottom: bottom + 'px',
                                    left: windowRect.left + 'px',
                                    borderWidth: modal.window.css('borderWidth'),
                                    borderColor: modal.window.css('borderColor'),
                                    backgroundColor: modal.window.css('backgroundColor'),
                                    boxShadow: modal.window.css('boxShadow')
                                };

                                if (sizeFix) {
                                    transformEndCSS.borderTopRightRadius = modal.window.css('border-top-right-radius');
                                    transformEndCSS.borderTopLeftRadius = modal.window.css('border-top-left-radius');
                                    transformEndCSS.borderBottomRightRadius = 0;
                                    transformEndCSS.borderBottomLeftRadius = 0;
                                } else
                                    transformEndCSS.borderRadius = modal.window.css('borderRadius');

                                this.transform
                                    .one('transitionend', function () {
                                        modal.window.removeClass('invisible');

                                        setTimeout(function () {
                                            modal.transform
                                                .one('transitionend', function (e) {
                                                    console.log(e);

                                                    modal.transform.remove();
                                                    delete modal.transform;

                                                    callback();
                                                })
                                                .addClass('transparent');
                                        }, 0);
                                    }.bind(modal))
                                    .css(transformEndCSS);
                            }.bind(modal));

                        setTimeout(function () {
                            modal.substrate.removeClass('transparent');
                            modal.transform.removeClass('transparent');
                        }, 0);

                    }
                },

                class(modal, insert, callback) {
                    return function (classes) {
                        classes = classes || 'fade';

                        modal.nodes.window
                            .addClass('class-animation')
                            .addClass(classes);

                        insert();

                        setTimeout(function () {
                            modal.nodes.window
                                .on('transitionend', function (e) {
                                    modal.nodes.window.removeClass('class-animation');

                                    callback();
                                }.bind(this))
                                .removeClass(classes);
                        }, 0);
                    }
                }
            };
        }

        static get closeEffects() {
            return {
                transform(modal, callback) {
                    modal.transform = $('<div>').addClass('modal transform transparent');
                    modal.substrate.addClass('transparent');

                    var scrollTop = modal.substrate.scrollTop();

                    var elementRect = modal.element[0].getBoundingClientRect();
                    var windowRect = modal.window[0].getBoundingClientRect();
                    var substrateWidth = modal.substrate.outerWidth();
                    var substrateHeight = modal.substrate.outerHeight();

                    var elementStyleList = {
                        top: elementRect.top + 'px',
                        right: substrateWidth - elementRect.right + 'px',
                        bottom: substrateHeight - elementRect.bottom + 'px',
                        left: elementRect.left + 'px',
                        borderRadius: modal.element.css('borderRadius'),
                        borderWidth: modal.element.css('borderWidth'),
                        borderColor: modal.element.css('borderColor'),
                        backgroundColor: modal.element.css('backgroundColor'),
                        boxShadow: modal.element.css('boxShadow')
                    };

                    if (modal.heightFix) {
                        if (scrollTop > modal.marginTop) {
                            if (modal.window.outerHeight() + modal.marginTop - scrollTop > substrateHeight) {
                                modal.transform
                                    .css({
                                        top: 0 + 'px',
                                        right: substrateWidth - windowRect.right + 'px',
                                        bottom: 0 + 'px',
                                        left: windowRect.left + 'px',
                                        borderRadius: 0
                                    });
                            } else {
                                modal.transform
                                    .css({
                                        top: 0 + 'px',
                                        right: substrateWidth - windowRect.right + 'px',
                                        bottom: substrateHeight - windowRect.bottom + 'px',
                                        left: windowRect.left + 'px',
                                        borderTopRightRadius: 0,
                                        borderTopLeftRadius: 0,
                                        borderBottomRightRadius: modal.window.css('border-bottom-right-radius'),
                                        borderBottomLeftRadius: modal.window.css('border-bottom-left-radius')
                                    });
                            }
                        } else {
                            if (modal.window.outerHeight() + modal.marginTop - scrollTop > substrateHeight) {
                                modal.transform
                                    .css({
                                        top: windowRect.top + 'px',
                                        right: substrateWidth - windowRect.right + 'px',
                                        bottom: 0 + 'px',
                                        left: windowRect.left + 'px',
                                        borderTopRightRadius: modal.window.css('border-top-right-radius'),
                                        borderTopLeftRadius: modal.window.css('border-top-left-radius'),
                                        borderBottomRightRadius: 0,
                                        borderBottomLeftRadius: 0
                                    });

                            } else {
                                modal.transform
                                    .css({
                                        top: windowRect.top + 'px',
                                        right: substrateWidth - windowRect.right + 'px',
                                        bottom: substrateHeight - windowRect.bottom + 'px',
                                        left: windowRect.left + 'px'
                                    });
                            }
                        }
                    } else {
                        modal.transform
                            .css({
                                borderRadius: modal.window.css('borderRadius'),
                                top: windowRect.top + 'px',
                                right: substrateWidth - windowRect.right + 'px',
                                bottom: substrateHeight - windowRect.bottom + 'px',
                                left: windowRect.left + 'px',
                            });
                    }

                    modal.transform
                        .css({
                            borderWidth: modal.window.css('borderWidth'),
                            borderColor: modal.window.css('borderColor'),
                            backgroundColor: modal.window.css('backgroundColor'),
                            boxShadow: modal.window.css('boxShadow')
                        });

                    modal.transform.appendTo(modal.substrate);

                    setTimeout(function () {
                        modal.transform
                            .one('transitionend', function () {
                                modal.window.addClass('invisible');

                                modal.transform
                                    .one('transitionend', function () {
                                        modal.element.css('visibility', '');

                                        setTimeout(function () {
                                            modal.transform
                                                .one('transitionend', function () {
                                                    modal.transform.remove();
                                                    delete modal.transform;

                                                    callback();
                                                })
                                                .addClass('transparent');
                                        }, 0);
                                    })
                                    .css(elementStyleList);
                            })
                            .removeClass('transparent')
                    }, 0);
                },

                class(modal, callback) {
                    return function (classes) {
                        classes = classes || 'fade';
                        modal.nodes.window.addClass('class-animation');

                        setTimeout(function () {
                            modal.nodes.window
                                .one('transitionend', function () {
                                    modal.nodes.window.removeClass(classes);

                                    callback();
                                })
                                .addClass(classes);
                        }, 0);
                    };
                }
            };
        }

        constructor(element, options) {
            super('modal', element, options, function () {

            }, function () {this.permission = true;
                this.nodes.element
                    .click(function (e) {
                        e.preventDefault();
                        if (this.permission) {
                            this.open();
                        }
                    }.bind(this));


                if (is.string(this.options.content))
                    this.options.content = $(this.options.content);
            });
        }

        resize() {
            let modalHeight = this.nodes.modal.outerHeight();

            if (this.nodes.window.outerHeight(true) > modalHeight) {
                this.nodes.heightFix = true;

                this.nodes.window.css('marginTop', '');

                this.marginTop = parseInt(this.nodes.window.css('marginTop'));
                this.marginBottom = parseInt(this.nodes.window.css('marginBottom'));
            } else {
                this.nodes.window.css('marginTop', (modalHeight - this.nodes.window.outerHeight()) / 2);
                this.heightFix = false;
            }
        }

        open() {
            this.permission = false;
            this.heightFix = false;
            this.nodes.element.trigger('modal:beforeOpen', [this]);

            $.scrollLock();

            this.nodes.modal = $('<div class="modal">');

            if (is.string(this.options.content))
                this.nodes.window = $(this.options.content);
            else if (is.$(this.options.content) && this.options.content.length > 1)
                this.nodes.window = $('<div class="window container">').append(this.options.content);
            else if (is.$(this.options.content) && this.options.content.length == 1)
                this.nodes.window = this.options.content;

            if (!this.nodes.window.hasClass('window'))
                this.nodes.window.addClass('window');

            if (!this.nodes.window.hasClass('container'))
                this.nodes.window.addClass('container');

            if (this.options.windowClass)
                this.nodes.window.addClass(this.options.windowClass);


            this.nodes.window.appendTo(this.nodes.modal);


            if (this.options.substrate) {
                this.nodes.substrate = $('<div class="substrate fade transparent">')
                    .on('click', this.close.bind(this))
                    .appendTo(this.nodes.modal);

                if (this.options.substrateClass)
                    this.nodes.substrate.addClass(this.options.substrateClass);
            }


            if (this.options.closeButton) {
                if (is.text(this.options.closeButton)) {

                    this.nodes.close = this.nodes.window.find(this.options.closeButton).on('click', function (e) {
                        e.preventDefault();

                        if (this.permission)
                            this.close();
                    }.bind(this));

                } else if (is.$(this.options.closeButton)) {

                    this.nodes.close = this.options.closeButton.on('click', function (e) {
                        e.preventDefault();

                        if (this.permission)
                            this.close();
                    }.bind(this));

                } else {

                    this.nodes.close = $(this.options.closeButton).on('click', function (e) {
                        e.preventDefault();

                        if (this.permission)
                            this.close();
                    }.bind(this));
                }
            }


            let openEffect;
            if (is.function(this.options.openEffect))
                openEffect = this.options.openEffect;

            else if (is.string(this.options.openEffect) && is.function(Modal.openEffects[this.options.openEffect]))
                openEffect = Modal.openEffects[this.options.openEffect];
            else
                openEffect = Modal.openEffects['class'];


            if (is.array(this.options.openEffectApply))
                openEffect.apply();


            openEffect = openEffect(this, function () {
                this.nodes.modal.appendTo('body');

                this.resize();
                $(w).on('resize', $.proxy(this.resize, this));

                if (this.nodes.substrate)
                    setTimeout(function () {
                        this.nodes.substrate
                            .removeClass('transparent');
                    }.bind(this), 0);
            }.bind(this), function () {
                this.nodes.element.trigger('modal:afterOpen', [this]);
                this.permission = true;
            }.bind(this));


            if (is.array(this.options.openEffectApply))
                openEffect.apply(null, this.options.openEffectApply);
            else
                openEffect(this.options.openEffectApply);

            this.nodes.element.trigger('modal:open', [this]);
        }

        close() {
            this.permission = false;
            this.nodes.element.trigger('modal:beforeClose', [this]);

            $(w).off('resize', $.proxy(this.resize, this));

            let closeEffect;
            if (is.function(this.options.closeEffect))
                closeEffect = this.options.closeEffect;

            else if (is.string(this.options.closeEffect) && is.function(Modal.closeEffects[this.options.closeEffect]))
                closeEffect = Modal.closeEffects[this.options.closeEffect];
            else
                closeEffect = Modal.closeEffects['class'];


            let afterClose = function () {
                $.scrollUnlock();

                this.nodes.window.remove();
                delete this.nodes.window;

                if (this.nodes.substrate) {
                    this.nodes.substrate.remove();
                    delete this.nodes.substrate;
                }

                this.nodes.modal.remove();
                delete this.nodes.modal;

                this.nodes.element.trigger('modal:closeEnd', [this]);
                this.permission = true;
            }.bind(this);

            let callback;

            if (this.nodes.substrate) {
                let permission = false;

                callback = function () {
                    permission ? afterClose() : permission = true;
                }.bind(this);

                this.nodes.substrate.one('transitionend', callback);

                closeEffect = closeEffect(this, callback);
            } else
                closeEffect = closeEffect(this, afterClose);

            if (is.array(this.options.closeEffectApply))
                closeEffect.apply(null, this.options.closeEffectApply);
            else
                closeEffect(this.options.closeEffectApply);

            if (this.nodes.substrate)
                this.nodes.substrate.addClass('transparent');

            this.nodes.element.trigger('modal:close', [this]);
        }
    }
})(window, document));