import { z } from 'zod';

export const MissingTokenErrorSchema = z.object({
	error: z.string(),
});
