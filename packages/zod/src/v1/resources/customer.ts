import { z } from 'zod';

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export const APICustomer = z.object({
	id: z.string({
		description: 'Unique customer identifier.',
	}),
	metadata: z.object({
		name: z.string({
			description: "Customer's full name.",
		}),
		email: z
			.string({
				description: "Customer's email",
			})
			.email(),
		taxId: z.string({
			description: "Customer's CPF or CNPJ.",
		}),
		cellphone: z.string({
			description: "Customer's cell phone.",
		}),
	}),
});

/**
 * https://docs.abacatepay.com/pages/client/reference#estrutura
 */
export type APICustomer = z.infer<typeof APICustomer>;
