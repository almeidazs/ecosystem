import { z } from 'zod';
import {
	CardBrandSchema,
	CardFundingTypeSchema,
	CountryCodeSchema,
} from './enums';

/**
 * Billing address schema for v2
 */
export const BillingAddressSchema = z.object({
	street: z.string().min(1, 'Street address is required'),
	streetNumber: z.string().min(1, 'Street number is required'),
	complement: z.string().optional(),
	neighborhood: z.string().min(1, 'Neighborhood is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().length(2, 'State must be 2 characters'),
	postalCode: z
		.string()
		.regex(/^\d{5}-?\d{3}$/, 'Invalid Brazilian postal code'),
	country: CountryCodeSchema.default('BR'),
});

export type BillingAddress = z.infer<typeof BillingAddressSchema>;

/**
 * Card data schema for v2 with enhanced security features
 */
export const CardDataSchema = z
	.object({
		cardNumber: z
			.string()
			.regex(/^\d{13,19}$/, 'Card number must be between 13 and 19 digits')
			.transform((val) => val.replace(/\s+/g, '')),

		holderName: z
			.string()
			.min(2, 'Cardholder name must be at least 2 characters')
			.regex(
				/^[a-zA-Z\s]+$/,
				'Cardholder name can only contain letters and spaces',
			),

		expirationMonth: z
			.string()
			.regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiration month')
			.transform((val) => parseInt(val, 10)),

		expirationYear: z
			.string()
			.regex(/^\d{2,4}$/, 'Invalid expiration year')
			.transform((val) => {
				const year = parseInt(val, 10);
				return year < 100 ? 2000 + year : year;
			}),

		cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),

		brand: CardBrandSchema.optional(),
		fundingType: CardFundingTypeSchema.optional(),
		last4: z
			.string()
			.regex(/^\d{4}$/, 'Last 4 digits must be exactly 4 digits')
			.optional(),
		bin: z
			.string()
			.regex(/^\d{6,8}$/, 'BIN must be 6 to 8 digits')
			.optional(),

		// Additional security fields
		installmentCount: z.number().int().min(1).max(12).optional(),
		saveCard: z.boolean().default(false),
		cardToken: z.string().optional(),
		threeDSecure: z
			.object({
				enabled: z.boolean().default(false),
				version: z.enum(['1.0', '2.0']).optional(),
				flow: z.enum(['FRICTIONLESS', 'CHALLENGE', 'DECLINE']).optional(),
			})
			.optional(),
	})
	.refine(
		(data) => {
			const now = new Date();
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;

			if (data.expirationYear < currentYear) return false;
			if (
				data.expirationYear === currentYear &&
				data.expirationMonth < currentMonth
			)
				return false;

			return true;
		},
		{
			message: 'Card expiration date cannot be in the past',
			path: ['expirationYear'],
		},
	);

export type CardData = z.infer<typeof CardDataSchema>;

/**
 * Card verification result schema
 */
export const CardVerificationSchema = z.object({
	verified: z.boolean(),
	brand: CardBrandSchema,
	fundingType: CardFundingTypeSchema,
	last4: z.string(),
	bin: z.string(),
	country: CountryCodeSchema.optional(),
	bank: z.string().optional(),
	cardType: z.enum(['CREDIT', 'DEBIT', 'PREPAID', 'UNIVERSAL']).optional(),
	international: z.boolean().optional(),
});

export type CardVerification = z.infer<typeof CardVerificationSchema>;

/**
 * Saved card schema for v2
 */
export const SavedCardSchema = z.object({
	id: z.string(),
	cardToken: z.string(),
	holderName: z.string(),
	brand: CardBrandSchema,
	last4: z.string(),
	expirationMonth: z.number().int().min(1).max(12),
	expirationYear: z.number().int(),
	fundingType: CardFundingTypeSchema,
	billingAddress: BillingAddressSchema.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SavedCard = z.infer<typeof SavedCardSchema>;
