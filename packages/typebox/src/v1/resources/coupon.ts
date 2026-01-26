import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponDiscountKind = StringEnum(['FIXED', 'PERCENTAGE'], {
	description: 'Type of discount applied by the coupon.',
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export type CouponDiscountKind = Static<typeof CouponDiscountKind>;

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponStatus = StringEnum(['ACTIVE', 'DELETE', 'DISABLED'], {
	description: 'Coupon status.',
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export type CouponStatus = Static<typeof CouponStatus>;

/**
 * https://docs.abacatepay.com/pages/coupon/reference#estrutura
 */
export const APICoupon = t.Object({
	id: t.String({
		description:
			'Unique coupon code that your customers will use to apply the discount.',
	}),
	discountKind: CouponDiscountKind,
	status: CouponStatus,
	maxRedeems: t.Integer({
		description:
			'Limit on the number of times the coupon can be used. Use `-1` for unlimited coupons or a specific number to limit usage.',
	}),
	redeemsCount: t.Integer({
		minimum: 0,
		description:
			'Counter of how many times the coupon has been used by customers.',
	}),
	devMode: t.Boolean({
		description:
			'Indicates whether the coupon was created in a development (true) or production (false) environment.',
	}),
	notes: t.Optional(
		t.String({
			description:
				'Internal description of the coupon for your organization and control.',
		}),
	),
	createdAt: t.Date({
		description: 'Coupon creation date and time.',
	}),
	updatedAt: t.Date({
		description: 'Coupon last updated date and time.',
	}),
	metadata: t.Optional(
		t.Record(t.String(), t.Any(), {
			description:
				'Object to store additional information about the coupon, such as campaign, category, or other data relevant to your organization.',
		}),
	),
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#estrutura
 */
export type APICoupon = Static<typeof APICoupon>;
