import { type Static, Type as t } from '@sinclair/typebox';
import { StringEnum } from '../../utils';

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponDiscountKind = StringEnum(['FIXED', 'PERCENTAGE'], {
	examples: ['FIXED'],
	description: 'Type of discount applied by the coupon.',
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export type CouponDiscountKind = Static<typeof CouponDiscountKind>;

/**
 * https://docs.abacatepay.com/pages/coupon/reference#atributos
 */
export const CouponStatus = StringEnum(['ACTIVE', 'INACTIVE', 'EXPIRED'], {
	examples: ['ACTIVE'],
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
		examples: ['SUMMER_26'],
		description:
			'Unique coupon code that your customers will use to apply the discount.',
	}),
	discountKind: CouponDiscountKind,
	status: CouponStatus,
	maxRedeems: t.Integer({
		examples: [25],
		description:
			'Limit on the number of times the coupon can be used. Use `-1` for unlimited coupons or a specific number to limit usage.',
	}),
	redeemsCount: t.Integer({
		minimum: 0,
		examples: [4],
		description:
			'Counter of how many times the coupon has been used by customers.',
	}),
	devMode: t.Boolean({
		examples: [false],
		description:
			'Indicates whether the coupon was created in a development (true) or production (false) environment.',
	}),
	notes: t.Optional(
		t.String({
			examples: ['Internal use only'],
			description:
				'Internal description of the coupon for your organization and control.',
		}),
	),
	createdAt: t.Date({
		examples: ['2024-01-15T13:45:30Z'],
		description: 'Coupon creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2024-02-20T10:15:00Z'],
		description: 'Coupon last updated date and time.',
	}),
	metadata: t.Record(t.String(), t.Any(), {
		examples: [{ category: 'SUMMER', campaign: 'SUMMER_2026' }],
		description:
			'Object to store additional information about the coupon, such as campaign, category, or other data relevant to your organization.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/coupon/reference#estrutura
 */
export type APICoupon = Static<typeof APICoupon>;
