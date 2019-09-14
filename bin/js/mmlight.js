import version from '../_version';
import MMToggler from './matchmedia';
import * as options from './_options';
import * as support from './_support';
import { r, $ } from './helpers';
/**
 * Class for a lightweight mobile menu.
 */
var MmenuLight = /** @class */ (function () {
    /**
     * Create a lightweight mobile menu.
     *
     * @param {HTMLElement} menu        HTML element for the menu.
     * @param {object}      [options]   Options for the menu.
     */
    function MmenuLight(menu, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        //  Extend options with defaults.
        this.options = {};
        Object.keys(MmenuLight.options).forEach(function (key) {
            _this.options[key] =
                typeof options[key] != 'undefined'
                    ? options[key]
                    : MmenuLight.options[key];
        });
        if (support.IE11) {
            this.options.slidingSubmenus = false;
        }
        //  Store the menu node.
        this.menu = menu;
        if (this.options.theme == 'dark') {
            this.menu.classList.add('mm--dark');
        }
        if (!this.options.slidingSubmenus) {
            this.menu.classList.add('mm--vertical');
        }
        this._openPanel();
        this._initAnchors();
    }
    /**
     * Enable the menu.
     *
     * @param {string} [mediaQuery='all'] Media queury to match for the menu.
     */
    MmenuLight.prototype.enable = function (mediaQuery) {
        var _this = this;
        if (mediaQuery === void 0) { mediaQuery = 'all'; }
        this.toggler = new MMToggler(mediaQuery);
        this.toggler.add(function () { return _this.menu.classList.add('mm'); }, function () { return _this.menu.classList.remove('mm'); });
        return this.toggler;
    };
    /**
     * Disable the menu.
     */
    MmenuLight.prototype.disable = function () {
        this.toggler.destroy();
    };
    /**
     * Initiate the selected listitem / open the current panel.
     */
    MmenuLight.prototype._openPanel = function () {
        var listitems = $('.' + this.options.selected, this.menu);
        var listitem = listitems[listitems.length - 1];
        var panel = null;
        if (listitem) {
            panel = listitem.closest('ul');
        }
        if (!panel) {
            panel = this.menu.querySelector('ul');
        }
        this.openPanel(panel);
    };
    /**
     * Open the given panel.
     *
     * @param {HTMLElement} panel Panel to open.
     */
    MmenuLight.prototype.openPanel = function (panel) {
        /** Title above the panel to open. */
        var title = panel.dataset.mmTitle;
        /** Parent LI for the panel.  */
        var listitem = panel.parentElement;
        if (listitem === this.menu) {
            //  Opening the main level UL.
            this.menu.classList.add('mm--main');
        }
        else {
            //  Opening a sub level UL.
            this.menu.classList.remove('mm--main');
            //  Find title from parent LI.
            if (!title) {
                r(listitem.children).forEach(function (child) {
                    if (child.matches('a, span')) {
                        title = child.textContent;
                    }
                });
            }
        }
        //  Use the default title.
        if (!title) {
            title = this.options.title;
        }
        //  Set the title.
        this.menu.dataset.mmTitle = title;
        //  Unset all panels from being opened and parent.
        $('.mm--open', this.menu).forEach(function (open) {
            open.classList.remove('mm--open', 'mm--parent');
        });
        //  Set the current panel as being opened.
        panel.classList.add('mm--open');
        panel.classList.remove('mm--parent');
        //  Set all parent panels as being parent.
        var parent = panel.parentElement.closest('ul');
        while (parent) {
            parent.classList.add('mm--open', 'mm--parent');
            parent = parent.parentElement.closest('ul');
        }
    };
    /**
     * Open or close the given panel.
     *
     * @param {HTMLElement} panel Panel to open or close.
     */
    MmenuLight.prototype.togglePanel = function (panel) {
        if (this.options.slidingSubmenus) {
            this.openPanel(panel);
        }
        else {
            var fn = 'add';
            if (panel.matches('.mm--open')) {
                fn = 'remove';
            }
            panel.classList[fn]('mm--open');
            panel.parentElement.classList[fn]('mm--open');
        }
    };
    /**
     * Initialize the click event handlers.
     */
    MmenuLight.prototype._initAnchors = function () {
        var _this = this;
        /**
         * Clicking an A in the menu: prevent bubbling up to the LI, UL or menu.
         *
         * @param   {MouseEvent}    evnt    The event.
         * @return  {boolean}       handled Whether or not the event was handled.
         */
        var clickAnchor = function (evnt) {
            /** The clicked element */
            var target = evnt.target;
            if (target.matches('a')) {
                evnt.stopImmediatePropagation();
                return true;
            }
            return false;
        };
        /**
         * Click a LI or SPAN in the menu: open its submenu (if present).
         *
         * @param   {MouseEvent}    evnt    The event.
         * @return  {boolean}               Whether or not the event was handled.
         */
        var openSubmenu = function (evnt) {
            /** The clicked element */
            var target = evnt.target;
            /** Parent listitem for the submenu.  */
            var listitem;
            //  Find the parent listitem.
            if (target.closest('span')) {
                listitem = target.parentElement;
            }
            else if (target.closest('li')) {
                listitem = target;
            }
            else {
                listitem = false;
            }
            if (listitem) {
                r(listitem.children).forEach(function (panel) {
                    if (panel.matches('ul')) {
                        _this.togglePanel(panel);
                    }
                });
                evnt.stopImmediatePropagation();
                return true;
            }
            return false;
        };
        /**
         * Click the menu: close the last opened submenu.
         *
         * @param   {MouseEvent}    evnt    The event.
         * @return  {boolean}               Whether or not the event was handled.
         */
        var closeSubmenu = function (evnt) {
            /** The clicked element */
            var target = evnt.target;
            if (target.matches('.mm')) {
                var panels = $('.mm--open', target);
                var panel = panels[panels.length - 1];
                if (panel) {
                    var parent_1 = panel.parentElement.closest('ul');
                    if (parent_1) {
                        _this.openPanel(parent_1);
                    }
                }
                evnt.stopImmediatePropagation();
                return true;
            }
            return false;
        };
        this.menu.addEventListener('click', function (evnt) {
            //  Don't proceed if the menu isn't enabled at the moment.
            if (!_this.menu.matches('.mm')) {
                return;
            }
            var handled = false;
            handled = handled || clickAnchor(evnt);
            handled = handled || openSubmenu(evnt);
            handled = handled || closeSubmenu(evnt);
        });
    };
    /**	Plugin version. */
    MmenuLight.version = version;
    /**	Default options for menus. */
    MmenuLight.options = options.core;
    /**	Default off-canvas options for menus. */
    MmenuLight.optionsOffcanvas = options.offcanvas;
    return MmenuLight;
}());
export default MmenuLight;
