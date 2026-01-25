import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
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
export const APIResponse = <Schema extends TAnySchema>(schema: Schema) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				examples: [null],
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(true, {
				examples: [true],
				description: 'Whether the response was successfull or not.',
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				examples: ['API key inválida.'],
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				examples: [false],
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Schema extends TAnySchema> = Static<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export const APIResponseWithPagination = <Schema extends TAnySchema>(
	schema: Schema,
) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				description: 'Error message returned from the API',
			}),
			success: t.Literal(true, {
				description: 'Whether the response was successfull or not.',
			}),
			pagination: t.Object({
				page: t.Integer({
					minimum: 1,
					examples: [1],
					description: 'Current page.',
				}),
				limit: t.Integer({
					minimum: 0,
					examples: [15],
					description: 'Number of items per page.',
				}),
				items: t.Integer({
					minimum: 0,
					examples: [5],
					description: 'Number of items.',
				}),
				totalPages: t.Integer({
					minimum: 0,
					examples: [1],
					description: 'Number of pages.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 * @returns
 */
export type APIResponseWithPagination<Schema extends TAnySchema> = Static<
	ReturnType<typeof APIResponseWithPagination<Schema>>
>;

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export const APIResponseWithCursorBasedPagination = <Schema extends TAnySchema>(
	schema: Schema,
) =>
	t.Union([
		t.Object({
			data: schema,
			error: t.Null({
				description: 'Error message returned from the API',
			}),
			success: t.Literal(false, {
				description: 'Whether the response was successfull or not.',
			}),
			pagination: t.Object({
				limit: t.Integer({
					minimum: 0,
					examples: [15],
					description: 'Number of items per page.',
				}),
				hasNext: t.Boolean({
					examples: [false],
					description: 'Indicates whether there is a next page.',
				}),
				hasPrevious: t.Boolean({
					examples: [true],
					description: 'Indicates whether there is a previous page.',
				}),
				nextCursor: t.Union([t.Null(), t.String()], {
					examples: [null],
					description: 'Cursor for the next page.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
			success: t.Literal(false, {
				description: 'Whether the response was successfull or not.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export type APIResponseWithCursorBasedPagination<Schema extends TAnySchema> =
	Static<ReturnType<typeof APIResponseWithCursorBasedPagination<Schema>>>;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkout/create
 */
export const RESTPostCreateNewCheckoutBody = t.Object({
	methods: PaymentMethod,
	returnUrl: t.Optional(
		t.String({
			format: 'uri',
			examples: ['https://yourstore.com/checkout/cancelled'],
			description:
				'URL to redirect the customer if they click on the "Back" option.',
		}),
	),
	completionUrl: t.Optional(
		t.String({
			format: 'uri',
			examples: ['https://yourstore.com/checkout/thanks'],
			description: 'URL to redirect the customer when payment is completed.',
		}),
	),
	customerId: t.Optional(
		t.String({
			examples: [undefined],
			description: 'The ID of a customer already registered in your store.',
		}),
	),
	customer: t.Optional(
		t.Pick(APICustomer, ['name', 'email', 'taxId', 'cellphone']),
	),
	coupons: t.Optional(
		t.Array(
			t.String({
				examples: ['SUMMER_26'],
			}),
			{
				maxItems: 50,
				description:
					'List of coupons available for resem used with billing (0-50 max.).',
			},
		),
	),
	externalId: t.Optional(
		t.String({
			examples: ['invoice_123456'],
			description:
				'If you have a unique identifier for your billing application, completely optional.',
		}),
	),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			examples: [{}],
			description: 'Optional billing metadata.',
		}),
	),
	items: APICheckout.properties.items,
});

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkout/create
 */
export type RESTPostCreateNewCheckoutBody = Static<
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
export type RESTPostCreateNewCheckoutData = Static<
	typeof RESTPostCreateNewCheckoutData
>;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export const RESTGetListCheckoutsData = t.Array(APICheckout);

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export type RESTGetListCheckoutsData = Static<typeof RESTGetListCheckoutsData>;

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
export type RESTGetCheckoutData = Static<typeof RESTGetCheckoutData>;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export const RESTGetCheckoutQueryParams = t.Object({
	id: t.String({
		examples: ['bill_12oimasd23'],
		description: 'Unique billing identifier.',
	}),
});

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export type RESTGetCheckoutQueryParams = Static<
	typeof RESTGetCheckoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export const RESTPostCreateCouponBody = t.Object({
	code: t.String({
		examples: ['DEYVIN_20'],
		description: 'Unique coupon identifier.',
	}),
	discount: t.Integer({
		examples: [2300],
		description: 'Discount amount to be applied.',
	}),
	discountKind: CouponDiscountKind,
	notes: t.Optional(
		t.String({
			examples: ['Test coupon.'],
			description: 'Coupon description',
		}),
	),
	maxRedeems: t.Optional(
		t.Integer({
			minimum: -1,
			examples: [3],
			description:
				'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
		}),
	),
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{}],
		description: 'Key value object for coupon metadata.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export type RESTPostCreateCouponBody = Static<typeof RESTPostCreateCouponBody>;

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
export type RESTPostCreateCouponData = Static<typeof RESTPostCreateCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsData = t.Array(APICoupon);

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = Static<typeof RESTGetListCouponsData>;

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export const RESTGetListCouponsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsQueryParams = Static<
	typeof RESTGetListCouponsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponQueryParams = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponQueryParams = Static<typeof RESTGetCouponQueryParams>;

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
export type RESTGetCouponData = Static<typeof RESTGetCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponBody = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponBody = Static<typeof RESTDeleteCouponBody>;

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
export type RESTDeleteCouponData = Static<typeof RESTDeleteCouponData>;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPatchToggleCouponStatusBody = t.Object({
	id: t.String({
		examples: ['SUMMER_26'],
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPatchToggleCouponStatusBody = Static<
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
export type RESTPatchToggleCouponStatusData = Static<
	typeof RESTPatchToggleCouponStatusData
>;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutBody = t.Object({
	externalId: t.String({
		examples: ['invoice_1231231'],
		description: 'Unique identifier of the payout in your system.',
	}),
	amount: t.Integer({
		minimum: 350,
		examples: [350],
		description: 'Payout value in cents (Min 350).',
	}),
	description: t.Optional(
		t.String({
			examples: ['No desc for this.'],
			description: 'Optional payout description.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewPayoutBody = Static<
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
export type RESTPostCreateNewPayoutData = Static<
	typeof RESTPostCreateNewPayoutData
>;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutQueryParams = t.Object({
	externalId: t.String({
		examples: ['invoice_12312312'],
		description: 'Unique payout identifier in your system.',
	}),
});

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export type RESTGetSearchPayoutQueryParams = Static<
	typeof RESTGetSearchPayoutQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsQueryParams = Static<
	typeof RESTGetListPayoutsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsData = t.Array(APIPayout);

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = Static<typeof RESTGetListPayoutsData>;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixBody = t.Intersect([
	t.Pick(RESTPostCreateNewCheckoutBody, ['customer', 'metadata']),
	t.Object({
		amount: t.Integer({
			examples: [1234],
			description: 'Charge amount in cents.',
		}),
		expiresIn: t.Optional(
			t.Integer({
				description: 'Billing expiration time in seconds.',
			}),
		),
		description: t.Optional(
			t.String({
				description: 'Message that will appear when paying the PIX.',
			}),
		),
	}),
]);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixBody = Static<
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
export type RESTPostCreateQRCodePixData = Static<
	typeof RESTPostCreateQRCodePixData
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentQueryParams = t.Object({
	id: t.String({
		examples: ['pix_char_123adi9i2m'],
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentQueryParams = Static<
	typeof RESTPostSimulateQRCodePixPaymentQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentBody = t.Object({
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{}],
		description: 'Optional metadata for the request.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentBody = Static<
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
export type RESTPostSimulateQRCodePixPaymentData = Static<
	typeof RESTPostSimulateQRCodePixPaymentData
>;

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = t.Object({
	id: t.String({
		examples: ['pix_char_1239129'],
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export type RESTGetCheckQRCodePixStatusQueryParams = Static<
	typeof RESTGetCheckQRCodePixStatusQueryParams
>;

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusData = t.Object({
	expiresAt: t.Date({
		examples: [new Date()],
		description: 'QRCode Pix expiration date.',
	}),
	status: PaymentStatus,
});

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export type RESTGetCheckQRCodePixStatusData = Static<
	typeof RESTGetCheckQRCodePixStatusData
>;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export const RESTPostCreateProductBody = t.Intersect([
	t.Object({
		description: t.Optional(
			t.String({
				description: 'Description for the product.',
			}),
		),
	}),
	t.Pick(APIProduct, ['name', 'price', 'currency', 'externalId']),
]);

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductBody = Static<
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
export type RESTPostCreateProductData = Static<
	typeof RESTPostCreateProductData
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			examples: [3],
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [15],
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsQueryParams = Static<
	typeof RESTGetListProductsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsData = t.Array(APIProduct);

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = Static<typeof RESTGetListProductsData>;

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export const RESTGetProductQueryParams = t.Object({
	id: t.Optional(
		t.String({
			description: 'The product ID.',
		}),
	),
	externalId: t.Optional(
		t.String({
			description: 'External ID of the product.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductQueryParams = Static<
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
export type RESTGetProductData = Static<typeof RESTGetProductData>;

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
export type RESTGetStoreDetailsData = Static<typeof RESTGetStoreDetailsData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = t.Object({
	mrr: t.Integer({
		minimum: 0,
		examples: [100],
		description:
			'Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
	}),
	totalActiveSubscriptions: t.Integer({
		minimum: 0,
		examples: [1],
		description:
			'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
	}),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = Static<typeof RESTGetMRRData>;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export const RESTPostCreateSubscriptionBody = t.Intersect([
	t.Object({
		description: t.Optional(
			t.String({
				description: 'Subscription description.',
			}),
		),
	}),
	t.Pick(APISubscription, [
		'name',
		'amount',
		'method',
		'frequency',
		'customerId',
		'externalId',
		'retryPolicy',
	]),
]);

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionBody = Static<
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
export type RESTPostCreateSubscriptionData = Static<
	typeof RESTPostCreateSubscriptionData
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsQueryParams = t.Object({
	cursor: t.Optional(
		t.String({
			description: 'Cursor for the pagination.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			examples: [3],
			default: 20,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsQueryParams = Static<
	typeof RESTGetListSubscriptionsQueryParams
>;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export const RESTGetListSubscriptionsData = t.Array(APISubscription);

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = Static<
	typeof RESTGetListSubscriptionsData
>;

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerBody = t.Intersect([
	t.Pick(APICustomer, ['email']),
	t.Partial(
		t.Pick(APICustomer, ['name', 'taxId', 'zipCode', 'cellphone', 'metadata']),
	),
]);

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = Static<
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
export type RESTPostCreateCustomerData = Static<
	typeof RESTPostCreateCustomerData
>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersData = t.Array(APICustomer);

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = Static<typeof RESTGetListCustomersData>;

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			examples: [3],
			default: 1,
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			examples: [10],
			minimum: 1,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersQueryParams = Static<
	typeof RESTGetListCustomersQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerQueryParams = t.Object({
	id: t.String({
		examples: ['1293kasd'],
		description: 'The ID of the customer.',
	}),
});

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerQueryParams = Static<
	typeof RESTGetCustomerQueryParams
>;

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export const RESTGetCustomerData = t.Omit(APICustomer, ['country', 'zipCode']);

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = Static<typeof RESTGetCustomerData>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerBody = t.Object({
	id: t.String({
		examples: ['cust_12malsdi93w'],
		description: 'Unique public identifier of the customer to be deleted.',
	}),
});

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerBody = Static<typeof RESTDeleteCustomerBody>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export const RESTDeleteCustomerData = t.Omit(APICustomer, [
	'country',
	'zipCode',
]);

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = Static<typeof RESTDeleteCustomerData>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodQueryParams = t.Object({
	startDate: t.Date({
		examples: [new Date()],
		description: 'Period start date (YYYY-MM-DD format).',
	}),
	endDate: t.Date({
		examples: [new Date()],
		description: 'Period end date (YYYY-MM-DD format).',
	}),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodQueryParams = Static<
	typeof RESTGetRevenueByPeriodQueryParams
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodData = t.Object({
	totalRevenue: t.Integer({
		examples: [10000],
		description: 'Total revenue for the period in cents.',
	}),
	totalTransactions: t.Integer({
		examples: [39],
		description: 'Total transactions in the period.',
	}),
	transactionsPerDay: t.Record(
		t.String(),
		t.Object({
			amount: t.Integer({
				examples: [3200],
				description: "Total value of the day's transactions in cents.",
			}),
			count: t.Integer({
				examples: [12],
				description: 'Number of transactions for the day.',
			}),
		}),
		{
			description:
				'Object with transactions grouped by day (key is the date in YYYY-MM-DD format).',
		},
	),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodData = Static<
	typeof RESTGetRevenueByPeriodData
>;

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export const RESTGetMerchantData = t.Object({
	name: t.String({
		examples: ['Summer Store'],
		description: 'Store name.',
	}),
	website: t.String({
		format: 'uri',
		examples: ['https://summer-store.com/'],
		description: 'Store website.',
	}),
	createdAt: t.Date({
		examples: [new Date()],
		description: 'Store creation date.',
	}),
});

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = Static<typeof RESTGetMerchantData>;
