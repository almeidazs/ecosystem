import { z } from 'zod';

/**
 * Withdraw method enum
 */
export const WithdrawMethodSchema = z.enum([
	'BANK_TRANSFER',
	'PIX',
	'INTERNAL_TRANSFER',
	'CRYPTO',
	'CHECK',
]);

export type WithdrawMethod = z.infer<typeof WithdrawMethodSchema>;

/**
 * Withdraw status enum
 */
export const WithdrawStatusSchema = z.enum([
	'PENDING',
	'PROCESSING',
	'APPROVED',
	'COMPLETED',
	'FAILED',
	'CANCELLED',
	'REJECTED',
	'EXPIRED',
]);

export type WithdrawStatus = z.infer<typeof WithdrawStatusSchema>;

/**
 * Bank account schema for withdraw
 */
export const BankAccountSchema = z.object({
	bankCode: z.string().min(3, 'Bank code is required'),
	bankName: z.string().optional(),
	agency: z.string().min(1, 'Agency number is required'),
	agencyDigit: z
		.string()
		.length(1, 'Agency digit must be exactly 1 character')
		.optional(),
	accountNumber: z.string().min(1, 'Account number is required'),
	accountDigit: z
		.string()
		.length(1, 'Account digit must be exactly 1 character'),
	accountType: z.enum(['CHECKING', 'SAVINGS', 'PAYMENT']),
	holderName: z.string().min(1, 'Account holder name is required'),
	holderTaxId: z.string().min(1, 'Account holder tax ID is required'),
	holderType: z.enum(['NATURAL', 'LEGAL']).default('NATURAL'),
	documentType: z.enum(['CPF', 'CNPJ']).optional(),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;

/**
 * Base withdraw schema without refinements
 */
export const BaseWithdrawSchema = z.object({
	id: z.string(),
	externalId: z.string().optional(),
	amount: z.number().min(0.01, 'Withdrawal amount must be greater than 0'),
	currency: z.string().default('BRL'),
	// method: WithdrawMethodSchema, // Method seems implicit or part of request? Response doesn't show method enum explicitly but implementation might need it. Kept for safety or removed if strict strict. Doc says "pixKey" exists, so likely PIX is dominant? Let's keep it but optional or default
	// Doc example: "pixKey": "fulano@banco.com". So pixKey is top level string.
	pixKey: z.string().min(1, 'Pix key is required'),
	status: WithdrawStatusSchema.default('PENDING'),
	notes: z.string().optional(), // Changed from internalNotes/description

	// Fee information
	fee: z.number().min(0, 'Fee must be non-negative').default(0),
	// ... timestamps
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),

	// Keeping other fields as optional/internal since they aren't in simple response but might constitute full object
	metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Main withdraw schema for v2 with refinements
 */
// Removed refinements for now
export const WithdrawSchema = BaseWithdrawSchema;

export type Withdraw = z.infer<typeof WithdrawSchema>;

/**
 * Withdraw creation schema
 */
// CreateWithdrawSchema
export const CreateWithdrawSchema = BaseWithdrawSchema.omit({
	id: true,
	status: true,
	fee: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateWithdraw = z.infer<typeof CreateWithdrawSchema>;

/**
 * Withdraw update schema
 */
export const UpdateWithdrawSchema = BaseWithdrawSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type UpdateWithdraw = z.infer<typeof UpdateWithdrawSchema>;

/**
 * Withdraw approval schema
 */
export const ApproveWithdrawSchema = z.object({
	id: z.string(),
	approve: z.boolean(),
	reason: z.string().optional(),
	approvedBy: z.string(),
	notes: z.string().optional(),
});

export type ApproveWithdraw = z.infer<typeof ApproveWithdrawSchema>;

/**
 * Withdraw batch schema for bulk operations
 */
export const WithdrawBatchSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Batch name is required'),
	description: z.string().optional(),
	withdrawals: z
		.array(z.string())
		.min(1, 'At least one withdrawal ID is required'),
	status: z
		.enum(['CREATED', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED'])
		.default('CREATED'),
	totalAmount: z.number().min(0),
	totalWithdrawals: z.number().int().min(1),
	processedWithdrawals: z.number().int().min(0).default(0),
	failedWithdrawals: z.number().int().min(0).default(0),
	processor: z.string().optional(),
	processorBatchId: z.string().optional(),
	createdAt: z.iso.datetime(),
	startedAt: z.iso.datetime().optional(),
	completedAt: z.iso.datetime().optional(),
	estimatedCompletionAt: z.iso.datetime().optional(),
	results: z
		.array(
			z.object({
				withdrawalId: z.string(),
				status: z.string(),
				error: z.string().optional(),
				processedAt: z.iso.datetime().optional(),
			}),
		)
		.optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	internalNotes: z.string().optional(),
});

export type WithdrawBatch = z.infer<typeof WithdrawBatchSchema>;

/**
 * Withdraw webhook event schema
 */
export const WithdrawWebhookEventSchema = z.object({
	id: z.string(),
	type: z.enum([
		'WITHDRAW_CREATED',
		'WITHDRAW_PROCESSING',
		'WITHDRAW_APPROVED',
		'WITHDRAW_COMPLETED',
		'WITHDRAW_FAILED',
		'WITHDRAW_CANCELLED',
		'WITHDRAW_REJECTED',
	]),
	timestamp: z.iso.datetime(),
	data: z.object({
		withdraw: WithdrawSchema,
		previousStatus: z.string().optional(),
	}),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type WithdrawWebhookEvent = z.infer<typeof WithdrawWebhookEventSchema>;
