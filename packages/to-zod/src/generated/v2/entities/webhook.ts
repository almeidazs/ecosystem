import { z } from 'zod';

export const BillingPaidEventSchema = z.object({
	id: z.string(),
	devMode: z.boolean(),
	event: z.literal('billing.paid'),
	data: z.object({
		payment: z.object({
			amount: z.number(),
			fee: z.number(),
			method: z.string(),
		}),
		billing: z.object({
			id: z.string(),
			externalId: z.string(),
			url: z.url(),
			amount: z.number(),
			status: z.string(),
		}),
	}),
});

export type BillingPaidEvent = z.infer<typeof BillingPaidEventSchema>;

const WebhookTransactionSchema = z.object({
	id: z.string(),
	status: z.string(),
	devMode: z.boolean(),
	receiptUrl: z.url(),
	kind: z.string(),
	amount: z.number(),
	platformFee: z.number(),
	externalId: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const PayoutDoneEventSchema = z.object({
	id: z.string(),
	devMode: z.boolean(),
	event: z.literal('payout.done'),
	data: z.object({
		transaction: WebhookTransactionSchema,
	}),
});

export type PayoutDoneEvent = z.infer<typeof PayoutDoneEventSchema>;

export const PayoutFailedEventSchema = z.object({
	id: z.string(),
	devMode: z.boolean(),
	event: z.literal('payout.failed'),
	data: z.object({
		transaction: WebhookTransactionSchema,
	}),
});

export type PayoutFailedEvent = z.infer<typeof PayoutFailedEventSchema>;

export const WebhookEventSchema = z.discriminatedUnion('event', [
	BillingPaidEventSchema,
	PayoutDoneEventSchema,
	PayoutFailedEventSchema,
]);

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;