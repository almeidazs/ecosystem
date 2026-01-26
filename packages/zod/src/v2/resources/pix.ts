import { z } from 'zod';
import { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = z.object({
	id: z.string().describe('Unique QRCode PIX identifier.'),
	amount: z
		.number()
		.int()
		.describe('Charge amount in cents (e.g. 4000 = R$40.00).'),
	status: PaymentStatus,
	devMode: z
		.boolean()
		.describe(
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
		),
	brCode: z.string().describe('PIX code (copy-and-paste) for payment.'),
	brCodeBase64: z
		.string()
		.describe('PIX code in Base64 format (Useful for displaying in images).'),
	platformFee: z
		.number()
		.int()
		.describe('Platform fee in cents. Example: 80 means R$0.80.'),
	createdAt: z.coerce.date().describe('QRCode PIX creation date and time.'),
	updatedAt: z.coerce.date().describe('QRCode PIX last updated date and time.'),
	expiresAt: z.coerce.date().describe('QRCode expiration date and time.'),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = z.infer<typeof APIQRCodePIX>;
