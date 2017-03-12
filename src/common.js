'use strict';

(function (w, d) {
    let html = d.documentElement;
    let body = d.body;
    let $body = $(body);

    let scrollTop;

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

let select = $('.new-select');
let menu = select.find('menu');
let items = menu.find('li');

let h = items.eq(0).outerHeight();

items.on('click', function (e) {
    if (menu.hasClass('opened')) {

        let item = $(this);
        let i = item.index();
        items.filter('.active').removeClass('active');

        item.addClass('active');
        menu.css('transform', 'translateY(-' + h * i + 'px)');

        menu.removeClass('opened');


    } else {
        menu.addClass('opened');
    }

});