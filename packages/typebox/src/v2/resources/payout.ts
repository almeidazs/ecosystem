import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export const PayoutStatus = StringEnum(
	['PENDING', 'EXPIRED', 'CANCELLED', 'COMPLETE', 'REFUNDED'],
	'Transaction status.',
);

export type PayoutStatus = Static<typeof PayoutStatus>;

/**
 * https://docs.abacatepay.com/pages/payouts/reference
 */
export const APIPayout = t.Object({
	id: t.String({
		description: 'Unique transaction identifier.',
	}),
	status: PayoutStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the transaction was created in a testing environment.',
	}),
	receiptUrl: t.Union([t.Null(), t.String({ format: 'uri' })], {
		description: 'Transaction proof URL.',
	}),
	amount: t.Integer({
		description: 'Payout value in cents.',
	}),
	platformFee: t.Integer({
		description: 'Platform fee in cents.',
	}),
	externalId: t.String({
		description: 'External transaction identifier.',
	}),
	createdAt: t.Date({
		description: 'Transaction creation date.',
	}),
	updatedAt: t.Date({
		description: 'Transaction update date.',
	}),
});

export type APIPayout = Static<typeof APIPayout>;
