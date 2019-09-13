/** Whether or not touch gestures are supported by the browser. */
export const touch =
    'ontouchstart' in window ||
    (navigator.msMaxTouchPoints ? true : false) ||
    false;

/** Whether or not its IE11 :/ */
export const IE11 =
    navigator.userAgent.indexOf('MSIE') > -1 ||
    navigator.appVersion.indexOf('Trident/') > -1;
