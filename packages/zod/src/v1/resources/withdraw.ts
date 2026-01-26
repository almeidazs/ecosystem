import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export const WithdrawStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transaction status.',
);

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export type WithdrawStatus = z.infer<typeof WithdrawStatus>;

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export const APIWithdraw = z.object({
	id: z.string().describe('Unique transaction identifier.'),
	status: WithdrawStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the transaction was created in a testing environment.',
		),
	receiptUrl: z.url().describe('Transaction proof URL.'),
	amount: z.number().describe('Withdraw value in cents.').int(),
	platformFee: z.number().describe('Platform fee in cents.').int(),
	externalId: z
		.string()
		.describe('External transaction identifier.')
		.optional(),
	createdAt: z.coerce.date().describe('Transaction creation date.'),
	updatedAt: z.coerce.date().describe('Transaction update date.'),
	kind: z
		.literal('WITHDRAW')
		.describe("Transaction type. It will always be 'WITHDRAW'"),
});

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export type APIWithdraw = z.infer<typeof APIWithdraw>;
