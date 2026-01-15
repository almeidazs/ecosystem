import { z } from 'zod';

export const PaymentMethodV2Schema = z.enum([
	'PIX',
	'CARD',
	'BOLETO',
	'BANK_TRANSFER',
	'WALLET',
]);

export type PaymentMethodV2 = z.infer<typeof PaymentMethodV2Schema>;

export const PixKeyTypeV2Schema = z.enum([
	'CPF',
	'CNPJ',
	'EMAIL',
	'PHONE',
	'EVP',
	'RANDOM_KEY',
]);

export type PixKeyTypeV2 = z.infer<typeof PixKeyTypeV2Schema>;

export const PaymentStatusV2Schema = z.enum([
	'PENDING',
	'PROCESSING',
	'AUTHORIZED',
	'EXPIRED',
	'CANCELLED',
	'PAID',
	'REFUNDED',
	'PARTIALLY_REFUNDED',
	'FAILED',
	'CHARGEBACK',
]);

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

export const CountryCodeSchema = z.enum([
	'BR',
	'US',
	'CA',
	'GB',
	'DE',
	'FR',
	'ES',
	'IT',
	'NL',
	'BE',
	'AU',
	'JP',
	'CN',
	'IN',
	'MX',
	'AR',
	'CL',
	'CO',
	'PE',
	'UY',
]);

export type CountryCode = z.infer<typeof CountryCodeSchema>;

export const WebhookEventTypeV2Schema = z.enum([
	'BILLING_CREATED',
	'BILLING_UPDATED',
	'BILLING_PAID',
	'BILLING_FAILED',
	'BILLING_CANCELLED',
	'BILLING_REFUNDED',
	'BILLING_PARTIALLY_REFUNDED',
	'BILLING_EXPIRED',
	'BILLING_AUTHORIZED',
	'BILLING_CHARGEBACK',
	'CARD_CREATED',
	'CARD_UPDATED',
	'CARD_DELETED',
	'CARD_EXPIRED',
	'SUBSCRIPTION_CREATED',
	'SUBSCRIPTION_UPDATED',
	'SUBSCRIPTION_CANCELLED',
	'SUBSCRIPTION_RENEWED',
	'SUBSCRIPTION_PAYMENT_FAILED',
	'CUSTOMER_CREATED',
	'CUSTOMER_UPDATED',
	'CUSTOMER_DELETED',
	'PIX_CREATED',
	'PIX_COMPLETED',
	'PIX_FAILED',
	'PIX_EXPIRED',
]);

export type WebhookEventTypeV2 = z.infer<typeof WebhookEventTypeV2Schema>;

export const CurrencySchema = z.enum([
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
]);

export type Currency = z.infer<typeof CurrencySchema>;

export const DiscountTypeV2Schema = z.enum([
	'PERCENTAGE',
	'FIXED',
	'FREE_SHIPPING',
	'BOGO',
]);

export type DiscountTypeV2 = z.infer<typeof DiscountTypeV2Schema>;
