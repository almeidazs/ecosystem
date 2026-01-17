import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../utils';
import { APIPayout, PaymentMethod } from '.';

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEventType = StringEnum(
	['payout.failed', 'payout.done', 'billing.paid'],
	'Webhook event type.',
);

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
			description: 'Unique identifier for the webhook.',
		}),
		event: t.Literal(type, {
			description: 'This field identifies the type of event received.',
		}),
		devMode: t.Boolean({
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
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						fee: t.Integer({
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
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						id: t.String({
							description: 'Unique billing identifier.',
						}),
						kind: t.Literal('PIX', {
							description: 'Kind of the payment',
						}),
						status: t.Literal('PAID', {
							description: 'Billing status, can only be `PAID` here',
						}),
					}),
				}),
				t.Object({
					billing: t.Object({
						amount: t.Integer({
							description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
						}),
						id: t.String({
							description: 'Unique billing identifier.',
						}),
						externalId: t.String({
							description: 'Bill ID in your system.',
						}),
						status: t.Literal('PAID', {
							description: 'Status of the payment. Always `PAID`.',
						}),
						url: t.String({
							format: 'uri',
							description: 'URL where the user can complete the payment.',
						}),
					}),
				}),
			]),
		]),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = t.Union([
	WebhookPayoutDoneEvent,
	WebhookBillingPaidEvent,
	WebhookPayoutFailedEvent,
]);
