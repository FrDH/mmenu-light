import { r, $ } from '../helpers';
var prefix = 'mm-spn';
/**
 * Class for navigating in a mobile menu.
 */
var MmSlidingPanelsNavigation = /** @class */ (function () {
    /**
     * Class for navigating in a mobile menu.
     *
     * @param {HTMLElement} node            HTMLElement for the menu.
     * @param {string}      title           The title for the menu.
     * @param {string}      selectedClass   The class for selected listitems.
     * @param {boolean}     slidingSubmenus Whether or not to use sliding submenus.
     * @param {string}      theme           The color scheme for the menu.
     */
    function MmSlidingPanelsNavigation(node, title, selectedClass, slidingSubmenus, theme) {
        this.node = node;
        this.title = title;
        this.slidingSubmenus = slidingSubmenus;
        this.selectedClass = selectedClass;
        //  Add classname.
        this.node.classList.add(prefix);
        this.node.classList.add(prefix + "--" + theme);
        this.node.classList.add(prefix + "--" + (this.slidingSubmenus ? 'navbar' : 'vertical'));
        this._setSelectedl();
        this._initAnchors();
    }
    Object.defineProperty(MmSlidingPanelsNavigation.prototype, "prefix", {
        /** Prefix for the class. */
        get: function () {
            return prefix;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Open the given panel.
     *
     * @param {HTMLElement} panel Panel to open.
     */
    MmSlidingPanelsNavigation.prototype.openPanel = function (panel) {
        /** Parent LI for the panel.  */
        var listitem = panel.parentElement;
        //  Sliding submenus
        if (this.slidingSubmenus) {
            /** Title above the panel to open. */
            var title_1 = panel.dataset.mmSpnTitle;
            //  Opening the main level UL.
            if (listitem === this.node) {
                this.node.classList.add(prefix + "--main");
            }
            //  Opening a sub level UL.
            else {
                this.node.classList.remove(prefix + "--main");
                //  Find title from parent LI.
                if (!title_1) {
                    r(listitem.children).forEach(function (child) {
                        if (child.matches('a, span')) {
                            title_1 = child.textContent;
                        }
                    });
                }
            }
            //  Use the default title.
            if (!title_1) {
                title_1 = this.title;
            }
            //  Set the title.
            this.node.dataset.mmSpnTitle = title_1;
            //  Unset all panels from being opened and parent.
            $("." + prefix + "--open", this.node).forEach(function (open) {
                open.classList.remove(prefix + "--open");
                open.classList.remove(prefix + "--parent");
            });
            //  Set the current panel as being opened.
            panel.classList.add(prefix + "--open");
            panel.classList.remove(prefix + "--parent");
            //  Set all parent panels as being parent.
            var parent_1 = panel.parentElement.closest('ul');
            while (parent_1) {
                parent_1.classList.add(prefix + "--open");
                parent_1.classList.add(prefix + "--parent");
                parent_1 = parent_1.parentElement.closest('ul');
            }
        }
        //  Vertical submenus
        else {
            /** Whether or not the panel is currently opened. */
            var isOpened = panel.matches("." + prefix + "--open");
            //  Unset all panels from being opened and parent.
            $("." + prefix + "--open", this.node).forEach(function (open) {
                open.classList.remove(prefix + "--open");
            });
            //  Toggle the current panel.
            panel.classList[isOpened ? 'remove' : 'add'](prefix + "--open");
            //  Set all parent panels as being opened.
            var parent_2 = panel.parentElement.closest('ul');
            while (parent_2) {
                parent_2.classList.add(prefix + "--open");
                parent_2 = parent_2.parentElement.closest('ul');
            }
        }
    };
    /**
     * Initiate the selected listitem / open the current panel.
     */
    MmSlidingPanelsNavigation.prototype._setSelectedl = function () {
        /** All selected LIs. */
        var listitems = $('.' + this.selectedClass, this.node);
        /** The last selected LI. */
        var listitem = listitems[listitems.length - 1];
        /** The opened UL. */
        var panel = null;
        if (listitem) {
            panel = listitem.closest('ul');
        }
        if (!panel) {
            panel = this.node.querySelector('ul');
        }
        this.openPanel(panel);
    };
    /**
     * Initialize the click event handlers.
     */
    MmSlidingPanelsNavigation.prototype._initAnchors = function () {
        var _this = this;
        /**
         * Clicking an A in the menu: prevent bubbling up to the LI.
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}       handled Whether or not the event was handled.
         */
        var clickAnchor = function (target) {
            if (target.matches('a')) {
                return true;
            }
            return false;
        };
        /**
         * Click a LI or SPAN in the menu: open its submenu (if present).
         *
         * @param   {HTMLElement}    target The clicked element.
         * @return  {boolean}               Whether or not the event was handled.
         */
        var openSubmenu = function (target) {
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
                        _this.openPanel(panel);
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
        var closeSubmenu = function (target) {
            /** The opened ULs. */
            var panels = $("." + prefix + "--open", target);
            /** The last opened UL. */
            var panel = panels[panels.length - 1];
            if (panel) {
                /** The second to last opened UL. */
                var parent_3 = panel.parentElement.closest('ul');
                if (parent_3) {
                    _this.openPanel(parent_3);
                    return true;
                }
            }
            return false;
        };
        this.node.addEventListener('click', function (evnt) {
            var target = evnt.target;
            var handled = false;
            handled = handled || clickAnchor(target);
            handled = handled || openSubmenu(target);
            handled = handled || closeSubmenu(target);
            if (handled) {
                evnt.stopImmediatePropagation();
            }
        });
    };
    return MmSlidingPanelsNavigation;
}());
export default MmSlidingPanelsNavigation;
