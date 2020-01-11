/**
 * Class for a match media toggler.
 */
var MmToggler = /** @class */ (function () {
    /**
     * Create the match media.
     *
     * @param {string} mediaquery Media query to use.
     */
    function MmToggler(mediaquery) {
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
     * Add a function to the list,
     * also fires the added function.
     *
     * @param {Function} match      Function to fire when the media query matches.
     * @param {Function} unmatch    Function to fire when the media query does not match.
     */
    MmToggler.prototype.add = function (match, unmatch) {
        this.matchFns.push(match);
        this.unmatchFns.push(unmatch);
        (this.toggler.matches ? match : unmatch)();
    };
    return MmToggler;
}());
export default MmToggler;
