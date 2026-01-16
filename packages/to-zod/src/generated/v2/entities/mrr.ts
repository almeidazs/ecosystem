import { z } from 'zod';

export const MerchantInfoResponseSchema = z.object({
	data: z.object({
		name: z.string(),
		website: z.url(),
		createdAt: z.coerce.date(),
	}),
});

export const MrrResponseSchema = z.object({
	data: z.object({
		mrr: z.number(),
		totalActiveSubscriptions: z.number(),
		error: z.null(),
	}),
});

export const RevenueResponseSchema = z.object({
	data: z.object({
		totalRevenue: z.number(),
		totalTransactions: z.number(),
		transactionsPerDay: z.record(
			z.string(),
			z.object({
				amount: z.number(),
				count: z.number(),
			}),
		),
	}),
	error: z.null(),
});
