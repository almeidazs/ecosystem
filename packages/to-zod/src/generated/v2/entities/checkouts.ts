import { z } from 'zod';

export const CheckoutItemSchema = z.object({
	id: z.string().min(1, 'Product ID is required'),
	quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export type CheckoutItem = z.infer<typeof CheckoutItemSchema>;

export const CheckoutCustomerSchema = z.object({
	name: z.string().min(1, 'Customer name is required'),
	cellphone: z.string().min(1, 'Cellphone is required'),
	email: z.email('Invalid email address'),
	taxId: z.string().min(1, 'Tax ID is required'),
});

export type CheckoutCustomer = z.infer<typeof CheckoutCustomerSchema>;

export const CreateCheckoutSchema = z.object({
	items: z.array(CheckoutItemSchema).min(1, 'At least one item is required'),
	method: z.enum(['PIX', 'CARD']).optional(),
	returnUrl: z.url().optional(),
	completionUrl: z.url().optional(),
	customerId: z.string().optional(),
	customer: CheckoutCustomerSchema.optional(),
	coupons: z.array(z.string()).optional(),
});

export type CreateCheckout = z.infer<typeof CreateCheckoutSchema>;

export const CheckoutSchema = z.object({
	id: z.string(),
	url: z.url(),
	amount: z.number(),
	status: z.string(),
	devMode: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Checkout = z.infer<typeof CheckoutSchema>;
