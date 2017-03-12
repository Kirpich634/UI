'use strict';

ui.tabs.options.preventDefaultInitEventAction = true;

ui.tabs.init = function (e, instance) {
    instance.queue = false;

    instance.nodes.tablists.find('.tab').on('mouseenter', function (e) {
        e.preventDefault();

        var target = $(e.currentTarget);

        if (!instance.permission) {
            instance.queue = target.attr('data-tabpanel') || target.index();
        } else {
            instance.switch(target.attr('data-tabpanel') || target.index());
        }
    });
};

ui.tabs.afterSwitch = function (e, instance) {
    if (!instance.queue) return;

    instance.switch(instance.queue);
    instance.queue = false;
};

ui.textfield.focus = function (e, instance) {
    instance.underline = $('<hr>').addClass('underline').css({
        left: ui.mouseCoordinates.pageX - instance.element.offset().left + "px",
        width: 0
    }).appendTo(instance.element);

    setTimeout(function () {
        instance.underline.css({
            left: 0,
            width: 100 + '%'
        });
    }, 0);
};

ui.textfield.blur = function (e, instance) {
    instance.underline.css('opacity', 0).on('transitionend', function () {
        instance.underline.remove();
        delete instance.underline;
    });
};