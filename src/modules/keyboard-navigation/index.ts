import { r, $ } from '../helpers';

const prefix = 'mm-kbdn';

/**
 * Default key bindings.
 */
export const keyBindings = {
    toggleDrawer: 'm',
    closeDrawer: 'Escape',
    openSubPanel: ' ',
    backOneLevel: 'Backspace',

    /**
     * Follow link under current selected panel
     * or open sub panel (if present).
     */
    firePanel: 'Enter'
};

export default class MmKeyboardNavigation {

    /**
     * Prefix for the class.
     */
    get prefix() {
        return prefix;
    }

    /**
     * Key bindings for the class.
     */
    get keyBindings() {
        return keyBindings;
    }

    /** HTML element for the menu. */
    node: HTMLElement;

    /** HTML element for the current selected panel. */
    currentPanel: HTMLElement;

    /**
     * Prepare the menu for keyboard navigation.
     * @param {HTMLElement} node          HTMLElement for the menu.
     * @param {string}      selectedClass The class for selected list items.
     */
    constructor(node: HTMLElement, selectedClass: string) {
        this.node = node;

        // Disable default tab navigation for entire menu
        this.node.setAttribute('tabindex', '-1');
        this.node.querySelectorAll('a').forEach((anchor) => {
            anchor.setAttribute('tabindex', '-1');
        });

        // Set selected panel or first LI element in the menu as current
        const selected = $('.' + selectedClass);
        if (selected.length !== 0) {
            this.currentPanel = selected[selected.length - 1];
        }
        if (!this.currentPanel) {
            this.currentPanel = this.node.querySelector('li');
        }
        if (this.currentPanel) {
            this.currentPanel.classList.add(this.prefix + '--sel');
        }
    }

    /**
     * Deselect current selected panel and select new one.
     * @param {HTMLElement} to Target panel.
     */
    _changeCurrentPanel(to: HTMLElement) {
        this.currentPanel.classList.remove(this.prefix + '--sel');
        this.currentPanel = to;
        this.currentPanel.classList.add(this.prefix + '--sel');
    }

    /**
     * Select next/previous panel in the current menu level.
     * @param {'up' | 'down'} direction Whether to select next higher or lower panel.
     */
    selectVertically(direction: 'up' | 'down') {
        const parent = this.currentPanel.parentElement;
        let sibling = direction === 'up' ? this.currentPanel.previousElementSibling : this.currentPanel.nextElementSibling;

        if (!sibling) {
            sibling = direction === 'up' ? parent.lastElementChild : parent.firstElementChild;
        }

        this._changeCurrentPanel(sibling as HTMLElement);
    }

    /**
     * Move back one level in the menu.
     * @return {HTMLElement} Current level parent element.
     */
    backOneLevel(): HTMLElement {
        const panelToClose = this.currentPanel.parentElement.parentElement;
        if (panelToClose === this.node) {
            return null;
        }

        this._changeCurrentPanel(panelToClose);
        return panelToClose;
    }

    /**
     * Open sub panel (if exists) whose parent is current selected panel.
     * @return {HTMLElement} Sub panel parent element or null if it doesn't exist.
     */
    openSubPanel(): HTMLElement {
        const subPanels = r(this.currentPanel.children).filter(child => child.matches('ul'));
        if (subPanels.length !== 0) {
            const panelToOpen = this.currentPanel;
            this._changeCurrentPanel(subPanels[0].querySelector('li'));
            return panelToOpen;
        } else {
            return null;
        }
    }

    /**
     * Follow link under the current selected panel if it exists.
     */
    goToAnchorDestination() {
        const anchors = r(this.currentPanel.children).filter(child => child.matches('a'));
        if (anchors.length !== 0) {
            const target = anchors[0].getAttribute('href');
            if (target) {
                window.location.href = target;
            }
        }
    }
}
