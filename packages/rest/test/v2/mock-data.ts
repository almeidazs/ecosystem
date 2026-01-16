// Define types inline for now to avoid import issues
type PaymentMethod = 'PIX' | 'CARD';
type PaymentFrequency = 'ONE_TIME' | 'MULTIPLE_PAYMENTS';
type PaymentStatus = 'PENDING' | 'EXPIRED' | 'CANCELLED' | 'PAID' | 'REFUNDED';

interface APIProduct {
	externalId: string;
	name: string;
	quantity: number;
	price: number;
	description?: string;
}

interface APICustomer {
	id?: string;
	name: string;
	email: string;
	taxId?: string;
	phone?: string | null;
	metadata: Record<string, any>;
}

interface APICharge {
	id: string;
	frequency: PaymentFrequency;
	url: string;
	status: PaymentStatus;
	devMode: boolean;
	methods: PaymentMethod[];
	products: APIProduct[];
	customer: APICustomer;
	metadata: {
		fee: number;
		returnUrl: string;
		completionUrl: string;
	};
	nextBilling: string | null;
	allowCoupons: boolean | null;
	coupons: any[];
	createdAt: string;
	updatedAt: string;
}

// Mock data for v2 testing
export const mockV2Data = {
	// Basic charge mock
	charge: {
		id: 'charge_test_123456789',
		frequency: 'ONE_TIME' as PaymentFrequency,
		url: 'https://checkout.abacatepay.com/billing/charge_test_123456789',
		status: 'PENDING' as PaymentStatus,
		devMode: true,
		methods: ['PIX', 'CARD' as PaymentMethod],
		products: [
			{
				externalId: 'prod_001',
				name: 'Test Product',
				quantity: 1,
				price: 10000, // 100.00 BRL in cents
				description: 'Test product description',
			},
		],
		customer: {
			id: 'cust_test_123',
			name: 'John Doe',
			email: 'john@example.com',
			taxId: '12345678901',
			phone: '+5511999999999',
			metadata: {},
		},
		metadata: {
			fee: 500,
			returnUrl: 'https://example.com/return',
			completionUrl: 'https://example.com/success',
		},
		nextBilling: null,
		allowCoupons: true,
		coupons: [],
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
	},

	// Migration scenarios
	v1Charge: {
		id: 'charge_v1_123',
		amount: 10000,
		paymentMethod: 'pix',
		status: 'pending',
		customer: {
			name: 'Jane Doe',
			email: 'jane@example.com',
			cpfCnpj: '98765432100',
		},
		createdAt: '2024-01-15T09:00:00Z',
		updatedAt: '2024-01-15T09:00:00Z',
	},

	// Expected v2 structure after migration
	migratedV2Charge: {
		id: 'charge_v1_123',
		frequency: 'ONE_TIME' as PaymentFrequency,
		url: 'https://checkout.abacatepay.com/billing/charge_v1_123',
		status: 'PENDING' as PaymentStatus,
		devMode: false,
		methods: ['PIX' as PaymentMethod],
		products: [
			{
				externalId: 'migrated_product',
				name: 'Migrated Product',
				quantity: 1,
				price: 10000,
				description: 'Migrated from v1',
			},
		],
		customer: {
			id: 'cust_migrated_123',
			name: 'Jane Doe',
			email: 'jane@example.com',
			taxId: '98765432100',
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
		createdAt: '2024-01-15T09:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
	},
};

export const mockResponses = {
	createCharge: {
		data: mockV2Data.charge,
		error: null,
	},

	createCustomer: {
		data: mockV2Data.charge.customer,
		error: null,
	},

	getCharge: {
		data: mockV2Data.charge,
		error: null,
	},

	errorResponse: {
		data: null,
		error: 'Charge not found',
	},

	rateLimitError: {
		data: null,
		error: 'Rate limit exceeded',
	},
};

export const performanceTestData = {
	batchCharges: Array.from({ length: 100 }, (_, i) => ({
		...mockV2Data.charge,
		id: `charge_perf_${i}`,
		products: [
			{
				...mockV2Data.charge.products[0],
				externalId: `prod_perf_${i}`,
				name: `Performance Test Product ${i}`,
			},
		],
	})),

	largeCharge: {
		...mockV2Data.charge,
		products: Array.from({ length: 50 }, (_, i) => ({
			externalId: `large_prod_${i}`,
			name: `Large Product ${i}`,
			quantity: Math.floor(Math.random() * 10) + 1,
			price: Math.floor(Math.random() * 50000) + 1000,
			description: `Description for large product ${i} with additional details`,
		})),
	},
};

export const webhookEvents = {
	chargeCreated: {
		event: 'charge.created',
		data: mockV2Data.charge,
		timestamp: '2024-01-15T10:00:00Z',
	},

	chargePaid: {
		event: 'charge.paid',
		data: {
			...mockV2Data.charge,
			status: 'PAID' as PaymentStatus,
		},
		timestamp: '2024-01-15T10:05:00Z',
	},

	chargeFailed: {
		event: 'charge.failed',
		data: {
			...mockV2Data.charge,
			status: 'EXPIRED' as PaymentStatus,
		},
		timestamp: '2024-01-15T12:00:00Z',
	},

	customerCreated: {
		event: 'customer.created',
		data: mockV2Data.charge.customer,
		timestamp: '2024-01-15T09:30:00Z',
	},
};

export const validationTestCases = {
	invalidCharges: [
		{
			name: 'Missing required fields',
			charge: {},
			expectedError: 'Missing required fields',
		},
		{
			name: 'Invalid payment method',
			charge: {
				...mockV2Data.charge,
				methods: ['INVALID_METHOD'],
			},
			expectedError: 'Invalid payment method',
		},
		{
			name: 'Price below minimum',
			charge: {
				...mockV2Data.charge,
				products: [
					{
						...mockV2Data.charge.products[0],
						price: 50, // Below 100 cents minimum
					},
				],
			},
			expectedError: 'Price below minimum',
		},
		{
			name: 'Invalid email format',
			charge: {
				...mockV2Data.charge,
				customer: {
					...mockV2Data.charge.customer,
					email: 'invalid-email',
				},
			},
			expectedError: 'Invalid email format',
		},
	],
};
