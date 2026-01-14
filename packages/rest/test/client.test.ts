import { test, expect } from 'bun:test';

test('Are we using Bun?', () => {
    expect(Bun).toBeDefined();
});
