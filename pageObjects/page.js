/**
 * This class contains all elements and actions for all pages
 */
var util = require('util');

class page {       
    button(value) { return browser.element(util.format("button=%s", value)); };
    link(value) { return browser.element(util.format("a=%s", value)); };
    buttonPageNameOnNavigateBar(value) { return browser.element("#navbar").element(util.format('a=%s', value)); }
    buttonPageNameStatusOnNavigateBar(value) { return browser.element("#navbar").element(util.format('li=%s', value)); }
    
    open(path) {
        browser.url(path);
    }    
}

module.exports = page;