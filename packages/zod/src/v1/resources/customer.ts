import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = z.object({
	id: z.string().describe('Unique customer identifier.'),
	metadata: z.object({
		name: z.string().describe("Customer's full name."),
		email: z.email().describe("Customer's email"),
		taxId: z.string().describe("Customer's CPF or CNPJ."),
		cellphone: z.string().describe("Customer's cell phone."),
	}),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = z.infer<typeof APICustomer>;
