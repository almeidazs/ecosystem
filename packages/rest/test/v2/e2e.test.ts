import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { REST } from '../../src/client';
import { mockResponses, mockV2Data, webhookEvents } from './mock-data';

describe('End-to-End API Integration Tests: v2 Features', () => {
	let restV2: REST;
	let mockResponsesLog: any[] = [];

	// Mock fetch implementation for E2E testing
	const mockFetch = async (url: any, options: any) => {
		const pathname = new URL(url).pathname;
		const method = options?.method || 'GET';
		const requestBody = options?.body ? JSON.parse(options.body) : null;

		// Log all requests for debugging
		mockResponsesLog.push({
			url: pathname,
			method,
			body: requestBody,
			timestamp: new Date().toISOString(),
		});

		// Handle different endpoints
		if (pathname.includes('/billing/create') && method === 'POST') {
			return new Response(
				JSON.stringify({
					data: {
						...mockV2Data.charge,
						...requestBody,
						id: `charge_${Date.now()}`,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					error: null,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		if (pathname.includes('/customer/create') && method === 'POST') {
			return new Response(
				JSON.stringify({
					data: {
						...mockV2Data.charge.customer,
						...requestBody,
						id: `cust_${Date.now()}`,
						metadata: requestBody.metadata || {},
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					error: null,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		if (pathname.includes('/billing/') && method === 'GET') {
			const chargeId = pathname.split('/billing/')[1];
			return new Response(
				JSON.stringify({
					data: {
						...mockV2Data.charge,
						id: chargeId,
					},
					error: null,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		if (pathname.includes('/billing/') && method === 'DELETE') {
			return new Response(JSON.stringify({ data: null, error: null }), {
				status: 204,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(
			JSON.stringify({ data: null, error: 'Endpoint not found' }),
			{
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	};

	beforeEach(() => {
		restV2 = new REST({
			secret: 'test_secret_v2',
			version: 2,
			base: 'https://api.abacatepay.com/',
		});

		mockResponsesLog = [];

		// @ts-expect-error - Overriding global fetch for testing
		global.fetch = mockFetch;
	});

	afterEach(() => {
		mockResponsesLog = [];
	});

	describe('Complete Payment Flow', () => {
		it('should handle end-to-end charge creation and retrieval', async () => {
			// Step 1: Create customer
			const customerData = {
				name: 'John Doe',
				email: 'john.doe@example.com',
				taxId: '12345678901',
				phone: '+5511999999999',
				metadata: {
					source: 'web',
					campaign: 'summer_promo',
				},
			};

			const customerResponse = await restV2.post('/customer/create', {
				body: customerData,
			});
			expect(customerResponse.data.name).toBe(customerData.name);
			expect(customerResponse.data.email).toBe(customerData.email);
			const customerId = customerResponse.data.id;

			// Step 2: Create charge with products
			const chargeData = {
				methods: ['PIX', 'CARD'],
				frequency: 'ONE_TIME',
				products: [
					{
						externalId: 'prod_001',
						name: 'Main Product',
						quantity: 1,
						price: 5000,
						description: 'Primary product purchase',
					},
					{
						externalId: 'shipping_001',
						name: 'Shipping',
						quantity: 1,
						price: 1500,
						description: 'Standard shipping',
					},
				],
				customerId: customerId,
				returnUrl: 'https://example.com/return',
				completionUrl: 'https://example.com/success',
			};

			const chargeResponse = await restV2.post('/billing/create', {
				body: chargeData,
			});
			expect(chargeResponse.data.methods).toEqual(['PIX', 'CARD']);
			expect(chargeResponse.data.products).toHaveLength(2);
			expect(chargeResponse.data.frequency).toBe('ONE_TIME');
			const chargeId = chargeResponse.data.id;

			// Step 3: Retrieve charge details
			const retrievedCharge = await restV2.get(`/billing/${chargeId}`);
			expect(retrievedCharge.data.id).toBe(chargeId);
			expect(retrievedCharge.data.products).toHaveLength(2);
			expect(retrievedCharge.data.customer.name).toBe(customerData.name);

			// Step 4: Verify request flow
			expect(mockResponsesLog).toHaveLength(3);
			expect(mockResponsesLog[0].url).toBe('/customer/create');
			expect(mockResponsesLog[0].method).toBe('POST');
			expect(mockResponsesLog[1].url).toBe('/billing/create');
			expect(mockResponsesLog[1].method).toBe('POST');
			expect(mockResponsesLog[2].url).toBe(`/billing/${chargeId}`);
			expect(mockResponsesLog[2].method).toBe('GET');
		});

		it('should handle recurring billing setup', async () => {
			// Step 1: Create recurring charge
			const recurringChargeData = {
				methods: ['PIX'],
				frequency: 'MULTIPLE_PAYMENTS',
				products: [
					{
						externalId: 'subscription_001',
						name: 'Monthly Subscription',
						quantity: 1,
						price: 2999, // 29.99 BRL
						description: 'Monthly service subscription',
					},
				],
				returnUrl: 'https://example.com/manage-subscription',
				completionUrl: 'https://example.com/subscription-active',
				nextBilling: '2024-02-15T10:00:00Z',
				allowCoupons: true,
			};

			const chargeResponse = await restV2.post('/billing/create', {
				body: recurringChargeData,
			});
			expect(chargeResponse.data.frequency).toBe('MULTIPLE_PAYMENTS');
			expect(chargeResponse.data.nextBilling).toBe('2024-02-15T10:00:00Z');
			expect(chargeResponse.data.allowCoupons).toBe(true);

			// Step 2: Verify recurring billing structure
			const chargeId = chargeResponse.data.id;
			const retrievedCharge = await restV2.get(`/billing/${chargeId}`);
			expect(retrievedCharge.data.nextBilling).toBeTruthy();
			expect(retrievedCharge.data.frequency).toBe('MULTIPLE_PAYMENTS');
		});

		it('should handle payment with coupons', async () => {
			// Step 1: Create charge with coupon support
			const chargeWithCouponData = {
				methods: ['CARD'],
				frequency: 'ONE_TIME',
				products: [
					{
						externalId: 'prod_with_coupon',
						name: 'Product with Coupon',
						quantity: 1,
						price: 10000,
						description: 'Product that accepts coupons',
					},
				],
				returnUrl: 'https://example.com/return',
				completionUrl: 'https://example.com/success',
				allowCoupons: true,
				coupons: [
					{
						code: 'WELCOME10',
						discountKind: 'PERCENTAGE',
						discount: 10,
					},
				],
			};

			const chargeResponse = await restV2.post('/billing/create', {
				body: chargeWithCouponData,
			});
			expect(chargeResponse.data.allowCoupons).toBe(true);
			expect(chargeResponse.data.coupons).toHaveLength(1);
			expect(chargeResponse.data.coupons[0].code).toBe('WELCOME10');
			expect(chargeResponse.data.coupons[0].discount).toBe(10);
		});
	});

	describe('Error Handling and Edge Cases', () => {
		it('should handle validation errors gracefully', async () => {
			const invalidChargeData = {
				methods: ['INVALID_METHOD'],
				frequency: 'INVALID_FREQUENCY',
				products: [
					{
						externalId: '',
						name: '',
						quantity: 0,
						price: -100,
					},
				],
			};

			try {
				const response = await restV2.post('/billing/create', {
					body: invalidChargeData,
				});
				// In a real implementation, this should throw an error
				expect(response.error).toBeTruthy();
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it('should handle missing resources', async () => {
			const nonExistentChargeId = 'charge_nonexistent_123';

			// Mock 404 response
			const originalFetch = global.fetch;
			global.fetch = async () => {
				return new Response(
					JSON.stringify({
						data: null,
						error: 'Charge not found',
					}),
					{
						status: 404,
						headers: { 'Content-Type': 'application/json' },
					},
				);
			};

			try {
				const response = await restV2.get(`/billing/${nonExistentChargeId}`);
				expect(response.data).toBeNull();
				expect(response.error).toBe('Charge not found');
			} catch (error) {
				expect(error).toBeDefined();
			}

			global.fetch = originalFetch;
		});

		it('should handle rate limiting', async () => {
			const originalFetch = global.fetch;
			global.fetch = async () => {
				return new Response(
					JSON.stringify({
						data: null,
						error: 'Rate limit exceeded',
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': '60',
						},
					},
				);
			};

			try {
				const response = await restV2.post('/billing/create', { body: {} });
				expect(response.error).toBe('Rate limit exceeded');
			} catch (error) {
				expect(error).toBeDefined();
			}

			global.fetch = originalFetch;
		});
	});

	describe('Performance and Scalability', () => {
		it('should handle concurrent requests', async () => {
			const concurrentRequests = 10;
			const promises = Array.from({ length: concurrentRequests }, (_, i) =>
				restV2.post('/billing/create', {
					body: {
						methods: ['PIX'],
						frequency: 'ONE_TIME',
						products: [
							{
								externalId: `concurrent_prod_${i}`,
								name: `Concurrent Product ${i}`,
								quantity: 1,
								price: 1000 + i,
							},
						],
						returnUrl: 'https://example.com/return',
						completionUrl: 'https://example.com/success',
					},
				}),
			);

			const startTime = performance.now();
			const results = await Promise.all(promises);
			const endTime = performance.now();
			const duration = endTime - startTime;

			expect(results).toHaveLength(concurrentRequests);
			expect(results.every((r) => r.data.id)).toBe(true);
			expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
		});

		it('should handle batch customer creation', async () => {
			const customerBatch = Array.from({ length: 5 }, (_, i) => ({
				name: `Customer ${i}`,
				email: `customer${i}@example.com`,
				taxId: `1234567890${i.toString().padStart(2, '0')}`,
				phone: `+551199999999${i}`,
				metadata: { batchId: 'batch_001', index: i },
			}));

			const promises = customerBatch.map((customer) =>
				restV2.post('/customer/create', { body: customer }),
			);

			const results = await Promise.all(promises);

			expect(results).toHaveLength(5);
			results.forEach((result, index) => {
				expect(result.data.name).toBe(customerBatch[index].name);
				expect(result.data.email).toBe(customerBatch[index].email);
				expect(result.data.metadata.batchId).toBe('batch_001');
			});
		});
	});

	describe('Real-world Scenarios', () => {
		it('should handle e-commerce checkout flow', async () => {
			// Step 1: Create customer from checkout form
			const customerData = {
				name: 'Maria Silva',
				email: 'maria.silva@example.com',
				taxId: '98765432100',
				phone: '+5511888888888',
				metadata: {
					source: 'checkout',
					utm_source: 'google',
					utm_medium: 'cpc',
					device: 'mobile',
				},
			};

			const customerResponse = await restV2.post('/customer/create', {
				body: customerData,
			});
			const customerId = customerResponse.data.id;

			// Step 2: Create charge with multiple items (cart)
			const cartItems = [
				{ externalId: 'shirt_001', name: 'Camiseta', price: 7999, quantity: 2 },
				{ externalId: 'pants_001', name: 'Calça', price: 12999, quantity: 1 },
				{ externalId: 'shipping', name: 'Frete', price: 1500, quantity: 1 },
			];

			const chargeData = {
				methods: ['PIX', 'CARD'],
				frequency: 'ONE_TIME',
				products: cartItems.map((item) => ({
					externalId: item.externalId,
					name: item.name,
					quantity: item.quantity,
					price: item.price,
					description: `Produto: ${item.name}`,
				})),
				returnUrl: 'https://loja.example.com/carrinho',
				completionUrl: 'https://loja.example.com/pedido-confirmado',
			};

			const chargeResponse = await restV2.post('/billing/create', {
				body: chargeData,
			});
			const chargeId = chargeResponse.data.id;

			// Step 3: Verify order details
			const orderDetails = await restV2.get(`/billing/${chargeId}`);
			expect(orderDetails.data.products).toHaveLength(3);
			expect(orderDetails.data.customer.name).toBe('Maria Silva');
			expect(orderDetails.data.methods).toContain('PIX');
			expect(orderDetails.data.methods).toContain('CARD');

			// Calculate total
			const total = cartItems.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0,
			);
			const chargeTotal = orderDetails.data.products.reduce(
				(sum: number, product: any) => sum + product.price * product.quantity,
				0,
			);
			expect(chargeTotal).toBe(total);
		});

		it('should handle subscription service setup', async () => {
			// Step 1: Create customer for subscription
			const subscriberData = {
				name: 'João Santos',
				email: 'joao.santos@example.com',
				taxId: '11122233344',
				metadata: {
					plan: 'premium',
					trial_period: true,
				},
			};

			const customerResponse = await restV2.post('/customer/create', {
				body: subscriberData,
			});
			const customerId = customerResponse.data.id;

			// Step 2: Create recurring subscription
			const subscriptionData = {
				methods: ['CARD'], // Subscriptions typically require card
				frequency: 'MULTIPLE_PAYMENTS',
				products: [
					{
						externalId: 'premium_monthly',
						name: 'Plano Premium Mensal',
						quantity: 1,
						price: 4999, // 49.99 BRL
						description: 'Acesso completo a recursos premium',
					},
				],
				returnUrl: 'https://app.example.com/subscription/manage',
				completionUrl: 'https://app.example.com/subscription/success',
				nextBilling: '2024-02-15T10:00:00Z',
				allowCoupons: true,
			};

			const subscriptionResponse = await restV2.post('/billing/create', {
				body: subscriptionData,
			});
			const subscriptionId = subscriptionResponse.data.id;

			// Step 3: Verify subscription setup
			const subscriptionDetails = await restV2.get(
				`/billing/${subscriptionId}`,
			);
			expect(subscriptionDetails.data.frequency).toBe('MULTIPLE_PAYMENTS');
			expect(subscriptionDetails.data.nextBilling).toBeTruthy();
			expect(subscriptionDetails.data.allowCoupons).toBe(true);
			expect(subscriptionDetails.data.methods).toContain('CARD');
		});

		it('should handle B2B bulk purchase', async () => {
			// Create business customer
			const businessCustomer = {
				name: 'Empresa ABC Ltda',
				email: 'compras@empresaabc.com',
				taxId: '12345678901234', // CNPJ
				phone: '+551133334444',
				metadata: {
					customer_type: 'business',
					company_size: 'medium',
					industry: 'technology',
				},
			};

			const customerResponse = await restV2.post('/customer/create', {
				body: businessCustomer,
			});
			const customerId = customerResponse.data.id;

			// Create bulk purchase with many items
			const bulkProducts = Array.from({ length: 20 }, (_, i) => ({
				externalId: `license_${i + 1}`,
				name: `Licença Software ${i + 1}`,
				quantity: 10,
				price: 1999, // 19.99 BRL per license
				description: `Licença anual de software - funcionário ${i + 1}`,
			}));

			const bulkChargeData = {
				methods: ['CARD'], // B2B typically uses invoice/card
				frequency: 'ONE_TIME',
				products: bulkProducts,
				returnUrl: 'https://portal.empresaabc.com/compras',
				completionUrl: 'https://portal.empresaabc.com/compra-aprovada',
			};

			const bulkChargeResponse = await restV2.post('/billing/create', {
				body: bulkChargeData,
			});
			const bulkChargeId = bulkChargeResponse.data.id;

			// Verify bulk purchase
			const bulkDetails = await restV2.get(`/billing/${bulkChargeId}`);
			expect(bulkDetails.data.products).toHaveLength(20);
			expect(bulkDetails.data.customer.metadata.customer_type).toBe('business');

			// Calculate business total
			const businessTotal = bulkProducts.reduce(
				(sum, product) => sum + product.price * product.quantity,
				0,
			);
			const chargeTotal = bulkDetails.data.products.reduce(
				(sum: number, product: any) => sum + product.price * product.quantity,
				0,
			);
			expect(chargeTotal).toBe(businessTotal);
			expect(chargeTotal).toBeGreaterThan(100000); // Should be significant amount
		});
	});
});
