import version from '../_version';
import MMToggler from './matchmedia';
import * as options from './_options';
import { r, $ } from './helpers';

/**
 * Class for a lightweight mobile menu.
 */
export default class MmenuLight {
    /**	Plugin version. */
    static version: string = version;

    /**	Default options for menus. */
    static options: mmOptions = options.core;

    /**	Default off-canvas options for menus. */
    static optionsOffcanvas: mmOptionsOffcanvas = options.offcanvas;

    /**	Options for the menu. */
    options: mmOptions;

    /** HTML element for the menu. */
    menu: HTMLElement;

    /** Off-canvas add-on */
    offcanvas: Function;

    /** HTML element for the blocker (off-canvas add-on). */
    blocker: HTMLElement;

    /** Open the menu (off-canvas add-on). */
    open: Function;

    /** Close the menu (off-canvas add-on). */
    close: Function;

    /** The Match Media Toggler. */
    toggler: MMToggler;

    /**
     * Create a lightweight mobile menu.
     *
     * @param {HTMLElement} menu        HTML element for the menu.
     * @param {object}      [options]   Options for the menu.
     */
    constructor(menu: HTMLElement, options?: mmOptions) {
        //  Extend options with defaults.
        this.options = {};
        Object.keys(MmenuLight.options).forEach(key => {
            this.options[key] =
                typeof options[key] != 'undefined'
                    ? options[key]
                    : MmenuLight.options[key];
        });

        //  Store the menu node.
        this.menu = menu;

        if (this.options.theme == 'dark') {
            this.menu.classList.add('mm--dark');
        }

        this._openPanel();
        this._initAnchors();
    }

    /**
     * Enable the menu.
     *
     * @param {string} [mediaQuery='all'] Media queury to match for the menu.
     */
    enable(mediaQuery: string = 'all') {
        this.toggler = new MMToggler(mediaQuery);
        this.toggler.add(
            () => this.menu.classList.add('mm'),
            () => this.menu.classList.remove('mm')
        );

        return this.toggler;
    }

    /**
     * Disable the menu.
     */
    disable() {
        this.toggler.destroy();
    }

    /**
     * Initiate the selected listitem / open the current panel.
     */
    _openPanel() {
        let listitems = $('.' + this.options.selected, this.menu);
        let listitem = listitems[listitems.length - 1];
        let panel = null;

        if (listitem) {
            panel = listitem.closest('ul');
        }
        if (!panel) {
            panel = this.menu.querySelector('ul');
        }
        this.openPanel(panel);
    }

    /**
     * Open the given panel.
     *
     * @param {HTMLElement} panel Panel to open.
     */
    openPanel(panel: HTMLElement) {
        /** Title above the panel to open. */
        let title = panel.dataset.mmTitle;

        /** Parent LI for the panel.  */
        let listitem = panel.parentElement;

        if (listitem === this.menu) {
            //  Opening the main level UL.
            this.menu.classList.add('mm--main');
        } else {
            //  Opening a sub level UL.
            this.menu.classList.remove('mm--main');

            //  Find title from parent LI.
            if (!title) {
                r(listitem.children).forEach(child => {
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
        $('.mm--open', this.menu).forEach(open => {
            open.classList.remove('mm--open', 'mm--parent');
        });

        //  Set the current panel as being opened.
        panel.classList.add('mm--open');
        panel.classList.remove('mm--parent');

        //  Set all parent panels as being parent.
        let parent = panel.parentElement.closest('ul');
        while (parent) {
            parent.classList.add('mm--open', 'mm--parent');
            parent = parent.parentElement.closest('ul');
        }
    }

    /**
     * Initialize the click event handlers.
     */
    _initAnchors() {
        /**
         * Clicking an A in the menu: prevent bubbling up to the LI, UL or menu.
         *
         * @param   {MouseEvent}    evnt    The event.
         * @return  {boolean}       handled Whether or not the event was handled.
         */
        const clickAnchor = (evnt: MouseEvent): boolean => {
            /** The clicked element */
            const target = evnt.target as HTMLElement;

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
        const openSubmenu = (evnt: MouseEvent): boolean => {
            /** The clicked element */
            const target = evnt.target as HTMLElement;

            /** Parent listitem for the submenu.  */
            let listitem;

            //  Find the parent listitem.
            if (target.closest('span')) {
                listitem = target.parentElement;
            } else if (target.closest('li')) {
                listitem = target;
            } else {
                listitem = false;
            }

            if (listitem) {
                r(listitem.children).forEach(panel => {
                    if (panel.matches('ul')) {
                        this.openPanel(panel);
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
        const closeSubmenu = (evnt: MouseEvent): boolean => {
            /** The clicked element */
            const target = evnt.target as HTMLElement;

            if (target.matches('.mm')) {
                let panels = $('.mm--open', target);
                let panel = panels[panels.length - 1];
                if (panel) {
                    let parent = panel.parentElement.closest('ul');
                    if (parent) {
                        this.openPanel(parent);
                    }
                }

                evnt.stopImmediatePropagation();
                return true;
            }
            return false;
        };

        this.menu.addEventListener('click', evnt => {
            //  Don't proceed if the menu isn't enabled at the moment.
            if (!this.menu.matches('.mm')) {
                return;
            }

            let handled = false;
            handled = handled || clickAnchor(evnt);
            handled = handled || openSubmenu(evnt);
            handled = handled || closeSubmenu(evnt);
        });
    }
}
