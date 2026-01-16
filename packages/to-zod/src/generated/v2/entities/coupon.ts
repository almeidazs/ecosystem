import { z } from 'zod';
import { createListResponseSchema, createResponseSchema } from '../response';

/**
 * Coupon data schema (Response)
 */
export const CouponSchema = z.object({
	id: z.string(),
	discountKind: z.enum(['PERCENTAGE', 'FIXED']),
	discount: z.number(),
	status: z.enum(['ACTIVE', 'INACTIVE']),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	notes: z.string().nullable(),
	maxRedeems: z.number().int(),
	redeemsCount: z.number().int(),
	devMode: z.boolean(),
	metadata: z.record(z.string(), z.unknown()).nullable(),
});

export type Coupon = z.infer<typeof CouponSchema>;

/**
 * Coupon creation schema
 */
export const CreateCouponSchema = z.object({
	code: z.string().min(1, 'Coupon code is required').toUpperCase(),
	discountKind: z.enum(['PERCENTAGE', 'FIXED']),
	discount: z.number().min(0),
	notes: z.string().optional(),
	maxRedeems: z.number().int().min(-1).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateCoupon = z.infer<typeof CreateCouponSchema>;

/**
 * Coupon application schema
 */
export const ApplyCouponSchema = z.object({
	code: z.string().min(1, 'Coupon code is required'),
	customerId: z.string().optional(),
	amount: z.number().min(0, 'Amount is required'),
});

export type ApplyCoupon = z.infer<typeof ApplyCouponSchema>;

export const CouponResponseSchema = createResponseSchema(CouponSchema);
export const ListCouponResponseSchema = createListResponseSchema(CouponSchema);

export type CouponResponse = z.infer<typeof CouponResponseSchema>;
export type ListCouponResponse = z.infer<typeof ListCouponResponseSchema>;
