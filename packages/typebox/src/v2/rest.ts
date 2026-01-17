import { type TAnySchema, Type as t } from '@sinclair/typebox';
import {
	APICheckout,
	APICoupon,
	APICustomer,
	APIPayout,
	APIProduct,
	APIQRCodePIX,
	APIStore,
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
				description: 'Error message returned from the API.',
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
		}),
	]);

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
			pagination: t.Object({
				page: t.Integer({
					minimum: 1,
					description: 'Current page.',
				}),
				limit: t.Integer({
					minimum: 0,
					description: 'Number of items per page.',
				}),
				items: t.Integer({
					minimum: 0,
					description: 'Number of items.',
				}),
				totalPages: t.Integer({
					minimum: 0,
					description: 'Number of pages.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
		}),
	]);

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
			pagination: t.Object({
				limit: t.Integer({
					minimum: 0,
					description: 'Number of items per page.',
				}),
				hasNext: t.Boolean({
					description: 'Indicates whether there is a next page.',
				}),
				hasPrevious: t.Boolean({
					description: 'Indicates whether there is a previous page.',
				}),
				nextCursor: t.Union([t.Null(), t.String()], {
					description: 'Cursor for the next page.',
				}),
			}),
		}),
		t.Object({
			data: t.Null(),
			error: t.String({
				description: 'Error message returned from the API.',
			}),
		}),
	]);

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
			description:
				'URL to redirect the customer if they click on the "Back" option.',
		}),
	),
	completionUrl: t.Optional(
		t.String({
			format: 'uri',
			description: 'URL to redirect the customer when payment is completed.',
		}),
	),
	customerId: t.Optional(
		t.String({
			description: 'The ID of a customer already registered in your store.',
		}),
	),
	customer: t.Optional(
		t.Pick(APICustomer, ['name', 'email', 'taxId', 'cellphone']),
	),
	coupons: t.Optional(
		t.Array(t.String(), {
			maxItems: 50,
			description:
				'List of coupons available for resem used with billing (0-50 max.).',
		}),
	),
	externalId: t.Optional(
		t.String({
			description:
				'If you have a unique identifier for your billing application, completely optional.',
		}),
	),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			description: 'Optional billing metadata.',
		}),
	),
	items: APICheckout.properties.items,
});

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/create
 */
export const RESTPostCreateNewCheckoutData = APICheckout;

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export const RESTGetListCheckoutsData = t.Array(APICheckout);

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
export const RESTGetCheckoutQueryParams = t.Object({
	id: t.String({
		description: 'Unique billing identifier.',
	}),
});

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
		description: 'Discount amount to be applied.',
	}),
	discountKind: CouponDiscountKind,
	notes: t.Optional(
		t.String({
			description: 'Coupon description',
		}),
	),
	maxRedeems: t.Optional(
		t.Integer({
			minimum: -1,
			description:
				'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
		}),
	),
	metadata: t.Record(t.String(), t.Any(), {
		description: 'Key value object for coupon metadata.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export const RESTPostCreateCouponData = APICoupon;

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
export const RESTGetListCouponsQueryParams = t.Object({
	page: t.Optional(
		t.Integer({
			minimum: 1,
			default: 1,
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponQueryParams = t.Object({
	id: t.String({
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export const RESTGetCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponBody = t.Object({
	id: t.String({
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export const RESTDeleteCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPatchToggleCouponStatusBody = t.Object({
	id: t.String({
		description: 'The ID of the coupon.',
	}),
});

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export const RESTPatchToggleCouponStatusData = APICoupon;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutBody = t.Object({
	externalId: t.String({
		description: 'Unique identifier of the payout in your system.',
	}),
	amount: t.Integer({
		minimum: 350,
		description: 'Payout value in cents (Min 350).',
	}),
	description: t.Optional(
		t.String({
			description: 'Optional payout description.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export const RESTPostCreateNewPayoutData = APIPayout;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export const RESTGetSearchPayoutQueryParams = t.Object({
	externalId: t.String({
		description: 'Unique payout identifier in your system.',
	}),
});

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
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export const RESTGetListPayoutsData = t.Array(APIPayout);

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export const RESTPostCreateQRCodePixBody = t.Intersect([
	t.Pick(RESTPostCreateNewCheckoutBody, ['customer', 'metadata']),
	t.Object({
		amount: t.Integer({
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
export const RESTPostCreateQRCodePixData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentQueryParams = t.Object({
	id: t.String({
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentBody = t.Object({
	metadata: t.Record(t.String(), t.Any(), {
		description: 'Optional metadata for the request.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export const RESTPostSimulateQRCodePixPaymentData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = t.Object({
	id: t.String({
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export const RESTGetCheckQRCodePixStatusData = t.Object({
	expiresAt: t.Date({
		description: 'QRCode Pix expiration date.',
	}),
	status: PaymentStatus,
});

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
export const RESTPostCreateProductData = APIProduct;

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
			description: 'Page number.',
		}),
	),
	limit: t.Optional(
		t.Integer({
			minimum: 1,
			description: 'Number of items per page.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export const RESTGetListProductsData = t.Array(APIProduct);

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
export const RESTGetProductData = APIProduct;

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export const RESTGetStoreDetailsData = APIStore;

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = t.Object({
	mrr: t.Integer({
		minimum: 0,
		description:
			'Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
	}),
	totalActiveSubscriptions: t.Integer({
		minimum: 0,
		description:
			'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
	}),
});
