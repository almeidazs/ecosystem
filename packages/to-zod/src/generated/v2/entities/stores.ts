import { z } from 'zod';
import { createResponseSchema } from '../response';

const balanceSchema = z.object({
	available: z.number(),
	pending: z.number(),
	blocked: z.number(),
});

export const StoreDataSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Store name is required'),
	balance: balanceSchema,
});

export const StoreResponseSchema = createResponseSchema(StoreDataSchema);

export const StoreErrorSchema = z.object({
	error: z.string(),
	data: z.null(),
});