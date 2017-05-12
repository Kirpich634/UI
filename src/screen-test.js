/**
 * Created by Stas on 12.05.2017.
 */

(function (w, d) {
    var t = function (text) {
        return d.createTextNode(text);
    };

    var n = function (name, attributes = {}, children = []) {
        let node = d.createElement(name);

        for (var kay in attributes)
            node.setAttribute(kay, attributes[kay]);

        for (var i = 0; i < children.length; i++)
            node.appendChild(children[i]);

        return node;
    };

    var nodes = {
        main: d.querySelector('main')
    };

    var insertList = [
        n('div', {class: 'about-client', style: ""}, [
            t("Теоретически, видимая часть страницы – это documentElement.clientWidth/Height")
        ]),
        n('div', {class: 'client-width', style: ""}, [
            t("documentElement.clientWidth = " + d.documentElement.clientWidth)
        ]),
        n('div', {class: 'client-width', style: ""}, [
            t("documentElement.clientHeight = " + d.documentElement.clientHeight)
        ]),

        n('div', {class: 'about-scroll', style: ""}, [
            t("А полный размер с учётом прокрутки – по аналогии, documentElement.scrollWidth/scrollHeight")
        ]),
        n('div', {class: 'scroll-width', style: ""}, [
            t("documentElement.scrollWidth = " + d.documentElement.scrollWidth)
        ]),
        n('div', {class: 'scroll-height', style: ""}, [
            t("documentElement.scrollHeight = " + d.documentElement.scrollHeight)
        ]),



        n('div', {class: 'about-inner', style: ""}, [
            t("Все браузеры, кроме IE8-, также поддерживают свойства window.innerWidth/innerHeight. Они хранят текущий размер окна браузера.")
        ]),

        n('div', {class: 'inner-width', style: ""}, [
            t("innerWidth = " + w.innerWidth)
        ]),
        n('div', {class: 'inner-width', style: ""}, [
            t("innerHeight = " + w.innerHeight)
        ]),

        n('br', {}, []),
        n('br', {}, []),
        n('br', {}, []),
        n('br', {}, []),
        n('br', {}, []),

        n('div', {class: 'client-width', style: ""}, [
            t("body.scrollHeight = " + d.body.scrollHeight)
        ]),
        n('div', {class: 'client-width', style: ""}, [
            t("documentElement.scrollHeight = " + d.documentElement.scrollHeight)
        ]),

        n('div', {class: 'client-width', style: ""}, [
            t("body.offsetHeight = " + d.body.offsetHeight)
        ]),
        n('div', {class: 'client-width', style: ""}, [
            t("documentElement.offsetHeight = " + d.documentElement.offsetHeight)
        ]),

        n('div', {class: 'client-width', style: ""}, [
            t("body.clientHeight = " + d.body.clientHeight)
        ]),
        n('div', {class: 'client-width', style: ""}, [
            t("documentElement.clientHeight = " + d.documentElement.clientHeight)
        ])
    ];

    insertList.forEach(function (value, i, array) {
        nodes.main.appendChild(value);
    });

})(window, document);