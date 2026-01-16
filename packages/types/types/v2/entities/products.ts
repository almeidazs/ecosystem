/**
 * https://docs.abacatepay.com/pages/products/reference#estrutura
 */
export interface APIProduct {
	/**
	 * The ID of your product.
	 */
	id: string;
	/**
	 * Unique product identifier in your system.
	 */
	externalId: string;
	/**
	 * Product name.
	 */
	name: string;
	/**
	 * Product price in cents.
	 */
	price: number;
	/**
	 * Product currency.
	 */
	// TODO: Review this
	currency: string;
	/**
	 * Product status
	 */
	status: ProductStatus;
	/**
	 * Indicates whether the product was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Product creation date.
	 */
	createdAt: string;
	/**
	 * Product update date.
	 */
	updatedAt: string;
	/**
	 * Product description.
	 */
	description: string | null;
}

export enum ProductStatus {
	Active = 'ACTIVE',
	Inactive = 'INACTIVE',
}
