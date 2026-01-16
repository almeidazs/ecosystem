import { z } from 'zod';
import { createListResponseSchema, createResponseSchema } from '../response';

export const CreatePayoutSchema = z.object({
	amount: z.number(),
	externalId: z.string(),
	description: z.string().optional(),
});

export const PayoutNotFoundSchema = z.object({
	data: z.object({}).nullable(),
	error: z.string(),
});

export const PayoutSchema = z.object({
	id: z.string(),
	status: z.string(),
	devMode: z.boolean(),
	receiptUrl: z.url().nullable(),
	kind: z.string().optional(),
	amount: z.number(),
	platformFee: z.number(),
	externalId: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const PayoutResponseSchema = createResponseSchema(PayoutSchema);

export const ListPayoutResponseSchema = createListResponseSchema(PayoutSchema);

export type PayoutResponse = z.infer<typeof PayoutResponseSchema>;
export type ListPayoutResponse = z.infer<typeof ListPayoutResponseSchema>;