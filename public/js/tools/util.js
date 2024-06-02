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

function removeCssPropertyFromRule(rule, property) {
    rule.style.removeProperty(property);
}

function alertToast(alertType, message) {
    let toast = document.createElement('div');
    toast.classList.add("alert", `alert-${alertType}`);
    toast.innerHTML = `<p>
                            ${message}
                       </p>`;

    document.querySelector('body').prepend(toast);

    const alert = document.querySelector('.alert');
    
    if (alert) {
        setTimeout(() => {
            alert.classList.add('dispose-alert');
            setTimeout(() => {
                alert.remove();
            }, 2000);
        }, 5000);

    }
}

function workContentSkeleton() {
    return `
    <div class="work-items-skeleton" style="margin: 0">
      <div class="work-item skeleton"></div>
      <div class="work-item skeleton"></div>
      <div class="work-item skeleton"></div>
      <div class="work-item skeleton"></div>
      <div class="work-item skeleton"></div>
      <div class="work-item skeleton"></div>
    </div>`;
}

export {
    getCssRule,
    removeCssPropertyFromRule,
    alertToast,
    workContentSkeleton
}