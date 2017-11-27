/**
 * This class contains all the step definitions for Login page
 */
var homePage = require('../pageObjects/homePage');
var host;

module.exports = function () {

    this.Given(/^I navigate to the demo page$/, function () {
        homePage.open("https://angularjs.org/");        
        browser.windowHandleMaximize();
    });

    this.When(/^I go to To Do section$/, function () {
        homePage.sectionTodo.moveToObject();
    });

    this.When(/^I enter "([^"]*)" into Add New Todo textbox$/, function (text) {
        homePage.textboxAddNewTodo.addValue(text);
    });

    this.When(/^I click on Add button$/, function () {
        homePage.buttonAddOnTodoSection.click();
    });

    this.When(/^I click on learn Angular JS checkbox$/, function () {
        homePage.checkboxLearnAngularJS.click();
    });

    this.When(/^I go to JavaScript Projects section$/, function () {
        homePage.sectionJavascriptProjects.moveToObject();
    });

    this.When(/^I click on add button$/, function () {
        homePage.buttonAddOnJavascriptProjectsSection.waitForVisible();
        homePage.buttonAddOnJavascriptProjectsSection.click();
    });

    this.When(/^I enter "([^"]*)" into Name textbox$/, function (name) {
        homePage.textboxNameOnJavascriptProjectsSection.addValue(name);
    });

    this.When(/^I enter "([^"]*)" into Website textbox$/, function (project) {
        homePage.textboxWebsiteOnJavascriptProjectsSection.addValue(project);
    });

    this.When(/^I enter "([^"]*)" into Description textbox$/, function (description) {
        homePage.textboxDescriptionOnJavascriptProjectsSection.addValue(description)
    });

    this.When(/^I click on Save button$/, function () {
        homePage.buttonSaveOnJavascriptProjectsSection.click();
    });

    this.When(/^I search for project "([^"]*)" project$/, function (projectName) {
        homePage.textboxSearchOnJavascriptProjectsSection.addValue(projectName);
    });

    this.Then(/^I see learn AngularJS checkbox is (checked|unchecked)$/, function (expectedStatus) {
        var checkedStatus = expectedStatus == 'checked';
        expect(Boolean(homePage.checkboxLearnAngularJS.getAttribute('checked'))).toEqual(checkedStatus);
    });

    this.Then(/^I see learn AngularJS text is( not)? strikethrough$/, function (not) {
        expect(homePage.textLearnAngularJS.getAttribute('className') == 'done-true').toBe(not ? false : true);
    });

    this.Then(/^I see "([^"]*)" checkbox displays$/, function (checkboxName) {
        expect(homePage.labelTodoCheckbox(checkboxName).isVisible()).toBe(true);
    });

    this.Then(/^I see the "([^"]*)" project with "([^"]*)" description displays$/, function (projectName, description) {
        expect(homePage.labelProjectsOnJavascriptProjectsSection(projectName).waitForVisible()).toBe(true);
        expect(homePage.labelDescriptionOnJavascriptProjectsSection(description).waitForVisible()).toBe(true);
    });

    this.Then(/^I see the form disappears$/, function () {
        expect(homePage.textboxNameOnJavascriptProjectsSection.isVisible()).toBe(false);
        expect(homePage.textboxWebsiteOnJavascriptProjectsSection.isVisible()).toBe(false);
        expect(homePage.textboxDescriptionOnJavascriptProjectsSection.isVisible()).toBe(false);
    });
}