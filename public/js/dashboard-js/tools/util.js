const body = document.querySelector('body');

const themeEvent = new CustomEvent('theme-switch', { detail: { "event-info": "Event that notify that the theme has changed" }, });

const months = ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsHalfYear = ["Jan", "Fev", "Mar", "Apr", "May", "Jun"];


/**
 * Get the theme element
 * 
 * @returns {Element} website current theme selector from css
 */
function getThemeSelector() {
    if (!body.classList.contains('dark')) {
        return document.querySelector(':root');
    } else {
        return document.querySelector('.dark');
    }
}

/**
 * Get the css value of the property (this function use the element that has the specific selector, 
 * get the css properties and return the value of the property passed as param)
 * 
 * @param {String} property a css property
 * @returns {String} the property value
 */
function getCssPropertyValue(property) {
    var cssRoot = getThemeSelector(); // either the element with :root or .dark
    var cssRootProperties = getComputedStyle(cssRoot); // get all properties
    return cssRootProperties.getPropertyValue(property); // return the value of the param property
}

/**
 * Get a specific css rule from a specific css file (this function load directly the needed css file 
 * with all rules and return the specific rule that has the specific selector)
 * 
 * @param {String} styleSheet the stylesheet to work on 
 * @param {String} selector a css file selector
 * @returns {CSSRule} selector rule (a block of css style containing the selector, the properties and their value)
 */
function getCssRule(styleSheet, selector) {
    const styleSheets = document.styleSheets;
    let rules;

    // loop over the list of stylesheets load in the document
    for (let i = 0; i < styleSheets.length; i++) {
        if (styleSheets[i].href.includes(styleSheet)) { // check if the current stylesheet is the one passed as param
            rules = styleSheets[i].cssRules; // get all rules
            break;
        }
    }

    // loop over the rule
    for (let i = 0; i < rules.length; i++) {
        if (rules[i].selectorText == selector) { // check if current selector is the one passed as param
            return rules[i]; // return the rule
        }
    }



}

/**
 * Get a filename without the extension from the path
 * 
 * @param {String} pagePath a page path 
 * @returns the filename without extension
 */
function getFilename(pagePath) {
    let filename, splitted;

    splitted = pagePath.split('/');
    filename = splitted[splitted.length - 1].split('.')[0];

    return filename;
}




export {
    months,
    getCssPropertyValue,
    themeEvent,
    monthsHalfYear,
    getCssRule,
    getFilename,
}