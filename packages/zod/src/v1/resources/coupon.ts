import { z } from 'zod';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponDiscountKind = StringEnum(
	['FIXED', 'PERCENTAGE'],
	'Type of discount applied by the coupon.',
);

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export type CouponDiscountKind = z.infer<typeof CouponDiscountKind>;

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponStatus = StringEnum(
	['ACTIVE', 'DELETE', 'DISABLED'],
	'Coupon status.',
);

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export type CouponStatus = z.infer<typeof CouponStatus>;

/**
 * https://docs.abacatepay.com/pages/coupon/reference#estrutura
 */
export const APICoupon = z.object({
	id: z
		.string()
		.describe(
			'Unique coupon code that your customers will use to apply the discount.',
		),
	discountKind: CouponDiscountKind,
	status: CouponStatus,
	maxRedeems: z
		.int()
		.describe(
			'Limit on the number of times the coupon can be used. Use `-1` for unlimited coupons or a specific number to limit usage.',
		),
	redeemsCount: z
		.int()
		.describe(
			'Counter of how many times the coupon has been used by customers.',
		)
		.min(0),
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the coupon was created in a development (true) or production (false) environment.',
		),
	notes: z
		.string()
		.describe(
			'Internal description of the coupon for your organization and control.',
		)
		.optional(),
	createdAt: z.coerce.date().describe('Coupon creation date and time.'),
	updatedAt: z.coerce.date().describe('Coupon last updated date and time.'),
	metadata: z
		.record(z.string(), z.any())
		.describe(
			'Object to store additional information about the coupon, such as campaign, category, or other data relevant to your organization.',
		)
		.optional(),
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#estrutura
 */
export type APICoupon = z.infer<typeof APICoupon>;
