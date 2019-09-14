// Source: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (
                    this.document || this.ownerDocument
                ).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;

        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('after')) {
            return;
        }
        Object.defineProperty(item, 'after', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function after() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(
                        isNode
                            ? argItem
                            : document.createTextNode(String(argItem))
                    );
                });

                this.parentNode.insertBefore(docFrag, this.nextSibling);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function append() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(
                        isNode
                            ? argItem
                            : document.createTextNode(String(argItem))
                    );
                });

                this.appendChild(docFrag);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function() {
    if (typeof window.Event === 'function') return false;

    function Event(event, params) {
        params = params || { bubbles: false, cancelable: false };
        var evt = document.createEvent('Event');
        evt.initEvent(event, params.bubbles, params.cancelable);
        return evt;
    }

    window.Event = Event;
})();
