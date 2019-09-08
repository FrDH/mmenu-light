import MmenuLight from './mmlight';
import * as support from './_support';
var _initAnchors = function () {
    var _this = this;
    /**
     * Click outside the menu: close the menu.
     *
     * @param   {MouseEvent}    evnt    The event.
     * @return  {boolean}               Whether or not the event was handled.
     */
    var closeMenu = function (evnt) {
        //  Don't proceed if the menu isn't enabled at the moment.
        if (!_this.menu.matches('.mm')) {
            return false;
        }
        //  Don't proceed if the menu isn't opened at the moment.
        if (!_this.menu.matches('.mm--open')) {
            return false;
        }
        _this.close();
        evnt.preventDefault();
        evnt.stopImmediatePropagation();
        return true;
    };
    this.blocker.addEventListener(support.touch ? 'touchstart' : 'mousedown', closeMenu);
};
/**
 * Open the menu.
 */
MmenuLight.prototype.open = function () {
    if (this.menu.matches('.mm')) {
        this.menu.classList.add('mm--open');
        document.body.classList.add('mm-body--open');
        if (this.blocker) {
            this.blocker.classList.add('mm--open');
        }
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
    if (this.blocker) {
        this.blocker.classList.remove('mm--open');
    }
    //  Dispatch the event.
    this.menu.dispatchEvent(new Event('mm:close'));
};
/**
 * Make the menu off-canvas.
 *
 * @param {object} [opts] Off-canvas options for the menu.
 */
export default function (opts) {
    var _this = this;
    var options = {};
    //  Extend options with defaults.
    Object.keys(MmenuLight.optionsOffcanvas).forEach(function (key) {
        options[key] =
            typeof opts[key] != 'undefined'
                ? opts[key]
                : MmenuLight.optionsOffcanvas[key];
    });
    //  Add off-canvas styles and behavior.
    this.menu.classList.add('mm--offcanvas');
    //  Close menu when disabled.
    this.toggler.add(function () { }, function () {
        _this.close();
    });
    //  Position: right
    if (options.position == 'right') {
        this.menu.classList.add('mm--right');
    }
    //  Move the menu to the <body>.
    if (options.move) {
        /** Original position in the DOM for the menu. */
        var orgPosition_1;
        this.toggler.add(function () {
            //  Store original menu position.
            orgPosition_1 = document.createComment('original menu location');
            _this.menu.after(orgPosition_1);
            //  Move the menu to the <body>.
            document.body.append(_this.menu);
        }, function () {
            if (orgPosition_1) {
                //  Move the menu back to where it came from.
                orgPosition_1.replaceWith(_this.menu);
            }
        });
    }
    //  Block the page while the menu is open.
    if (options.blockPage) {
        this.blocker = document.createElement('div');
        this.blocker.classList.add('mm-blocker');
        //  Position: right
        if (options.position == 'right') {
            this.blocker.classList.add('mm--right');
        }
        //  Append to the <body>.
        document.body.append(this.blocker);
        //  Close the menu when clicking outside it (non-modal).
        if (options.blockPage != 'modal') {
            _initAnchors.call(this);
        }
        this.toggler.add(function () {
            _this.blocker.classList.remove('mm-hidden');
        }, function () {
            _this.blocker.classList.add('mm-hidden');
        });
    }
}
