import { z } from 'zod';
import { CardDataSchema, SavedCardSchema } from './card';
import { WebhookEventTypeV2Schema } from './enums';
import { CustomerMetadataSchema } from './metadata';

/**
 * Base webhook event schema
 */
export const BaseWebhookEventSchema = z.object({
	id: z.string(),
	type: WebhookEventTypeV2Schema,
	timestamp: z.iso.datetime(),
	version: z.string().default('2.0'),
	source: z.object({
		id: z.string(),
		name: z.string(),
		environment: z.enum(['production', 'development', 'staging']),
	}),

	signature: z.string(),
	signatureAlgorithm: z.enum(['HS256', 'HS512']).default('HS256'),
	metadata: z.record(z.string(), z.unknown()).optional(),
	retryCount: z.number().int().min(0).default(0),
	maxRetries: z.number().int().min(0).default(3),
	nextRetryAt: z.iso.datetime().optional(),
});

export type BaseWebhookEvent = z.infer<typeof BaseWebhookEventSchema>;

/**
 * Card webhook events
 */
export const CardWebhookEventSchema = BaseWebhookEventSchema.extend({
	type: z.enum([
		'CARD_CREATED',
		'CARD_UPDATED',
		'CARD_DELETED',
		'CARD_EXPIRED',
	]),
	data: z.object({
		card: SavedCardSchema,
		customerId: z.string().optional(),
		previousData: z.unknown().optional(),
	}),
});

export type CardWebhookEvent = z.infer<typeof CardWebhookEventSchema>;

/**
 * Subscription webhook events
 */
export const SubscriptionWebhookEventSchema = BaseWebhookEventSchema.extend({
	type: z.enum([
		'SUBSCRIPTION_CREATED',
		'SUBSCRIPTION_UPDATED',
		'SUBSCRIPTION_CANCELLED',
		'SUBSCRIPTION_RENEWED',
		'SUBSCRIPTION_PAYMENT_FAILED',
	]),
	data: z.object({
		subscription: z.object({
			id: z.string(),
			customerId: z.string(),
			status: z.enum(['ACTIVE', 'CANCELLED', 'PAUSED', 'EXPIRED']),
			currentPeriodStart: z.iso.datetime(),
			currentPeriodEnd: z.iso.datetime(),
			nextBillingAt: z.iso.datetime().nullable(),
			billingId: z.string().optional(),
			plan: z.object({
				id: z.string(),
				name: z.string(),
				amount: z.number(),
				currency: z.string(),
				frequency: z.string(),
			}),
		}),
	}),
});

export type SubscriptionWebhookEvent = z.infer<
	typeof SubscriptionWebhookEventSchema
>;

/**
 * Customer webhook events
 */
export const CustomerWebhookEventSchema = BaseWebhookEventSchema.extend({
	type: z.enum(['CUSTOMER_CREATED', 'CUSTOMER_UPDATED', 'CUSTOMER_DELETED']),
	data: z.object({
		customer: CustomerMetadataSchema,
		customerId: z.string(),
		previousData: z.unknown().optional(),
	}),
});

export type CustomerWebhookEvent = z.infer<typeof CustomerWebhookEventSchema>;

/**
 * PIX webhook events
 */
export const PixWebhookEventSchema = BaseWebhookEventSchema.extend({
	type: z.enum(['PIX_CREATED', 'PIX_COMPLETED', 'PIX_FAILED', 'PIX_EXPIRED']),
	data: z.object({
		pix: z.object({
			id: z.string(),
			billingId: z.string(),
			keyType: z.string(),
			key: z.string(),
			amount: z.number(),
			status: z.string(),
			qrCodeUrl: z.string().optional(),
			expiresAt: z.iso.datetime().optional(),
			createdAt: z.iso.datetime(),
			completedAt: z.iso.datetime().optional(),
			txid: z.string().optional(),
			endToEndId: z.string().optional(),
		}),
	}),
});

export type PixWebhookEvent = z.infer<typeof PixWebhookEventSchema>;

/**
 * Union type for all v2 webhook events
 */
export const WebhookEventV2Schema = z.discriminatedUnion('type', [
	CardWebhookEventSchema,
	SubscriptionWebhookEventSchema,
	CustomerWebhookEventSchema,
	PixWebhookEventSchema,
]);

export type WebhookEventV2 = z.infer<typeof WebhookEventV2Schema>;

/**
 * Webhook delivery status schema
 */
export const WebhookDeliverySchema = z.object({
	id: z.string(),
	eventId: z.string(),
	url: z.string(),
	status: z.enum(['PENDING', 'DELIVERED', 'FAILED', 'RETRY']),
	statusCode: z.number().int().min(100).max(599).optional(),
	responseTime: z.number().int().min(0).optional(),
	attempts: z.number().int().min(0).default(0),
	lastAttemptAt: z.iso.datetime().optional(),
	nextAttemptAt: z.iso.datetime().optional(),
	deliveredAt: z.iso.datetime().optional(),
	errorMessage: z.string().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type WebhookDelivery = z.infer<typeof WebhookDeliverySchema>;

/**
 * Webhook configuration schema
 */
export const WebhookConfigSchema = z.object({
	url: z.string().url('Invalid webhook URL'),
	events: z
		.array(WebhookEventTypeV2Schema)
		.min(1, 'At least one event type is required'),
	secret: z.string().min(1, 'Webhook secret is required'),
	active: z.boolean().default(true),

	// Retry configuration
	retryConfig: z
		.object({
			enabled: z.boolean().default(true),
			maxAttempts: z.number().int().min(0).max(10).default(3),
			backoffStrategy: z
				.enum(['LINEAR', 'EXPONENTIAL', 'FIXED'])
				.default('EXPONENTIAL'),
			initialDelay: z.number().int().min(1000).default(5000), // in milliseconds
			maxDelay: z.number().int().min(1000).default(300000),
		})
		.optional(),
	filters: z
		.object({
			environments: z
				.array(z.enum(['production', 'development', 'staging']))
				.optional(),
			status: z.array(z.string()).optional(),
			minAmount: z.number().min(0).optional(),
		})
		.optional(),
	headers: z.record(z.string(), z.string()).optional(),
	signatureVersion: z.enum(['v1', 'v2']).default('v2'),
	verifySsl: z.boolean().default(true),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;
