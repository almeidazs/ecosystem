export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];
