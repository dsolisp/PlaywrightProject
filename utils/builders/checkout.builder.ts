import { faker } from '@faker-js/faker';

/**
 * CheckoutInfo — data type for the checkout info form.
 * Mirrors the interface in utils/test-data-factory.ts.
 */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

/**
 * CheckoutBuilder — fluent, stateless test data builder (Law 6).
 * Returns a new object on every build(); never mutates internal state.
 *
 * Usage:
 *   const info = new CheckoutBuilder().valid().build();
 *   const info = new CheckoutBuilder().withZipCode('90210').build();
 */
export class CheckoutBuilder {
  private firstName = faker.person.firstName();
  private lastName = faker.person.lastName();
  private zipCode = faker.location.zipCode('#####');

  /** Deterministic valid checkout info (for stable snapshot tests). */
  valid(): this {
    this.firstName = 'John';
    this.lastName = 'Doe';
    this.zipCode = '12345';
    return this;
  }

  /** All fields empty — triggers validation errors. */
  empty(): this {
    this.firstName = '';
    this.lastName = '';
    this.zipCode = '';
    return this;
  }

  /** Missing first name — triggers first-name required error. */
  missingFirstName(): this {
    this.firstName = '';
    return this;
  }

  /** Missing last name — triggers last-name required error. */
  missingLastName(): this {
    this.lastName = '';
    return this;
  }

  /** Missing zip code — triggers zip required error. */
  missingZipCode(): this {
    this.zipCode = '';
    return this;
  }

  withFirstName(firstName: string): this {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.lastName = lastName;
    return this;
  }

  withZipCode(zipCode: string): this {
    this.zipCode = zipCode;
    return this;
  }

  build(): CheckoutInfo {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      zipCode: this.zipCode,
    };
  }
}
