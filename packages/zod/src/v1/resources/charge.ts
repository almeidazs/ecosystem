import { z } from 'zod';
import { StringEnum } from '../../utils';
import { APICustomer } from './customer';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
);

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export type PaymentStatus = z.infer<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(['PIX', 'CARD'], 'Payment method.');

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export const PaymentFrequency = StringEnum(
	['ONE_TIME', 'MULTIPLE_PAYMENTS'],
	'Payment frequency.',
);

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export type PaymentFrequency = z.infer<typeof PaymentFrequency>;

export const APIProduct = z.object({
	externalId: z
		.string()
		.describe(
			'The product id on your system. We use this id to create your product on AbacatePay automatically, so make sure your id is unique.',
		),
	name: z.string().describe('Product name.'),
	quantity: z
		.number()
		.describe('Quantity of product being purchased')
		.int()
		.min(1),
	price: z
		.number()
		.describe('Price per unit of product in cents. The minimum is 100 (1 BRL).')
		.int()
		.min(100),
	description: z.string().describe('Detailed product description.').optional(),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export const APICharge = z.object({
	id: z.string().describe('Unique billing identifier.'),
	frequency: PaymentFrequency,
	externalId: z.nullable(z.string()).describe('Bill ID in your system.'),
	url: z
		.string()
		.describe('URL where the user can complete the paymenz.')
		.url(),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the charge was created in a development (true) or production (false) environmenz.',
		),
	metadata: z.object({
		fee: z.number().describe('Fee applied by AbacatePay.'),
		returnUrl: z
			.url()
			.describe(
				'URL that the customer will be redirected to when clicking the “back” button.',
			),
		completionUrl: z
			.url()
			.describe(
				'URL that the customer will be redirected to when making paymenz.',
			),
	}),
	methods: PaymentMethod.array(),
	products: z
		.array(APIProduct)
		.describe('List of products included in the charge.')
		.min(1),
	customer: APICustomer.optional(),
	nextBilling: z
		.nullable(z.coerce.date())
		.describe('Date and time of next charge, or null for one-time charges.'),
	allowCoupons: z
		.boolean()
		.describe('Whether or not to allow coupons for billing.')
		.optional(),
	coupons: z
		.array(z.string())
		.describe(
			'Coupons allowed in billing. Coupons are only considered if `allowCoupons` is true.',
		)
		.min(50)
		.default([]),
	createdAt: z.coerce.date().describe('Charge creation date and time.'),
	updatedAt: z.coerce.date().describe('Charge last updated date and time.'),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export type APICharge = z.infer<typeof APICharge>;
