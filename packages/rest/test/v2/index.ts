/**
 * V2 Test Suite Index
 *
 * This file imports and organizes all v2 test suites for comprehensive testing.
 * Run all tests with: bun test test/v2/
 *
 * Test Categories:
 * - Migration: v1 to v2 charge migration tests
 * - Integration: v2 feature integration tests
 * - Webhook: webhook event processing tests
 * - Performance: performance and benchmark tests
 * - Compatibility: backward compatibility matrix tests
 * - Validation: validation test suites
 * - E2E: end-to-end API integration tests
 */

// Import all test files - they will be automatically discovered and run by Bun
import './migration.test';
import './integration.test';
import './webhook.test';
import './performance.test';
import './compatibility.test';
import './validation.test';
import './e2e.test';

// Test configuration and utilities
export const testConfig = {
	timeout: 30000, // 30 seconds default timeout
	retry: 3, // Number of retries for flaky tests
	parallel: true, // Run tests in parallel
	verbose: true, // Verbose output
};

export const testCategories = {
	migration: 'Tests for v1 charge to v2 billing migration',
	integration: 'Integration tests for v2 features',
	webhook: 'Webhook event processing and validation tests',
	performance: 'Performance benchmarks and load testing',
	compatibility: 'Backward compatibility matrix tests',
	validation: 'Input validation and error handling tests',
	e2e: 'End-to-end API integration tests',
};

// Test utilities
export const testUtils = {
	// Helper to create test data
	createMockCharge: (overrides: any = {}) => ({
		id: `charge_test_${Date.now()}`,
		frequency: 'ONE_TIME',
		url: 'https://checkout.abacatepay.com/billing/test',
		status: 'PENDING',
		devMode: true,
		methods: ['PIX'],
		products: [
			{
				externalId: 'prod_test',
				name: 'Test Product',
				quantity: 1,
				price: 1000,
			},
		],
		customer: {
			name: 'Test Customer',
			email: 'test@example.com',
			taxId: '12345678901',
			metadata: {},
		},
		metadata: {
			fee: 50,
			returnUrl: 'https://example.com/return',
			completionUrl: 'https://example.com/success',
		},
		nextBilling: null,
		allowCoupons: false,
		coupons: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...overrides,
	}),

	// Helper to validate test environment
	validateTestEnvironment: () => {
		const requiredEnvVars = ['NODE_ENV', 'API_BASE_URL'];
		const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

		if (missing.length > 0) {
			console.warn(`Missing environment variables: ${missing.join(', ')}`);
		}

		return missing.length === 0;
	},

	// Helper to measure test performance
	measurePerformance: async (operation: () => Promise<any>, label: string) => {
		const start = performance.now();
		const result = await operation();
		const end = performance.now();
		const duration = end - start;

		console.log(`${label}: ${duration.toFixed(2)}ms`);
		return { result, duration };
	},
};

// Export for potential test runner customization
export default {
	config: testConfig,
	categories: testCategories,
	utils: testUtils,
};
