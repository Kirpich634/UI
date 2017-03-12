'use strict';

(function (w, d) {
    var html = d.documentElement;
    var body = d.body;
    var $body = $(body);

    var scrollTop = void 0;

    w.crollLock = function () {

        scrollTop = html.scrollTop;

        if (body.style.cssText) {
            $body.css({
                position: 'fixed',
                top: -scrollTop
            });
        } else {
            body.style.cssText = 'position: fixed; top: -' + html.scrollTop + 'px;';
        }
    };

    w.crollUock = function () {
        $body.css({
            position: '',
            top: ''
        });

        html.scrollTop = scrollTop;
    };
})(window, document);

var select = $('.new-select');
var menu = select.find('menu');
var items = menu.find('li');

var h = items.eq(0).outerHeight();

items.on('click', function (e) {
    if (menu.hasClass('opened')) {

        var item = $(this);
        var i = item.index();
        items.filter('.active').removeClass('active');

        item.addClass('active');
        menu.css('transform', 'translateY(-' + h * i + 'px)');

        menu.removeClass('opened');
    } else {
        menu.addClass('opened');
    }
});