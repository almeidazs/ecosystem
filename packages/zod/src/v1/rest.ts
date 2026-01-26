import { z } from 'zod';
import { StringEnum } from '../utils';
import {
	APICharge,
	APICoupon,
	APICustomer,
	APIProduct,
	APIQRCodePIX,
	APIStore,
	APIWithdraw,
	CouponDiscountKind,
	PaymentFrequency,
	PaymentMethod,
	PaymentStatus,
} from '.';

/**
 * Any response returned by the AbacatePay API
 */
export const APIResponse = <Schema extends z.ZodTypeAny>(schema: Schema) =>
	z.union([
		z.object({
			data: schema,
			error: z.null({
				description: 'Error message returned from the API.',
			}),
		}),
		z.object({
			data: z.null(),
			error: z.string({
				description: 'Error message returned from the API.',
			}),
		}),
	]);

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Schema extends z.ZodTypeAny> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * https://api.abacatepay.com/v1/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerBody = APICustomer.pick({ metadata: true });

/**
 * https://api.abacatepay.com/v1/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = z.infer<
	typeof RESTPostCreateCustomerBody
>;

/**
 * https://api.abacatepay.com/v1/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export const RESTPostCreateCustomerData = APIResponse(APICustomer);

/**
 * https://api.abacatepay.com/v1/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = z.infer<
	typeof RESTPostCreateCustomerData
>;

/**
 * https://api.abacatepay.com/v1/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export const RESTPostCreateNewChargeBody = z.object({
	methods: z.array(PaymentMethod, {
		description:
			'Payment methods that will be used. Currently, only `PIX` is supported, `CARD` is in beta.',
	}),
	frequency: PaymentFrequency,
	products: z
		.array(APIProduct, {
			description: 'List of products your customer is paying for.',
		})
		.min(1),
	returnUrl: z
		.string({
			description:
				'URL to redirect the customer if they click on the "Back" option.',
		})
		.url(),
	completionUrl: z
		.string({
			description: 'URL to redirect the customer when payment is completed.',
		})
		.url(),
	customerId: z.optional(
		z.string({
			description: 'The ID of a customer already registered in your store.',
		}),
	),
	customer: z.optional(APICustomer.pick({ metadata: true }), {
		description: "Your customer's data to create it.",
	}),
	allowCoupons: z.optional(
		z.boolean({ description: 'If true coupons can be used in billing.' }),
	),
	coupons: z.optional(
		z.array(z.string(), {
			description:
				'List of coupons available for resem used with billing (0-50 max.).',
		}),
	),
	externalId: z.optional(
		z.string({
			description:
				'If you have a unique identifier for your billing application, completely optional.',
		}),
	),
	metadata: z.optional(
		z.record(z.string(), z.any(), {
			description: 'Optional billing metadata.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v1/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewChargeBody = z.infer<
	typeof RESTPostCreateNewChargeBody
>;

/**
 * https://api.abacatepay.com/v1/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export const RESTPostCreateNewChargeData = APIResponse(APICharge);

/**
 * https://api.abacatepay.com/v1/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewChargeData = z.infer<
	typeof RESTPostCreateNewChargeData
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export const RESTPostCreateQRCodePixBody = z.intersection(
	RESTPostCreateNewChargeBody.pick({ customer: true, metadata: true }),
	z.object({
		amount: z
			.number({
				description: 'Charge amount in cents',
			})
			.int(),
		expiresIn: z.optional(
			z
				.number({
					description: 'Billing expiration time in seconds.',
				})
				.int(),
		),
		description: z.optional(
			z.string({
				description: 'Message that will appear when paying the PIX.',
			}),
		),
	}),
);

/**
 * https://api.abacatepay.com/v1/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export type RESTPostCreateQRCodePixBody = z.infer<
	typeof RESTPostCreateQRCodePixBody
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export const RESTPostCreateQRCodePixData = APIResponse(APIQRCodePIX);

/**
 * https://api.abacatepay.com/v1/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export type RESTPostCreateQRCodePixData = z.infer<
	typeof RESTPostCreateQRCodePixData
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export const RESTPostSimulatePaymentQueryParams = z.object({
	id: z.string({
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v1/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export type RESTPostSimulatePaymentQueryParams = z.infer<
	typeof RESTPostSimulatePaymentQueryParams
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export const RESTPostSimulatePaymentData = APIResponse(APIQRCodePIX);

/**
 * https://api.abacatepay.com/v1/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export type RESTPostSimulatePaymentData = z.infer<
	typeof RESTPostSimulatePaymentData
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export const RESTGetCheckQRCodePixStatusQueryParams = z.object({
	id: z.string({
		description: 'QRCode Pix ID.',
	}),
});

/**
 * https://api.abacatepay.com/v1/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export type RESTGetCheckQRCodePixStatusQueryParams = z.infer<
	typeof RESTGetCheckQRCodePixStatusQueryParams
>;

/**
 * https://api.abacatepay.com/v1/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export const RESTGetCheckQRCodePixStatusData = APIResponse(
	z.object({
		expiresAt: z.coerce.date({
			description: 'QRCode Pix expiration date.',
		}),
		status: PaymentStatus,
	}),
);

/**
 * https://api.abacatepay.com/v1/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export type RESTGetCheckQRCodePixStatusData = z.infer<
	typeof RESTGetCheckQRCodePixStatusData
>;

/**
 * https://api.abacatepay.com/v1/billing/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export const RESTGetListBillingsData = APIResponse(z.array(APICharge));

/**
 * https://api.abacatepay.com/v1/billing/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListBillingsData = z.infer<typeof RESTGetListBillingsData>;

/**
 * https://api.abacatepay.com/v1/customer/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export const RESTGetListCustomersData = APIResponse(z.array(APICustomer));

/**
 * https://api.abacatepay.com/v1/customer/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = z.infer<typeof RESTGetListCustomersData>;

/**
 * https://api.abacatepay.com/v1/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export const RESTPostCreateCouponBody = z.object(
	{
		data: z.object({
			code: z.string({
				description: 'Unique coupon identifier.',
			}),
			discount: z
				.number({
					description: 'Discount amount to be applied.',
				})
				.int(),
			discountKind: CouponDiscountKind,
			notes: z.optional(
				z.string({
					description: 'Coupon description.',
				}),
			),
			maxRedeems: z.optional(
				z
					.number({
						description:
							'Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.',
					})
					.int()
					.min(-1)
					.default(-1),
			),
			metadata: z.optional(z.record(z.string(), z.any()), {
				description: 'Key value object for coupon metadata.',
			}),
		}),
	},
	{
		description: 'Coupon data.',
	},
);

/**
 * https://api.abacatepay.com/v1/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export type RESTPostCreateCouponBody = z.infer<typeof RESTPostCreateCouponBody>;

/**
 * https://api.abacatepay.com/v1/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export const RESTPostCreateCouponData = APIResponse(APICoupon);

/**
 * https://api.abacatepay.com/v1/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export type RESTPostCreateCouponData = z.infer<typeof RESTPostCreateCouponData>;

/**
 * https://api.abacatepay.com/v1/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export const RESTPostCreateNewWithdrawBody = z.object({
	externalId: z.string({
		description: 'Unique identifier of the withdrawal in your system.',
	}),
	method: z.literal('PIX', {
		description: 'Withdrawal method available.',
	}),
	amount: z
		.number({
			description: 'Withdrawal value in cents (Min 350).',
		})
		.int()
		.min(350),
	pix: z.object(
		{
			type: StringEnum(
				['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'RANDOM', 'BR_CODE'],
				'PIX key type.',
			),
			key: z.string({
				description: 'PIX key value.',
			}),
		},
		{
			description: 'PIX key data to receive the withdrawal.',
		},
	),
	description: z.optional(
		z.string({
			description: 'Optional description of the withdrawal.',
		}),
	),
});

/**
 * https://api.abacatepay.com/v1/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export type RESTPostCreateNewWithdrawBody = z.infer<
	typeof RESTPostCreateNewWithdrawBody
>;

/**
 * https://api.abacatepay.com/v1/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export const RESTPostCreateNewWithdrawData = APIResponse(APIWithdraw);

/**
 * https://api.abacatepay.com/v1/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export type RESTPostCreateNewWithdrawData = z.infer<
	typeof RESTPostCreateNewWithdrawData
>;

/**
 * https://api.abacatepay.com/v1/withdraw/get
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/get
 */
export const RESTGetSearchWithdrawQueryParams = z.object({
	externalId: z.string({
		description: 'Unique identifier of the withdrawal in your system.',
	}),
});

/**
 * https://api.abacatepay.com/v1/withdraw/get
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/get
 */
export type RESTGetSearchWithdrawQueryParams = z.infer<
	typeof RESTGetSearchWithdrawQueryParams
>;

/**
 * https://api.abacatepay.com/v1/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export const RESTGetRevenueByPeriodQueryParams = z.object({
	startDate: z.string({
		description: 'Period start date (YYYY-MM-DD format).',
	}),
	endDate: z.string({
		description: 'Period end date (YYYY-MM-DD format).',
	}),
});

/**
 * https://api.abacatepay.com/v1/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export type RESTGetRevenueByPeriodQueryParams = z.infer<
	typeof RESTGetRevenueByPeriodQueryParams
>;

/**
 * https://api.abacatepay.com/v1/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export const RESTGetMerchantData = APIResponse(
	z.object({
		name: z.string({
			description: 'Store name.',
		}),
		website: z
			.string({
				description: 'Store website.',
			})
			.url(),
		createdAt: z.coerce.date({
			description: 'Store creation date.',
		}),
	}),
);

/**
 * https://api.abacatepay.com/v1/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export type RESTGetMerchantData = z.infer<typeof RESTGetMerchantData>;

/**
 * https://api.abacatepay.com/v1/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export const RESTGetMRRData = APIResponse(
	z.object({
		mrr: z
			.number({
				description:
					'hly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.',
			})
			.int(),
		totalActiveSubscriptions: z
			.number({
				description:
					'Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.',
			})
			.int(),
	}),
);

/**
 * https://api.abacatepay.com/v1/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export type RESTGetMRRData = z.infer<typeof RESTGetMRRData>;

/**
 * https://api.abacatepay.com/v1/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export const RESTGetStoreDetailsData = APIResponse(APIStore);

/**
 * https://api.abacatepay.com/v1/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = z.infer<typeof RESTGetStoreDetailsData>;

/**
 * https://api.abacatepay.com/v1/withdraw/list
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/list
 */
export const RESTGetListWithdrawsData = APIResponse(z.array(APIWithdraw));

/**
 * https://api.abacatepay.com/v1/withdraw/list
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/list
 */
export type RESTGetListWithdrawsData = z.infer<typeof RESTGetListWithdrawsData>;

/**
 * https://api.abacatepay.com/v1/coupon/list
 *
 * @reference https://docs.abacatepay.com/pages/coupon/list
 */
export const RESTGetListCouponsData = APIResponse(z.array(APICoupon));

/**
 * https://api.abacatepay.com/v1/coupon/list
 *
 * @reference https://docs.abacatepay.com/pages/coupon/list
 */
export type RESTGetListCouponsData = z.infer<typeof RESTGetListCouponsData>;
