/*!
 * mmenujs.com/mmenu-light
 *
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-4.0
 * http://creativecommons.org/licenses/by/4.0/
 */

/**
 * Lightweight mobile menu
 */
const mmlight = (() => {
    /**
     * Convert a list to an array.
     * @param 	{NodeList|HTMLCollection} list 	The list or collection to convert into an array.
     * @return	{array}							The array.
     */
    const r = (list: NodeList | HTMLCollection) => {
        return Array.prototype.slice.call(list);
    };

    /**
     * Find elements in the given context.
     * @param 	{string}		selector			The query selector to search for.
     * @param 	{HTMLElement}	[context=document]	The context to search in.
     * @return	{HTMLElement[]}						The found list of elements.
     */
    const $ = (selector: string, context?: HTMLElement) => {
        return r((context || document).querySelectorAll(selector));
    };

    /** Add the event listeners to the document. */
    var addEventListeners = () => {
        //  Clicking an A in the menu
        //  -> prevent bubbling up to the LI, UL or menu.
        document.addEventListener('click', evnt => {
            const target = evnt.target as HTMLElement;
            if (target.closest('.mm')) {
                if (target.matches('a')) {
                    evnt.stopPropagation();
                }
            }
        });

        //  Click a LI or SPAN in the menu
        //  -> Open submenu (if present)
        const openSubmenu = (evnt: MouseEvent) => {
            const target = evnt.target as HTMLElement;
            const menu = target.closest('.mm');
            if (menu) {
                let listitem = target.matches('li')
                    ? target
                    : target.matches('span')
                    ? target.parentElement
                    : false;

                if (listitem) {
                    evnt.stopPropagation();

                    r(listitem.children).forEach(panel => {
                        if (panel.matches('ul')) {
                            (listitem as HTMLElement).parentElement.classList.add(
                                'mm--parent'
                            );
                            menu['mmlight'].openPanel(panel);
                        }
                    });
                }
            }
        };

        //  Click the menu
        //  -> Close submenu
        const closeSubmenu = (evnt: MouseEvent) => {
            const menu = evnt.target as HTMLElement;
            if (menu.matches('.mm')) {
                evnt.stopPropagation();

                let panels = $('.mm--open', menu);
                let panel = panels[panels.length - 1];
                if (panel) {
                    panel.classList.remove('mm--open');

                    let parent = panel.parentElement.closest('ul');
                    if (parent) {
                        menu['mmlight'].openPanel(parent);
                    }
                }
            }
        };

        //  Click outside the menu
        //  -> Close menu
        const closeMenu = (evnt: MouseEvent) => {
            const target = evnt.target as HTMLElement;
            if (target.closest('.mm')) {
                return;
            }

            $('.mm.mm--open').forEach(menu => {
                evnt.preventDefault();
                evnt.stopPropagation();

                menu['mmlight'].close();
            });
        };

        document.addEventListener('click', openSubmenu);
        document.addEventListener('click', closeSubmenu);
        document.addEventListener('click', closeMenu);
        document.addEventListener('touchstart', closeMenu);
    };

    interface options {
        mediaQuery?: string | number;
        title?: string;
    }

    /**
     * Default options for the menu.
     */
    const defaults: options = {
        mediaQuery: 'all',
        title: 'Menu'
    };

    /**
     * The Method
     * @param {HTMLElement} menu        Node for the menu.
     * @param {object}      [options]   Override options for the menu.
     */
    const mmlight = (menu: HTMLElement, options?: options) => {
        /**
         * Completed options for the menu.
         */
        const opts: options = {};

        //  Extend options
        options = options || {};
        ['mediaQuery', 'title'].forEach(key => {
            opts[key] = options[key] || defaults[key];
        });

        //  Add event listeners...
        addEventListeners();

        //  ...only once per page load.
        addEventListeners = () => {};

        /** MediaQueryList. */
        var mql = null;

        /**
         * Listener for the MediaQueryList.
         * @param {MediaQueryListEvent} mqle Event for the MediaQueryList.
         */
        const mqListener = (mqle: MediaQueryListEvent) => {
            menu.classList[mqle.matches ? 'add' : 'remove']('mm');
        };

        /** The API. */
        const api = {
            /**
             * Create the menu.
             * @param {string} [mediaQuery='all'] Media queury to match for the menu.
             */
            create: (mediaQuery?: string | number) => {
                if (typeof mediaQuery == 'undefined') {
                    mediaQuery = opts.mediaQuery;
                }
                if (typeof mediaQuery == 'number') {
                    mediaQuery = '(max-width: ' + mediaQuery + 'px)';
                }
                opts.mediaQuery = mediaQuery;

                mql = window.matchMedia(mediaQuery);
                mql.addListener(mqListener);
                menu.classList[mql.matches ? 'add' : 'remove']('mm');

                return api;
            },

            /**
             * Destroy the menu.
             */
            destroy: () => {
                mql.removeListener(mqListener);
                menu.classList.remove('mm');

                return api;
            },

            /**
             * Initiate the selected listitem / open the current panel.
             * @param {string} selector Selector for the currently selected LI.
             */
            init: (selector: string) => {
                let listitems = $(selector, menu);
                let listitem = listitems[listitems.length - 1];
                let panel = null;

                if (listitem) {
                    panel = listitem.closest('ul');
                }
                if (!panel) {
                    panel = menu.querySelector('ul');
                }
                api.openPanel(panel);

                return api;
            },

            /**
             * Open the menu.
             */
            open: () => {
                menu.classList.add('mm--open');
                document.body.classList.add('mm--open');

                return api;
            },

            /**
             * Close the menu.
             */
            close: () => {
                menu.classList.remove('mm--open');
                document.body.classList.remove('mm--open');

                return api;
            },

            /**
             * Open the given panel.
             * @param {HTMLElement} panel Panel to open.
             */
            openPanel: (panel: HTMLElement) => {
                if (!panel) {
                    panel = menu.querySelector('ul');
                }

                let title = panel.dataset.mmTitle;
                let listitem = panel.parentElement;

                if (listitem === menu) {
                    menu.classList.add('mm--home');
                } else {
                    menu.classList.remove('mm--home');
                    if (!title) {
                        r(listitem.children).forEach(child => {
                            if (child.matches('a, span')) {
                                title = child.textContent;
                            }
                        });
                    }
                }
                if (!title) {
                    title = opts.title;
                }
                menu.dataset.mmTitle = title;

                $('.mm--open', menu).forEach(open => {
                    open.classList.remove('.mm--open', 'mm--parent');
                });

                panel.classList.add('mm--open');
                panel.classList.remove('mm--parent');

                let parent = panel.parentElement.closest('ul');
                while (parent) {
                    parent.classList.add('mm--open', 'mm--parent');
                    parent = parent.parentElement.closest('ul');
                }

                return api;
            }
        };

        //  Add API to the HTMLElement.
        menu['mmlight'] = api;

        //  Return API.
        return api;
    };

    return mmlight;
})();

export default mmlight;
