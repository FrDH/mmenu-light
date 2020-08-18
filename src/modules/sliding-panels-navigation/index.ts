import { r, $ } from '../helpers';
import * as support from '../support';
import MmKeyboardNavigation, { keyBindings } from '../keyboard-navigation/index';

const prefix = 'mm-spn';

/**
 * Class for navigating in a mobile menu.
 */
export default class MmSlidingPanelsNavigation {
    /** Prefix for the class. */
    get prefix() {
        return prefix;
    }

    /** HTML element for the menu. */
    node: HTMLElement;

    /** The title for the menu. */
    title: string;

    /** Whether or not to use sliding submenus. */
    slidingSubmenus: boolean;

    /** The class for selected menu items. */
    selectedClass: string;

    keyboardNavigator: MmKeyboardNavigation;

    /**
     * Class for navigating in a mobile menu.
     *
     * @param {HTMLElement} node               HTMLElement for the menu.
     * @param {string}      title              The title for the menu.
     * @param {string}      selectedClass      The class for selected list items.
     * @param {boolean}     slidingSubmenus    Whether or not to use sliding submenus.
     * @param {string}      theme              The color scheme for the menu.
     * @param {boolean}     keyboardNavigation Whether or not to use keyboard navigation.
     */
    constructor(
        node: HTMLElement,
        title: string,
        selectedClass: string,
        slidingSubmenus: boolean,
        theme: 'light' | 'dark',
        keyboardNavigation: boolean
    ) {
        this.node = node;
        this.title = title;
        this.slidingSubmenus = slidingSubmenus;
        this.selectedClass = selectedClass;

        //  Add classname.
        this.node.classList.add(prefix);

        //  Sliding submenus not supported in IE11.
        if (support.IE11) {
            this.slidingSubmenus = false;
        }

        this.node.classList.add(`${prefix}--${theme}`);
        this.node.classList.add(
            `${prefix}--${this.slidingSubmenus ? 'navbar' : 'vertical'}`
        );

        if (keyboardNavigation) {
            this.keyboardNavigator = new MmKeyboardNavigation(this.node, this.selectedClass);
        }

        this._setSelectedl();
        this._initAnchors();
    }

    /**
     * Open the given panel.
     *
     * @param {HTMLElement} panel Panel to open.
     */
    openPanel(panel: HTMLElement) {
        /** Parent LI for the panel.  */
        let listItem = panel.parentElement;

        //  Sliding submenus
        if (this.slidingSubmenus) {
            /** Title above the panel to open. */
            let title = panel.dataset.mmSpnTitle;

            //  Opening the main level UL.
            if (listItem === this.node) {
                this.node.classList.add(`${prefix}--main`);
            } else {  //  Opening a sub level UL.
                this.node.classList.remove(`${prefix}--main`);

                //  Find title from parent LI.
                if (!title) {
                    r(listItem.children).forEach(child => {
                        if (child.matches('a, span')) {
                            title = child.textContent;
                        }
                    });
                }
            }

            //  Use the default title.
            if (!title) {
                title = this.title;
            }

            //  Set the title.
            this.node.dataset.mmSpnTitle = title;

            //  Unset all panels from being opened and parent.
            $(`.${prefix}--open`, this.node).forEach(open => {
                open.classList.remove(`${prefix}--open`);
                open.classList.remove(`${prefix}--parent`);
            });

            //  Set the current panel as being opened.
            panel.classList.add(`${prefix}--open`);
            panel.classList.remove(`${prefix}--parent`);

            //  Set all parent panels as being parent.
            let parent = panel.parentElement.closest('ul');
            while (parent) {
                parent.classList.add(`${prefix}--open`);
                parent.classList.add(`${prefix}--parent`);
                parent = parent.parentElement.closest('ul');
            }
        }

        //  Vertical submenus
        else {
            /** Whether or not the panel is currently opened. */
            const isOpened = panel.matches(`.${prefix}--open`);

            //  Unset all panels from being opened and parent.
            $(`.${prefix}--open`, this.node).forEach(open => {
                open.classList.remove(`${prefix}--open`);
            });

            //  Toggle the current panel.
            panel.classList[isOpened ? 'remove' : 'add'](`${prefix}--open`);

            //  Set all parent panels as being opened.
            let parent = panel.parentElement.closest('ul');
            while (parent) {
                parent.classList.add(`${prefix}--open`);
                parent = parent.parentElement.closest('ul');
            }
        }
    }

    /**
     * Initiate the selected list item / open the current panel.
     */
    _setSelectedl() {
        /** All selected LIs. */
        let listItems = $('.' + this.selectedClass, this.node);

        /** The last selected LI. */
        let listItem = listItems[listItems.length - 1];

        /** The opened UL. */
        let panel = null;

        if (listItem) {
            panel = listItem.closest('ul');
        }
        if (!panel) {
            panel = this.node.querySelector('ul');
        }
        this.openPanel(panel);
    }

    /**
     * Initialize the click event handlers.
     */
    _initAnchors() {
        /**
         * Clicking an A in the menu: prevent bubbling up to the LI.
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}       handled Whether or not the event was handled.
         */
        const clickAnchor = (target: HTMLElement): boolean => {
            return target.matches('a');
        };

        /**
         * Click a LI or SPAN in the menu: open its submenu (if present).
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}               Whether or not the event was handled.
         */
        const openSubmenu = (target: HTMLElement): boolean => {
            /** Parent list item for the submenu.  */
            let listItem;

            //  Find the parent list item.
            if (target.closest('span')) {
                listItem = target.parentElement;
            } else if (target.closest('li')) {
                listItem = target;
            } else {
                listItem = false;
            }

            if (listItem) {
                r(listItem.children).forEach(panel => {
                    if (panel.matches('ul')) {
                        this.openPanel(panel);
                    }
                });

                return true;
            }
            return false;
        };

        /**
         * Click the menu (the navbar): close the last opened submenu.
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}               Whether or not the event was handled.
         */
        const closeSubmenu = (target: HTMLElement): boolean => {
            /** The opened ULs. */
            let panels = $(`.${prefix}--open`, target);

            /** The last opened UL. */
            let panel = panels[panels.length - 1];
            if (panel) {
                /** The second to last opened UL. */
                let parent = panel.parentElement.closest('ul');
                if (parent) {
                    this.openPanel(parent);
                    return true;
                }
            }
            return false;
        };

        this.node.addEventListener('click', event => {
            let target = event.target as HTMLElement;
            let handled = false;

            handled = handled || clickAnchor(target);
            handled = handled || openSubmenu(target);
            handled = handled || closeSubmenu(target);

            if (handled) {
                event.stopImmediatePropagation();
            }
        });

        if (this.keyboardNavigator) {
            this.node.addEventListener('keydown', event => {
                if (event.key === 'Tab') {
                    this.keyboardNavigator.selectVertically(event.shiftKey ? 'up' : 'down');

                    setTimeout(() => {
                        this.node.focus();
                    }, 10);
                } else if (event.key === keyBindings.openSubPanel) {
                    const subPanel = this.keyboardNavigator.openSubPanel();
                    if (subPanel) {
                        openSubmenu(subPanel);
                    }
                } else if (event.key === keyBindings.backOneLevel) {
                    closeSubmenu(this.keyboardNavigator.backOneLevel());
                } else if (event.key === keyBindings.firePanel) {
                    const subPanel = this.keyboardNavigator.openSubPanel();
                    if (subPanel) {
                        openSubmenu(subPanel);
                    } else {
                        this.keyboardNavigator.goToAnchorDestination();
                    }
                }
            });
        }
    }
}
