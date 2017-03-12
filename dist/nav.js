'use strict';

/**
 * Created by Stas on 30.08.2016.
 */

(function () {
    var header = $('#nav');

    var button = header.children('button.menu-container-interaction');
    var menu = header.find('.menu-container');

    menu.find('li.sub-menu>button').on('click', function () {
        if (document.documentElement.clientWidth >= 992) return;

        var submenu = $(this).parent().toggleClass('open').children('ul').animate({
            height: "toggle",
            marginTop: 'toggle',
            marginBottom: 'toggle',
            paddingTop: 'toggle',
            paddingBottom: 'toggle',
            borderWidth: 'toggle',
            opacity: "toggle"
        }, function () {
            if (submenu.css('display') == 'none') submenu.css('display', '');
        });
    });

    button.on('click', function () {
        if (button.hasClass('show')) {
            button.removeClass('show').addClass('hide');

            menu.fadeIn();
        } else {
            button.removeClass('hide').addClass('show');

            menu.fadeOut(function () {
                menu.css('display', '');
            });
        }
    });
})();