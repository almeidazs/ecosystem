import { z } from 'zod';

const balanceSchema = z.object({
	available: z.number(),
	pending: z.number(),
	blocked: z.number(),
});

export const StoreResponseSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Store name is required'),
	balance: balanceSchema,
	error: z.null(),
});

export const StoreErrorSchema = z.object({
	error: z.string(),
	data: z.null(),
});
