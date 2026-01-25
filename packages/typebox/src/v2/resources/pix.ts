import { type Static, Type as t } from '@sinclair/typebox';
import { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = t.Object({
	id: t.String({
		examples: ['pix_char_123456'],
		description: 'Unique QRCode PIX identifier.',
	}),
	amount: t.Integer({
		examples: [4000],
		description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
	}),
	status: PaymentStatus,
	devMode: t.Boolean({
		examples: [true],
		description:
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
	}),
	brCode: t.String({
		examples: ['00020101021226950014br.gov.bcb.pix'],
		description: 'PIX code (copy-and-paste) for payment.',
	}),
	brCodeBase64: t.String({
		examples: ['data:image/png;base64,iVBORw0KGgoAAA'],
		description: 'PIX code in Base64 format (Useful for displaying in images).',
	}),
	platformFee: t.Integer({
		examples: [80],
		description: 'Platform fee in cents. Example: 80 means R$0.80.',
	}),
	createdAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'QRCode PIX creation date and time.',
	}),
	updatedAt: t.Date({
		examples: ['2025-01-01T12:00:00Z'],
		description: 'QRCode PIX last updated date and time.',
	}),
	expiresAt: t.Date({
		examples: ['2025-01-02T12:00:00Z'],
		description: 'QRCode expiration date and time.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = Static<typeof APIQRCodePIX>;
