/**
 * Class for a match media toggler.
 */
export default class MmToggler {
    /** List of functions to fire when the media query matches. */
    matchFns: Function[];

    /** List of functions to fire when the media query does not match. */
    unmatchFns: Function[];

    /** The match media. */
    toggler: MediaQueryList;

    /** The media query listener, fires all added functions. */
    listener: Function;

    /**
     * Create the match media.
     *
     * @param {string} mediaquery Media query to use.
     */
    constructor(mediaquery: string) {
        this.listener = (evnt: MediaQueryList) => {
            (evnt.matches ? this.matchFns : this.unmatchFns).forEach(
                listener => {
                    listener();
                }
            );
        };

        this.toggler = window.matchMedia(mediaquery);
        this.toggler.addListener(this.listener as any);
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
    add(match: Function, unmatch: Function) {
        this.matchFns.push(match);
        this.unmatchFns.push(unmatch);
        (this.toggler.matches ? match : unmatch)();
    }
}
