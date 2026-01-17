import { Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';
import { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscriptionEvent = t.Object({
	event: t.String({
		description: 'Event type.',
	}),
	description: t.String({
		description: 'Event description.',
	}),
	createdAt: t.Date({
		description: 'Event cretion date.',
	}),
});

export const SubscriptionStatus = StringEnum(
	['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
	'Subscription status.',
);

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscription = t.Object({
	id: t.String({
		description: 'The ID of the subscription.',
	}),
	amount: t.Integer({
		description: 'The subscription value in cents.',
	}),
	currency: t.String({
		description: 'Subscription currency.',
	}),
	name: t.String({
		description: 'Subscription name.',
	}),
	description: t.String({
		description: 'Subscription description.',
	}),
	externalId: t.String({
		description: 'Unique identifier of the subscription on your system.',
	}),
	devMode: t.Boolean({
		description:
			'Indicates whether the signature was created in a testing environment.',
	}),
	createdAt: t.Date({
		description: 'Subscription creation date.',
	}),
	updatedAt: t.Date({
		description: 'Subscription update date.',
	}),
	method: PaymentMethod,
	status: SubscriptionStatus,
	frequency: t.Object(
		{
			cycle: StringEnum(
				['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY'],
				'Subscription billing cycle.',
			),
		},
		{
			description: 'Billing frequency configuration.',
		},
	),
	dayOfProcessing: t.Integer({
		minimum: 1,
		maximum: 31,
		description: 'Day of the month the charge will be processed (1-31).',
	}),
	customerId: t.String({
		description: 'Identifier of the customer who will have the signature.',
	}),
	retryPolicy: t.Object(
		{
			maxRetry: t.Integer({
				description: 'Maximum number of billing attempts.',
			}),
			retryEvery: t.Integer({
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
