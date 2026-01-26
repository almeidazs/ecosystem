import { z } from 'zod';
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

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends z.ZodTypeAny,
>(
	type: Type,
	schema: Schema,
) =>
	z.object({
		data: schema,
		id: z.string({
			description: 'Unique identifier for the webhook.',
		}),
		event: z.literal(type, {
			description: 'This field identifies the type of event received.',
		}),
		devMode: z.boolean({
			description:
				'Indicates whether the event occurred in the development environment.',
		}),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export const WebhookWithdrawFailedEvent = BaseWebhookEvent(
	'withdraw.failed',
	z.object({
		transaction: z.intersection(
			APIWithdraw.omit({ status: true }),
			z.object({
				status: z.literal('CANCELLED', {
					description: 'Status of the withdraw. Always `CANCELLED`.',
				}),
			}),
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export type WebhookWithdrawFailedEvent = z.infer<
	typeof WebhookWithdrawFailedEvent
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export const WebhookWithdrawDoneEvent = BaseWebhookEvent(
	'withdraw.done',
	z.object({
		transaction: z.intersection(
			APIWithdraw.omit({ status: true }),
			z.object({
				status: z.literal('COMPLETE', {
					description: 'Status of the withdraw. Always `COMPLETE`.',
				}),
			}),
			{
				description: 'Transaction data.',
			},
		),
	}),
);

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-done
 */
export type WebhookWithdrawDoneEvent = z.infer<typeof WebhookWithdrawDoneEvent>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export const WebhookBillingPaidEvent = BaseWebhookEvent(
	'billing.paid',
	z.object({
		payment: z.intersection(
			z.object(
				{
					payment: z.object({
						amount: z
							.number({
								description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
							})
							.int(),
						fee: z
							.number({
								description: 'The fee charged by AbacatePay.',
							})
							.int(),
						method: PaymentMethod,
					}),
				},
				{
					description: 'Payment data.',
				},
			),
			z.union([
				z.object({
					pixQrCode: z.object({
						amount: z
							.number({
								description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
							})
							.int(),
						id: z.string({
							description: 'Unique billing identifier.',
						}),
						kind: z.literal('PIX', {
							description: 'Kind of the payment',
						}),
						status: z.literal('PAID', {
							description: 'Billing status, can only be `PAID` here',
						}),
					}),
				}),
				z.object({
					billing: z.object({
						amount: z
							.number({
								description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
							})
							.int(),
						id: z.string({
							description: 'Unique billing identifier.',
						}),
						status: z.literal('PAID', {
							description: 'Status of the payment. Always `PAID`.',
						}),
						couponsUsed: z.array(z.string(), {
							description: 'Counpons used in the billing.',
						}),
						customer: APICustomer,
						frequency: PaymentFrequency,
						kind: z.array(PaymentMethod, {
							description: 'Payment methods.',
						}),
						paidAmount: z
							.number({
								description: 'Charge amount in cents.',
							})
							.int(),
						products: z.intersection(
							APIProduct.pick({ quantity: true, externalId: true }),
							z.object({
								id: z.string(),
							}),
							{
								description: 'Products used in the billing.',
							},
						),
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
export const WebhookEvent = z.union([
	WebhookWithdrawDoneEvent,
	WebhookBillingPaidEvent,
	WebhookWithdrawFailedEvent,
]);

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;
