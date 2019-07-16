/**
 * Class for a match media toggler.
 */
export default class MMToggler {
    /**
     * Create the match media.
     *
     * @param {string} mediaquery Media query to use.
     */
    constructor(mediaquery) {
        this.listener = (evnt) => {
            (evnt.matches ? this.matchFns : this.unmatchFns).forEach(listener => {
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
    destroy() {
        this.toggler.removeListener(this.listener);
        this.unmatchFns.forEach(listener => {
            listener();
        });
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
    add(match, unmatch) {
        this.matchFns.push(match);
        this.unmatchFns.push(unmatch);
        (this.toggler.matches ? match : unmatch)();
    }
}
