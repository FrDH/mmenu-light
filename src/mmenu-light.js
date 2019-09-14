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
import MmenuLight from '../bin/js/mmlight';

//	Add-ons
import offcanvas from '../bin/js/mmlight.offcanvas';

MmenuLight.prototype.offcanvas = offcanvas;

//  Export module
export default MmenuLight;

//	Global namespace
window.MmenuLight = MmenuLight;
