import { z } from 'zod';
import {
	CheckoutItemSchema,
	CheckoutSchema,
	CreateCheckoutSchema,
} from './entities/checkouts';
import {
	ApplyCouponSchema,
	CouponApplicationResultSchema,
	CouponSchema,
	CreateCouponSchema,
	UpdateCouponSchema,
} from './entities/coupon';
import {
	CreateCustomerSchema,
	CustomerSchema,
	UpdateCustomerSchema,
} from './entities/customer';
import {
	PixKeySchema,
	PixQrCodeSchema,
	CreatePixQrCodeSchema,
	PixTransactionSchema,
} from './entities/pix';
import {
	CreateStoreSchema,
	StoreSchema,
	UpdateStoreSchema,
} from './entities/store';
import {
	ApproveWithdrawSchema,
	CreateWithdrawSchema,
	UpdateWithdrawSchema,
	WithdrawBatchSchema,
	WithdrawSchema,
} from './entities/withdraw';

/**
 * Common API response schema
 */
export const ApiResponseSchema = z.object({
	success: z.boolean(),
	data: z.unknown().optional(),
	error: z
		.object({
			code: z.string(),
			message: z.string(),
			details: z.unknown().optional(),
		})
		.optional(),
	metadata: z
		.object({
			timestamp: z.iso.datetime(),
			requestId: z.string(),
			version: z.string().default('2.0'),
			pagination: z
				.object({
					page: z.number().int().min(1).optional(),
					limit: z.number().int().min(1).max(100).optional(),
					total: z.number().int().min(0).optional(),
					totalPages: z.number().int().min(0).optional(),
					hasNext: z.boolean().optional(),
					hasPrev: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

/**
 * Checkout API schemas
 */
export const CheckoutApiSchemas = {
	// POST /checkouts
	CreateCheckoutBody: CreateCheckoutSchema,

	// GET /checkouts/:id
	GetCheckoutParams: z.object({
		id: z.string().min(1, 'Checkout ID is required'),
	}),

	// GET /checkouts
	ListCheckoutsQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
	}),
};

/**
 * Customer API schemas
 */
export const CustomerApiSchemas = {
	// GET /customers
	ListCustomersQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		search: z.string().optional(),
		email: z.string().email().optional(),
		taxId: z.string().optional(),
		status: z.array(z.string()).optional(),
		createdAfter: z.iso.datetime().optional(),
		createdBefore: z.iso.datetime().optional(),
		sortBy: z
			.enum(['createdAt', 'updatedAt', 'name', 'email'])
			.default('createdAt'),
		sortOrder: z.enum(['asc', 'desc']).default('desc'),
	}),

	// GET /customers/:id
	GetCustomerParams: z.object({
		id: z.string().min(1, 'Customer ID is required'),
	}),

	// POST /customers
	CreateCustomerBody: CreateCustomerSchema,

	// PUT /customers/:id
	UpdateCustomerBody: UpdateCustomerSchema,
	UpdateCustomerParams: z.object({
		id: z.string().min(1, 'Customer ID is required'),
	}),

	// DELETE /customers/:id
	DeleteCustomerParams: z.object({
		id: z.string().min(1, 'Customer ID is required'),
	}),

	// GET /customers/:id/billings
	GetCustomerBillingsParams: z.object({
		customerId: z.string().min(1, 'Customer ID is required'),
	}),
	GetCustomerBillingsQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		status: z.array(z.string()).optional(),
	}),
};

/**
 * Store API schemas
 */
export const StoreApiSchemas = {
	// GET /stores
	ListStoresQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		search: z.string().optional(),
		status: z.array(z.string()).optional(),
		sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
		sortOrder: z.enum(['asc', 'desc']).default('desc'),
	}),

	// GET /stores/:id
	GetStoreParams: z.object({
		id: z.string().min(1, 'Store ID is required'),
	}),

	// POST /stores
	CreateStoreBody: CreateStoreSchema,

	// PUT /stores/:id
	UpdateStoreBody: UpdateStoreSchema,
	UpdateStoreParams: z.object({
		id: z.string().min(1, 'Store ID is required'),
	}),
};

/**
 * Coupon API schemas
 */
export const CouponApiSchemas = {
	// GET /coupons
	ListCouponsQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		search: z.string().optional(),
		code: z.string().optional(),
		active: z.coerce.boolean().optional(),
		sortBy: z.enum(['createdAt', 'updatedAt', 'code']).default('createdAt'),
		sortOrder: z.enum(['asc', 'desc']).default('desc'),
	}),

	// GET /coupons/:id
	GetCouponParams: z.object({
		id: z.string().min(1, 'Coupon ID is required'),
	}),

	// POST /coupons
	CreateCouponBody: CreateCouponSchema,

	// PUT /coupons/:id
	UpdateCouponBody: UpdateCouponSchema,
	UpdateCouponParams: z.object({
		id: z.string().min(1, 'Coupon ID is required'),
	}),

	// POST /coupons/apply
	ApplyCouponBody: ApplyCouponSchema,

	// GET /coupons/:id/usage
	GetCouponUsageParams: z.object({
		id: z.string().min(1, 'Coupon ID is required'),
	}),
	GetCouponUsageQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		customerId: z.string().optional(),
	}),
};

/**
 * PIX API schemas
 */
export const PixApiSchemas = {
	// POST /v1/pixQrCode/create
	CreateQrCodeBody: CreatePixQrCodeSchema,

	// GET /v1/pixQrCode/check
	CheckStatusQuery: z.object({
		id: z.string().min(1, 'PIX QR code ID is required'),
	}),

	// POST /v1/pixQrCode/simulate-payment (Dev mode only)
	SimulatePaymentQuery: z.object({
		id: z.string().min(1, 'PIX QR code ID is required'),
	}),
	SimulatePaymentBody: z.object({
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),

	// GET /v1/pix/keys (Keeping for extended API support)
	ListKeysQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
	}),
};

/**
 * Withdraw API schemas
 */
export const WithdrawApiSchemas = {
	// POST /v1/withdraw/create
	CreateWithdrawBody: CreateWithdrawSchema,

	// GET /v1/withdraw/get
	GetWithdrawParams: z.object({
		id: z.string().min(1, 'Withdrawal ID is required'),
	}),

	// GET /v1/withdraw/list
	ListWithdrawalsQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		status: z.array(z.string()).optional(),
	}),

	// POST /withdrawals/:id/approve
	ApproveWithdrawalParams: z.object({
		id: z.string().min(1, 'Withdrawal ID is required'),
	}),
	ApproveWithdrawalBody: ApproveWithdrawSchema,

	// POST /withdrawals/:id/cancel
	CancelWithdrawalParams: z.object({
		id: z.string().min(1, 'Withdrawal ID is required'),
	}),
	CancelWithdrawalBody: z.object({
		reason: z.string().optional(),
		notifyUser: z.boolean().default(true),
	}),

	// GET /withdrawals/batches
	ListBatchesQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		status: z.array(z.string()).optional(),
	}),

	// GET /withdrawals/batches/:id
	GetBatchParams: z.object({
		id: z.string().min(1, 'Batch ID is required'),
	}),

	// POST /withdrawals/batches
	CreateBatchBody: z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		withdrawals: z.array(z.string()).min(1),
		scheduledFor: z.iso.datetime().optional(),
	}),
};

/**
 * Webhook API schemas
 */
export const WebhookApiSchemas = {
	// GET /webhooks
	ListWebhooksQuery: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(20),
		active: z.coerce.boolean().optional(),
		events: z.array(z.string()).optional(),
	}),

	// GET /webhooks/:id
	GetWebhookParams: z.object({
		id: z.string().min(1, 'Webhook ID is required'),
	}),

	// POST /webhooks
	CreateWebhookBody: z.object({
		url: z.url(),
		events: z.array(z.string()).min(1),
		secret: z.string().min(1),
		active: z.boolean().default(true),
		retryConfig: z
			.object({
				enabled: z.boolean().default(true),
				maxAttempts: z.number().int().min(0).max(10).default(3),
				backoffStrategy: z
					.enum(['LINEAR', 'EXPONENTIAL', 'FIXED'])
					.default('EXPONENTIAL'),
				initialDelay: z.number().int().min(1000).default(5000),
				maxDelay: z.number().int().min(1000).default(300000),
			})
			.optional(),
		headers: z.record(z.string(), z.string()).optional(),
	}),

	// PUT /webhooks/:id
	UpdateWebhookParams: z.object({
		id: z.string().min(1, 'Webhook ID is required'),
	}),
	UpdateWebhookBody: z.object({
		url: z.url().optional(),
		events: z.array(z.string()).optional(),
		secret: z.string().min(1).optional(),
		active: z.boolean().optional(),
		retryConfig: z
			.object({
				enabled: z.boolean(),
				maxAttempts: z.number().int().min(0).max(10),
				backoffStrategy: z.enum(['LINEAR', 'EXPONENTIAL', 'FIXED']),
				initialDelay: z.number().int().min(1000),
				maxDelay: z.number().int().min(1000),
			})
			.optional(),
		headers: z.record(z.string(), z.string()).optional(),
	}),

	// DELETE /webhooks/:id
	DeleteWebhookParams: z.object({
		id: z.string().min(1, 'Webhook ID is required'),
	}),

	// POST /webhooks/:id/test
	TestWebhookParams: z.object({
		id: z.string().min(1, 'Webhook ID is required'),
	}),
	TestWebhookBody: z.object({
		eventType: z.string(),
		testData: z.record(z.string(), z.unknown()).optional(),
	}),
};
