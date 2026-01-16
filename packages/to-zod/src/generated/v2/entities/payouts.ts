import { z } from 'zod';

export const CreatePayoutSchema = z.object({
	amount: z.number(),
	externalId: z.string(),
	description: z.string().optional(),
});

export const PayoutNotFoundSchema = z.object({
	data: z.object().nullable(),
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

export const PayoutResponseSchema = z.object({
	data: PayoutSchema,
	error: z.null(),
});

export const ListPayoutResponseSchema = z.object({
	data: z.array(PayoutSchema),
	pagination: z.object({
		page: z.number(),
		limit: z.number(),
		total: z.number(),
		totalPages: z.number(),
	}),
	error: z.null(),
});

export type PayoutResponse = z.infer<typeof PayoutResponseSchema>;
export type ListPayoutResponse = z.infer<typeof ListPayoutResponseSchema>;
