const prefix = 'mm-ocd';

/**
 * Class for off-canvas behavior.
 */
export default class MmOffCanvasDrawer {
    /** Prefix for the class. */
    get prefix() {
        return prefix;
    }

    /** HTML element for the wrapper */
    wrapper: HTMLElement;

    /** HTML element for the content. */
    content: HTMLElement;

    /** HTML element for the blocker (off-canvas add-on). */
    backdrop: HTMLElement;

    /**
     * Class for off-canvas drawer.
     *
     * @param {HTMLElement} [node]          The element to put in the drawer.
     * @param {String}      [position=left] The position of the drawer, can be "left" or "right".
     */
    constructor(node: HTMLElement = null, position: 'left' | 'right') {
        //  Create the wrapper.
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add(`${prefix}`);
        this.wrapper.classList.add(`${prefix}--${position}`);
        this.wrapper.setAttribute('inert', 'true');

        //  Create the drawer.
        this.content = document.createElement('div');
        this.content.classList.add(`${prefix}__content`);
        this.wrapper.append(this.content);

        //  Create the backdrop.
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add(`${prefix}__backdrop`);
        this.wrapper.append(this.backdrop);

        //  Add the nodes to the <body>.
        document.body.append(this.wrapper);

        if (node) {
            this.content.append(node);
        }

        //  Click the backdrop.
        const close = (evnt: MouseEvent) => {
            this.close();
            evnt.stopImmediatePropagation();
        };
        this.backdrop.addEventListener('touchstart', close, { passive: true });
        this.backdrop.addEventListener('mousedown', close, { passive: true });
    }

    /**
     * Open the drawer.
     */
    open() {
        this.wrapper.classList.add(`${prefix}--open`);
        document.body.classList.add(`${prefix}-opened`);
        this.wrapper.removeAttribute('inert');
    }

    /**
     * Close the drawer.
     */
    close() {
        this.wrapper.classList.remove(`${prefix}--open`);
        document.body.classList.remove(`${prefix}-opened`);
        this.wrapper.setAttribute('inert', 'true');
    }
}
