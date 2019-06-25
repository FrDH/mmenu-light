/*!
 * mmenujs.com/mmenu-light
 *
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-4.0
 * http://creativecommons.org/licenses/by/4.0/
 */

//	Core
import MmenuLight from '../dist/js/mmlight';

//	Add-ons
import offcanvas from '../dist/js/mmlight.offcanvas';

MmenuLight.prototype.offcanvas = offcanvas;

//	Global namespace
window.MmenuLight = MmenuLight;
