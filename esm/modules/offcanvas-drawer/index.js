var prefix = 'mm-ocd';
/**
 * Class for off-canvas behavior.
 */
var MmOffCanvasDrawer = /** @class */ (function () {
    /**
     * Class for off-canvas drawer.
     *
     * @param {HTMLElement} [node]          The element to put in the drawer.
     * @param {String}      [position=left] The position of the drawer, can be "left" or "right".
     */
    function MmOffCanvasDrawer(node, position) {
        var _this = this;
        if (node === void 0) { node = null; }
        //  Create the wrapper.
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add("" + prefix);
        this.wrapper.classList.add(prefix + "--" + position);
        //  Create the drawer.
        this.content = document.createElement('div');
        this.content.classList.add(prefix + "__content");
        this.wrapper.append(this.content);
        //  Create the backdrop.
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add(prefix + "__backdrop");
        this.wrapper.append(this.backdrop);
        //  Add the nodes to the <body>.
        document.body.append(this.wrapper);
        if (node) {
            this.content.append(node);
        }
        //  Click the backdrop.
        var close = function (evnt) {
            _this.close();
            evnt.preventDefault();
            evnt.stopImmediatePropagation();
        };
        this.backdrop.addEventListener('touchstart', close);
        this.backdrop.addEventListener('mousedown', close);
    }
    Object.defineProperty(MmOffCanvasDrawer.prototype, "prefix", {
        /** Prefix for the class. */
        get: function () {
            return prefix;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open the drawer.
     */
    MmOffCanvasDrawer.prototype.open = function () {
        this.wrapper.classList.add(prefix + "--open");
        document.body.classList.add(prefix + "-opened");
    };
    /**
     * Close the drawer.
     */
    MmOffCanvasDrawer.prototype.close = function () {
        this.wrapper.classList.remove(prefix + "--open");
        document.body.classList.remove(prefix + "-opened");
    };
    return MmOffCanvasDrawer;
}());
export default MmOffCanvasDrawer;
