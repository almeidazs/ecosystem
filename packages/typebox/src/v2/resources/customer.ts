import { type Static, Type as t } from '@sinclair/typebox';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = t.Object({
	id: t.String({
		examples: ['cust_aebxkhDZNaMmJeKsy0AHS0FQ'],
		description: 'Unique customer identifier.',
	}),
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the client was created in a testing environment.',
	}),
	country: t.String({
		examples: ['BR'],
		description: 'Customer country.',
	}),
	name: t.String({
		examples: ['Daniel Lima'],
		description: "Customer's full name.",
	}),
	email: t.String({
		format: 'email',
		examples: ['daniel_lima@abacatepay.com'],
		description: "Customer's email",
	}),
	taxId: t.String({
		examples: ['123.456.789-09'],
		description: "Customer's CPF or CNPJ.",
	}),
	cellphone: t.String({
		examples: ['(11) 4002-8922'],
		description: "Customer's cell phone.",
	}),
	zipCode: t.String({
		examples: ['01310-100'],
		description: 'Customer zip code.',
	}),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			examples: [
				{
					source: 'newsletter',
				},
			],
			description: 'Additional customer metadata.',
		}),
	),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = Static<typeof APICustomer>;
