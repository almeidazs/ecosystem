import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export const PayoutStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transaction status.',
);

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export type PayoutStatus = z.infer<typeof PayoutStatus>;

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export const APIPayout = z.object({
	id: z.string().describe('Unique transaction identifier.'),
	status: PayoutStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the transaction was created in a testing environment.',
		),
	receiptUrl: z.union([z.null(), z.url()]).describe('Transaction proof URL.'),
	amount: z.number().int().describe('Payout value in cents.'),
	platformFee: z.number().int().describe('Platform fee in cents.'),
	externalId: z.string().describe('External transaction identifier.'),
	createdAt: z.coerce.date().describe('Transaction creation date.'),
	updatedAt: z.coerce.date().describe('Transaction update date.'),
});

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export type APIPayout = z.infer<typeof APIPayout>;
