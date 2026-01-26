import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';
import { APICustomer } from './customer';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	{
		description:
			'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
	},
);

export type PaymentStatus = Static<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(['PIX', 'CARD'], {
	description: 'Payment method.',
});

export type PaymentMethod = Static<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export const PaymentFrequency = StringEnum(['ONE_TIME', 'MULTIPLE_PAYMENTS'], {
	description: 'Payment frequency.',
});

/**
 * https://docs.abacatepay.com/pages/payment/create#body-frequency
 */
export type PaymentFrequency = Static<typeof PaymentFrequency>;

export const APIProduct = t.Object({
	externalId: t.String({
		examples: ['prod-1234'],
		description:
			'The product id on your system. We use this id to create your product on AbacatePay automatically, so make sure your id is unique.',
	}),
	name: t.String({
		description: 'Product name.',
		examples: ['Assinature de Programa Fitness'],
	}),
	quantity: t.Integer({
		minimum: 1,
		examples: [2],
		description: 'Quantity of product being purchased',
	}),
	price: t.Integer({
		minimum: 100,
		examples: [100],
		description:
			'Price per unit of product in cents. The minimum is 100 (1 BRL).',
	}),
	description: t.Optional(
		t.String({
			description: 'Detailed product description.',
		}),
	),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export const APICharge = t.Object({
	id: t.String({
		description: 'Unique billing identifier.',
	}),
	frequency: PaymentFrequency,
	externalId: t.Union([t.Null(), t.String()], {
		description: 'Bill ID in your system.',
	}),
	url: t.String({
		format: 'uri',
		description: 'URL where the user can complete the payment.',
	}),
	status: PaymentStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the charge was created in a development (true) or production (false) environment.',
	}),
	metadata: t.Object({
		fee: t.Integer({
			description: 'Fee applied by AbacatePay.',
		}),
		returnUrl: t.String({
			format: 'uri',
			description:
				'URL that the customer will be redirected to when clicking the “back” button.',
		}),
		completionUrl: t.String({
			format: 'uri',
			description:
				'URL that the customer will be redirected to when making payment.',
		}),
	}),
	methods: t.Array(PaymentMethod, {
		description: 'Supported payment types: `PIX` and `CARD` (beta).',
	}),
	products: t.Array(APIProduct, {
		minItems: 1,
		description: 'List of products included in the charge.',
	}),
	customer: t.Optional(APICustomer),
	nextBilling: t.Union([t.Date(), t.Null()], {
		description: 'Date and time of next charge, or null for one-time charges.',
	}),
	allowCoupons: t.Optional(
		t.Boolean({
			description: 'Whether or not to allow coupons for billing.',
		}),
	),
	coupons: t.Array(t.String(), {
		default: [],
		maxItems: 50,
		description:
			'Coupons allowed in billing. Coupons are only considered if `allowCoupons` is true.',
	}),
	createdAt: t.Date({
		description: 'Charge creation date and time.',
	}),
	updatedAt: t.Date({
		description: 'Charge last updated date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/payment/reference#estrutura
 */
export type APICharge = Static<typeof APICharge>;
