import { faker } from '@faker-js/faker';

/**
 * UserCredentials — data type shared with the rest of the project.
 * Mirrors the interface in utils/test-data-factory.ts.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * UserBuilder — fluent, stateless test data builder (Law 6).
 * Returns a new object on every build(); never mutates internal state.
 *
 * Usage:
 *   const user = new UserBuilder().standard().build();
 *   const user = new UserBuilder().withUsername('admin').withPassword('secret').build();
 */
export class UserBuilder {
  private username = faker.internet.username();
  private password = faker.internet.password({ length: 12 });

  /** SauceDemo standard (happy-path) user. */
  standard(): this {
    this.username = 'standard_user';
    this.password = 'secret_sauce';
    return this;
  }

  /** SauceDemo locked-out user (expects login error). */
  locked(): this {
    this.username = 'locked_out_user';
    this.password = 'secret_sauce';
    return this;
  }

  /** SauceDemo problem user (image glitches). */
  problem(): this {
    this.username = 'problem_user';
    this.password = 'secret_sauce';
    return this;
  }

  /** SauceDemo performance-glitch user. */
  slow(): this {
    this.username = 'performance_glitch_user';
    this.password = 'secret_sauce';
    return this;
  }

  /** Arbitrary invalid user for negative tests. */
  invalid(): this {
    this.username = faker.internet.username();
    this.password = faker.internet.password({ length: 8 });
    return this;
  }

  withUsername(username: string): this {
    this.username = username;
    return this;
  }

  withPassword(password: string): this {
    this.password = password;
    return this;
  }

  build(): UserCredentials {
    return { username: this.username, password: this.password };
  }
}
