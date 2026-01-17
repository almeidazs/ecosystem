import { Type as t } from '@sinclair/typebox';

/**
 * https://docs.abacatepay.com/pages/store/reference#estrutura
 */
export const APIStore = t.Object({
	id: t.String({
		description: 'Unique identifier for your store on AbacatePay.',
	}),
	name: t.String({
		examples: ['Minha Loja Online'],
		description: 'Name of your store/company.',
	}),
	balance: t.Object(
		{
			available: t.Integer({
				description: 'Balance available for withdrawal in cents.',
			}),
			pending: t.Integer({
				description: 'Balance pending confirmation in cents.',
			}),
			blocket: t.Integer({
				description: 'Balance blocked in disputes in cents.',
			}),
		},
		{
			description: 'Object containing information about your account balances.',
		},
	),
});
