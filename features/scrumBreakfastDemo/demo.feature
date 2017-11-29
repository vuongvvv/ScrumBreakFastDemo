@smoke1
Feature: Demo Feature 

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