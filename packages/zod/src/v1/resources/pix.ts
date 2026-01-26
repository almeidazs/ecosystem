import { z } from 'zod';
import { PaymentStatus } from './charge';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export const APIQRCodePIX = z.object({
	id: z.string({
		description: 'Unique QRCode PIX identifier.',
	}),
	amount: z
		.number({
			description: 'Charge amount in cents (e.g. 4000 = R$40.00).',
		})
		.int(),
	status: PaymentStatus,
	devMode: z.boolean({
		description:
			'Indicates whether the charge is in a testing (true) or production (false) environment.',
	}),
	method: z.literal('PIX', {
		description: 'Payment method.',
	}),
	brCode: z.string({
		description: 'PIX code (copy-and-paste) for payment.',
	}),
	brCodeBase64: z.string({
		description: 'PIX code in Base64 format (Useful for displaying in images).',
	}),
	platformFee: z
		.number({
			description: 'Platform fee in cents. Example: 80 means R$0.80.',
		})
		.int(),
	createdAt: z.coerce.date({
		description: 'QRCode PIX creation date and time.',
	}),
	updatedAt: z.coerce.date({
		description: 'QRCode PIX last updated date and time.',
	}),
	expiresAt: z.coerce.date({
		description: 'QRCode expiration date and time.',
	}),
	description: z.string({
		description: 'Payment description.',
	}),
	metadata: z.record(z.string(), z.any(), {
		description: 'Payment metadata.',
	}),
});

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export type APIQRCodePIX = z.infer<typeof APIQRCodePIX>;
