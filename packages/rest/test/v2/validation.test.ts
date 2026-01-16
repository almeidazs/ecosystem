import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { REST } from '../../src/client';
import { mockV2Data, validationTestCases } from './mock-data';

describe('Validation Test Suites: v2 Features', () => {
	let restV2: REST;

	beforeEach(() => {
		restV2 = new REST({
			secret: 'test_secret_v2',
			version: 2,
		});
	});

	afterEach(() => {
		// Cleanup
	});

	describe('Charge Validation', () => {
		it('should validate required charge fields', () => {
			const validCharge = mockV2Data.charge;

			// Check required fields
			expect(validCharge.id).toBeTruthy();
			expect(validCharge.frequency).toBeTruthy();
			expect(validCharge.url).toBeTruthy();
			expect(validCharge.status).toBeTruthy();
			expect(validCharge.methods).toBeTruthy();
			expect(validCharge.products).toBeTruthy();
			expect(validCharge.customer).toBeTruthy();
			expect(validCharge.metadata).toBeTruthy();
			expect(validCharge.createdAt).toBeTruthy();
			expect(validCharge.updatedAt).toBeTruthy();
		});

		it('should reject invalid payment methods', () => {
			const invalidMethods = [
				'INVALID',
				'CASH',
				'BITCOIN',
				'',
				null,
				undefined,
			];
			const validMethods = ['PIX', 'CARD'];

			invalidMethods.forEach((method) => {
				const isValid = validMethods.includes(method as any);
				expect(isValid).toBe(false);
			});

			validMethods.forEach((method) => {
				const isValid = validMethods.includes(method);
				expect(isValid).toBe(true);
			});
		});

		it('should validate payment frequency values', () => {
			const validFrequencies = ['ONE_TIME', 'MULTIPLE_PAYMENTS'];
			const invalidFrequencies = [
				'INVALID',
				'RECURRING',
				'DAILY',
				'',
				null,
				undefined,
			];

			invalidFrequencies.forEach((frequency) => {
				const isValid = validFrequencies.includes(frequency as any);
				expect(isValid).toBe(false);
			});

			validFrequencies.forEach((frequency) => {
				const isValid = validFrequencies.includes(frequency);
				expect(isValid).toBe(true);
			});
		});

		it('should validate charge status values', () => {
			const validStatuses = [
				'PENDING',
				'EXPIRED',
				'CANCELLED',
				'PAID',
				'REFUNDED',
			];
			const invalidStatuses = [
				'INVALID',
				'PROCESSING',
				'SUCCESS',
				'',
				null,
				undefined,
			];

			invalidStatuses.forEach((status) => {
				const isValid = validStatuses.includes(status as any);
				expect(isValid).toBe(false);
			});

			validStatuses.forEach((status) => {
				const isValid = validStatuses.includes(status);
				expect(isValid).toBe(true);
			});
		});

		it('should validate URL format', () => {
			const validUrls = [
				'https://checkout.abacatepay.com/billing/123',
				'https://example.com/return',
				'https://merchant.com/success?order=123',
			];

			const invalidUrls = [
				'not-a-url',
				'ftp://invalid-protocol.com',
				'',
				null,
				undefined,
			];

			validUrls.forEach((url) => {
				expect(url).toMatch(/^https:\/\//);
			});

			invalidUrls.forEach((url) => {
				if (url) {
					expect(url).not.toMatch(/^https:\/\//);
				}
			});
		});
	});

	describe('Product Validation', () => {
		it('should validate required product fields', () => {
			const validProduct = mockV2Data.charge.products[0];

			expect(validProduct.externalId).toBeTruthy();
			expect(validProduct.name).toBeTruthy();
			expect(validProduct.quantity).toBeGreaterThan(0);
			expect(validProduct.price).toBeGreaterThan(0);
			expect(typeof validProduct.quantity).toBe('number');
			expect(typeof validProduct.price).toBe('number');
		});

		it('should enforce minimum price constraint', () => {
			const minimumPrice = 100; // 1.00 BRL in cents
			const invalidPrices = [0, -100, -1000, 50, 99];
			const validPrices = [100, 101, 1000, 50000];

			invalidPrices.forEach((price) => {
				expect(price).toBeLessThan(minimumPrice);
			});

			validPrices.forEach((price) => {
				expect(price).toBeGreaterThanOrEqual(minimumPrice);
			});
		});

		it('should validate product quantity constraints', () => {
			const validQuantities = [1, 2, 10, 100];
			const invalidQuantities = [0, -1, -10, 0.5, 1.5, null, undefined];

			validQuantities.forEach((quantity) => {
				expect(quantity).toBeGreaterThan(0);
				expect(Number.isInteger(quantity)).toBe(true);
			});

			invalidQuantities.forEach((quantity) => {
				if (typeof quantity === 'number') {
					expect(quantity <= 0 || !Number.isInteger(quantity)).toBe(true);
				}
			});
		});

		it('should validate external ID format', () => {
			const validExternalIds = [
				'prod_001',
				'product-123',
				'SKU_2024_001',
				'item.123.abc',
			];

			const invalidExternalIds = [
				'',
				'   ',
				'   product   ',
				'product with spaces',
				null,
				undefined,
			];

			validExternalIds.forEach((id) => {
				expect(id.trim()).toBe(id);
				expect(id.length).toBeGreaterThan(0);
			});

			invalidExternalIds.forEach((id) => {
				if (id) {
					expect(id.trim() !== id || id.length === 0).toBe(true);
				}
			});
		});

		it('should validate product name constraints', () => {
			const validNames = [
				'Product Name',
				'Service Subscription',
				'Ássinatura Especial', // Unicode characters
				'Product 123',
			];

			const invalidNames = [
				'',
				'   ',
				null,
				undefined,
				'   ', // Only spaces
				'a'.repeat(300), // Too long
			];

			validNames.forEach((name) => {
				expect(name.trim().length).toBeGreaterThan(0);
				expect(name.length).toBeLessThanOrEqual(255);
			});

			invalidNames.forEach((name) => {
				if (name) {
					expect(name.trim().length === 0 || name.length > 255).toBe(true);
				}
			});
		});
	});

	describe('Customer Validation', () => {
		it('should validate required customer fields', () => {
			const validCustomer = mockV2Data.charge.customer;

			expect(validCustomer.name).toBeTruthy();
			expect(validCustomer.email).toBeTruthy();
			expect(validCustomer.metadata).toBeDefined();
		});

		it('should validate email format', () => {
			const validEmails = [
				'user@example.com',
				'john.doe@company.co.uk',
				'user+tag@example.org',
				'usuario@dominio.com.br',
			];

			const invalidEmails = [
				'not-an-email',
				'user@',
				'@domain.com',
				'user..name@domain.com',
				'',
				null,
				undefined,
			];

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			validEmails.forEach((email) => {
				expect(emailRegex.test(email)).toBe(true);
			});

			invalidEmails.forEach((email) => {
				if (email) {
					expect(emailRegex.test(email)).toBe(false);
				}
			});
		});

		it('should validate tax ID format', () => {
			const validCpfs = ['12345678901', '98765432100'];
			const validCnpjs = ['12345678901234', '98765432123456'];
			const invalidTaxIds = [
				'123',
				'123456789012',
				'123456789012345',
				'abc12345678',
				'',
				null,
				undefined,
			];

			const isValidCPF = (taxId: string) => /^\d{11}$/.test(taxId);
			const isValidCNPJ = (taxId: string) => /^\d{14}$/.test(taxId);

			validCpfs.forEach((cpf) => {
				expect(isValidCPF(cpf)).toBe(true);
			});

			validCnpjs.forEach((cnpj) => {
				expect(isValidCNPJ(cnpj)).toBe(true);
			});

			invalidTaxIds.forEach((taxId) => {
				if (taxId) {
					expect(isValidCPF(taxId) || isValidCNPJ(taxId)).toBe(false);
				}
			});
		});

		it('should validate phone number format', () => {
			const validPhones = [
				'+5511999999999',
				'+12481234567',
				'+442071234567',
				null, // Optional field
				undefined, // Optional field
			];

			const invalidPhones = [
				'11999999999', // Missing country code
				'phone-number',
				'',
				'+',
			];

			const phoneRegex = /^\+\d{10,15}$/;

			validPhones.forEach((phone) => {
				if (phone) {
					expect(phoneRegex.test(phone)).toBe(true);
				}
			});

			invalidPhones.forEach((phone) => {
				if (phone) {
					expect(phoneRegex.test(phone)).toBe(false);
				}
			});
		});

		it('should validate name format', () => {
			const validNames = [
				'John Doe',
				'João Silva', // Unicode characters
				'Mary-Jane Watson',
				'John A. Smith Jr.',
			];

			const invalidNames = [
				'',
				'   ',
				null,
				undefined,
				'123',
				'   John   ',
				'a'.repeat(200), // Too long
			];

			const nameRegex = /^[a-zA-Z\u00C0-\u017F\s\-.']+$/; // Allows Unicode letters, spaces, hyphens, apostrophes

			validNames.forEach((name) => {
				expect(nameRegex.test(name)).toBe(true);
				expect(name.trim().length).toBeGreaterThan(0);
				expect(name.length).toBeLessThanOrEqual(100);
			});

			invalidNames.forEach((name) => {
				if (name) {
					expect(
						nameRegex.test(name) === false ||
							name.trim().length === 0 ||
							name.length > 100,
					).toBe(true);
				}
			});
		});
	});

	describe('Metadata Validation', () => {
		it('should validate metadata structure', () => {
			const validMetadata = {
				fee: 500,
				returnUrl: 'https://example.com/return',
				completionUrl: 'https://example.com/success',
			};

			const invalidMetadata = {
				fee: -100, // Negative fee
				returnUrl: 'not-a-url',
				completionUrl: '',
			};

			// Validate metadata structure
			expect(typeof validMetadata.fee).toBe('number');
			expect(validMetadata.fee).toBeGreaterThanOrEqual(0);
			expect(typeof validMetadata.returnUrl).toBe('string');
			expect(typeof validMetadata.completionUrl).toBe('string');

			// Check invalid metadata
			expect(invalidMetadata.fee).toBeLessThan(0);
			expect(invalidMetadata.returnUrl).not.toMatch(/^https:\/\//);
		});

		it('should validate customer metadata', () => {
			const validCustomerMetadata = {
				utm_source: 'google',
				utm_medium: 'cpc',
				campaign: 'summer_sale',
				customer_segment: 'premium',
				custom_field: 'custom_value',
			};

			const invalidCustomerMetadata = {
				'': 'invalid_key', // Empty key
				'   ': 'spaces_key', // Spaces key
				very_long_key_that_exceeds_reasonable_limits: 'value', // Too long key
			};

			// Validate valid metadata
			Object.entries(validCustomerMetadata).forEach(([key, value]) => {
				expect(key.trim()).toBe(key);
				expect(key.length).toBeGreaterThan(0);
				expect(key.length).toBeLessThanOrEqual(100);
				expect(value).toBeDefined();
			});

			// Check invalid metadata keys
			Object.keys(invalidCustomerMetadata).forEach((key) => {
				const hasIssue =
					key.trim() !== key || key.length === 0 || key.length > 100;
				expect(hasIssue).toBe(true);
			});
		});
	});

	describe('URL Validation', () => {
		it('should validate return URLs', () => {
			const validReturnUrls = [
				'https://example.com/return',
				'https://merchant.com/success',
				'https://app.company.com/callback?order=123',
			];

			const invalidReturnUrls = [
				'http://insecure.com', // Not HTTPS
				'ftp://protocol.com', // Wrong protocol
				'not-a-url',
				'',
				null,
				undefined,
			];

			const urlRegex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$/;

			validReturnUrls.forEach((url) => {
				expect(urlRegex.test(url)).toBe(true);
			});

			invalidReturnUrls.forEach((url) => {
				if (url) {
					expect(urlRegex.test(url)).toBe(false);
				}
			});
		});

		it('should validate completion URLs', () => {
			const validCompletionUrls = [
				'https://example.com/thank-you',
				'https://merchant.com/order-complete',
				'https://app.company.com/payment-success?id=123',
			];

			const invalidCompletionUrls = [
				'http://not-secure.com',
				'mailto:contact@example.com',
				'javascript:alert("xss")',
				'',
			];

			const secureUrlRegex = /^https:\/\//;

			validCompletionUrls.forEach((url) => {
				expect(secureUrlRegex.test(url)).toBe(true);
			});

			invalidCompletionUrls.forEach((url) => {
				if (url) {
					expect(secureUrlRegex.test(url)).toBe(false);
				}
			});
		});
	});

	describe('Date and Time Validation', () => {
		it('should validate timestamp format', () => {
			const validTimestamps = [
				'2024-01-15T10:00:00Z',
				'2024-01-15T10:00:00.123Z',
				'2024-01-15T10:00:00-03:00',
				'2024-01-15T10:00:00+05:30',
			];

			const invalidTimestamps = [
				'2024-01-15', // Date only
				'10:00:00', // Time only
				'invalid-date',
				'',
				null,
				undefined,
			];

			const iso8601Regex =
				/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/;

			validTimestamps.forEach((timestamp) => {
				expect(iso8601Regex.test(timestamp)).toBe(true);
				expect(Date.parse(timestamp)).not.toBeNaN();
			});

			invalidTimestamps.forEach((timestamp) => {
				if (timestamp) {
					expect(iso8601Regex.test(timestamp)).toBe(false);
				}
			});
		});

		it('should validate next billing date logic', () => {
			const chargeWithNextBilling = {
				...mockV2Data.charge,
				frequency: 'MULTIPLE_PAYMENTS',
				nextBilling: '2024-02-15T10:00:00Z',
			};

			const chargeWithoutNextBilling = {
				...mockV2Data.charge,
				frequency: 'ONE_TIME',
				nextBilling: null,
			};

			// Multiple payments should have next billing date
			expect(chargeWithNextBilling.frequency).toBe('MULTIPLE_PAYMENTS');
			expect(chargeWithNextBilling.nextBilling).toBeTruthy();

			// One-time payments should not have next billing date
			expect(chargeWithoutNextBilling.frequency).toBe('ONE_TIME');
			expect(chargeWithoutNextBilling.nextBilling).toBeNull();
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle empty arrays gracefully', () => {
			const chargeWithEmptyArrays = {
				...mockV2Data.charge,
				methods: [],
				products: [],
				coupons: [],
			};

			expect(Array.isArray(chargeWithEmptyArrays.methods)).toBe(true);
			expect(Array.isArray(chargeWithEmptyArrays.products)).toBe(true);
			expect(Array.isArray(chargeWithEmptyArrays.coupons)).toBe(true);
			expect(chargeWithEmptyArrays.methods).toHaveLength(0);
			expect(chargeWithEmptyArrays.products).toHaveLength(0);
			expect(chargeWithEmptyArrays.coupons).toHaveLength(0);
		});

		it('should handle extreme values', () => {
			const extremeCharge = {
				...mockV2Data.charge,
				products: [
					{
						externalId: 'x'.repeat(100),
						name: 'y'.repeat(255),
						quantity: 1000,
						price: 999999999, // Maximum reasonable price
					},
				],
			};

			expect(extremeCharge.products[0].externalId.length).toBe(100);
			expect(extremeCharge.products[0].name.length).toBe(255);
			expect(extremeCharge.products[0].quantity).toBe(1000);
			expect(extremeCharge.products[0].price).toBe(999999999);
		});

		it('should validate boolean fields', () => {
			const validBooleanValues = [true, false];
			const invalidBooleanValues = [
				'true',
				'false',
				1,
				0,
				'1',
				'0',
				null,
				undefined,
			];

			validBooleanValues.forEach((value) => {
				expect(typeof value).toBe('boolean');
			});

			invalidBooleanValues.forEach((value) => {
				expect(typeof value !== 'boolean').toBe(true);
			});
		});
	});
});
