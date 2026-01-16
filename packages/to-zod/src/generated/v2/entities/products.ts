import { z } from 'zod';
import { createListResponseSchema, createResponseSchema } from '../response';

/**
 * Product data schema (Response)
 */
export const ProductSchema = z.object({
	id: z.string(),
	externalId: z.string(),
	name: z.string(),
	price: z.number(),
	currency: z.string(),
	status: z.string(),
	devMode: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	description: z.string().nullable(),
});

export type Product = z.infer<typeof ProductSchema>;

/**
 * Product creation schema
 */
export const CreateProductSchema = z.object({
	externalId: z.string().min(1, 'External ID is required'),
	name: z.string().min(1, 'Product name is required'),
	price: z.number().int().min(0, 'Price must be non-negative'),
	description: z.string().optional(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const ProductResponseSchema = createResponseSchema(ProductSchema);
export const ListProductResponseSchema = createListResponseSchema(ProductSchema);

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ListProductResponse = z.infer<typeof ListProductResponseSchema>;
