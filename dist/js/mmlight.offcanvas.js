import MmenuLight from './mmlight';
import * as toggler from './matchmedia';
import * as support from './_support';
var blocker;
const _initAnchors = function () {
    /**
     * Click outside the menu: close the menu.
     *
     * @param   {MouseEvent}    evnt    The event.
     * @return  {boolean}               Whether or not the event was handled.
     */
    const closeMenu = (evnt) => {
        //  Don't proceed if the menu isn't enabled at the moment.
        if (!this.menu.matches('.mm')) {
            return false;
        }
        //  Don't proceed if the menu isn't opened at the moment.
        if (!this.menu.matches('.mm--open')) {
            return false;
        }
        this.close();
        evnt.preventDefault();
        evnt.stopImmediatePropagation();
        return true;
    };
    blocker.addEventListener(support.touch ? 'touchstart' : 'mousedown', closeMenu);
};
/**
 * Open the menu.
 */
MmenuLight.prototype.open = function () {
    if (this.menu.matches('.mm')) {
        this.menu.classList.add('mm--open');
        document.body.classList.add('mm-body--open');
        //  Dispatch the event.
        this.menu.dispatchEvent(new Event('mm:open'));
    }
};
/**
 * Close the menu.
 */
MmenuLight.prototype.close = function () {
    this.menu.classList.remove('mm--open');
    document.body.classList.remove('mm-body--open');
    //  Dispatch the event.
    this.menu.dispatchEvent(new Event('mm:close'));
};
/**
 * Make the menu off-canvas.
 *
 * @param {object} [options] Off-canvas options for the menu.
 */
export default function (options) {
    //  Extend options with defaults.
    options = Object.assign(MmenuLight.optionsOffcanvas, options);
    //  Add off-canvas styles and behavior.
    this.menu.classList.add('mm--offcanvas');
    //  Close menu when disabled.
    toggler.add(() => { }, () => {
        this.close();
    });
    if (options.position == 'right') {
        this.menu.classList.add('mm--right');
    }
    //  Move the menu to the <body>.
    if (options.move) {
        /** Original position in the DOM for the menu. */
        let orgPosition;
        toggler.add(() => {
            //  Store original menu position.
            orgPosition = document.createComment('original menu location');
            this.menu.after(orgPosition);
            //  Move the menu to the <body>.
            document.body.append(this.menu);
        }, () => {
            if (orgPosition) {
                //  Move the menu back to where it came from.
                orgPosition.replaceWith(this.menu);
            }
        });
    }
    //  Block the page while the menu is open.
    if (options.blockPage) {
        blocker = document.createElement('div');
        blocker.classList.add('mm-blocker');
        document.body.append(blocker);
        //  Close the menu when clicking outside it (non-modal).
        if (options.blockPage != 'modal') {
            _initAnchors.call(this);
        }
    }
}
