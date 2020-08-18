/**	Options for the navigation. */
interface mmNavigationOptions {
    /** The class for selected listitems. */
    selectedClass?: string;

    /** Whether or not to use sliding submenus. */
    slidingSubmenus?: boolean;

    /** The color scheme for the menu. */
    theme?: 'light' | 'dark';

    /** The title for the menu. */
    title?: string;

    /** Whether or not to use keyboard navigation. */
    keyboardNavigation?: boolean;
}

/**	Options for the offcanvas drawer. */
interface mmOffcanvasOptions {
    /** The position of the drawer. */
    position?: 'left' | 'right';
}
