import { type Static, Type as t } from '@sinclair/typebox';

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export const APIStore = t.Object({
	id: t.String({
		examples: ['store_123abc456def789ghi0jkl'],
		description: 'Unique identifier for your store on AbacatePay.',
	}),
	name: t.String({
		examples: ['Minha Loja Online'],
		description: 'Name of your store/company.',
	}),
	balance: t.Object(
		{
			available: t.Integer({
				examples: [150000],
				description: 'Balance available for withdrawal in cents.',
			}),
			pending: t.Integer({
				examples: [5000],
				description: 'Balance pending confirmation in cents.',
			}),
			blocked: t.Integer({
				examples: [0],
				description: 'Balance blocked in disputes in cents.',
			}),
		},
		{
			description: 'Object containing information about your account balances.',
		},
	),
});

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export type APIStore = Static<typeof APIStore>;
