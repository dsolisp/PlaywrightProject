import { createLogger } from '../../utils/logger';

describe('logger', () => {
  it('creates a child logger with a name', () => {
    const log = createLogger('test');
    expect(typeof log).toBe('object');
  });
});
