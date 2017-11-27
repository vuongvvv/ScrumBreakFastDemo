/**
 * This class contains all base steps using in all pages
 */

var page = require('../pageObjects/page');
var support = require('./support/support');
var homePage = require('../pageObjects/homePage');
var util = require('util');

module.exports = function () {
    var newPage = new page();
    
    this.When(/^I click on "([^"]*)" button$/, function (button) {
        browser.element(util.format("button*=%s", button)).waitForVisible();
        browser.element(util.format("button*=%s", button)).click();
        support.waitForPageLoad(constant.longTime);
    });

    this.When(/^I click on "([^"]*)" link$/, function (link) {        
        newPage.link(link).waitForVisible();        
        newPage.link(link).click();
    });

    this.When(/^I reload page$/, function(){
        browser.refresh();
        // support.waitForPageLoad();
    });

    this.When(/^I go to "([^"]*)" page$/, function (pageName) {
        switch(pageName){
            case "manage portfolio":
                analyzePage.buttonMyAccount.waitForExist();
                analyzePage.buttonMyAccount.click();
                analyzePage.menuItemManageMyData.click();
                break;
            case "Life Projects":
            case "Non-Life Projects":
                analyzePage.tabNavigationbar.waitForVisible();
                analyzePage.buttonPageNameOnNavigateBar("Models").click();
                analyzePage.buttonPageNameOnNavigateBar(pageName).click();
                support.waitForPageLoad();
                break;
            default:
                analyzePage.tabNavigationbar.waitForVisible(constant.mediumTime);
                analyzePage.buttonPageNameOnNavigateBar(pageName).click();    
                //Vuong.Van - After clicking on a Navigation tab, the support.waitForPageLoad() function will not execute, because of loading icon does not display immediately after clicking
                support.waitUntilUrlChanged();
                support.waitForPageLoad();
                /**
                 * Bug GB-22277: Staging - /app-service/events/pathogens?sort=pathogen - API returns 400 bad request with error message "e90000:The request could not be understood by the server due to malformed syntax. Error code 400/bad request"
                 * This bug causes the error message displays after navigating to the Event page
                 */            
        }        
    });

    this.Then(/^I see "([^"]*)" page is navigated$/, function (pageName) {
        var status = analyzePage.buttonPageNameStatusOnNavigateBar(pageName).getAttribute('class');
        expect(status.includes('active')).toBe(true);
    });
}
