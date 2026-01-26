import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export const APIStore = z.object({
	id: z.string({
		description: 'Unique identifier for your store on AbacatePay.',
	}),
	name: z.string({
		description: 'Name of your store/company.',
	}),
	balance: z.object(
		{
			available: z
				.number({
					description: 'Balance available for withdrawal in cents.',
				})
				.int(),
			pending: z
				.number({
					description: 'Balance pending confirmation in cents.',
				})
				.int(),
			blocket: z
				.number({
					description: 'Balance blocked in disputes in cents.',
				})
				.int(),
		},
		{
			description: 'Object containing information about your account balances.',
		},
	),
});

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export type APIStore = z.infer<typeof APIStore>;
