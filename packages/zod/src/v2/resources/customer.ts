import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = z.object({
	id: z.string().describe('Unique customer identifier.'),
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the client was created in a testing environment.',
		),
	country: z.string().describe('Customer country.'),
	name: z.string().describe("Customer's full name."),
	email: z.email().describe("Customer's email"),
	taxId: z.string().describe("Customer's CPF or CNPJ."),
	cellphone: z.string().describe("Customer's cell phone."),
	zipCode: z.string().describe('Customer zip code.'),
	metadata: z
		.record(z.string(), z.any())
		.describe('Additional customer metadata.')
		.optional(),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = z.infer<typeof APICustomer>;
