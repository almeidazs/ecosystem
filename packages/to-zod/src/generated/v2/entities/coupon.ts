import { z } from 'zod';
import { createListResponseSchema, createResponseSchema } from '../response';

/**
 * Base coupon schema without refinements
 */
export const BaseCouponSchema = z.object({
	id: z.string(),
	code: z.string().min(1, 'Coupon code is required').toUpperCase(),
	// name: z.string().min(1, 'Coupon name is required'), // Not in manual example but maybe useful
	notes: z.string().optional(), // Rename from description/notes in doc
	discountKind: z.enum(['PERCENTAGE', 'FIXED']), // Rename from discountType
	discount: z.number().min(0), // Single field for value

	maxRedeems: z.number().int().min(-1).optional(), // Rename from usageLimit, supports -1
	redeemsCount: z.number().int().min(0).default(0), // Rename from usageCount

	active: z.boolean().default(true),
	// ... timestamps
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),

	// Keeping other fields as optional metadata
	metadata: z.record(z.string(), z.unknown()).optional(),
	devMode: z.boolean().default(false),
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'), // From response example
});

/**
 * Main coupon schema for v2 with refinements
 */
// Refinements temporarily removed to facilitate basic adaptation
export const CouponSchema = BaseCouponSchema;

export type Coupon = z.infer<typeof CouponSchema>;

/**
 * Coupon creation schema
 */
// Wrapped in "data" property for creation as per doc example
export const CreateCouponSchema = z.object({
	data: BaseCouponSchema.omit({
		id: true,
		redeemsCount: true,
		createdAt: true,
		updatedAt: true,
		status: true,
		devMode: true,
	})
});

export type CreateCoupon = z.infer<typeof CreateCouponSchema>;

/**
 * Coupon update schema
 */
export const UpdateCouponSchema = BaseCouponSchema.partial().omit({
	id: true,
	redeemsCount: true,
	createdAt: true,
	updatedAt: true,
});

export type UpdateCoupon = z.infer<typeof UpdateCouponSchema>;

/**
 * Coupon application schema
 */
export const ApplyCouponSchema = z.object({
	code: z.string().min(1, 'Coupon code is required'),
	customerId: z.string().optional(),
	amount: z.number().min(0, 'Amount is required'),
	items: z
		.array(
			z.object({
				id: z.string(),
				externalId: z.string(),
				quantity: z.number().int().min(1),
				unitPrice: z.number().min(0),
				category: z.string().optional(),
			}),
		)
		.optional(),
	paymentMethod: z.string().optional(),
});

export type ApplyCoupon = z.infer<typeof ApplyCouponSchema>;

/**
 * Coupon application result schema
 */
export const CouponApplicationResultSchema = z.object({
	coupon: CouponSchema,
	applicable: z.boolean(),
	discountAmount: z.number().min(0),
	finalAmount: z.number().min(0),
	message: z.string(),
	warnings: z.array(z.string()).optional(),
	appliedAt: z.coerce.date(),
});

export type CouponApplicationResult = z.infer<
	typeof CouponApplicationResultSchema
>;

export const CouponResponseSchema = createResponseSchema(CouponSchema);
export const ListCouponResponseSchema = createListResponseSchema(CouponSchema);

export type CouponResponse = z.infer<typeof CouponResponseSchema>;
export type ListCouponResponse = z.infer<typeof ListCouponResponseSchema>;