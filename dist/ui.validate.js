"use strict";

(function (w, d) {
    var rules = {
        empty: function empty(value) {
            return value != "" && value != undefined && value != null;
        },
        min: function min(value, limit) {
            return is.string(value) ? value.length >= limit : value >= limit;
        },
        max: function max(value, limit) {
            return is.string(value) ? value.length <= limit : value <= limit;
        },
        email: function email(value) {
            return (/^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/gi.test(value)
            );
        },
        phone: function phone(value) {
            return (/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value)
            );
        },
        regex: function regex(value, _regex) {
            return _regex.test(value);
        },
        equals: function equals(value, value2) {
            return value == value2;
        },
        custom: function custom(value, rule) {
            return rule(value);
        }
    };

    var validate = w.formvalidate = function () {
        var generalValidate = void 0;

        var form = arguments[0];

        var update = is.function(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : false;
        var node = void 0;

        for (var i = 1; i < (update ? arguments.length - 1 : arguments.length); i++) {

            if (node = form.elements[arguments[i].name]) {
                var validation = void 0;
                var rule = void 0;

                for (rule in rules) {
                    if (arguments[i][rule]) {

                        if (is.object(arguments[i][rule])) validation = rules[rule](node.value, arguments[i][rule].value);else {
                            validation = rules[rule](node.value);
                        }

                        if (validation) {
                            if (i == 1) generalValidate = true;
                        } else {
                            generalValidate = false;

                            break;
                        }
                    }
                }

                if (is.function(arguments[i].update)) arguments[i].update(node, validation, validation ? arguments[i].success : is.object(arguments[i][rule]) ? arguments[i][rule].error : arguments[i][rule]);else if (is.function(update)) update(node, validation, validation ? arguments[i].success : is.object(arguments[i][rule]) ? arguments[i][rule].error : arguments[i][rule]);
            }
        }

        return generalValidate;
    };

    $.fn.validate = function () {
        var _arguments = arguments;

        var v = true;

        this.each(function (i, el) {
            var a = Array.prototype.slice.call(_arguments);

            Array.prototype.unshift.call(a, el);

            if (!validate.apply(null, a)) v = false;
        });

        return v;
    };
})(window, document);