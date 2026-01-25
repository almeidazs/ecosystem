import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

export const ProductStatus = StringEnum(['ACTIVE', 'INACTIVE'], {
	description: 'Product status.',
});

export type ProductStatus = Static<typeof ProductStatus>;

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export const APIProduct = t.Object({
	id: t.String({
		examples: ['prod_abc123xyz'],
		description: 'The ID of your product.',
	}),
	externalId: t.String({
		examples: ['my-product-001'],
		description: 'Unique product identifier in your system.',
	}),
	name: t.String({
		examples: ['Fitness'],
		description: 'Product name.',
	}),
	price: t.Integer({
		examples: [1999],
		description: 'Product price in cents.',
	}),
	currency: t.String({
		examples: ['BRL'],
		description: 'Product currency.',
	}),
	status: ProductStatus,
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the product was created in a testing environment.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-15T08:00:00Z'],
		description: 'Product creation date.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-20T10:30:00Z'],
		description: 'Product update date.',
	}),
	description: t.Union([t.Null(), t.String()], {
		description: 'Product description.',
		examples: ['Fitness program.'],
	}),
});

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export type APIProduct = Static<typeof APIProduct>;
