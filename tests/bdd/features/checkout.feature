@checkout
Feature: SauceDemo Checkout

  Background:
    Given I am logged in as "standard_user"
    And I have items in my cart

  @smoke
  Scenario: Complete checkout successfully
    When I proceed to checkout
    And I enter checkout information:
      | firstName | lastName | postalCode |
      | Jane      | Doe      | 90210      |
    And I continue to overview
    Then I should see the order total
    When I finish the checkout
    Then I should see the order confirmation

  @negative
  Scenario: Checkout fails without personal information
    When I proceed to checkout
    And I click continue without entering information
    Then I should see a checkout error message
