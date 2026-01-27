/**
 * Options to use when creating the REST client.
 */
export interface RESTOptions {
	/**
	 * Base URL without the version for all requests (Default `https://api.abacatepay.com/`).
	 */
	base?: string;
	/**
	 * The API key to use in the Authorization header.
	 */
	secret?: string;
	/**
	 * The time to wait in milliseconds before a request is aborted (Default `5_000`).
	 */
	timeout?: number;
	/**
	 * Options to use when retrying.
	 */
	retry?: RetryOptions;
	/**
	 * Version to use in requests (Default 1).
	 */
	version?: string | number;
	/**
	 * Additional headers to send for all API requests.
	 */
	headers?: Record<string, string>;
	/**
	 * Function to execute when a rate limit occurs.
	 * @param response - Response of the rate limit.
	 */
	onRateLimit?(response: Response): unknown;
}

/**
 * Options to use when sending a request to the API.
 */
export interface MakeRequestOptions
	extends Pick<RESTOptions, 'retry' | 'headers'> {
	/**
	 * Optional data to send in the request body (We stringify with JSON.stringify internally).
	 */
	body?: unknown;
	/**
	 * Method to use in the request.
	 */
	method: HTTPMethodLike;
	/**
	 * Query string parameters to append to the called endpoint.
	 */
	query?:
		| string
		| Record<string, string>
		| URLSearchParams
		| [string, string][];
}

/**
 * Options to use when sending a request to the API (Without the method).
 */
export type MakeRequestOptionsWithoutMethod = Omit<
	MakeRequestOptions,
	'method'
>;

/**
 * Options to use when retrying a request.
 */
export interface RetryOptions {
	/**
	 * Maximum number of attempts we should try.
	 */
	max: number;
	/**
	 * Custom function to set the backoff of the retry.
	 * @param attempt Current retry attempt.
	 */
	backoff?(attempt: number): number;
	/**
	 * Function to execute every time a retry is made
	 * @param context The context for the retry
	 */
	onRetry?(context: RetryContext): unknown;
}

/**
 * Context provided when a retry is made.
 */
export interface RetryContext {
	/**
	 * Current attempt number.
	 */
	attempt: number;
	/**
	 * Response received from the API, undefined if the error was a timeout.
	 */
	response?: Response;
	/**
	 * Options used in the request.
	 */
	options: MakeRequestOptions;
}

/**
 * Any HTTP method.
 */
export type HTTPMethodLike =
	| 'GET'
	| 'PUT'
	| 'POST'
	| 'HEAD'
	| 'PATCH'
	| 'DELETE'
	| (string & {});

/**
 * @private
 */
export interface InternalHandleErrorOptions {
	route: string;
	attempt: number;
	response: Response;
	retry: RetryOptions;
	options: MakeRequestOptions;
}

/**
 * @private
 */
export type InternalHandleTimeoutErrorOptions = Omit<
	InternalHandleErrorOptions,
	'response'
>;
