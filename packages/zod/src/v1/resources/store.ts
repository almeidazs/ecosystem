import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export const APIStore = z.object({
	id: z.string().describe('Unique identifier for your store on AbacatePay.'),
	name: z.string().describe('Name of your store/company.'),
	balance: z
		.object({
			available: z.int().describe('Balance available for withdrawal in cents.'),
			pending: z.int().describe('Balance pending confirmation in cents.'),
			blocked: z.int().describe('Balance blocked in disputes in cents.'),
		})
		.describe('Object containing information about your account balances.'),
});

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export type APIStore = z.infer<typeof APIStore>;
