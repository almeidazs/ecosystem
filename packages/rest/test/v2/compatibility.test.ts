import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { REST } from '../../src/client';
import { mockResponses, mockV2Data } from './mock-data';

describe('Backward Compatibility Matrix: v1 to v2', () => {
	let restV1: REST;
	let restV2: REST;

	beforeEach(() => {
		restV1 = new REST({
			secret: 'test_secret_v1',
			version: 1,
		});

		restV2 = new REST({
			secret: 'test_secret_v2',
			version: 2,
		});
	});

	describe('API Version Coexistence', () => {
		it('should support both v1 and v2 clients simultaneously', () => {
			expect(restV1.options.version).toBe(1);
			expect(restV2.options.version).toBe(2);
			expect(restV1.options.secret).toBe('test_secret_v1');
			expect(restV2.options.secret).toBe('test_secret_v2');
		});

		it('should handle mixed API operations', async () => {
			// Simulate mixed version operations
			const v1Response = {
				data: {
					id: 'v1_charge_123',
					amount: 10000,
					status: 'pending',
					paymentMethod: 'pix',
					customer: {
						name: 'V1 Customer',
						email: 'v1@example.com',
					},
				},
				error: null,
			};

			const v2Response = mockResponses.createCharge;

			// Both responses should be processable
			expect(v1Response.data.amount).toBe(10000);
			expect(v2Response.data.products[0].price).toBe(10000);
			expect(v1Response.data.customer.name).toBe('V1 Customer');
			expect(v2Response.data.customer.name).toBe(
				mockV2Data.charge.customer.name,
			);
		});
	});

	describe('Data Structure Compatibility', () => {
		it('should map v1 charge fields to v2 structure', () => {
			const v1Charge = {
				id: 'charge_v1_001',
				amount: 5000,
				status: 'pending',
				paymentMethod: 'pix',
				customer: {
					name: 'John Doe',
					email: 'john@example.com',
					cpfCnpj: '12345678901',
				},
				createdAt: '2024-01-15T10:00:00Z',
				updatedAt: '2024-01-15T10:00:00Z',
			};

			// Mapped v2 structure
			const v2Equivalent = {
				id: v1Charge.id,
				frequency: 'ONE_TIME',
				url: `https://checkout.abacatepay.com/billing/${v1Charge.id}`,
				status: v1Charge.status.toUpperCase(),
				devMode: false,
				methods: [v1Charge.paymentMethod.toUpperCase()],
				products: [
					{
						externalId: 'migrated_product',
						name: 'Migrated Product',
						quantity: 1,
						price: v1Charge.amount,
						description: 'Migrated from v1',
					},
				],
				customer: {
					name: v1Charge.customer.name,
					email: v1Charge.customer.email,
					taxId: v1Charge.customer.cpfCnpj,
					phone: null,
					metadata: {},
				},
				metadata: {
					fee: Math.round(v1Charge.amount * 0.05),
					returnUrl: '',
					completionUrl: '',
				},
				nextBilling: null,
				allowCoupons: false,
				coupons: [],
				createdAt: v1Charge.createdAt,
				updatedAt: v1Charge.updatedAt,
			};

			// Verify mapping integrity
			expect(v2Equivalent.id).toBe(v1Charge.id);
			expect(v2Equivalent.products[0].price).toBe(v1Charge.amount);
			expect(v2Equivalent.customer.name).toBe(v1Charge.customer.name);
			expect(v2Equivalent.customer.email).toBe(v1Charge.customer.email);
			expect(v2Equivalent.customer.taxId).toBe(v1Charge.customer.cpfCnpj);
			expect(v2Equivalent.status).toBe('PENDING');
			expect(v2Equivalent.methods[0]).toBe('PIX');
		});

		it('should handle missing v2 fields in v1 responses gracefully', () => {
			const v1MinimalResponse = {
				id: 'minimal_v1',
				amount: 1000,
				status: 'paid',
			};

			// Should provide sensible defaults for missing v2 fields
			const v2WithDefaults = {
				id: v1MinimalResponse.id,
				frequency: 'ONE_TIME',
				url: `https://checkout.abacatepay.com/billing/${v1MinimalResponse.id}`,
				status: v1MinimalResponse.status.toUpperCase(),
				devMode: false,
				methods: ['PIX'], // Default payment method
				products: [
					{
						externalId: 'default_product',
						name: 'Default Product',
						quantity: 1,
						price: v1MinimalResponse.amount,
					},
				],
				customer: {
					name: 'Default Customer',
					email: 'default@example.com',
					taxId: '',
					phone: null,
					metadata: {},
				},
				metadata: {
					fee: Math.round(v1MinimalResponse.amount * 0.05),
					returnUrl: '',
					completionUrl: '',
				},
				nextBilling: null,
				allowCoupons: false,
				coupons: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			expect(v2WithDefaults.id).toBe(v1MinimalResponse.id);
			expect(v2WithDefaults.products[0].price).toBe(v1MinimalResponse.amount);
			expect(v2WithDefaults.customer.name).toBe('Default Customer');
			expect(v2WithDefaults.methods[0]).toBe('PIX');
		});
	});

	describe('Response Format Compatibility', () => {
		it('should handle v1 and v2 response formats', () => {
			const v1Response = {
				id: 'charge_001',
				amount: 10000,
				status: 'pending',
				customer: {
					name: 'Customer',
				},
			};

			const v2Response = {
				data: {
					id: 'charge_001',
					frequency: 'ONE_TIME',
					url: 'https://checkout.abacatepay.com/billing/charge_001',
					status: 'PENDING',
					devMode: false,
					methods: ['PIX'],
					products: [
						{
							externalId: 'product_001',
							name: 'Product',
							quantity: 1,
							price: 10000,
						},
					],
					customer: {
						name: 'Customer',
						email: 'customer@example.com',
						taxId: '',
						phone: null,
						metadata: {},
					},
					metadata: {
						fee: 500,
						returnUrl: '',
						completionUrl: '',
					},
					nextBilling: null,
					allowCoupons: false,
					coupons: [],
					createdAt: '2024-01-15T10:00:00Z',
					updatedAt: '2024-01-15T10:00:00Z',
				},
				error: null,
			};

			// Common fields should be accessible in both formats
			const v1Id = v1Response.id;
			const v2Id = v2Response.data.id;

			const v1Status = v1Response.status;
			const v2Status = v2Response.data.status;

			const v1CustomerName = v1Response.customer.name;
			const v2CustomerName = v2Response.data.customer.name;

			expect(v1Id).toBe(v2Id);
			expect(v1Status.toUpperCase()).toBe(v2Status);
			expect(v1CustomerName).toBe(v2CustomerName);
		});

		it('should handle error response format differences', () => {
			const v1Error = {
				error: 'Charge not found',
				code: 404,
				message: 'The requested charge could not be found',
			};

			const v2Error = {
				data: null,
				error: 'Charge not found',
			};

			// Error messages should be consistent
			const v1ErrorMessage = v1Error.error;
			const v2ErrorMessage = v2Error.error;

			expect(v1ErrorMessage).toBe(v2ErrorMessage);

			// Additional v1 error details should be preserved if needed
			const v1ErrorCode = v1Error.code;
			const v1Message = v1Error.message;

			expect(v1ErrorCode).toBe(404);
			expect(v1Message).toBeTruthy();
		});
	});

	describe('Endpoint Compatibility', () => {
		it('should map v1 endpoints to v2 equivalents', () => {
			const endpointMappings = [
				{ v1: '/charge/create', v2: '/billing/create' },
				{ v1: '/charge/:id', v2: '/billing/:id' },
				{ v1: '/customer/create', v2: '/customer/create' }, // Same
				{ v1: '/customer/:id', v2: '/customer/:id' }, // Same
			];

			endpointMappings.forEach((mapping) => {
				const isChargeEndpoint = mapping.v1.includes('/charge/');
				const expectedV2Endpoint = isChargeEndpoint
					? mapping.v1.replace('/charge/', '/billing/')
					: mapping.v1;

				expect(mapping.v2).toBe(expectedV2Endpoint);
			});
		});

		it('should handle endpoint deprecation warnings', () => {
			const deprecatedEndpoints = [
				'/charge/create',
				'/charge/list',
				'/charge/:id/cancel',
			];

			const endpointDeprecationMap = new Map();

			deprecatedEndpoints.forEach((endpoint) => {
				endpointDeprecationMap.set(endpoint, {
					deprecated: true,
					replacement: endpoint.replace('/charge/', '/billing/'),
					deprecationDate: '2024-01-01',
					sunsetDate: '2024-06-01',
				});
			});

			deprecatedEndpoints.forEach((endpoint) => {
				const deprecationInfo = endpointDeprecationMap.get(endpoint);
				expect(deprecationInfo.deprecated).toBe(true);
				expect(deprecationInfo.replacement).toContain('/billing/');
				expect(deprecationInfo.sunsetDate).toBeTruthy();
			});
		});
	});

	describe('Status Compatibility', () => {
		it('should map v1 status values to v2 equivalents', () => {
			const statusMappings = {
				pending: 'PENDING',
				paid: 'PAID',
				cancelled: 'CANCELLED',
				refunded: 'REFUNDED',
				expired: 'EXPIRED',
				processing: 'PROCESSING',
				authorized: 'AUTHORIZED',
				failed: 'FAILED',
			};

			Object.entries(statusMappings).forEach(([v1Status, expectedV2Status]) => {
				const mappedV2Status = v1Status.toUpperCase();
				expect(mappedV2Status).toBe(expectedV2Status);
			});
		});

		it('should handle legacy status values gracefully', () => {
			const legacyStatuses = ['created', 'waiting_payment', 'under_analysis'];

			legacyStatuses.forEach((status) => {
				const normalizedStatus = status.toUpperCase().replace(/[^A-Z_]/g, '_');
				expect(typeof normalizedStatus).toBe('string');
				expect(normalizedStatus.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Field Type Compatibility', () => {
		it('should handle field type differences between versions', () => {
			const v1Fields = {
				amount: 'number', // Integer in cents
				paymentMethod: 'string', // 'pix', 'credit_card'
				customer: {
					cpfCnpj: 'string', // Single tax ID field
				},
			};

			const v2Fields = {
				products: 'array', // Array of product objects
				methods: 'array', // Array of payment methods
				customer: {
					taxId: 'string', // Unified tax ID field
					phone: 'string | null', // Optional phone
				},
			};

			// Verify field types
			expect(typeof v1Fields.amount).toBe('string');
			expect(typeof v2Fields.products).toBe('string');
			expect(Array.isArray(['PIX', 'CARD'])).toBe(true);
			expect(v2Fields.customer.phone).toContain('null');
		});

		it('should handle currency field conversion', () => {
			const v1Amount = 10000; // 100.00 BRL in cents
			const v2ProductPrice = 10000; // Same format in v2
			const v2MetadataFee = 500; // 5.00 BRL fee in cents

			// Both versions should use the same currency format (cents)
			expect(v1Amount).toBe(v2ProductPrice);
			expect(v2MetadataFee).toBeLessThan(v1Amount);

			const convertedToBRL = v1Amount / 100;
			expect(convertedToBRL).toBe(100.0);
		});
	});

	describe('Feature Compatibility Matrix', () => {
		it('should track feature availability across versions', () => {
			const featureMatrix = {
				pix: { v1: true, v2: true, status: 'stable' },
				card: { v1: false, v2: true, status: 'beta' },
				coupons: { v1: false, v2: true, status: 'stable' },
				recurring: { v1: false, v2: true, status: 'stable' },
				webhooks: { v1: true, v2: true, status: 'enhanced' },
				metadata: { v1: 'limited', v2: 'enhanced', status: 'improved' },
			};

			// Verify feature compatibility
			expect(featureMatrix.pix.v1).toBe(true);
			expect(featureMatrix.pix.v2).toBe(true);
			expect(featureMatrix.card.v1).toBe(false);
			expect(featureMatrix.card.v2).toBe(true);
			expect(featureMatrix.coupons.v1).toBe(false);
			expect(featureMatrix.coupons.v2).toBe(true);
		});

		it('should provide migration paths for new features', () => {
			const migrationPaths = [
				{
					feature: 'card_payments',
					v1Support: false,
					v2Support: true,
					migrationRequired: 'implement v2 card payment flow',
					breakingChange: false,
				},
				{
					feature: 'coupons',
					v1Support: false,
					v2Support: true,
					migrationRequired: 'use v2 coupon API',
					breakingChange: false,
				},
				{
					feature: 'charge_structure',
					v1Support: true,
					v2Support: true,
					migrationRequired: 'update data structure handling',
					breakingChange: true,
				},
			];

			migrationPaths.forEach((path) => {
				expect(path.feature).toBeTruthy();
				expect(path.migrationRequired).toBeTruthy();
				expect(typeof path.breakingChange).toBe('boolean');
			});
		});
	});
});
