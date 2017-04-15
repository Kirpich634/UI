


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

        constructor (node) {
            this.virtualDOM = App.DOMNodeToVirtualNode(node);


        }
    }

    let elementsData = {
        custom: new WeakMap(),
        eventsCallbacksPhaseTrue: {
            stock: {

            },
            sheathed: {

            }
        },
        eventsCallbacksPhaseFalse: {
            stock: {

            },
            sheathed: {

            }
        },
    };

    Array.prototype.unique = function() {
        var a = [];
        for (var i=0, l=this.length; i<l; i++)
            if (a.indexOf(this[i]) === -1)
                a.push(this[i]);
        return a;
    };


    let render = function (nodeMask, virtualNode) {

        let differentNew = new WeakMap();
        let differentOld = new WeakMap();

        let difference = function (nodeMask, virtualNode) {
            let maxLength = Math.max(nodeMask.children.length, virtualNode.children.length);

            for (let i = 0; i < maxLength; i++) {
                if (virtualNode.children[i]) {
                    if (virtualNode.children[i].node = nodeMask.children[i].node) {

                    } else {
                        if (differentOld.has(virtualNode.children[i].node)) {
                            let mask = differentOld[virtualNode.children[i].node];

                            if (mask.type !== virtualNode.children[i].type)
                                virtualNode.children[i].node.tagName = virtualNode.children[i].type;

                            let keys = Object.keys(virtualNode.children[i].props).concat(Object.keys(mask.props)).unique();

                            for (let key of keys) {
                                if (virtualNode.children[i].props[key]) {
                                    if (virtualNode.children[i].props[key] !== mask.props[key])
                                        virtualNode.children[i].node.setAttribute(key, virtualNode.children[i].props);
                                } else {
                                    virtualNode.children[i].node.removeAttribute(key);
                                }
                            }


                            

                            differentOld.delete(virtualNode.children[i].node);
                        } else {
                            differentNew.set(virtualNode.children[i].node, virtualNode.children[i]);
                        }

                        if (differentNew.has(nodeMask.children[i].node)) {


                            let mask = differentNew[nodeMask.children[i].node];

                            if (mask.type !== virtualNode.children[i].type)
                                virtualNode.children[i].node.tagName = virtualNode.children[i].type;

                            let keys = Object.keys(virtualNode.children[i].props).concat(Object.keys(mask.props)).unique();

                            for (let key of keys) {
                                if (virtualNode.children[i].props[key]) {
                                    if (virtualNode.children[i].props[key] !== mask.props[key])
                                        virtualNode.children[i].node.setAttribute(key, virtualNode.children[i].props);
                                } else {
                                    virtualNode.children[i].node.removeAttribute(key);
                                }
                            }

                            differentOld.delete(virtualNode.children[i].node);


                        } else {
                            differentOld.set(nodeMask.node, nodeMask);
                        }
                    }
                } else {
                    nodeMask.children[i].node.parentNode.removeChild(nodeMask.children[i].node);
                }
            }
        };

        difference(nodeMask, virtualNode);

    };

    class virtualNodeElement {
        constructor (node) {
            this.node = node;
            this.type = node.nodeName;
            this.classList = [];
            this.style = {};
            this.props = {
                id: '',
                class: '',
                style: '',
            };
            this.children = [];

            for (let attribute of node.attributes) {
                switch (attribute.name) {
                    case 'class':
                        this.props.classList = attribute.value.split(' ');

                        break;
                    case 'style':
                        let cssText = this.node.style.cssText.split(';');
                        cssText.pop();

                        for (let style of cssText) {
                            style = style.split(':');

                            this.props.style[style[0].trim()] = style[1].trim();
                        }

                        break;
                    default:
                        this.props[attribute.name] = attribute.value;
                }

            }

            this.children = deep ? Array.prototype.map.call(node.childNodes, createVirtualNodeFromNode) : [];
        }

        addClass(className) {
            if (!this.hasClass(className))
                this.props.classList.push(className);
        }

        hasClass(className) {
            return this.props.classList.indexOf(className) > -1;
        }

        removeClass(className) {
            let i = this.props.classList.indexOf(className);

            if (i > -1)
                this.props.classList.splice(this.props.classList.indexOf(className), 1);
        }

        hasAttr(name) {
            this.props.hasOwnProperty(name);
        }

        setAttr(name, value) {
            this.props[name] = value;
        }

        removeAttr(name) {
            delete this.props[name];
        }

        on () {
            let event, selector = false, callback, phase = false;

            for (let argument of arguments) {
                if (is.string(argument))
                    event ? selector = argument : event = argument;

                else if (is.function(argument))
                    callback = argument;

                else if (is.boolean(argument))
                    phase = argument;
            }

            let eventCallbacks = phase ? elementsData.eventsCallbacksPhaseTrue : elementsData.eventsCallbacksPhaseFalse;

            eventCallbacks = selector ? eventCallbacks.sheathed : eventCallbacks.stock;

            if (!eventCallbacks[event])
                //eventCallbacks[event] = new;

            if (eventCallbacks)

            let phaseEvents = selector ? this.events.get(phase) : this.get(phase);

            if (!phaseEvents[event])
                phaseEvents[event] = new WeakMap();
            else if (phaseEvents[event].has(callback))
                return;

            if (selector) {
                let callbackWrapper = e => {
                    if (!e.target.matches(selector))
                        return;

                    callback(e);
                };

                phaseEvents[event].set(callback, callbackWrapper);

                callback = callbackWrapper;
            } else
                phaseEvents[event].set(callback, callback);

            this.node.addEventListener(event, callback, phase);
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

        trigger(event, arguments) {

        }

        style() {
            if (arguments.length == 2)
                this.props.style[arguments[0]] = arguments[1];
            else
                for (let kay of Object.keys(arguments[0]))
                    this.props.style[kay] = arguments[0][kay];
        }

        set id(id){
            this.props.id = id;
        }

        get id() {
            return this.props.id;
        }

        get mask() {
            return {
                node: this.node,
                type: this.type,
                props: Object.assign({}, this.props.style),
                children: this.children.map((el) => {
                    return is.string(el) ? el : el.mask();
                })
            };
        }
    }

    let createVirtualNodeFromNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE)
            return node.data;
        else if (node.nodeType === Node.ELEMENT_NODE)
            return new virtualNodeElement(node);
    };

    let app = w.app = {};

    d.addEventListener('DOMContentLoaded', () => {
        app.dom = createVirtualNodeFromNode(d.body);
    });

})(window, document);



