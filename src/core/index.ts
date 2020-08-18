import MmToggler from '../modules/match-media-toggler/index';
import MmSlidingPanelsNavigation from '../modules/sliding-panels-navigation/index';
import MmOffCanvasDrawer from '../modules/offcanvas-drawer/index';
import { keyBindings } from "../modules/keyboard-navigation";

/**
 * Class for a lightweight mobile menu.
 */
export default class MmenuLight {
    /** HTML element for the menu. */
    menu: HTMLElement;

    /** The Toggler instance. */
    toggler: MmToggler;

    /** The Navigation instance. */
    navigator: MmSlidingPanelsNavigation;

    /** The Off-canvas instance. */
    drawer: MmOffCanvasDrawer;

    /**
     * Create a lightweight mobile menu.
     *
     * @param {HTMLElement} menu                HTML element for the menu.
     * @param {string}      [mediaQuery='all']  Media query to match for the menu.
     */
    constructor(menu: HTMLElement, mediaQuery: string = 'all') {
        //  Store the menu node.
        this.menu = menu;

        //  Create the toggler instance.
        this.toggler = new MmToggler(mediaQuery);
    }

    /**
     * Add navigation for the menu.
     *
     * @param {object} options Options for the navigation.
     */
    navigation(options: mmNavigationOptions) {
        //  Only needs to be done ones.
        if (!this.navigator) {
            options = options || {};

            const {
                title = 'Menu',
                selectedClass = 'Selected',
                slidingSubmenus = true,
                theme = 'light',
                keyboardNavigation = true,
            } = options;

            this.navigator = new MmSlidingPanelsNavigation(
                this.menu,
                title,
                selectedClass,
                slidingSubmenus,
                theme,
                keyboardNavigation
            );

            // Add keyboard handling for the drawer
            if (keyboardNavigation) {
                document.addEventListener('keydown', event => {
                    if (event.key === keyBindings.toggleDrawer) {
                        if (!document.body.classList.contains(`${this.drawer.prefix}-opened`)) {
                            this.drawer?.open();
                            this.menu.focus();
                        } else {
                            this.drawer?.close();
                            this.menu.blur();
                        }
                    }

                    if (event.key === keyBindings.closeDrawer && document.body.classList.contains(`${this.drawer.prefix}-opened`)) {
                        this.drawer?.close();
                        this.menu.blur();
                    }
                });
            }

            //  En-/disable
            this.toggler.add(
                () => this.menu.classList.add(this.navigator.prefix),
                () => this.menu.classList.remove(this.navigator.prefix)
            );
        }

        return this.navigator;
    }

    /**
     * Add off-canvas behavior to the menu.
     *
     * @param {object} options Options for the off-canvas drawer.
     */
    offcanvas(options: mmOffcanvasOptions) {
        //  Only needs to be done ones.
        if (!this.drawer) {
            options = options || {};
            const { position = 'left' } = options;
            this.drawer = new MmOffCanvasDrawer(null, position);

            /** Original location in the DOM for the menu. */
            let orgLocation = document.createComment('original menu location');
            this.menu.after(orgLocation);

            //  En-/disable
            this.toggler.add(
                () => {
                    // Move the menu to the drawer.
                    this.drawer.content.append(this.menu);
                },
                () => {
                    // Close the drawer.
                    this.drawer.close();

                    // Move the menu to the original position.
                    orgLocation.after(this.menu);
                }
            );
        }

        return this.drawer;
    }
}
