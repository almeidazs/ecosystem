import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	{
		examples: ['PENDING'],
		description:
			'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
	},
);

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export type PaymentStatus = Static<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(['PIX', 'CARD'], {
	examples: ['PIX'],
	description: 'Payment method.',
});

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export type PaymentMethod = Static<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export const APICheckout = t.Object({
	id: t.String({
		examples: ['bill_abc123xyz'],
		description: 'Unique billing identifier.',
	}),
	amount: t.Integer({
		minimum: 100,
		examples: [1500],
		description: 'Total amount to be paid in cents.',
	}),
	paidAmount: t.Union(
		[
			t.Null(),
			t.Integer({
				minimum: 100,
			}),
		],
		{
			examples: [null],
			description:
				'Amount already paid in cents.`null` if it has not yet been paid.',
		},
	),
	externalId: t.Union([t.Null(), t.String()], {
		examples: ['internal_bill_456def'],
		description: 'Bill ID in your system.',
	}),
	url: t.String({
		format: 'uri',
		examples: ['https://app.abacatepay.com/pay/bill_abc123xyz'],
		description: 'URL where the user can complete the payment.',
	}),
	items: t.Array(
		t.Object({
			id: t.String({
				examples: ['prod_abc123'],
				description: 'Product ID.',
			}),
			quantity: t.Integer({
				minimum: 1,
				examples: [2],
				description: 'Item quantity.',
			}),
		}),
		{
			minItems: 1,
			description: 'List of items in billing.',
		},
	),
	status: PaymentStatus,
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the charge was created in a development (true) or production (false) environment.',
	}),
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{ orderId: 'order_789ghi' }],
		description: 'Additial metadata for the charge.',
	}),
	returnUrl: t.String({
		format: 'uri',
		examples: ['https://yourshop.com/premium'],
		description:
			'URL that the customer will be redirected to when clicking the “back” button.',
	}),
	completionUrl: t.String({
		format: 'uri',
		examples: ['https://yourshop.com/thanks'],
		description:
			'URL that the customer will be redirected to when making payment.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		examples: [null],
		description: 'Payment receipt URL.',
	}),
	coupons: t.Array(
		t.String({
			examples: ['#ABKT2'],
		}),
		{
			default: [],
			maxItems: 50,
			description: 'Coupons allowed in billing.',
		},
	),
	customerId: t.Union([t.Null(), t.String()], {
		examples: [null],
		description: 'Customer ID associated with the charge.',
	}),
	createdAt: t.Date({
		examples: ['2024-11-04T18:38:28.573Z'],
		description: 'Charge creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2024-11-04T18:38:28.573Z'],
		description: 'Charge last updated date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export type APICheckout = Static<typeof APICheckout>;
