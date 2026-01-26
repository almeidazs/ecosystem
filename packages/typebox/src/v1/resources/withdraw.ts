import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export const WithdrawStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	{ description: 'Transaction status.' },
);

/**
 * https://docs.abacatepay.com/pages/withdraw/reference#atributos
 */
export type WithdrawStatus = Static<typeof WithdrawStatus>;

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export const APIWithdraw = t.Object({
	id: t.String({
		description: 'Unique transaction identifier.',
	}),
	status: WithdrawStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the transaction was created in a testing environment.',
	}),
	receiptUrl: t.String({
		format: 'uri',
		description: 'Transaction proof URL.',
	}),
	amount: t.Integer({
		description: 'Withdraw value in cents.',
	}),
	platformFee: t.Integer({
		description: 'Platform fee in cents.',
	}),
	externalId: t.Optional(
		t.String({
			description: 'External transaction identifier.',
		}),
	),
	createdAt: t.Date({
		description: 'Transaction creation date.',
	}),
	updatedAt: t.Date({
		description: 'Transaction update date.',
	}),
	kind: t.Literal('WITHDRAW', {
		description: "Transaction type. It will always be 'WITHDRAW'",
	}),
});

/**
 * https://docs.abacatepay.com/pages/withdraws/reference
 */
export type APIWithdraw = Static<typeof APIWithdraw>;
