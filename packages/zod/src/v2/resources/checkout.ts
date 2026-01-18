import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payment/reference#atributos
 */
export const PaymentStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED'],
	'Billing status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.',
);

export type PaymentStatus = z.infer<typeof PaymentStatus>;

/**
 * https://docs.abacatepay.com/pages/payment/create#body-methods
 */
export const PaymentMethod = StringEnum(['PIX', 'CARD'], 'Payment method.');

export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * https://docs.abacatepay.com/pages/checkouts/reference#estrutura
 */
export const APICheckout = z.object({
	id: z.string().describe('Unique billing identifier.'),
	amount: z
		.number()
		.int()
		.min(100)
		.describe('Total amount to be paid in cents.'),
	paidAmount: z
		.union([z.null(), z.number().int().min(100)])
		.describe(
			'Amount already paid in cents.`null` if it has not yet been paid.',
		),
	externalId: z
		.union([z.null(), z.string()])
		.describe('Bill ID in your system.'),
	url: z.url().describe('URL where the user can complete the payment.'),
	items: z
		.array(
			z.object({
				id: z.string().describe('Product ID.'),
				quantity: z.number().int().min(1).describe('Item quantity.'),
			}),
		)
		.min(1)
		.describe('List of items in billing.'),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the charge was created in a development (true) or production (false) environment.',
		),
	metadata: z
		.record(z.string(), z.any())
		.describe('Additial metadata for the charge.'),
	returnUrl: z
		.url()
		.describe(
			'URL that the customer will be redirected to when clicking the "back" button.',
		),
	completionUrl: z
		.url()
		.describe(
			'URL that the customer will be redirected to when making payment.',
		),
	receiptUrl: z.union([z.null(), z.url()]).describe('Payment receipt URL.'),
	coupons: z
		.array(z.string())
		.max(50)
		.default([])
		.describe('Coupons allowed in billing.'),
	customerId: z
		.union([z.null(), z.string()])
		.describe('Customer ID associated with the charge.'),
	createdAt: z.coerce.date().describe('Charge creation date and time.'),
	updatedAt: z.coerce.date().describe('Charge last updated date and time.'),
});

export type APICheckout = z.infer<typeof APICheckout>;
