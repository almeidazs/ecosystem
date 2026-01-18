import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

export const ProductStatus = StringEnum(
	['ACTIVE', 'INACTIVE'],
	'Product status.',
);

export type ProductStatus = Static<typeof ProductStatus>;

/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export const APIProduct = t.Object({
	id: t.String({
		description: 'The ID of your product.',
	}),
	externalId: t.String({
		description: 'Unique product identifier in your system.',
	}),
	name: t.String({
		description: 'Product name.',
	}),
	price: t.Integer({
		description: 'Product price in cents.',
	}),
	currency: t.String({
		description: 'Product currency.',
	}),
	status: ProductStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the product was created in a testing environment.',
	}),
	createdAt: t.Date({
		description: 'Product creation date.',
	}),
	updatedAt: t.Date({
		description: 'Product update date.',
	}),
	description: t.Union([t.Null(), t.String()], {
		description: 'Product description.',
	}),
});

export type APIProduct = Static<typeof APIProduct>;
