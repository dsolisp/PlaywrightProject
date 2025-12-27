// Test data generation utilities

// ── Data Generation ──────────────────────────────────────────────────

export function generateTestData() {
  return {
    email: () => `test_${Date.now()}@example.com`,
    username: () => `user_${Math.random().toString(36).substring(7)}`,
    password: () => `Pass${Math.floor(Math.random() * 10000)}!`,
    firstName: () => ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][Math.floor(Math.random() * 5)],
    lastName: () =>
      ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
    phone: () => `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    zipCode: () => String(Math.floor(Math.random() * 90000 + 10000)),
    uuid: () => crypto.randomUUID(),
  };
}

// Cache for any future data loading needs
const cache = new Map<string, unknown>();

export function clearCache(): void {
  cache.clear();
}
