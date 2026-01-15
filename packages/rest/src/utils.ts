export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const DEFAULT_TIMEOUT = 5_000;
export const DEFAULT_RETRY_DELAY = 3_000;

export const RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];
