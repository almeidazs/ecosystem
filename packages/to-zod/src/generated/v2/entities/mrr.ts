import { z } from 'zod';
import { createResponseSchema } from '../response';

export const MerchantInfoDataSchema = z.object({
	name: z.string(),
	website: z.url(),
	createdAt: z.coerce.date(),
});

export const MerchantInfoResponseSchema = createResponseSchema(
	MerchantInfoDataSchema,
);

export const MrrDataSchema = z.object({
	mrr: z.number(),
	totalActiveSubscriptions: z.number(),
});

export const MrrResponseSchema = createResponseSchema(MrrDataSchema);

export const RevenueDataSchema = z.object({
	totalRevenue: z.number(),
	totalTransactions: z.number(),
	transactionsPerDay: z.record(
		z.string(),
		z.object({
			amount: z.number(),
			count: z.number(),
		}),
	),
});

export const RevenueResponseSchema = createResponseSchema(RevenueDataSchema);