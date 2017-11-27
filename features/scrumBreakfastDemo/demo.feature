@smoke1
Feature: Demo Feature 
@watch
Scenario: TC-01: Verify user is able to add/remove to do Tasks
  Given I navigate to the demo page
   When I go to To Do section
   Then I see learn AngularJS checkbox is checked
    And I see learn AngularJS text is strikethrough
   When I enter "Join ScrumBreakFirst" into Add New Todo textbox
    And I click on Add button
   Then I see "Join ScrumBreakFirst" checkbox displays
   When I click on learn Angular JS checkbox
   Then I see learn AngularJS checkbox is unchecked
    And I see learn AngularJS text is not strikethrough
@watch
Scenario: TC-02: Verify user can create a Project successul
  Given I navigate to the demo page
   When I go to JavaScript Projects section
    And I click on add button
    And I enter "JavaScript Beginner" into Name textbox
    And I enter "https://angularjs.org" into Website textbox
    And I enter "I want to learn angularjs" into Description textbox
    And I click on Save button
   Then I see the "JavaScript Beginner" project with "I want to learn angularjs" description displays
    And I see the form disappears
   When I search for project "JavaScript Beginner" project
   Then I see the "JavaScript Beginner" project with "I want to learn angularjs" description displays