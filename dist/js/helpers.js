/**
 * Convert a list to an array.
 * @param 	{NodeList|HTMLCollection} list 	The list or collection to convert into an array.
 * @return	{array}							The array.
 */
export const r = (list) => {
    return Array.prototype.slice.call(list);
};
/**
 * Find elements in the given context.
 * @param 	{string}		selector			The query selector to search for.
 * @param 	{HTMLElement}	[context=document]	The context to search in.
 * @return	{HTMLElement[]}						The found list of elements.
 */
export const $ = (selector, context) => {
    return r((context || document).querySelectorAll(selector));
};
