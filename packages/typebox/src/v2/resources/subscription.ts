import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';
import { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscriptionEvent = t.Object({
	event: t.String({
		examples: ['CREATED'],
		description: 'Event type.',
	}),
	description: t.String({
		examples: ['Subscription was created.'],
		description: 'Event description.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Event creation date.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscriptionEvent = Static<typeof APISubscriptionEvent>;

export const SubscriptionStatus = StringEnum(
	['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
	{ examples: ['ACTIVE'], description: 'Subscription status.' },
);

export type SubscriptionStatus = Static<typeof SubscriptionStatus>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscription = t.Object({
	id: t.String({
		examples: ['subs_abc123xyz'],
		description: 'The ID of the subscription.',
	}),
	amount: t.Integer({
		examples: [5000],
		description: 'The subscription value in cents.',
	}),
	currency: t.String({
		examples: ['USD'],
		description: 'Subscription currency.',
	}),
	name: t.String({
		examples: ['Premium Plan'],
		description: 'Subscription name.',
	}),
	description: t.String({
		examples: ['Access to all premium features.'],
		description: 'Subscription description.',
	}),
	externalId: t.String({
		examples: ['subscr_internal_123'],
		description: 'Unique identifier of the subscription on your system.',
	}),
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the signature was created in a testing environment.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T00:00:00Z'],
		description: 'Subscription creation date.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-15T00:00:00Z'],
		description: 'Subscription update date.',
	}),
	method: PaymentMethod,
	status: SubscriptionStatus,
	frequency: t.Object(
		{
			cycle: StringEnum(['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY'], {
				examples: ['MONTHLY'],
				description: 'Subscription billing cycle.',
			}),
			dayOfProcessing: t.Integer({
				minimum: 1,
				maximum: 31,
				examples: [15],
				description: 'Day of the month the charge will be processed (1-31).',
			}),
		},
		{
			description: 'Billing frequency configuration.',
		},
	),
	customerId: t.String({
		examples: ['cust_abc123xyz'],
		description: 'Identifier of the customer who will have the signature.',
	}),
	retryPolicy: t.Object(
		{
			maxRetry: t.Integer({
				examples: [3],
				description: 'Maximum number of billing attempts.',
			}),
			retryEvery: t.Integer({
				examples: [5],
				description: 'Interval in days between charging attempts.',
			}),
		},
		{
			description: 'Retry policy in case of payment failure.',
		},
	),
	events: t.Array(APISubscriptionEvent, {
		description: 'Array of events related to the subscription.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscription = Static<typeof APISubscription>;
