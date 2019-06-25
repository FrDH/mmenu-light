/** List of functions to fire when the media query matches. */
var matchFns;
/** List of functions to fire when the media query does not match. */
var unmatchFns;
/**
 * The media query listener, fires all added functions.
 *
 * @param {MediaQueryEvent} evnt The event.
 */
const listener = (evnt) => {
    (evnt.matches ? matchFns : unmatchFns).forEach(listener => {
        listener();
    });
};
/** The match media. */
export var toggler = null;
/**
 * Create the match media.
 *
 * @param {string} mqs Media query to use.
 */
export const init = mqs => {
    toggler = window.matchMedia(mqs);
    toggler.addListener(listener);
    matchFns = [];
    unmatchFns = [];
};
/**
 * Destroy the match media,
 * also fires the added functions for when the media query does not match
 * and removes the functions from the lists.
 *
 * @param {Function} listener
 */
export const destroy = () => {
    toggler.removeListener(listener);
    unmatchFns.forEach(listener => {
        listener();
    });
    matchFns = [];
    unmatchFns = [];
};
/**
 * Add a function to the list,
 * also fires the added function.
 *
 * @param {Function} match      Function to fire when the media query matches.
 * @param {Function} unmatch    Function to fire when the media query does not match.
 */
export const add = (match, unmatch) => {
    matchFns.push(match);
    unmatchFns.push(unmatch);
    (toggler.matches ? match : unmatch)();
};
