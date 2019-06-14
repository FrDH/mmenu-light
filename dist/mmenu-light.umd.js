/*!
 * mmenu-light v1.0.6
 * mmenujs.com/mmenu-light
 *
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-4.0
 * http://creativecommons.org/licenses/by/4.0/
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o,a,m=(n=function(e){return Array.prototype.slice.call(e)},o=function(e,t){return n((t||document).querySelectorAll(e))},a=function(e){document.addEventListener("click",function(e){var t=e.target;t.closest(".mm")&&t.matches("a")&&e.stopPropagation()});var t=function(e){e.target.closest(".mm")||o(".mm.mm--open").forEach(function(t){e.preventDefault(),e.stopPropagation(),t.mmenu.close()})};document.addEventListener("click",function(e){var t=e.target,o=t.closest(".mm");if(o){var a=t.matches("li")?t:!!t.matches("span")&&t.parentElement;a&&(e.stopPropagation(),n(a.children).forEach(function(e){e.matches("ul")&&(a.parentElement.classList.add("mm--parent"),o.mmenu.openPanel(e))}))}}),document.addEventListener("click",function(e){var t=e.target;if(t.matches(".mm")){e.stopPropagation();var n=o(".mm--open",t),a=n[n.length-1];if(a){a.classList.remove("mm--open");var m=a.parentElement.closest("ul");m&&t.mmenu.openPanel(m)}}}),e.bodyClose&&document.addEventListener("click",t),document.addEventListener("touchstart",t)},function(e,t){var m=Object.assign({},{bodyClose:!0},t);a(m),a=function(){};var r=null,s=function(t){e.classList[t.matches?"add":"remove"]("mm")},c={create:function(t){return void 0===t&&(t="all"),"number"==typeof t&&(t="(max-width: "+t+"px)"),(r=window.matchMedia(t)).addListener(s),e.classList[r.matches?"add":"remove"]("mm"),c},destroy:function(){return r.removeListener(s),e.classList.remove("mm"),c},init:function(t){var n=o(t,e),a=n[n.length-1],m=null;return a&&(m=a.closest("ul")),m||(m=e.querySelector("ul")),c.openPanel(m),c},open:function(){return e.classList.add("mm--open"),c},close:function(){return e.classList.remove("mm--open"),c},openPanel:function(t){t||(t=e.querySelector("ul"));var a=t.dataset.mmTitle,m=t.parentElement;m===e?(e.classList.add("mm--home"),a||(a="Menu"),e.dataset.mmTitle=a):(e.classList.remove("mm--home"),a||n(m.children).forEach(function(e){e.matches("a, span")&&(a=e.textContent)}),a&&(e.dataset.mmTitle=a)),o(".mm--open",e).forEach(function(e){e.classList.remove(".mm--open","mm--parent")}),t.classList.add("mm--open"),t.classList.remove("mm--parent");for(var r=t.parentElement.closest("ul");r;)r.classList.add("mm--open","mm--parent"),r=r.parentElement.closest("ul");return c}};return e.mmenu=c,c});t.default=m});