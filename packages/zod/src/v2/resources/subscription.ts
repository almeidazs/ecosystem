import { z } from 'zod';
import { StringEnum } from '../../utils';
import { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscriptionEvent = z.object({
	event: z.string().describe('Event type.'),
	description: z.string().describe('Event description.'),
	createdAt: z.coerce.date().describe('Event cretion date.'),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscriptionEvent = z.infer<typeof APISubscriptionEvent>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#atributos
 */
export const SubscriptionStatus = StringEnum(
	['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
	'Subscription status.',
);

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#atributos
 */
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export const APISubscription = z.object({
	id: z.string().describe('The ID of the subscription.'),
	amount: z.int().describe('The subscription value in cents.'),
	currency: z.string().describe('Subscription currency.'),
	name: z.string().describe('Subscription name.'),
	description: z.string().describe('Subscription description.'),
	externalId: z
		.string()
		.describe('Unique identifier of the subscription on your system.'),
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the signature was created in a testing environment.',
		),
	createdAt: z.coerce.date().describe('Subscription creation date.'),
	updatedAt: z.coerce.date().describe('Subscription update date.'),
	method: PaymentMethod,
	status: SubscriptionStatus,
	frequency: z
		.object({
			cycle: StringEnum(
				['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY'],
				'Subscription billing cycle.',
			),
		})
		.describe('Billing frequency configuration.'),
	dayOfProcessing: z
		.int()
		.min(1)
		.max(31)
		.describe('Day of the month the charge will be processed (1-31).'),
	customerId: z
		.string()
		.describe('Identifier of the customer who will have the signature.'),
	retryPolicy: z
		.object({
			maxRetry: z.int().describe('Maximum number of billing attempts.'),
			retryEvery: z
				.int()
				.describe('Interval in days between charging attempts.'),
		})
		.describe('Retry policy in case of payment failure.'),
	events: z
		.array(APISubscriptionEvent)
		.describe('Array of events related to the subscription.'),
});

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export type APISubscription = z.infer<typeof APISubscription>;
