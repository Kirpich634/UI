'use strict';

(function (w, d) {
    (function () {
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
    })();

    (function () {
        console.log($('form[name="form"] button.submit'));

        $('form[name="form"] button.submit').on('click', function (e) {
            e.preventDefault();

            console.log($.fn.validate);

            var validate = $('form[name="form"]').validate({
                name: 'name',
                empty: 'поле обязательно для заполнения'
            }, {
                name: 'surname',
                empty: 'поле обязательно для заполнения'
            }, {
                name: 'middle name',
                empty: 'поле обязательно для заполнения'
            }, {
                name: 'phone',
                empty: 'поле обязательно для заполнения'
            }, {
                name: 'email',
                empty: 'поле обязательно для заполнения'
            }, {
                name: 'addres',
                empty: 'поле обязательно для заполнения'
            }, function () {
                console.log(arguments);
            });

            console.log(validate);
        });
    })();

    (function () {
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
    })();
})(window, document);