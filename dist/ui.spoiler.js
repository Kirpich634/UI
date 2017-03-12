'use strict';

/**
 * Created by Stas on 17.08.2016.
 */

(function () {
    var uiTabs = $('[data-ui="spoiler"]');

    uiTabs.each(function () {
        var parrent = $(this);

        var menu = parrent.children('menu');
        var buttons = menu.children('button');

        var tabs = parrent.children('article');

        buttons.on('click', function () {
            var button = $(this);

            var index = button.index();
        });
    });
})();