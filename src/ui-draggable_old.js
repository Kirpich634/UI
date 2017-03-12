'use strict';

(function ($) {
    var getReact = function (element) {
        var rect = element.offset();
        rect.right = rect.left + element.outerWidth();
        rect.bottom = rect.top + element.outerHeight();

        return rect;
    };

    $.widget('draggable', {
        options: {
            axis: 'x y',
            containment: false,
            containmentFor: 'element',
            handle: false,

            helper: 'original',
            cursorOffset: 'auto',
            revert: false,
            revertDuration: 200
        },

        permission: true,

        create: function () {
            if ( this.options.start ) this.parent.on('dragstart', this.options.start);
            if ( this.options.drag ) this.parent.on('drag', this.options.drag);
            if ( this.options.stop ) this.parent.on('dragstop', this.options.stop);

            this.setDraggable();
            this.setContainment();
            this.setHandle();
        },

        setDraggable: function (draggable) {
            if (draggable) this.options.draggable = draggable;

            if ( this.options.draggable ) {
                if ( is.string(this.options.draggable) ) this.draggable = this.parent.find(this.options.draggable);
                else if ( is.$(this.options.draggable) ) this.draggable = this.options.draggable;
                else this.draggable = $(this.options.draggable);
            } else
                this.draggable = this.parent;

            if ( this.draggable.css('position') == 'static') this.draggable.css('position', 'relative');
        },

        setContainment: function (containment) {
            if (containment) this.options.containment = containment;

            if ( this.options.containment ) {
                if ( is.string(this.options.containment) )
                    this.containment = this.parent.closest(this.options.containment);
                else if ( is.$(this.options.handle) )
                    this.containment = this.options.containment;
                else
                    this.containment = $(this.options.containment);
            }
        },
        setHandle: function (handle) {
            if (handle) this.options.handle = handle;

            if ( this.handle ) this.disable();

            if ( this.options.handle ) {
                if ( is.string(this.options.handle) ) this.handle = this.parent.find(this.options.handle);
                else if ( is.$(this.options.handle) ) this.handle = this.options.handle;
                else this.handle = $(this.options.handle);
            } else
                this.handle = this.parent;

            if ( !this.parent.attr('disabled') ) this.enable();
        },

        getPosition: function () {
            var cssPosition = this.helper.css('position');

            var e = event;

            var x = cssPosition == 'fixed' ? e.clientX : e.pageX,
                y = cssPosition == 'fixed' ? e.clientY : e.pageY;

            if ( this.containment ) {
                var containmentOffset = this.containment.offset();
                var containmentWidth = this.containment.outerWidth();
                var containmentHeight = this.containment.outerHeight();
            }

            var helperWidth = this.helper.outerWidth();
            var helperHeight = this.helper.outerHeight();

            var position = {
                top: y,
                left: x
            };

            if (cssPosition == 'fixed') {

                position.top -= this.cursorOffset.top;
                position.left -= this.cursorOffset.left;

                if ( this.containment ) {
                    containmentOffset.top = containmentOffset.top - $(window).scrollTop();
                    containmentOffset.left = containmentOffset.left - $(window).scrollLeft();
                }

                if (this.containment && this.options.containmentFor == 'cursor') {
                    if (y < containmentOffset.top)
                        position.top = containmentOffset.top - this.cursorOffset.top;
                    else if (y > containmentOffset.top + containmentHeight)
                        position.top = containmentOffset.top + containmentHeight - this.cursorOffset.top;

                    if (x < containmentOffset.left)
                        position.left = containmentOffset.left - this.cursorOffset.left;
                    else if (x > containmentOffset.left + containmentWidth)
                        position.left = containmentOffset.left + containmentWidth - this.cursorOffset.left;

                } else if (this.containment && this.options.containmentFor == 'element') {

                    if (y - this.cursorOffset.top < containmentOffset.top)
                        position.top = containmentOffset.top;
                    else if (y - this.cursorOffset.top + helperHeight > containmentOffset.top + containmentHeight)
                        position.top = containmentOffset.top + containmentHeight - helperHeight;

                    if (x - this.cursorOffset.left < containmentOffset.left)
                        position.left = containmentOffset.left;
                    else if (x - this.cursorOffset.left + helperWidth > containmentOffset.left + containmentWidth)
                        position.left = containmentOffset.left + containmentWidth - helperWidth;
                }

            } else {
                var offsetParentOffset = this.offsetParent.offset();

                position.top -= this.cursorOffset.top + offsetParentOffset.top;
                position.left -= this.cursorOffset.left + offsetParentOffset.left;

                if (this.containment && this.options.containmentFor == 'cursor') {
                    if (y < containmentOffset.top)
                        position.top = containmentOffset.top - offsetParentOffset.top - this.cursorOffset.top;
                    else if (y > containmentOffset.top + containmentHeight)
                        position.top = containmentOffset.top + containmentHeight - offsetParentOffset.top - this.cursorOffset.top;

                    if (x < containmentOffset.left)
                        position.left = containmentOffset.left - offsetParentOffset.left - this.cursorOffset.left;
                    else if (x > containmentOffset.left + containmentWidth)
                        position.left = containmentOffset.left + containmentWidth - offsetParentOffset.left - this.cursorOffset.left;

                } else if (this.containment && this.options.containmentFor == 'element') {
                    if (y - this.cursorOffset.top < containmentOffset.top)
                        position.top = containmentOffset.top - offsetParentOffset.top;
                    else if (y - this.cursorOffset.top + helperHeight > containmentOffset.top + containmentHeight)
                        position.top = containmentOffset.top - offsetParentOffset.top + containmentHeight - helperHeight;

                    if (x - this.cursorOffset.left < containmentOffset.left)
                        position.left = containmentOffset.left - offsetParentOffset.left;
                    else if (x - this.cursorOffset.left + helperWidth > containmentOffset.left + containmentWidth)
                        position.left = containmentOffset.left - offsetParentOffset.left + containmentWidth - helperWidth;
                }

                if (cssPosition == 'relative') {
                    position.top += this.relativeFix.top;
                    position.left += this.relativeFix.left;
                }
            }

            return position;
        },

        setHelper: function () {
            if (this.options.helper == 'original')
                this.helper = this.draggable;
            else if (this.options.helper == 'clone') {
                this.helper = this.draggable.clone().css({
                    position: 'fixed',
                    display: 'none'
                }, 'fixed').appendTo('body').fadeIn(200);
            } else if (is.function(this.options.helper)) {
                this.helper = this.options.helper().appendTo('body');
            } else {
                console.error('неверный тип данных в this.options.helper');
                console.error(this.options.helper);
            }
        },

        getRelativeFix: function (draggableOffset) {
            return {
                top: this.offset.parent.top - draggableOffset.top + parseFloat(this.handle.css('top')),
                left: this.offset.parent.left - draggableOffset.left + parseFloat(this.handle.css('left'))
            };
        },

        setOriginPosition: function (draggableOffset, draggableWidth, draggableHeight, helperWidth, helperHeight) {
            this.originPosition = {
                top: draggableOffset.top - this.offset.parent.top,
                left:  draggableOffset.left - this.offset.parent.left
            };

            if (this.cssPosition == 'fixed') {
                this.originPosition.top -= this.scrollParent.scrollTop();
                this.originPosition.left -= this.scrollParent.scrollLeft();
            } else if (this.cssPosition == 'relative') {
                console.log(this.cssPosition);
                this.originPosition.top += this.relativeFix.top;
                this.originPosition.left += this.relativeFix.left;
            }

            if ( draggableWidth != helperWidth )
                this.originPosition.left += (draggableWidth - helperWidth) / 2;

            if ( draggableHeight != helperHeight )
                this.originPosition.top += (draggableHeight - helperHeight) / 2;
        },

        setCursorOffset: function (x, y, draggableOffset, draggableWidth, draggableHeight, helperWidth, helperHeight) {
            this.cursorOffset = {
                top: 0,
                left: 0
            };

            if (this.options.cursorOffset == 'auto') {

                this.cursorOffset.top =  y - draggableOffset.top;
                this.cursorOffset.left =  x - draggableOffset.left;

                if ( draggableWidth != helperWidth )
                    this.cursorOffset.left -= (draggableWidth - helperWidth) / 2;

                if ( draggableHeight != helperHeight )
                    this.cursorOffset.top -= (draggableHeight - helperHeight) / 2;

            } else if (this.options.cursorOffset == 'top') {
                this.cursorOffset.left =  x - draggableOffset.left;

                if ( draggableWidth != helperWidth )
                    this.cursorOffset.left -= (draggableWidth - helperWidth) / 2;


            } else if (this.options.cursorOffset == 'right') {

                this.cursorOffset.top =  y - draggableOffset.top;
                this.cursorOffset.left = helperWidth;

                if ( draggableHeight != helperHeight )
                    this.cursorOffset.top -= (draggableHeight - helperHeight) / 2;

            } else if (this.options.cursorOffset == 'bottom') {
                this.cursorOffset.top = helperHeight;
                this.cursorOffset.left = x - draggableOffset.left;

                if ( draggableWidth != helperWidth )
                    this.cursorOffset.left -= (draggableWidth - helperWidth) / 2;

            } else if (this.options.cursorOffset == 'left') {
                this.cursorOffset.top =  y - draggableOffset.top;

                if ( draggableHeight != helperHeight )
                    this.cursorOffset.top -= (draggableHeight - helperHeight) / 2;

            } else if (this.options.cursorOffset == 'center') {
                this.cursorOffset.top = draggableWidth / 2;
                this.cursorOffset.left = draggableHeight / 2;

                if ( draggableWidth != helperWidth )
                    this.cursorOffset.left -= (draggableWidth - helperWidth) / 2;

                if ( draggableHeight != helperHeight )
                    this.cursorOffset.top -= (draggableHeight - helperHeight) / 2;

            } else if (is.object(this.options.cursorOffset)) {
                this.cursorOffset.top = this.options.cursorOffset.top;
                this.cursorOffset.left = this.options.cursorOffset.left;
            }
        },

        axisMove: function (position) {
            if ( !this.options.axis ) return;

            if ( this.options.axis == 'x' )
                this.helper.css('left', position.left);
            else if (  this.options.axis == 'y' )
                this.helper.css('top', position.top);
            else
                this.helper.css({top: position.top, left: position.left});
        },

        mousedown: function (e) {
            if ( !this.permission ) return;
            if (e.which != 1 || $(e.target).hasClass('ui-resizable-handle')) return;
            e.preventDefault();
            this.parent.trigger('dragstart', [this]);

            var x = e.pageX, y = e.pageY;

            var draggableOffset = this.draggable.offset();
            var draggableWidth = this.draggable.outerWidth();
            var draggableHeight = this.draggable.outerHeight();

            this.setHelper();

            var helperWidth = this.helper.outerWidth();
            var helperHeight = this.helper.outerHeight();

            this.cssPosition = this.helper.css( "position" );
            this.scrollParent = this.helper.scrollParent();

            this.offsetParent = this.helper.offsetParent();
            this.offset = {
                mousedown: {
                    top: y,
                    left: x
                },
                parent: this.offsetParent.offset(),
                draggableOrigin: {
                    top: draggableOffset.top,
                    left:  draggableOffset.left
                }
            };

            if (this.cssPosition == 'relative')
                this.relativeFix = this.getRelativeFix(draggableOffset);

            this.setOriginPosition(draggableOffset, draggableWidth, draggableHeight, helperWidth, helperHeight);

            this.setCursorOffset(x, y, draggableOffset, draggableWidth, draggableHeight, helperWidth, helperHeight);

            if ( this.draggable.has(this.handle).length == 0  && this.draggable[0] != this.handle[0]) {

                var test = false;

                if ( this.cursorOffset.left < 0 || this.cursorOffset.left > helperWidth ) {
                    this.cursorOffset.left = helperWidth / 2;
                    test = true;
                }


                if ( this.cursorOffset.top < 0 || this.cursorOffset.top > helperHeight ) {
                    this.cursorOffset.top = helperHeight / 2;
                    test = true;
                }

                if (test == true) {
                    this.position = this.getPosition();

                    this.parent.trigger('drag', [this]);

                    this.axisMove(this.position);
                }
            }

            this.position = this.getPosition();

            $(document)
                .on('mousemove', $.proxy(this.move, this))
                .one('mouseup', function () {
                    $(document).off('mousemove', $.proxy(this.move, this));

                    this.parent.trigger('dragstop', [this]);

                    if (this.options.revert) {
                        this.permission = false;
                        this.helper.animate(this.originPosition, this.options.revertDuration, function () {
                            if (this.options.helper != 'original') {
                                this.helper.fadeOut(200, function () {
                                    this.helper.remove();
                                    this.permission = true;
                                }.bind(this))
                            } else
                                this.permission = true;
                        }.bind(this));
                    } else {
                        if (this.options.helper != 'original') {
                            this.permission = false;
                            this.helper.fadeOut(200, function () {
                                this.helper.remove();
                                this.permission = true;
                            }.bind(this))
                        }
                    }


                }.bind(this));
        },
        move: function (e) {
            this.position = this.getPosition();

            this.parent.trigger('drag', [this]);

            this.axisMove(this.position);
        },

        disable: function () {
            this.parent.addClass('disabled');
            this.handle.off('mousedown', $.proxy(this.mousedown, this));
        },
        enable: function () {
            this.parent.removeClass('disabled');
            this.handle.on('mousedown', $.proxy(this.mousedown, this));
        },

        setOption: function (kay, value) {
            switch (kay) {
                case 'preventmove':
                    if (value != undefined)
                        this.options.preventmove = value;
                    else
                        return this.options.preventmove;

                    break;
                case 'axis':
                    if (value != undefined)
                        this.options.axis = value;
                    else
                        return this.options.axis;

                    break;
                case 'containment':
                    if (value != undefined)
                        this.setContainment(value);
                    else
                        return this.options.containment;

                    break;
                case 'containmentFor':
                    if (value != undefined)
                        this.options.containmentFor = value;
                    else
                        return this.options.containmentFor;

                    break;
                case 'handle':
                    if (value != undefined)
                        this.setHandle(value);
                    else
                        return this.options.handle;

                    break;
                case 'draggable':
                    if (value != undefined)
                        this.setDraggable(value);
                    else
                        return this.options.handle;

                    break;
                case 'disable':
                    this.disable();

                    break;
                case 'enable':
                    this.enable();

                    break;

                case 'getUi':
                    return draggable;
                    break;
            }
        }
    });
})($);