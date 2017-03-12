'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (w, d) {
    var App = function () {
        _createClass(App, null, [{
            key: 'n',
            value: function n(type, props, children) {
                return { type: type, props: props, children: children };
            }
        }, {
            key: 'setBooleanProp',
            value: function setBooleanProp($target, name, value) {
                if (value) {
                    $target.setAttribute(name, value);
                    $target[name] = true;
                } else {
                    $target[name] = false;
                }
            }
        }, {
            key: 'removeBooleanProp',
            value: function removeBooleanProp($target, name) {
                $target.removeAttribute(name);
                $target[name] = false;
            }
        }, {
            key: 'isEventProp',
            value: function isEventProp(name) {
                return (/^on/.test(name)
                );
            }
        }, {
            key: 'extractEventName',
            value: function extractEventName(name) {
                return name.slice(2).toLowerCase();
            }
        }, {
            key: 'isCustomProp',
            value: function isCustomProp(name) {
                return isEventProp(name) || name === 'forceUpdate';
            }
        }, {
            key: 'setProp',
            value: function setProp($target, name, value) {
                if (isCustomProp(name)) {
                    return;
                } else if (name === 'className') {
                    $target.setAttribute('class', value);
                } else if (typeof value === 'boolean') {
                    setBooleanProp($target, name, value);
                } else {
                    $target.setAttribute(name, value);
                }
            }
        }, {
            key: 'removeProp',
            value: function removeProp($target, name, value) {
                if (isCustomProp(name)) {
                    return;
                } else if (name === 'className') {
                    $target.removeAttribute('class');
                } else if (typeof value === 'boolean') {
                    removeBooleanProp($target, name);
                } else {
                    $target.removeAttribute(name);
                }
            }
        }, {
            key: 'setProps',
            value: function setProps($target, props) {
                Object.keys(props).forEach(function (name) {
                    setProp($target, name, props[name]);
                });
            }
        }, {
            key: 'updateProp',
            value: function updateProp($target, name, newVal, oldVal) {
                if (!newVal) {
                    removeProp($target, name, oldVal);
                } else if (!oldVal || newVal !== oldVal) {
                    setProp($target, name, newVal);
                }
            }
        }, {
            key: 'updateProps',
            value: function updateProps($target, newProps) {
                var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var props = Object.assign({}, newProps, oldProps);
                Object.keys(props).forEach(function (name) {
                    updateProp($target, name, newProps[name], oldProps[name]);
                });
            }
        }, {
            key: 'addEventListeners',
            value: function addEventListeners($target, props) {
                Object.keys(props).forEach(function (name) {
                    if (isEventProp(name)) {
                        $target.addEventListener(extractEventName(name), props[name]);
                    }
                });
            }
        }, {
            key: 'createElement',
            value: function (_createElement) {
                function createElement(_x) {
                    return _createElement.apply(this, arguments);
                }

                createElement.toString = function () {
                    return _createElement.toString();
                };

                return createElement;
            }(function (node) {
                if (typeof node === 'string') {
                    return document.createTextNode(node);
                }
                var $el = document.createElement(node.type);
                setProps($el, node.props);
                addEventListeners($el, node.props);
                node.children.map(createElement).forEach($el.appendChild.bind($el));
                return $el;
            })
        }, {
            key: 'changed',
            value: function changed(node1, node2) {
                return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type || node1.props && node1.props.forceUpdate;
            }
        }, {
            key: 'updateChildren',
            value: function (_updateChildren) {
                function updateChildren(_x2, _x3, _x4) {
                    return _updateChildren.apply(this, arguments);
                }

                updateChildren.toString = function () {
                    return _updateChildren.toString();
                };

                return updateChildren;
            }(function (parent, newNode, oldNode) {
                var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;


                console.log('====');
                console.log(oldNode);
                console.log('-------');
                console.log(newNode);
                console.log('====');

                if (!oldNode) {
                    console.log('appendChild');
                    parent.appendChild(createElement(newNode));
                } else if (!newNode) {
                    console.log('removeChild');
                    //parent.removeChild(parent.childNodes[index]);
                } else if (changed(newNode, oldNode)) {
                    console.log('changed');
                    console.log(parent);
                    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
                } else if (newNode.type) {
                    console.log('type');
                    updateProps(parent.childNodes[index], newNode.props, oldNode.props);
                    var newLength = newNode.children.length;
                    var oldLength = oldNode.children.length;
                    for (var i = 0; i < newLength || i < oldLength; i++) {
                        updateChildren(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
                    }
                }
            })
        }, {
            key: 'updateElement',
            value: function updateElement(node, newNode, oldNode) {
                if (changed(newNode, oldNode)) node.parentNode.replaceChild(createElement(newNode), node);else if (newNode.type) {
                    updateProps(node, newNode.props, oldNode.props);

                    var newLength = newNode.children.length;
                    var oldLength = oldNode.children.length;

                    for (var i = 0; i < newLength || i < oldLength; i++) {
                        updateChildren(node, newNode.children[i], oldNode.children[i], i);
                    }
                }
            }
        }, {
            key: 'virtualNodeTravel',
            value: function (_virtualNodeTravel) {
                function virtualNodeTravel(_x5, _x6, _x7, _x8) {
                    return _virtualNodeTravel.apply(this, arguments);
                }

                virtualNodeTravel.toString = function () {
                    return _virtualNodeTravel.toString();
                };

                return virtualNodeTravel;
            }(function (node, i, parent, callback) {
                if (typeof node === 'string') callback(node, i, parent.children, parent);else {
                    callback(node, i, parent.children, parent);

                    parent = node;
                    parent.children.forEach(function (node, i, children) {
                        virtualNodeTravel(node, i, parent, callback);
                    });
                }
            })
        }, {
            key: 'DOMNodeToVirtualNode',
            value: function (_DOMNodeToVirtualNode) {
                function DOMNodeToVirtualNode(_x9, _x10) {
                    return _DOMNodeToVirtualNode.apply(this, arguments);
                }

                DOMNodeToVirtualNode.toString = function () {
                    return _DOMNodeToVirtualNode.toString();
                };

                return DOMNodeToVirtualNode;
            }(function (node, parent) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.data;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    var virtualNode = {
                        node: node,
                        type: node.nodeName,
                        props: {}
                    };

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = node.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var attribute = _step.value;

                            virtualNode.props[attribute.name] = attribute.value;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    virtualNode.children = Array.prototype.map.call(node.childNodes, DOMNodeToVirtualNode);

                    return virtualNode;
                }
            })
        }, {
            key: 'cloneNode',
            value: function cloneNode(virtualNode) {
                return $.extend(true, {}, virtualNode);
            }
        }]);

        function App(node) {
            _classCallCheck(this, App);

            this.virtualDOM = App.DOMNodeToVirtualNode(node);
        }

        return App;
    }();

    function _on(elem, types, selector, data, fn, one) {
        var origFn, type;

        // Types can be a map of types/handlers
        if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === "object") {

            // ( types-Object, selector, data )
            if (typeof selector !== "string") {

                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                _on(elem, type, selector, data, types[type], one);
            }
            return elem;
        }

        if (data == null && fn == null) {

            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if (fn == null) {
            if (typeof selector === "string") {

                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {

                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if (fn === false) {
            fn = returnFalse;
        } else if (!fn) {
            return elem;
        }

        if (one === 1) {
            origFn = fn;
            fn = function fn(event) {

                // Can use an empty set, since event contains the info
                jQuery().off(event);
                return origFn.apply(this, arguments);
            };

            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }

        return elem.each(function () {
            jQuery.event.add(this, types, fn, data, selector);
        });
    }

    var jq = {
        on: function on(types, selector, data, fn) {
            return _on(this, types, selector, data, fn);
        },

        one: function one(types, selector, data, fn) {
            return _on(this, types, selector, data, fn, 1);
        },

        off: function off(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {

                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === "object") {

                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {

                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        }
    };

    var virtualNodeElement = function () {
        function virtualNodeElement(node) {
            _classCallCheck(this, virtualNodeElement);

            this.node = node;
            this.type = node.nodeName;
            this.props = {
                id: '',
                classList: [],
                style: {}
            };
            this.children = [];
            this.events = function () {
                var map = new Map();

                map.set(true, {});
                map.set(false, {});

                return map;
            }();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = node.attributes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var attribute = _step2.value;

                    switch (attribute.name) {
                        case 'class':
                            this.props.classList = attribute.value.split(' ');

                            break;
                        case 'style':
                            var cssText = this.node.style.cssText.split(';');
                            cssText.pop();

                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = cssText[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var style = _step3.value;

                                    style = style.split(':');

                                    this.props.style[style[0].trim()] = style[1].trim();
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                        _iterator3.return();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }

                            break;
                        default:
                            this.props[attribute.name] = attribute.value;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.children = Array.prototype.map.call(node.childNodes, createVirtualNodeFromNode);
        }

        _createClass(virtualNodeElement, [{
            key: 'addClass',
            value: function addClass(className) {
                if (!this.hasClass(className)) this.props.classList.push(className);
            }
        }, {
            key: 'hasClass',
            value: function hasClass(className) {
                return this.props.classList.indexOf(className) > -1;
            }
        }, {
            key: 'removeClass',
            value: function removeClass(className) {
                var i = this.props.classList.indexOf(className);

                if (i > -1) this.props.classList.splice(this.props.classList.indexOf(className), 1);
            }
        }, {
            key: 'hasAttr',
            value: function hasAttr(name) {
                this.props.hasOwnProperty(name);
            }
        }, {
            key: 'setAttr',
            value: function setAttr(name, value) {
                this.props[name] = value;
            }
        }, {
            key: 'removeAttr',
            value: function removeAttr(name) {
                delete this.props[name];
            }
        }, {
            key: 'on',
            value: function on() {
                var event = void 0,
                    selector = false,
                    callback = void 0,
                    phase = false;

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = arguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var argument = _step4.value;

                        if (is.string(argument)) event ? selector = argument : event = argument;else if (is.function(argument)) callback = argument;else if (is.boolean(argument)) phase = argument;
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var phaseEvents = selector ? this.events.get(phase) : this.get(phase);

                if (!phaseEvents[event]) phaseEvents[event] = new WeakMap();else if (phaseEvents[event].has(callback)) return;

                if (selector) {
                    var callbackWrapper = function callbackWrapper(e) {
                        if (!e.target.matches(selector)) return;

                        callback(e);
                    };

                    phaseEvents[event].set(callback, callbackWrapper);

                    callback = callbackWrapper;
                } else phaseEvents[event].set(callback, callback);

                this.node.addEventListener(event, callback, phase);
            }
        }, {
            key: 'off',
            value: function off() {
                var event = void 0,
                    selector = false,
                    callback = void 0,
                    phase = false;

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = arguments[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var argument = _step5.value;

                        if (is.string(argument)) event ? selector = argument : event = argument;else if (is.function(argument)) callback = argument;else if (is.boolean(argument)) phase = argument;
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                var phaseEvent = this.events.get(phase)[event];

                if (!phaseEvent || !phaseEvent) return;

                callback = phaseEvent.get(callback);

                this.node.removeEventListener(event, callback, phase);

                phaseEvent.delete(callback);
            }
        }, {
            key: 'one',
            value: function one() {
                var _this = this;

                var event = void 0,
                    selector = false,
                    callback = void 0,
                    phase = false,
                    callbackWrapper = void 0;

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = arguments[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var argument = _step6.value;

                        if (is.string(argument)) event ? selector = argument : event = argument;else if (is.function(argument)) callback = argument;else if (is.boolean(argument)) phase = argument;
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                var phaseEvents = this.events.get(phase);

                if (!phaseEvents[event]) phaseEvents[event] = new WeakMap();else if (!phaseEvents[event].has(callback)) return;

                if (selector) callbackWrapper = function callbackWrapper(e) {
                    if (!e.target.matches(selector)) return;

                    _this.off(event, callback, phase);

                    callback(e);
                };else callbackWrapper = function callbackWrapper(e) {
                    _this.off(event, callback, phase);

                    callback(e);
                };

                phaseEvents[event].set(callback, callbackWrapper);

                this.node.addEventListener(event, callbackWrapper, phase);
            }
        }, {
            key: 'trigger',
            value: function trigger() {}
        }, {
            key: 'style',
            value: function style() {
                if (arguments.length == 2) this.props.style[arguments[0]] = arguments[1];else {
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = Object.keys(arguments[0])[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var _kay = _step7.value;

                            this.props.style[_kay] = arguments[0][_kay];
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }
                }
            }
        }, {
            key: 'id',
            set: function set(id) {
                this.props.id = id;
            },
            get: function get() {
                return this.props.id;
            }
        }, {
            key: 'clone',
            get: function get() {}
        }]);

        return virtualNodeElement;
    }();

    var createVirtualNodeFromNode = function createVirtualNodeFromNode(node) {
        if (node.nodeType === Node.TEXT_NODE) return node.data;else if (node.nodeType === Node.ELEMENT_NODE) return new virtualNodeElement(node);
    };

    var app = w.app = {};

    d.addEventListener('DOMContentLoaded', function () {
        app.dom = createVirtualNodeFromNode(d.body);
    });
})(window, document);