import { z } from 'zod';

/**
 * Store configuration schema for v2
 */
export const StoreSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Store name is required'),

	business: z.object({
		legalName: z.string().min(1, 'Legal business name is required'),
		tradeName: z.string().min(1, 'Trade name is required'),
		taxId: z.string().min(1, 'Business tax ID is required'),
		stateRegistration: z.string().optional(),
		municipalRegistration: z.string().optional(),
		website: z.url().optional(),
		description: z.string().optional(),
		industry: z.string().optional(),
		establishedAt: z.iso.datetime().optional(),
	}),

	contact: z.object({
		email: z.string().email('Invalid contact email'),
		phone: z.string().min(1, 'Contact phone is required'),
		whatsapp: z.string().optional(),
		supportEmail: z.string().email('Invalid support email').optional(),
		supportPhone: z.string().optional(),
	}),

	address: z.object({
		street: z.string(),
		number: z.string(),
		complement: z.string().optional(),
		neighborhood: z.string(),
		city: z.string(),
		state: z.string().length(2),
		postalCode: z.string(),
		country: z.string().length(2).default('BR'),
	}),

	payments: z.object({
		currency: z
			.enum([
				'BRL',
				'USD',
				'EUR',
				'GBP',
				'JPY',
				'CAD',
				'AUD',
				'CHF',
				'CNY',
				'INR',
			])
			.default('BRL'),

		acceptedMethods: z
			.array(
				z.enum([
					'PIX',
					'CREDIT_CARD',
					'DEBIT_CARD',
					'BOLETO',
					'BANK_TRANSFER',
					'WALLET',
				]),
			)
			.min(1, 'At least one payment method is required'),

		cardProcessing: z
			.object({
				enabled: z.boolean().default(true),
				allowInstallments: z.boolean().default(true),
				maxInstallments: z.number().int().min(1).max(12).default(12),
				minInstallmentAmount: z.number().min(0).optional(),
				requireAuthentication: z.boolean().default(false),
				saveCards: z.boolean().default(true),
				threeDSecure: z
					.object({
						enabled: z.boolean().default(false),
						requiredForAmount: z.number().min(0).optional(),
						exemptionRules: z.array(z.string()).optional(),
					})
					.optional(),
			})
			.optional(),

		pixConfig: z
			.object({
				enabled: z.boolean().default(true),
				instantPayment: z.boolean().default(true),
				expirationMinutes: z.number().int().min(5).max(1440).default(60),
				allowRefunds: z.boolean().default(true),
				maxRefundHours: z.number().int().min(1).max(8760).default(720),
			})
			.optional(),

		boletoConfig: z
			.object({
				enabled: z.boolean().default(false),
				expirationDays: z.number().int().min(1).max(365).default(3),
				minAmount: z.number().min(0).default(1),
				instructions: z.string().optional(),
				penalties: z
					.object({
						interestRate: z.number().min(0).max(1).optional(),
						lateFee: z.number().min(0).optional(),
						graceDays: z.number().int().min(0).default(0),
					})
					.optional(),
			})
			.optional(),

		refundPolicy: z
			.object({
				enabled: z.boolean().default(true),
				automaticApproval: z.boolean().default(false),
				maxRefundDays: z.number().int().min(1).max(365).default(30),
				requireReason: z.boolean().default(true),
				allowedMethods: z.array(z.string()).optional(),
			})
			.optional(),
	}),

	configuration: z.object({
		timezone: z.string().default('America/Sao_Paulo'),
		locale: z.string().default('pt-BR'),

		checkout: z
			.object({
				theme: z
					.object({
						primaryColor: z
							.string()
							.regex(
								/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
								'Invalid color format',
							)
							.optional(),
						logoUrl: z.url().optional(),
						faviconUrl: z.url().optional(),
						customCSS: z.string().optional(),
					})
					.optional(),
				behavior: z
					.object({
						requireCustomerData: z.boolean().default(true),
						allowGuestCheckout: z.boolean().default(true),
						showPaymentMethodIcons: z.boolean().default(true),
						autoRedirect: z.boolean().default(false),
						redirectDelay: z.number().int().min(0).max(30).default(3),
					})
					.optional(),
			})
			.optional(),

		security: z
			.object({
				enable3DS: z.boolean().default(false),
				fraudDetection: z.boolean().default(true),
				ipWhitelist: z.array(z.string()).optional(),
				corsOrigins: z.array(z.string()).optional(),
				webhookSecretRotation: z.boolean().default(false),
			})
			.optional(),

		notifications: z
			.object({
				emailEnabled: z.boolean().default(true),
				smsEnabled: z.boolean().default(false),
				webhookEnabled: z.boolean().default(true),
				internalAlerts: z.boolean().default(true),
			})
			.optional(),
	}),

	integrations: z
		.object({
			webhooks: z
				.array(
					z.object({
						url: z.url(),
						events: z.array(z.string()),
						secret: z.string(),
						active: z.boolean().default(true),
					}),
				)
				.optional(),

			services: z
				.object({
					analytics: z
						.array(
							z.object({
								provider: z.string(),
								config: z.record(z.string(), z.unknown()),
							}),
						)
						.optional(),
					email: z
						.object({
							provider: z
								.enum(['SMTP', 'SES', 'SENDGRID', 'MAILGUN'])
								.optional(),
							config: z.record(z.string(), z.unknown()).optional(),
						})
						.optional(),
					sms: z
						.object({
							provider: z.enum(['TWILIO', 'AWS_SNS', 'MESSAGEBIRD']).optional(),
							config: z.record(z.string(), z.unknown()).optional(),
						})
						.optional(),
				})
				.optional(),
		})
		.optional(),

	compliance: z
		.object({
			privacyPolicy: z
				.object({
					url: z.url().optional(),
					version: z.string().optional(),
					acceptedAt: z.iso.datetime().optional(),
				})
				.optional(),

			termsOfService: z
				.object({
					url: z.url().optional(),
					version: z.string().optional(),
					acceptedAt: z.iso.datetime().optional(),
				})
				.optional(),

			dataProtection: z
				.object({
					compliant: z.boolean().default(true),
					dpoEmail: z.string().email().optional(),
					dataRetentionDays: z.number().int().min(0).optional(),
					cookieConsent: z.boolean().default(true),
				})
				.optional(),

			pciCompliance: z
				.object({
					level: z
						.enum([
							'SAQ_A',
							'SAQ_A_EP',
							'SAQ_B',
							'SAQ_B_IP',
							'SAQ_C',
							'SAQ_C_VT',
							'SAQ_D',
						])
						.optional(),
					certifiedAt: z.iso.datetime().optional(),
					expiresAt: z.iso.datetime().optional(),
				})
				.optional(),
		})
		.optional(),

	metadata: z.record(z.string(), z.unknown()).optional(),
	customData: z.record(z.string(), z.unknown()).optional(),

	status: z
		.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'UNDER_REVIEW', 'DELETED'])
		.default('ACTIVE'),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	deletedAt: z.iso.datetime().optional(),

	stats: z
		.object({
			totalBillings: z.number().int().min(0).optional(),
			totalRevenue: z.number().min(0).optional(),
			activeCustomers: z.number().int().min(0).optional(),
			averageOrderValue: z.number().min(0).optional(),
			conversionRate: z.number().min(0).max(1).optional(),
		})
		.optional(),
});

export type Store = z.infer<typeof StoreSchema>;

/**
 * Store creation schema
 */
export const CreateStoreSchema = StoreSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
	stats: true,
});

export type CreateStore = z.infer<typeof CreateStoreSchema>;

/**
 * Store update schema
 */
export const UpdateStoreSchema = StoreSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
	stats: true,
});

export type UpdateStore = z.infer<typeof UpdateStoreSchema>;
