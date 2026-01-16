import { z } from 'zod';

export const DefaultErrorSchema = z.object({
	data: z.object().nullable().optional(),
	error: z.string(),
});
