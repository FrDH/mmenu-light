/**
 * Class for a match media toggler.
 */
var MMToggler = /** @class */ (function () {
    /**
     * Create the match media.
     *
     * @param {string} mediaquery Media query to use.
     */
    function MMToggler(mediaquery) {
        var _this = this;
        this.listener = function (evnt) {
            (evnt.matches ? _this.matchFns : _this.unmatchFns).forEach(function (listener) {
                listener();
            });
        };
        this.toggler = window.matchMedia(mediaquery);
        this.toggler.addListener(this.listener);
        this.matchFns = [];
        this.unmatchFns = [];
    }
    /**
     * Destroy the match media,
     * also fires the added functions for when the media query does not match
     * and removes the functions from the lists.
     *
     * @param {Function} listener
     */
    MMToggler.prototype.destroy = function () {
        this.toggler.removeListener(this.listener);
        this.unmatchFns.forEach(function (listener) {
            listener();
        });
        this.matchFns = [];
        this.unmatchFns = [];
    };
    /**
     * Add a function to the list,
     * also fires the added function.
     *
     * @param {Function} match      Function to fire when the media query matches.
     * @param {Function} unmatch    Function to fire when the media query does not match.
     */
    MMToggler.prototype.add = function (match, unmatch) {
        this.matchFns.push(match);
        this.unmatchFns.push(unmatch);
        (this.toggler.matches ? match : unmatch)();
    };
    return MMToggler;
}());
export default MMToggler;
