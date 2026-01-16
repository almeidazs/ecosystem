import { z } from 'zod';
import { createResponseSchema } from '../response';

export const PixQrCodeSchema = z.object({
	id: z.string(),
	amount: z.number().int(),
	status: z.enum(['PENDING', 'PAID', 'EXPIRED']),
	devMode: z.boolean(),
	brCode: z.string(),
	brCodeBase64: z.string(),
	platformFee: z.number().int().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type PixQrCode = z.infer<typeof PixQrCodeSchema>;

export const CreatePixQrCodeSchema = z.object({
	amount: z.number().int().min(1),
	expiresIn: z.number().int().optional(),
	description: z.string().max(140).optional(),
	customer: z
		.object({
			name: z.string(),
			cellphone: z.string(),
			email: z.email(),
			taxId: z.string(),
		})
		.optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
/*
 *{
	"data": {
		"id": "pix_char_123456",
		"amount": 100,
		"status": "PENDING",
		"devMode": true,
		"brCode": "00020101021226950014br.gov.bcb.pix",
		"brCodeBase64": "data:image/png;base64,iVBORw0KGgoAAA",
		"platformFee": 80,
		"createdAt": "2025-03-24T21:50:20.772Z",
		"updatedAt": "2025-03-24T21:50:20.772Z",
		"expiresAt": "2025-03-25T21:50:20.772Z"
	},
	"error": null
}
 * */
export type CreatePixQrCode = z.infer<typeof CreatePixQrCodeSchema>;

export const PixTransactionSchema = PixQrCodeSchema;
export type PixTransaction = PixQrCode;

export const PixStaticQrCodeSchema = PixQrCodeSchema;
export type PixStaticQrCode = PixQrCode;

export const PixQrCodeResponseSchema = createResponseSchema(PixQrCodeSchema);
export type PixQrCodeResponse = z.infer<typeof PixQrCodeResponseSchema>;