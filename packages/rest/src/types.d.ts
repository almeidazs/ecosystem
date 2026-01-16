/**
 * Options to use when creating the REST client
 */
export interface RESTOptions {
    /**
     * Base URL without the version for all requests (Default `https://api.abacatepay.com/`)
     */
    base?: string;
    /**
     * The API key to use in the Authorization header
     */
    secret?: string;
    /**
     * The time to wait in milliseconds before a request is aborted (Default `5_000`)
     */
    timeout?: number;
    /**
     * Options to use when retrying
     */
    retry?: RetryOptions;
    /**
     * Version to use in requests (Default 1)
     */
    version?: string | number;
    /**
     * Additional headers to send for all API requests
     */
    headers?: Record<string, string>;
    /**
     * Function to execute when a rate limit occurs
     * @param response - Response of the rate limit
     */
    onRateLimit?(response: Response): unknown;
}
/**
 * Options to use when sending a request to the API
 */
export interface MakeRequestOptions extends Pick<RESTOptions, 'retry' | 'headers'> {
    /**
     * Optional data to send in the request body (We stringify with JSON.stringify internally)
     */
    body?: unknown;
    /**
     * Method to use in the request
     */
    method: HTTPMethodLike;
    /**
     * Query string parameters to append to the called endpoint
     */
    query?: string | Record<string, string> | URLSearchParams;
}
/**
 * Options to use when sending a request to the API (Without the method)
 */
export type MakeRequestOptionsWithoutMethod = Omit<MakeRequestOptions, 'method'>;
/**
 * Options to use when retrying a request
 */
export interface RetryOptions {
    /**
     * Maximum number of attempts we should try
     */
    max: number;
    /**
     * Custom function to set the backoff of the retry
     * @param attempt Current retry attempt
     */
    backoff?(attempt: number): number;
}
/**
 * Any HTTP method
 */
export type HTTPMethodLike = 'GET' | 'PUT' | 'POST' | 'HEAD' | 'PATCH' | 'DELETE' | (string & {});
