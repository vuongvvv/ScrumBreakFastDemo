/**
 * This class contains all elements and actions for Login page
 */

var page = require('./page');
var util = require('util');

class homePage extends page {
    get sectionTodo() { return browser.element("div[class='well ng-scope'][module='todoApp']"); }
    get checkboxLearnAngularJS() { return browser.element("ul[class='unstyled']>li:nth-child(1) input"); }
    get checkboxBuildAngularJSApp() { return browser.element("ul[class='unstyled']>li:nth-child(2) input"); }
    get textLearnAngularJS() { return browser.element("span=learn AngularJS"); };
    get textBuildAngularJSApp() { return browser.element("span=build an AngularJS app"); };
    get textboxAddNewTodo() { return browser.element("input[placeholder='add new todo here']"); };
    get buttonAddOnTodoSection() { return browser.element("input[class='btn-primary'][value='add']"); };
    get sectionJavascriptProjects() { return browser.element("div[module='project'][app-run='project.html']"); }
    get buttonAddOnJavascriptProjectsSection() { return browser.element("i[class='icon-plus-sign']"); };
    get buttonSaveOnJavascriptProjectsSection() { return browser.element("button=Save"); };
    get textboxNameOnJavascriptProjectsSection() { return browser.element("input[ng-model='editProject.project.name']"); };
    get textboxWebsiteOnJavascriptProjectsSection() { return browser.element("input[ng-model='editProject.project.site']"); };
    get textboxDescriptionOnJavascriptProjectsSection() { return browser.element("textarea[ng-model='editProject.project.description']"); };
    get textboxSearchOnJavascriptProjectsSection() { return browser.element("input[id='projects_search']"); };

    labelTodoCheckbox(value) { return browser.element(util.format("span=%s", value)); };
    labelProjectsOnJavascriptProjectsSection(value) { return browser.element(util.format("a=%s", value)); };
    labelDescriptionOnJavascriptProjectsSection(value) { return browser.element(util.format(".ng-binding=%s", value)); };
}

module.exports = new homePage();