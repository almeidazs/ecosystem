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
		id: z.string().describe('Unique identifier for the webhook.'),
		event: z
			.literal([type])
			.describe('This field identifies the type of event received.'),
		devMode: z
			.boolean()
			.describe(
				'Indicates whether the event occurred in the development environment.',
			),
	});

/**
 * https://docs.abacatepay.com/pages/webhooks#withdraw-failed
 */
export const WebhookWithdrawFailedEvent = BaseWebhookEvent(
	'withdraw.failed',
	z.object({
		transaction: z
			.intersection(
				APIWithdraw.omit({ status: true }),
				z.object({
					status: z
						.literal(['CANCELLED'])
						.describe('Status of the withdraw. Always `CANCELLED`.'),
				}),
			)
			.describe('Transaction data.'),
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
		transaction: z
			.intersection(
				APIWithdraw.omit({ status: true }),
				z.object({
					status: z
						.literal(['COMPLETE'])
						.describe('Status of the withdraw. Always `COMPLETE`.'),
				}),
			)
			.describe('Transaction data.'),
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
			z
				.object({
					payment: z.object({
						amount: z
							.number()
							.int()
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
						fee: z.number().int().describe('The fee charged by AbacatePay.'),
						method: PaymentMethod,
					}),
				})
				.describe('Payment data.'),
			z.union([
				z.object({
					pixQrCode: z.object({
						amount: z
							.number()
							.int()
							.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
						id: z.string().describe('Unique billing identifier.'),
						kind: z.literal(['PIX']).describe('Kind of the payment'),
						status: z
							.literal(['PAID'])
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
						status: z
							.literal(['PAID'])
							.describe('Status of the payment. Always `PAID`.'),
						couponsUsed: z
							.array(z.string())
							.describe('Counpons used in the billing.'),
					}),
					customer: APICustomer,
					frequency: PaymentFrequency,
					kind: z.array(PaymentMethod).describe('Payment methods.'),
					paidAmount: z.number().int().describe('Charge amount in cents.'),
					products: z
						.intersection(
							APIProduct.pick({ quantity: true, externalId: true }),
							z.object({
								id: z.string(),
							}),
						)
						.describe('Products used in the billing.'),
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
