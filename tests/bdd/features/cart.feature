@cart
Feature: SauceDemo Shopping Cart

  @smoke
  Scenario: Add a product to the cart
    Given I am logged in as "standard_user"
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  @smoke
  Scenario: Add multiple products to the cart
    Given I am logged in as "standard_user"
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

  @smoke
  Scenario: Remove a product from the cart
    Given I am logged in as "standard_user"
    And I have added "Sauce Labs Backpack" to the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty

  @smoke
  Scenario: View cart contents
    Given I am logged in as "standard_user"
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    Then I should see "Sauce Labs Backpack" in the cart
