import { z } from 'zod';

/**
 * Enhanced metadata schema for v2 with structured fields
 */
export const EnhancedMetadataSchema = z.object({
	fee: z.number().min(0, 'Fee must be non-negative'),
	returnUrl: z.url('Invalid return URL'),
	completionUrl: z.url('Invalid completion URL'),
	sessionId: z.string().optional(),
	userId: z.string().optional(),
	ipAddress: z
		.string()
		.regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address')
		.optional(),
	userAgent: z.string().optional(),
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
	utmTerm: z.string().optional(),
	utmContent: z.string().optional(),
	platform: z.enum(['web', 'mobile', 'app', 'pos']).optional(),
	deviceFingerprint: z.string().optional(),
	riskScore: z.number().min(0).max(100).optional(),
	fraudFlags: z.array(z.string()).optional(),
	velocityChecks: z.record(z.string(), z.unknown()).optional(),
	subscriptionId: z.string().optional(),
	invoiceId: z.string().optional(),
	orderId: z.string().optional(),
	customerNotes: z.string().optional(),
	internalNotes: z.string().optional(),
	partnerId: z.string().optional(),
	affiliateId: z.string().optional(),
	marketplaceId: z.string().optional(),
	termsAccepted: z.boolean().optional(),
	termsAcceptedAt: z.iso.datetime().optional(),
	privacyAccepted: z.boolean().optional(),
	privacyAcceptedAt: z.iso.datetime().optional(),
	customFields: z.record(z.string(), z.unknown()).optional(),
	legacy: z.record(z.string(), z.unknown()).optional(),
});

export type EnhancedMetadata = z.infer<typeof EnhancedMetadataSchema>;

/**
 * PIX metadata schema with enhanced key support
 */
export const PixMetadataSchema = z.object({
	keyType: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP', 'RANDOM_KEY']),
	key: z.string().min(1, 'PIX key is required'),
	qrCodeUrl: z.url().optional(),
	qrCodeText: z.string().optional(),
	expiresAt: z.iso.datetime().optional(),
	merchantName: z.string().optional(),
	merchantCity: z.string().optional(),
	merchantCnpj: z.string().optional(),
	amount: z.number().min(0).optional(),
	description: z.string().optional(),
	txid: z.string().optional(),
	createdAt: z.iso.datetime().optional(),
	paidAt: z.iso.datetime().optional(),
	refundAt: z.iso.datetime().optional(),
});

export type PixMetadata = z.infer<typeof PixMetadataSchema>;

/**
 * Customer metadata schema
 */
export const CustomerMetadataSchema = z.object({
	name: z.string().min(1, 'Customer name is required'),
	email: z.string().email('Invalid email address'),
	taxId: z.string().min(1, 'Tax ID is required'),
	cellphone: z.string().min(1, 'Cellphone is required'),

	// Enhanced customer fields
	birthdate: z.iso.datetime().optional(),
	gender: z.enum(['M', 'F', 'O']).optional(),
	profession: z.string().optional(),
	company: z.string().optional(),
	address: z
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
	emailNotifications: z.boolean().default(true),
	smsNotifications: z.boolean().default(true),
	whatsappNotifications: z.boolean().default(false),
	loyaltyPoints: z.number().min(0).default(0),
	customerSince: z.iso.datetime().optional(),
	lastPurchase: z.iso.datetime().optional(),
	segment: z.string().optional(),
	tags: z.array(z.string()).optional(),
	verified: z.boolean().default(false),
	verifiedAt: z.iso.datetime().optional(),
	verificationMethod: z.string().optional(),
});

export type CustomerMetadata = z.infer<typeof CustomerMetadataSchema>;

/**
 * Product metadata schema
 */
export const ProductMetadataSchema = z.object({
	externalId: z.string().min(1, 'Product external ID is required'),
	name: z.string().min(1, 'Product name is required'),
	quantity: z.number().int().min(1, 'Quantity must be at least 1'),
	price: z.number().min(0, 'Price must be non-negative'),
	description: z.string().optional(),
	sku: z.string().optional(),
	category: z.string().optional(),
	brand: z.string().optional(),
	model: z.string().optional(),
	color: z.string().optional(),
	size: z.string().optional(),
	weight: z.number().positive().optional(),
	dimensions: z
		.object({
			length: z.number().positive(),
			width: z.number().positive(),
			height: z.number().positive(),
			unit: z.enum(['cm', 'in']).default('cm'),
		})
		.optional(),
	downloadUrl: z.url().optional(),
	licenseKey: z.string().optional(),
	expirationDate: z.iso.datetime().optional(),
	stock: z.number().int().min(0).optional(),
	trackInventory: z.boolean().default(false),
	taxable: z.boolean().default(true),
	taxRate: z.number().min(0).max(1).optional(),
	requiresShipping: z.boolean().default(true),
	freeShipping: z.boolean().default(false),
	images: z
		.array(
			z.object({
				url: z.url(),
				alt: z.string().optional(),
				order: z.number().int().min(0),
			}),
		)
		.optional(),
	attributes: z.record(z.string(), z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ProductMetadata = z.infer<typeof ProductMetadataSchema>;
