import { z } from 'zod';
import { CustomerMetadataSchema } from './metadata';

/**
 * Customer schema for v2
 */
export const CustomerSchema = z.object({
	id: z.string(),
	externalId: z.string().optional(),

	name: z.string().min(1, 'Customer name is required'),
	email: z.string().email('Invalid email address'),
	taxId: z.string().min(1, 'Tax ID is required'),
	cellphone: z.string().min(1, 'Cellphone is required'),

	birthdate: z.iso.datetime().optional(),
	gender: z.enum(['M', 'F', 'O']).optional(),
	profession: z.string().optional(),

	company: z
		.object({
			name: z.string().optional(),
			taxId: z.string().optional(),
			tradeName: z.string().optional(),
			website: z.url().optional(),
			industry: z.string().optional(),
			size: z
				.enum(['MICRO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'])
				.optional(),
		})
		.optional(),

	billingAddress: z
		.object({
			street: z.string(),
			number: z.string(),
			complement: z.string().optional(),
			neighborhood: z.string(),
			city: z.string(),
			state: z.string().length(2),
			postalCode: z.string(),
			country: z.string().length(2).default('BR'),
		})
		.optional(),

	shippingAddress: z
		.object({
			street: z.string(),
			number: z.string(),
			complement: z.string().optional(),
			neighborhood: z.string(),
			city: z.string(),
			state: z.string().length(2),
			postalCode: z.string(),
			country: z.string().length(2).default('BR'),
		})
		.optional(),

	preferences: z
		.object({
			emailNotifications: z.boolean().default(true),
			smsNotifications: z.boolean().default(true),
			whatsappNotifications: z.boolean().default(false),
			newsletterSubscription: z.boolean().default(false),
			marketingConsent: z.boolean().default(false),
		})
		.optional(),

	loyalty: z
		.object({
			points: z.number().int().min(0).default(0),
			tier: z.string().optional(),
			memberSince: z.iso.datetime().optional(),
			lastPurchase: z.iso.datetime().optional(),
			totalPurchases: z.number().min(0).default(0),
			averageOrderValue: z.number().min(0).optional(),
		})
		.optional(),

	segmentation: z
		.object({
			segment: z.string().optional(),
			tags: z.array(z.string()).optional(),
			attributes: z.record(z.string(), z.string()).optional(),
			customFields: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),

	verification: z
		.object({
			verified: z.boolean().default(false),
			verifiedAt: z.iso.datetime().optional(),
			verificationMethod: z
				.enum(['DOCUMENT', 'SMS', 'EMAIL', 'BANK', 'MANUAL'])
				.optional(),
			documents: z
				.array(
					z.object({
						type: z.string(),
						number: z.string(),
						verifiedAt: z.iso.datetime().optional(),
					}),
				)
				.optional(),
		})
		.optional(),

	paymentMethods: z
		.array(
			z.object({
				type: z.enum([
					'CREDIT_CARD',
					'DEBIT_CARD',
					'PIX',
					'BANK_TRANSFER',
					'WALLET',
				]),
				token: z.string(),
				last4: z.string().optional(),
				brand: z.string().optional(),
				isDefault: z.boolean().default(false),
				createdAt: z.iso.datetime(),
			}),
		)
		.optional(),

	risk: z
		.object({
			score: z.number().min(0).max(1000).optional(),
			level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
			flags: z.array(z.string()).optional(),
			lastAssessedAt: z.iso.datetime().optional(),
		})
		.optional(),

	metadata: CustomerMetadataSchema.optional(),
	customData: z.record(z.string(), z.unknown()).optional(),
	internalNotes: z.string().optional(),

	status: z
		.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'])
		.default('ACTIVE'),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	deletedAt: z.iso.datetime().optional(),
	lastLoginAt: z.iso.datetime().optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;

/**
 * Customer creation schema (Simplified for V2 docs)
 */
export const CreateCustomerSchema = z.object({
	name: z.string().min(1, 'Customer name is required'),
	cellphone: z.string().min(1, 'Cellphone is required'),
	email: z.string().email('Invalid email address'),
	taxId: z.string().min(1, 'Tax ID is required'),
});

export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;

/**
 * Customer update schema
 */
export const UpdateCustomerSchema = CustomerSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
