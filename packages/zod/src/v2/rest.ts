import { type _ZodType, z } from 'zod';
import {
	APICheckout,
	APICoupon,
	APICustomer,
	APIPayout,
	APIProduct,
	APIQRCodePIX,
	APIStore,
	APISubscription,
	CouponDiscountKind,
	PaymentMethod,
	PaymentStatus,
} from '.';

/**
 * Any response returned by the AbacatePay API
 */
export const APIResponse = <Schema extends _ZodType>(schema: Schema) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
		}),
		z.object({
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Schema extends z._ZodType> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export const APIResponseWithPagination = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
			pagination: z.object({
				page: z.number().int().min(1).describe('Current page.'),
				limit: z.number().int().min(0).describe('Number of items per page.'),
				items: z.number().int().min(0).describe('Number of items.'),
				totalPages: z.number().int().min(0).describe('Number of pages.'),
			}),
		}),
		z.object({
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export type APIResponseWithPagination<Schema extends z._ZodType> = z.infer<
	ReturnType<typeof APIResponseWithPagination<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export const APIResponseWithCursorBasedPagination = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('success', [
		z.object({
			data: schema,
			success: z
				.literal([true])
				.describe('Whether the request was successfull or not.'),
			pagination: z.object({
				limit: z.number().int().min(0).describe('Number of items per page.'),
				hasNext: z
					.boolean()
					.describe('Indicates whether there is a next page.'),
				hasPrevious: z
					.boolean()
					.describe('Indicates whether there is a previous page.'),
				nextCursor: z
					.union([z.null(), z.string()])
					.describe('Cursor for the next page.'),
			}),
		}),
		z.object({
			error: z.string().describe('Error message returned from the API.'),
			success: z
				.literal([false])
				.describe('Whether the request was successfull or not.'),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export type APIResponseWithCursorBasedPagination<Schema extends z._ZodType> =
	z.infer<ReturnType<typeof APIResponseWithCursorBasedPagination<Schema>>>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkout/create
 */
export const RESTPostCreateNewCheckoutBody = z.object({
	methods: PaymentMethod,
	returnUrl: z
		.url()
		.describe(
			'URL to redirect the customer if they click on the "Back" option.',
		)
		.optional(),
	completionUrl: z
		.url()
		.describe('URL to redirect the customer when payment is completed.')
		.optional(),
	customerId: z
		.string()
		.describe('The ID of a customer already registered in your store.')
		.optional(),
	customer: APICustomer.pick({
		name: true,
		email: true,
		taxId: true,
		cellphone: true,
	}).optional(),
	coupons: z
		.array(z.string())
		.max(50)
		.describe(
			'List of coupons available for resem used with billing (0-50 max.).',
		)
		.optional(),
	externalId: z
		.string()
		.describe(
			'If you have a unique identifier for your billing application, completely optional.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.any())
		.describe('Optional billing metadata.')
		.optional(),
	items: APICheckout.shape.items,
});

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkout/create
 */
export type RESTPostCreateNewCheckoutBody = z.infer<
	typeof RESTPostCreateNewCheckoutBody
>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/create
 */
export const RESTPostCreateNewCheckoutData = APICheckout;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/create
 */
export type RESTPostCreateNewCheckoutData = z.infer<
	typeof RESTPostCreateNewCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export const RESTGetListCheckoutsData = z.array(APICheckout);

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export type RESTGetListCheckoutsData = z.infer<typeof RESTGetListCheckoutsData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export const RESTGetCheckoutData = APICheckout;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export type RESTGetCheckoutData = z.infer<typeof RESTGetCheckoutData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export const RESTGetCheckoutQueryParams = z.object({
	id: z.string().describe('Unique billing identifier.'),
});

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export type RESTGetCheckoutQueryParams = z.infer<
	typeof RESTGetCheckoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export const RESTPostCreateCouponBody = z.object({
	code: z.string().describe('Unique coupon identifier.'),
	discount: z.number().int().describe('Discount amount to be applied.'),
	discountKind: CouponDiscountKind,
	notes: z.string().describe('Coupon description').optional(),
	maxRedeems: z
		.number()
		.int()
		.min(-1)
		.describe(
			'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.any())
		.describe('Key value object for coupon metadata.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponBody = z.infer<typeof RESTPostCreateCouponBody>;

/**
 * https://api.abacatepay.com/v2/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export const RESTPostCreateCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export type RESTPostCreateCouponData = z.infer<typeof RESTPostCreateCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsData = z.array(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = z.infer<typeof RESTGetListCouponsData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsQueryParams = z.object({
	page: z.number().int().min(1).default(1).describe('Page number.').optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.describe('Number of items per page.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsQueryParams = z.infer<
	typeof RESTGetListCouponsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponQueryParams = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponQueryParams = z.infer<typeof RESTGetCouponQueryParams>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponData = z.infer<typeof RESTGetCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponBody = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponBody = z.infer<typeof RESTDeleteCouponBody>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponData = z.infer<typeof RESTDeleteCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPatchToggleCouponStatusBody = z.object({
	id: z.string().describe('The ID of the coupon.'),
});

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPatchToggleCouponStatusBody = z.infer<
	typeof RESTPatchToggleCouponStatusBody
>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPatchToggleCouponStatusData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPatchToggleCouponStatusData = z.infer<
	typeof RESTPatchToggleCouponStatusData
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutBody = z.object({
	externalId: z
		.string()
		.describe('Unique identifier of the payout in your system.'),
	amount: z
		.number()
		.int()
		.min(350)
		.describe('Payout value in cents (Min 350).'),
	description: z.string().describe('Optional payout description.').optional(),
});

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutBody = z.infer<
	typeof RESTPostCreateNewPayoutBody
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutData = APIPayout;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutData = z.infer<
	typeof RESTPostCreateNewPayoutData
>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutQueryParams = z.object({
	externalId: z.string().describe('Unique payout identifier in your system.'),
});

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutQueryParams = z.infer<
	typeof RESTGetSearchPayoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsQueryParams = z.object({
	page: z.number().int().min(1).default(1).describe('Page number.').optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.describe('Number of items per page.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsQueryParams = z.infer<
	typeof RESTGetListPayoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsData = z.array(APIPayout);

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = z.infer<typeof RESTGetListPayoutsData>;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixBody = RESTPostCreateNewCheckoutBody.pick({
	customer: true,
	metadata: true,
}).extend({
	amount: z.number().int().describe('Charge amount in cents.'),
	expiresIn: z
		.number()
		.int()
		.describe('Billing expiration time in seconds.')
		.optional(),
	description: z
		.string()
		.describe('Message that will appear when paying the PIX.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixBody = z.infer<
	typeof RESTPostCreateQRCodePixBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixData = z.infer<
	typeof RESTPostCreateQRCodePixData
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentQueryParams = z.object({
	id: z.string().describe('QRCode Pix ID.'),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentQueryParams = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentBody = z.object({
	metadata: z
		.record(z.string(), z.any())
		.describe('Optional metadata for the request.'),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentBody = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentBody
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentData = z.infer<
	typeof RESTPostSimulateQRCodePixPaymentData
>;

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = z.object({
	id: z.string().describe('QRCode Pix ID.'),
});

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export type RESTGetCheckQRCodePixStatusQueryParams = z.infer<
	typeof RESTGetCheckQRCodePixStatusQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusData = z.object({
	expiresAt: z.coerce.date().describe('QRCode Pix expiration date.'),
	status: PaymentStatus,
});

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = z.infer<
	typeof RESTGetCheckQRCodePixStatusData
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductBody = APIProduct.pick({
	name: true,
	price: true,
	currency: true,
	externalId: true,
}).extend({
	description: z.string().describe('Description for the product.').optional(),
});

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductBody = z.infer<
	typeof RESTPostCreateProductBody
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductData = APIProduct;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductData = z.infer<
	typeof RESTPostCreateProductData
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsQueryParams = z.object({
	page: z.number().int().min(1).default(1).describe('Page number.').optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.describe('Number of items per page.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsQueryParams = z.infer<
	typeof RESTGetListProductsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsData = z.array(APIProduct);

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = z.infer<typeof RESTGetListProductsData>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductQueryParams = z.object({
	id: z.string().describe('The product ID.').optional(),
	externalId: z.string().describe('External ID of the product.').optional(),
});

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductQueryParams = z.infer<
	typeof RESTGetProductQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductData = APIProduct;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductData = z.infer<typeof RESTGetProductData>;

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export const RESTGetStoreDetailsData = APIStore;

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = z.infer<typeof RESTGetStoreDetailsData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = z.object({
	mrr: z
		.number()
		.int()
		.min(0)
		.describe(
			'Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
		),
	totalActiveSubscriptions: z
		.number()
		.int()
		.min(0)
		.describe(
			'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
		),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = z.infer<typeof RESTGetMRRData>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionBody = APISubscription.pick({
	name: true,
	amount: true,
	method: true,
	frequency: true,
	customerId: true,
	externalId: true,
	retryPolicy: true,
}).extend({
	description: z.string().describe('Subscription description.').optional(),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionBody = z.infer<
	typeof RESTPostCreateSubscriptionBody
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionData = APISubscription;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionData = z.infer<
	typeof RESTPostCreateSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsQueryParams = z.object({
	cursor: z.string().describe('Cursor for the pagination.').optional(),
	limit: z
		.number()
		.int()
		.default(20)
		.describe('Number of items per page.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsQueryParams = z.infer<
	typeof RESTGetListSubscriptionsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsData = z.array(APISubscription);

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = z.infer<
	typeof RESTGetListSubscriptionsData
>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerBody = APICustomer.pick({
	email: true,
}).and(
	APICustomer.pick({
		name: true,
		taxId: true,
		zipCode: true,
		cellphone: true,
		metadata: true,
	}).partial(),
);

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = z.infer<
	typeof RESTPostCreateCustomerBody
>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerData = APICustomer;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = z.infer<
	typeof RESTPostCreateCustomerData
>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersData = z.array(APICustomer);

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = z.infer<typeof RESTGetListCustomersData>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersQueryParams = z.object({
	page: z.number().int().min(1).default(1).describe('Page number.').optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.describe('Number of items per page.')
		.optional(),
});

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersQueryParams = z.infer<
	typeof RESTGetListCustomersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerQueryParams = z.object({
	id: z.string().describe('The ID of the customer.'),
});

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerQueryParams = z.infer<
	typeof RESTGetCustomerQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerData = APICustomer.omit({
	country: true,
	zipCode: true,
});

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = z.infer<typeof RESTGetCustomerData>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerBody = z.object({
	id: z
		.string()
		.describe('Unique public identifier of the customer to be deleted.'),
});

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerBody = z.infer<typeof RESTDeleteCustomerBody>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerData = APICustomer.omit({
	country: true,
	zipCode: true,
});

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = z.infer<typeof RESTDeleteCustomerData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodQueryParams = z.object({
	startDate: z.coerce.date().describe('Period start date (YYYY-MM-DD format).'),
	endDate: z.coerce.date().describe('Period end date (YYYY-MM-DD format).'),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodQueryParams = z.infer<
	typeof RESTGetRevenueByPeriodQueryParams
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodData = z.object({
	totalRevenue: z
		.number()
		.int()
		.describe('Total revenue for the period in cents.'),
	totalTransactions: z
		.number()
		.int()
		.describe('Total transactions in the period.'),
	transactionsPerDay: z
		.record(
			z.string(),
			z.object({
				amount: z
					.number()
					.int()
					.describe("Total value of the day's transactions in cents."),
				count: z.number().int().describe('Number of transactions for the day.'),
			}),
		)
		.describe(
			'Object with transactions grouped by day (key is the date in YYYY-MM-DD format).',
		),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodData = z.infer<
	typeof RESTGetRevenueByPeriodData
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export const RESTGetMerchantData = z.object({
	name: z.string().describe('Store name.'),
	website: z.url().describe('Store website.'),
	createdAt: z.coerce.date().describe('Store creation date.'),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = z.infer<typeof RESTGetMerchantData>;
