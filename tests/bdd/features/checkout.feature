@checkout
Feature: Checkout Process
  As a logged in user with items in cart
  I want to complete the checkout process
  So that I can purchase my items

  Background:
    Given I am logged in as "standard_user"
    And I have items in my cart

  @smoke
  Scenario: Complete checkout successfully
    When I proceed to checkout
    And I enter checkout information:
      | firstName | lastName | postalCode |
      | John      | Doe      | 12345      |
    And I continue to overview
    And I finish the checkout
    Then I should see the order confirmation

  Scenario: Checkout displays order total
    When I proceed to checkout
    And I enter checkout information:
      | firstName | lastName | postalCode |
      | Jane      | Smith    | 54321      |
    And I continue to overview
    Then I should see the order total

  @negative
  Scenario: Checkout fails without required information
    When I proceed to checkout
    And I click continue without entering information
    Then I should see a checkout error message

