import { type Static, type TAnySchema, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../utils';
import {
	APICustomer,
	APIProduct,
	APIWithdraw,
	PaymentFrequency,
	PaymentMethod,
} from '.';

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEventType = StringEnum(
	['withdraw.failed', 'withdraw.done', 'billing.paid'],
	'Webhook event type.',
);

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
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export const WebhookWithdrawFailedEvent = BaseWebhookEvent(
	'withdraw.failed',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIWithdraw, ['status']),
				t.Object({
					status: t.Literal('CANCELLED', {
						description: 'Status of the withdraw. Always `CANCELLED`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

export type WebhookWithdrawFailedEvent = Static<
	typeof WebhookWithdrawFailedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export const WebhookWithdrawDoneEvent = BaseWebhookEvent(
	'withdraw.done',
	t.Object({
		transaction: t.Intersect(
			[
				t.Omit(APIWithdraw, ['status']),
				t.Object({
					status: t.Literal('COMPLETE', {
						description: 'Status of the withdraw. Always `COMPLETE`.',
					}),
				}),
			],
			{
				description: 'Transaction data.',
			},
		),
	}),
);

export type WebhookWithdrawDoneEvent = Static<typeof WebhookWithdrawDoneEvent>;

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
						status: t.Literal('PAID', {
							description: 'Status of the payment. Always `PAID`.',
						}),
						couponsUsed: t.Array(t.String(), {
							description: 'Counpons used in the billing.',
						}),
						customer: APICustomer,
						frequency: PaymentFrequency,
						kind: t.Array(PaymentMethod, {
							description: 'Payment methods.',
						}),
						paidAmount: t.Integer({
							description: 'Charge amount in cents.',
						}),
						products: t.Intersect(
							[
								t.Pick(APIProduct, ['quantity', 'externalId']),
								t.Object({
									id: t.String(),
								}),
							],
							{
								description: 'Products used in the billing.',
							},
						),
					}),
				}),
			]),
		]),
	}),
);

export type WebhookBillingPaidEvent = Static<typeof WebhookBillingPaidEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export const WebhookEvent = t.Union([
	WebhookWithdrawDoneEvent,
	WebhookBillingPaidEvent,
	WebhookWithdrawFailedEvent,
]);

export type WebhookEvent = Static<typeof WebhookEvent>;
