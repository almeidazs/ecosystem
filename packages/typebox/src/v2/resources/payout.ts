import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export const PayoutStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	{ examples: ['PENDING'], description: 'Transaction status.' },
);

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export type PayoutStatus = Static<typeof PayoutStatus>;

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export const APIPayout = t.Object({
	id: t.String({
		examples: ['txn_1234567890abcdef'],
		description: 'Unique transaction identifier.',
	}),
	status: PayoutStatus,
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the transaction was created in a testing environment.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		examples: [null],
		description: 'Transaction proof URL.',
	}),
	amount: t.Integer({
		examples: [1000],
		description: 'Payout value in cents.',
	}),
	platformFee: t.Integer({
		examples: [80],
		description: 'Platform fee in cents.',
	}),
	externalId: t.String({
		examples: ['order_9876543210fedcba'],
		description: 'External transaction identifier.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'Transaction creation date.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-02T12:00:00Z'],
		description: 'Transaction update date.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export type APIPayout = Static<typeof APIPayout>;
