/**
 * This class contains all elements and actions for all pages
 */

var support = require('../steps/support/support');
var util = require('util');

class page {
    get tabNavigationbar() { return browser.element("#navbar"); };
    get headerUploadNotification() { return browser.element(".notification-header"); };
    get panelMetabiotaApp() { return browser.element("html[class='ng-scope'][ng-app='metabiotaApp']"); };
    
    button(value) { return browser.element(util.format("button=%s", value)); };
    link(value) { return browser.element(util.format("a=%s", value)); };
    buttonPageNameOnNavigateBar(value) { return browser.element("#navbar").element(util.format('a=%s', value)); }
    buttonPageNameStatusOnNavigateBar(value) { return browser.element("#navbar").element(util.format('li=%s', value)); }

    /**
     * Open url
     * @author - Khoa Hoang
     * @param {string} path
     */
    open(path) {
        browser.url(path);
    }

    /**
     * Click on the button based on name
     * @author - Dung Pham
     * @param {string} button - the name of button
     */
    clickOnButton(button) {
        this.button(button).waitForVisible();
        this.button(button).click();
    }

    /**
     * Check or uncheck the checkbox
     * @author Dung Pham
     * @param {string} checkboxSelector - the checkbox which user want to check or uncheck
     * @param {string} status - true or false. If true, checkbox will be checked and vice versa.
     */
    setCheckboxStatus(checkbox, status){
        // Get the current status of checkbox. If true, checkbox is checking and vice versa
        var booleanChecked = checkbox.getAttribute('class').includes('icon-ok');
        if (status == true){
            if(booleanChecked == false) checkbox.leftClick(); // Check the checkbox if it unchecks. If it is checking, do nothing
        } else {
            if(booleanChecked == true) checkbox.leftClick(); // Uncheck the checkbox if it checks. If it is unchecking, do nothing
        };
    }

    /**
     * Check 2 elements are aligned
     * @param {element} firstElement
     * @param {element} secondElement
     * @return {boolean}
     */
    isElementsAligned(firstElement, secondElement) {
        var yFirstElement = firstElement.getLocation('y');
        var ySecondElement = secondElement.getLocation('y');

        var heightFirstElement = firstElement.getElementSize('height');
        var heightSecondElement = secondElement.getElementSize('height');

        return Math.round((yFirstElement + heightFirstElement) / 2) == Math.round((ySecondElement + heightSecondElement) / 2);
    }

    /**
     * Collapse Notification Bar for uploading if it's expanded
     * @author Khoa Hoang
     */
    collapseUploadNotification() {
        if (this.headerUploadNotification.isVisible() && this.headerUploadNotification.getAttribute("aria-expanded") == "true") {
            this.headerUploadNotification.click();            
        }
    }
}

module.exports = page;