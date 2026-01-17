import { Type as t } from '@sinclair/typebox';
import { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = t.Object({
	id: t.String({
		description: 'Unique QRCode PIX identifier.',
	}),
	amount: t.Integer({
		description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
	}),
	status: PaymentStatus,
	devMode: t.Boolean({
		description:
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
	}),
	brCode: t.String({
		description: 'PIX code (copy-and-paste) for payment.',
	}),
	brCodeBase64: t.String({
		description: 'PIX code in Base64 format (Useful for displaying in images).',
	}),
	platformFee: t.Integer({
		description: 'Platform fee in cents. Example: 80 means R$0.80.',
	}),
	createdAt: t.Date({
		description: 'QRCode PIX creation date and time.',
	}),
	updatedAt: t.Date({
		description: 'QRCode PIX last updated date and time.',
	}),
	expiresAt: t.Date({
		description: 'QRCode expiration date and time.',
	}),
});
