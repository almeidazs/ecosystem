/**
 * Function to wait for the `ms`.
 */
export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Status code of rate limit responses.
 */
export const RATE_LIMIT_STATUS_CODE = 429;

export const SERVICE_UNAVAILABLE_STATUS_CODE = 503;

/**
 * Array of any retryable status code.
 */
export const RETRYABLE_STATUS = [
	408,
	425,
	RATE_LIMIT_STATUS_CODE,
	500,
	502,
	SERVICE_UNAVAILABLE_STATUS_CODE,
	504,
];

const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 10_000;

/**
 * Function that use exponential backoff with jitter based on attempt.
 */
export const backoff = (attempt: number) => {
	const exp = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
	const jitter = Math.random() * exp * 0.3;

	return Math.floor(exp + jitter);
};

export const isTimeoutError = (err: unknown) =>
	(err as { name?: string })?.name === 'TimeoutError';
