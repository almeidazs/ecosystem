import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export const ProductStatus = StringEnum(
	['ACTIVE', 'INACTIVE'],
	'Product status.',
);

/**
 * https://docs.abacatepay.com/pages/products/reference#atributos
 */
export type ProductStatus = z.infer<typeof ProductStatus>;

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export const APIProduct = z.object({
	id: z.string().describe('The ID of your product.'),
	externalId: z.string().describe('Unique product identifier in your system.'),
	name: z.string().describe('Product name.'),
	price: z.int().describe('Product price in cents.'),
	currency: z.string().describe('Product currency.'),
	status: ProductStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the product was created in a testing environment.',
		),
	createdAt: z.coerce.date().describe('Product creation date.'),
	updatedAt: z.coerce.date().describe('Product update date.'),
	description: z.union([z.null(), z.string()]).describe('Product description.'),
});

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export type APIProduct = z.infer<typeof APIProduct>;
