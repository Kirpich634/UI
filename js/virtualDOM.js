'use strict';

((w, d) => {
    class App {
        static n(type, props, children) {
            return {type, props, children};
        }

        static setBooleanProp($target, name, value) {
            if (value) {
                $target.setAttribute(name, value);
                $target[name] = true;
            } else {
                $target[name] = false;
            }
        }

        static removeBooleanProp($target, name) {
            $target.removeAttribute(name);
            $target[name] = false;
        }

        static isEventProp(name) {
            return /^on/.test(name);
        }

        static extractEventName(name) {
            return name.slice(2).toLowerCase();
        }

        static isCustomProp(name) {
            return isEventProp(name) || name === 'forceUpdate';
        }

        static setProp($target, name, value) {
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

        static removeProp($target, name, value) {
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

        static setProps($target, props) {
            Object.keys(props).forEach(name => {
                setProp($target, name, props[name]);
            });
        }

        static updateProp($target, name, newVal, oldVal) {
            if (!newVal) {
                removeProp($target, name, oldVal);
            } else if (!oldVal || newVal !== oldVal) {
                setProp($target, name, newVal);
            }
        }

        static updateProps($target, newProps, oldProps = {}) {
            const props = Object.assign({}, newProps, oldProps);
            Object.keys(props).forEach(name => {
                updateProp($target, name, newProps[name], oldProps[name]);
            });
        }

        static addEventListeners($target, props) {
            Object.keys(props).forEach(name => {
                if (isEventProp(name)) {
                    $target.addEventListener(
                        extractEventName(name),
                        props[name]
                    );
                }
            });
        }

        static createElement(node) {
            if (typeof node === 'string') {
                return document.createTextNode(node);
            }
            const $el = document.createElement(node.type);
            setProps($el, node.props);
            addEventListeners($el, node.props);
            node.children
                .map(createElement)
                .forEach($el.appendChild.bind($el));
            return $el;
        }

        static changed(node1, node2) {
            return typeof node1 !== typeof node2 ||
                typeof node1 === 'string' && node1 !== node2 ||
                node1.type !== node2.type ||
                node1.props && node1.props.forceUpdate;
        }

        static updateChildren(parent, newNode, oldNode, index = 0) {

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
                updateProps(
                    parent.childNodes[index],
                    newNode.props,
                    oldNode.props
                );
                const newLength = newNode.children.length;
                const oldLength = oldNode.children.length;
                for (let i = 0; i < newLength || i < oldLength; i++)
                    updateChildren(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
            }
        }

        static updateElement(node, newNode, oldNode) {
            if (changed(newNode, oldNode))
                node.parentNode.replaceChild(createElement(newNode), node);
            else if (newNode.type) {
                updateProps(node, newNode.props, oldNode.props);

                const newLength = newNode.children.length;
                const oldLength = oldNode.children.length;

                for (let i = 0; i < newLength || i < oldLength; i++)
                    updateChildren(node, newNode.children[i], oldNode.children[i], i);
            }
        }

        static virtualNodeTravel(node, i, parent, callback) {
            if (typeof node === 'string')
                callback(node, i, parent.children, parent);
            else {
                callback(node, i, parent.children, parent);

                parent = node;
                parent.children.forEach((node, i, children) => {
                    virtualNodeTravel(node, i, parent, callback);
                });
            }
        }

        static DOMNodeToVirtualNode(node, parent) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.data;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let virtualNode = {
                    node,
                    type: node.nodeName,
                    props: {},
                };

                for (let attribute of node.attributes)
                    virtualNode.props[attribute.name] = attribute.value;

                virtualNode.children = Array.prototype.map.call(node.childNodes, DOMNodeToVirtualNode);

                return virtualNode;
            }
        }

        static cloneNode(virtualNode) {
            return $.extend(true, {}, virtualNode);
        }

        constructor(node) {
            this.virtualDOM = App.DOMNodeToVirtualNode(node);


        }
    }

    const render = (function () {
        const addToDifferent = function (node, different, branch) {
            switch (node.node.nodeType) {
                case Node.TEXT_NODE:
                    different[Node.TEXT_NODE][branch].set(node.node, node);

                    break;
                case Node.ELEMENT_NODE:
                    different[Node.ELEMENT_NODE][branch].set(node.node, node);

                    if (node.children.length)
                        for (let child of node.children)
                            addToDifferent(child, different, branch);
                    break;
            }
        };

        const difference = function (parent, virtual, mask, different) {
            if (virtual && mask && virtual.node === mask.node) {
                switch (virtual.node.nodeType) {
                    case Node.TEXT_NODE:
                        if (virtual.text !== mask.text)
                            virtual.node.data = virtual.text;

                        break;
                    case Node.ELEMENT_NODE:
                        if (virtual.children.length || mask.children.length) {
                            const maxLength = Math.max(virtual.children.length, mask.children.length);

                            for (let i = 0; i < maxLength; i++)
                                difference(virtual, virtual.children[i], mask.children[i], different);
                        }

                        if (virtual.type !== mask.type)
                            virtual.node.tagName = virtual.type;

                        let keys = Object.keys(virtual.attributes);
                        let nextKeys = Object.keys(mask.attributes);
                        for (let key of nextKeys)
                            if (keys.indexOf(key) === -1)
                                keys.push(key);

                        for (let key of keys) {
                            if (virtual.attributes[key]) {
                                if (virtual.attributes[key] !== mask.attributes[key])
                                    virtual.node.setAttribute(key, virtual.attributes);
                            } else
                                virtual.node.removeAttribute(key);
                        }

                        break;
                }
            } else {
                if (virtual) {
                    switch (virtual.node.nodeType) {
                        case Node.TEXT_NODE:
                            if (different[Node.TEXT_NODE].mask.has(virtual.node)) {
                                let mask = different[Node.TEXT_NODE].mask.get(virtual.node);

                                //parent.node.insertBefore(virtual, parent.node.childNodes)

                                if (virtual.text !== mask.text)
                                    virtual.node.data = virtual.text;

                                different[Node.TEXT_NODE].mask.delete(virtual.node);
                            } else
                                different[Node.TEXT_NODE].virtual.set(virtual.node, virtual);

                            break;
                        case Node.ELEMENT_NODE:
                            if (different[Node.ELEMENT_NODE].mask.has(virtual.node)) {
                                let mask = different[Node.ELEMENT_NODE].mask.get(virtual.node);

                                if (virtual.children.length || mask.children.length) {
                                    const maxLength = Math.max(virtual.children.length, mask.children.length);

                                    for (let i = 0; i < maxLength; i++)
                                        difference(virtual, virtual.children[i], mask.children[i], different);
                                }

                                if (mask.type !== virtual.type)
                                    virtual.node.tagName = virtual.type;

                                let keys = Object.keys(virtual.attributes);
                                let nextKeys = Object.keys(mask.attributes);
                                for (let key of nextKeys)
                                    if (keys.indexOf(key) === -1)
                                        keys.push(key);

                                for (let key of keys) {
                                    if (virtual.attributes[key]) {
                                        if (virtual.attributes[key] !== mask.attributes[key])
                                            virtual.node.setAttribute(key, virtual.attributes);
                                    } else
                                        virtual.node.removeAttribute(key);
                                }

                                different[Node.ELEMENT_NODE].mask.delete(virtual.node);
                            } else
                                different[Node.ELEMENT_NODE].virtual.set(virtual.node, virtual);
                            break;
                    }
                }

                if (mask) {
                    switch (mask.node.nodeType) {
                        case Node.TEXT_NODE:
                            if (different[Node.TEXT_NODE].virtual.has(mask.node)) {
                                let vNode = different[Node.TEXT_NODE].virtual.get(mask.node);

                                if (vNode.text !== mask.text)
                                    vNode.node.data = vNode.text;

                                different[Node.TEXT_NODE].virtual.delete(mask.node);
                            } else
                                different[Node.TEXT_NODE].mask.set(mask.node, mask);

                            break;
                        case Node.ELEMENT_NODE:
                            if (different[Node.ELEMENT_NODE].virtual.has(mask.node)) {
                                let vNode = different[Node.ELEMENT_NODE].virtual.get(mask.node);

                                if (vNode.children.length || mask.children.length) {
                                    const maxLength = Math.max(virtual.children.length, mask.children.length);

                                    for (let i = 0; i < maxLength; i++)
                                        difference(virtual, virtual.children[i], mask.children[i], different);
                                }

                                if (vNode.type !== mask.type)
                                    vNode.node.tagName = vNode.type;

                                let keys = Object.keys(vNode.attributes);
                                let nextKeys = Object.keys(mask.attributes);
                                for (let key of nextKeys)
                                    if (keys.indexOf(key) === -1)
                                        keys.push(key);

                                for (let key of keys) {
                                    if (vNode.attributes[key]) {
                                        if (vNode.attributes[key] !== mask.attributes[key])
                                            vNode.node.setAttribute(key, vNode.attributes);
                                    } else
                                        vNode.node.removeAttribute(key);
                                }

                                different[Node.ELEMENT_NODE].virtual.delete(mask.node);
                            } else
                                different[Node.ELEMENT_NODE].mask.set(mask.node, mask);

                            break;
                    }
                }
            }
        };

        return function (virtual, mask) {
            const different = {
                [Node.TEXT_NODE]: {
                    mask: new Map(),
                    virtual: new Map()
                },
                [Node.ELEMENT_NODE]: {
                    mask: new Map(),
                    virtual: new Map()
                }
            };

            if (virtual.children.length || mask.children.length) {
                const maxLength = Math.max(virtual.children.length, mask.children.length);

                for (let i = 0; i < maxLength; i++)
                    difference(virtual, virtual.children[i], mask.children[i], different);
            }

            for (let node of different[Node.TEXT_NODE].mask) {
                console.log(node);
            }

            for (let node of different[Node.ELEMENT_NODE].mask) {
                console.log(node);
            }

        };
    })();

    class VirtualTextNodeElement {
        constructor() {
            if (arguments[0] instanceof Node) {
                this.node = arguments[0];
                this.text = this.node.data;
            } else {
                this.text = arguments[0];
                this.node = d.createTextNode(this.text);
            }
        }

        get mask() {
            return {
                node: this.node,
                text: this.text
            };
        }
    }

    class VirtualNodeElement {
        constructor() {
            this.attributes = {};
            this.children = [];

            this.fields = {
                class: [],
                style: {},
                data: {},
                eventListener: {
                    stock: {},
                    wrapped: {}
                },
                useCaptureEventListener: {
                    stock: {},
                    wrapped: {}
                }
            };

            if (arguments[0] instanceof Node) {
                this.node = arguments[0];
                this.type = this.node.tagName.toLowerCase();

                for (let argument of arguments) {
                    if (is.array(argument))
                        this.children = argument;
                }

                for (let attribute of this.node.attributes) {
                    this.attributes[attribute.name] = attribute.value;

                    switch (attribute.name) {
                        case 'class':
                            this.fields.class = attribute.value.split(' ');

                            break;
                        case 'style':
                            let cssText = attribute.value.split(';');
                            cssText.pop();
                            for (let style of cssText) {
                                style = style.split(':');
                                this.fields.style[style[0].trim()] = style[1].trim();
                            }

                            break;
                    }
                }
            } else {
                this.type = 'div';

                for (let argument of arguments) {
                    if (is.string(argument))
                        this.type = argument;
                    else if (is.plainObject(argument))
                        this.attributes = argument;
                    else if (is.array(argument))
                        this.children = argument;
                }

                this.node = d.createElement(this.type);

                let attributes = Object.keys(this.attributes);
                if (attributes.length) {
                    for (let attribute of attributes) {
                        let value = this.attributes[attribute];

                        this.node.setAttribute(attribute, value);

                        switch (attribute) {
                            case 'class':
                                this.fields.class = value.split(' ');

                                break;
                            case 'style':
                                let cssText = value.split(';');
                                cssText.pop();
                                for (let style of cssText) {
                                    style = style.split(':');
                                    this.fields.style[style[0].trim()] = style[1].trim();
                                }

                                break;
                        }
                    }
                }
            }
        }

        hasAttr(name) {
            return this.attributes.hasOwnProperty(name);
        }

        setAttr(name, value) {
            this.attributes[name] = value;
        }

        removeAttr(name) {
            delete this.attributes[name];
        }

        set id(id) {
            this.attributes.id = id;
        }

        get id() {
            return this.attributes.id;
        }

        hasClass(name) {
            return this.fields.class.indexOf(name) > -1;
        }

        addClass(name) {
            if (this.hasClass(name))
                return;

            this.fields.class.push(name);
            this.attributes.class = this.fields.class.join(' ');
        }

        removeClass(name) {
            let i = this.fields.class.indexOf(name);

            if (i === -1)
                return;

            this.fields.class.splice(i, 1);
            if (this.fields.class.length)
                this.attributes.class = this.fields.class.join(' ');
            else
                delete this.attributes.class;
        }

        style() {
            if (arguments.length === 2)
                this.style[arguments[0]] = arguments[1];
            else
                for (let kay of Object.keys(arguments[0]))
                    this.style[kay] = arguments[0][kay];

            let keys = Object.keys(this.style);
            if (keys.length) {
                let cssText = '';
                for (let name of Object.keys(this.style))
                    cssText += name + ':' + this.style + ';';

                this.attributes.style = cssText;
            } else
                delete this.attributes.style;
        }

        on() {
            let event, selector = false, callback, phase = false;

            for (let argument of arguments) {
                if (is.string(argument))
                    event ? selector = argument : event = argument;

                else if (is.function(argument))
                    callback = argument;

                else if (is.boolean(argument))
                    phase = argument;
            }

            let eventCallbacks = this.events[phase];

            eventCallbacks = selector ? eventCallbacks.wrapped : eventCallbacks.stock;

            if (!eventCallbacks[event])
                eventCallbacks[event] = new WeakSet();
            else if (eventCallbacks[event].has(callback))
                return;

            if (selector) {
                let callbackWrapper = e => {
                    if (!e.target.matches(selector))
                        return;

                    callback(e);
                };

                eventCallbacks[event].set(callback, callbackWrapper);

                callback = callbackWrapper;
            } else
                eventCallbacks[event].set(callback, callback);

            this.node.addEventListener(event, callback, phase);
        }

        one() {
            let event, selector = false, callback, phase = false, callbackWrapper;

            for (let argument of arguments) {
                if (is.string(argument))
                    event ? selector = argument : event = argument;

                else if (is.function(argument))
                    callback = argument;

                else if (is.boolean(argument))
                    phase = argument;
            }

            let phaseEvents = this.events.get(phase);

            if (!phaseEvents[event])
                phaseEvents[event] = new WeakMap();
            else if (!phaseEvents[event].has(callback))
                return;

            if (selector)
                callbackWrapper = e => {
                    if (!e.target.matches(selector))
                        return;

                    this.off(event, callback, phase);

                    callback(e);
                };

            else
                callbackWrapper = e => {
                    this.off(event, callback, phase);

                    callback(e);
                };

            phaseEvents[event].set(callback, callbackWrapper);

            this.node.addEventListener(event, callbackWrapper, phase);
        }

        off() {
            let event, selector = false, callback, phase = false;

            for (let argument of arguments) {
                if (is.string(argument))
                    event ? selector = argument : event = argument;

                else if (is.function(argument))
                    callback = argument;

                else if (is.boolean(argument))
                    phase = argument;
            }

            let phaseEvent = this.events.get(phase)[event];

            if (!phaseEvent || !phaseEvent)
                return;

            callback = phaseEvent.get(callback);

            this.node.removeEventListener(event, callback, phase);

            phaseEvent.delete(callback);
        }

        trigger(event) {

        }

        data() {
            if (arguments.length === 0)
                return this.fields.data;
            if (arguments.length === 1)
                return this.fields.data[arguments[0]];
            else
                this.fields.data[arguments[0]] = arguments[1];
        }

        get mask() {
            return {
                node: this.node,
                type: this.type,
                attributes: Object.assign({}, this.attributes),
                children: this.children.map(el => {
                    return is.string(el) ? el : el.mask;
                })
            };
        }
    }

    let createVirtualNodeFromNode = (node, deep = true) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return new VirtualTextNodeElement(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            let children = deep ? Array.prototype.map.call(node.childNodes, createVirtualNodeFromNode) : [];
            let attributes = {};

            for (let attribute of node.attributes)
                attributes[attribute.name] = attribute.value;

            return new VirtualNodeElement(node, attributes, children);
        }
    };

    let app = w.app = {};

    let travel = function (vnode, callback) {
        if (vnode.children)
            for (let i = 0; i < vnode.children.length; i++) {
                travel(vnode.children[i], callback);

                callback(vnode.children[i], i, vnode.children);
            }
    };

    d.addEventListener('DOMContentLoaded', () => {
        app.vdom = createVirtualNodeFromNode(d.body);

        let mask = app.vdom.mask;

        travel(app.vdom, (vnode, i, array) => {
            if (vnode.node.nodeType === Node.TEXT_NODE && /^\s+$/.test(vnode.text)) {
                array.splice(i, 1);
            }
        });

        console.log(app.vdom);
        console.log(mask);

        render(app.vdom, mask);

        console.log(app.vdom);
    });
})(window, document);
