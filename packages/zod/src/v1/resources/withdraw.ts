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
	id: z.string({
		description: 'Unique transaction identifier.',
	}),
	status: WithdrawStatus,
	devMode: z.boolean({
		description:
			'Indicates whether the transaction was created in a testing environment.',
	}),
	receiptUrl: z
		.string({
			description: 'Transaction proof URL.',
		})
		.url(),
	amount: z
		.number({
			description: 'Withdraw value in cents.',
		})
		.int(),
	platformFee: z
		.number({
			description: 'Platform fee in cents.',
		})
		.int(),
	externalId: z
		.string({
			description: 'External transaction identifier.',
		})
		.optional(),
	createdAt: z.coerce.date({
		description: 'Transaction creation date.',
	}),
	updatedAt: z.coerce.date({
		description: 'Transaction update date.',
	}),
	kind: z.literal('WITHDRAW', {
		description: "Transaction type. It will always be 'WITHDRAW'",
	}),
});

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export type APIWithdraw = z.infer<typeof APIWithdraw>;
