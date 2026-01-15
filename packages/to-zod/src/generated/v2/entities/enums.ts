import { z } from 'zod';

export const PaymentMethodV2Schema = z.enum(['PIX', 'CARD']);

export type PaymentMethodV2 = z.infer<typeof PaymentMethodV2Schema>;
export const PaymentStatusV2Schema = z.enum(['PENDING', 'CANCELLED', 'PAID']);
export type PaymentStatusV2 = z.infer<typeof PaymentStatusV2Schema>;

export const BillingFrequencyV2Schema = z.enum([
	'ONE_TIME',
	'DAILY',
	'WEEKLY',
	'MONTHLY',
	'QUARTERLY',
	'YEARLY',
	'CUSTOM',
]);

export type BillingFrequencyV2 = z.infer<typeof BillingFrequencyV2Schema>;

export const CardBrandSchema = z.enum([
	'VISA',
	'MASTERCARD',
	'AMEX',
	'ELO',
	'HIPERCARD',
	'DISCOVER',
	'JCB',
	'DINERS',
	'UNIONPAY',
]);

export type CardBrand = z.infer<typeof CardBrandSchema>;

export const CardFundingTypeSchema = z.enum(['CREDIT', 'DEBIT', 'PREPAID']);

export type CardFundingType = z.infer<typeof CardFundingTypeSchema>;

export const WebhookEventTypeV2Schema = z.enum([
	'billing.paid',
	'payout.done',
	'payout.failed',
]);

export type WebhookEventTypeV2 = z.infer<typeof WebhookEventTypeV2Schema>;

export const CurrencySchema = z.enum(['BRL']);

export type Currency = z.infer<typeof CurrencySchema>;

export const DiscountTypeV2Schema = z.enum(['PERCENTAGE']);

export type DiscountTypeV2 = z.infer<typeof DiscountTypeV2Schema>;
