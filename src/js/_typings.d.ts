/**	Options for the plugin. */
interface mmOptions {
    /** Title above the main panel. */
    title?: string;

    /** Color scheme to use (light or dark). */
    theme?: 'light' | 'dark';

    slidingSubmenus?: boolean;

    /** Classname for the selected <li>. */
    selected?: string;
}

/** Options for the off-canvas add-on */
interface mmOptionsOffcanvas {
    /** Whether (and how) or not to block the page while the menu is open. */
    blockPage?: boolean | 'modal';

    /** Whether or not to move the menu to the <body>. */
    move?: boolean;

    /** Where on the page to position the menu. */
    position?: 'left' | 'right';
}
