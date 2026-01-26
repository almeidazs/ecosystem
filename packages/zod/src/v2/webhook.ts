import { type _ZodType, z } from 'zod';
import { StringEnum } from '../utils';
import { APIPayout, PaymentMethod } from '.';

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEventType = StringEnum(
	['payout.failed', 'payout.done', 'billing.paid'],
	'Webhook event type.',
);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	schema: Schema,
) =>
	z.object({
		data: schema,
		id: z.string().describe('Unique identifier for the webhook.'),
		event: z
			.literal(type)
			.describe('This field identifies the type of event received.'),
		devMode: z
			.boolean()
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export const WebhookPayoutFailedEvent = BaseWebhookEvent(
	'payout.failed',
	z.object({
		transaction: APIPayout.omit({ status: true })
			.extend({
				status: z
					.literal('CANCELLED')
					.describe('Status of the payout. Always `CANCELLED`.'),
			})
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = z.infer<typeof WebhookPayoutFailedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-done
 */
export const WebhookPayoutDoneEvent = BaseWebhookEvent(
	'payout.done',
	z.object({
		transaction: APIPayout.omit({ status: true })
			.extend({
				status: z
					.literal('COMPLETE')
					.describe('Status of the payout. Always `COMPLETE`.'),
			})
			.describe('Transaction data.'),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-done
 */
export type WebhookPayoutDoneEvent = z.infer<typeof WebhookPayoutDoneEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export const WebhookBillingPaidEvent = BaseWebhookEvent(
	'billing.paid',
	z.object({
		payment: z
			.object({
				payment: z
					.object({
						amount: z
							.number()
							.int()
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
						fee: z.number().int().describe('The fee charged by AbacatePay.'),
						method: PaymentMethod,
					})
					.describe('Payment data.'),
			})
			.and(
				z.union([
					z.object({
						pixQrCode: z.object({
							amount: z
								.number()
								.int()
								.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
							id: z.string().describe('Unique billing identifier.'),
							kind: z.literal('PIX').describe('Kind of the payment'),
							status: z
								.literal('PAID')
								.describe('Billing status, can only be `PAID` here'),
						}),
					}),
					z.object({
						billing: z.object({
							amount: z
								.number()
								.int()
								.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
							id: z.string().describe('Unique billing identifier.'),
							externalId: z.string().describe('Bill ID in your system.'),
							status: z
								.literal('PAID')
								.describe('Status of the payment. Always `PAID`.'),
							url: z
								.url()
								.describe('URL where the user can complete the payment.'),
						}),
					}),
				]),
			),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export type WebhookBillingPaidEvent = z.infer<typeof WebhookBillingPaidEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = z.discriminatedUnion('event', [
	WebhookPayoutDoneEvent,
	WebhookBillingPaidEvent,
	WebhookPayoutFailedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;
