import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../utils';
import { APIPayout, PaymentMethod } from '.';

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEventType = StringEnum(
	['payout.failed', 'payout.done', 'billing.paid'],
	{ examples: ['payout.failed'], description: 'Webhook event type.' },
);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEventType = Static<typeof WebhookEventType>;

export const BaseWebhookEvent = <
	Type extends Static<typeof WebhookEventType>,
	Schema extends TAnySchema,
>(
	type: Type,
	schema: Schema,
) =>
	t.Object({
		data: schema,
		id: t.String({
			examples: ['log_1234567890abcdef'],
			description: 'Unique identifier for the webhook.',
		}),
		event: t.Literal(type, {
			examples: [type],
			description: 'This field identifies the type of event received.',
		}),
		devMode: t.Boolean({
			examples: [false],
			description:
				'Indicates whether the event occurred in the development environment.',
		}),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export const WebhookPayoutFailedEvent = BaseWebhookEvent(
	'payout.failed',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIPayout, ['status']),
				t.Object({
					status: t.Literal('CANCELLED', {
						examples: ['CANCELLED'],
						description: 'Status of the payout. Always `CANCELLED`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = Static<typeof WebhookPayoutFailedEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-done
 */
export const WebhookPayoutDoneEvent = BaseWebhookEvent(
	'payout.done',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIPayout, ['status']),
				t.Object({
					status: t.Literal('COMPLETE', {
						examples: ['COMPLETE'],
						description: 'Status of the payout. Always `COMPLETE`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-done
 */
export type WebhookPayoutDoneEvent = Static<typeof WebhookPayoutDoneEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export const WebhookBillingPaidEvent = BaseWebhookEvent(
	'billing.paid',
	t.Object({
		payment: t.Intersect([
			t.Object(
				{
					payment: t.Object({
						amount: t.Integer({
							examples: [4000],
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						fee: t.Integer({
							examples: [200],
							description: 'The fee charged by AbacatePay.',
						}),
						method: PaymentMethod,
					}),
				},
				{
					description: 'Payment data.',
				},
			),
			t.Union([
				t.Object({
					pixQrCode: t.Object({
						amount: t.Integer({
							examples: [4000],
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						id: t.String({
							examples: ['bill_1234567890abcdef'],
							description: 'Unique billing identifier.',
						}),
						kind: t.Literal('PIX', {
							examples: ['PIX'],
							description: 'Kind of the payment',
						}),
						status: t.Literal('PAID', {
							examples: ['PAID'],
							description: 'Billing status, can only be `PAID` here',
						}),
					}),
				}),
				t.Object({
					billing: t.Object({
						amount: t.Integer({
							examples: [4000],
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						id: t.String({
							examples: ['bill_1234567890abcdef'],
							description: 'Unique billing identifier.',
						}),
						externalId: t.String({
							examples: ['my-invoice-0001'],
							description: 'Bill ID in your system.',
						}),
						status: t.Literal('PAID', {
							examples: ['PAID'],
							description: 'Status of the payment. Always `PAID`.',
						}),
						url: t.String({
							format: 'uri',
							examples: ['https://abacatepay.com/pay/bill_1234567890abcdef'],
							description: 'URL where the user can complete the payment.',
						}),
					}),
				}),
			]),
		]),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export type WebhookBillingPaidEvent = Static<typeof WebhookBillingPaidEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = t.Union([
	WebhookPayoutDoneEvent,
	WebhookBillingPaidEvent,
	WebhookPayoutFailedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = Static<typeof WebhookEvent>;
