"use strict";

(function (w, d) {
    let rules = {
        empty: (value) => value != "" && value != undefined && value != null,
        min: (value, limit) => is.string(value) ? value.length >= limit : value >= limit,
        max: (value, limit) => is.string(value) ? value.length <= limit : value <= limit,
        email: (value) => (/^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/gi).test(value),
        phone: (value) => (/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/).test(value),
        regex: (value, regex) => (regex).test(value),
        equals: (value, value2) => value == value2,
        custom: (value, rule) => rule(value)
    };

    let validate = w.formvalidate = function() {
        let generalValidate;

        let form = arguments[0];

        let update = is.function(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : false;
        let node;

        for (let i = 1; i < (update ? arguments.length - 1 : arguments.length); i++) {

            if (node = form.elements[arguments[i].name]) {
                let validation;
                let rule;

                for (rule in rules) {
                    if (arguments[i][rule]) {

                        if (is.object(arguments[i][rule]))
                            validation = rules[rule](node.value, arguments[i][rule].value);
                        else {
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

                if ( is.function(arguments[i].update) )
                    arguments[i].update(node, validation, validation ? arguments[i].success : (is.object(arguments[i][rule]) ? arguments[i][rule].error : arguments[i][rule]));
                else if ( is.function(update) )
                    update(node, validation, validation ? arguments[i].success : (is.object(arguments[i][rule]) ? arguments[i][rule].error : arguments[i][rule]));
            }
        }

        return generalValidate;
    };

    $.fn.validate = function() {
        let _arguments = arguments;

        let v = true;

        this.each(function(i, el) {
            let a = Array.prototype.slice.call(_arguments);

            Array.prototype.unshift.call(a, el);

            if (!validate.apply(null, a))
                v = false;
        });

        return v;
    }
})(window, document);