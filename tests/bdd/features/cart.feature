@cart
Feature: Shopping Cart
  As a logged in user
  I want to manage my shopping cart
  So that I can purchase products

  Background:
    Given I am logged in as "standard_user"

  @smoke
  Scenario: Add single product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: Add multiple products to cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

  Scenario: Remove product from cart
    Given I have added "Sauce Labs Backpack" to the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty

  Scenario: View cart contents
    Given I have added "Sauce Labs Backpack" to the cart
    When I go to the cart
    Then I should see "Sauce Labs Backpack" in the cart

