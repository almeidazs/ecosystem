import { z } from 'zod';

/**
 * PIX key schema for v2
 */
export const PixKeySchema = z.object({
	id: z.string(),
	type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP', 'RANDOM_KEY']),
	key: z.string().min(1, 'PIX key is required'),
	verified: z.boolean().default(false),
	verifiedAt: z.iso.datetime().optional(),
	nickname: z.string().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type PixKey = z.infer<typeof PixKeySchema>;

/**
 * PIX QRCode response schema per V2 documentation
 */
export const PixQrCodeSchema = z.object({
	id: z.string(),
	amount: z.number().int(), // Value in cents
	status: z.enum(['PENDING', 'PAID', 'EXPIRED']),
	devMode: z.boolean(),
	brCode: z.string(),
	brCodeBase64: z.string(),
	platformFee: z.number().int().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	expiresAt: z.iso.datetime(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type PixQrCode = z.infer<typeof PixQrCodeSchema>;

/**
 * PIX creation schema (Request body)
 */
export const CreatePixQrCodeSchema = z.object({
	amount: z.number().int().min(1),
	expiresIn: z.number().int().optional(),
	description: z.string().max(140).optional(),
	customer: z.object({
		name: z.string(),
		cellphone: z.string(),
		email: z.string().email(),
		taxId: z.string(),
	}).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreatePixQrCode = z.infer<typeof CreatePixQrCodeSchema>;

/**
 * Legacy aliases for backwards compatibility
 */
export const PixTransactionSchema = PixQrCodeSchema;
export type PixTransaction = PixQrCode;

export const PixStaticQrCodeSchema = PixQrCodeSchema;
export type PixStaticQrCode = PixQrCode;
