import type { RESTOptions } from '@abacatepay/rest';

/**
 * Options for an AbacatePay client
 */
export interface AbacatePayOptions {
	/**
	 * Secret key (API key) to use in the requests
	 *
	 * @see {@link RESTOptions}
	 */
	secret?: string;
	/**
	 * Options for the REST client
	 */
	rest?: RESTOptions;
}
