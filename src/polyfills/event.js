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
