import { AbacatePayError, HTTPError } from './errors';
import type {
	InternalHandleErrorOptions,
	InternalHandleTimeoutErrorOptions,
	MakeRequestOptions,
	MakeRequestOptionsWithoutMethod,
	RESTOptions,
} from './types';
import {
	backoff,
	isTimeoutError,
	RATE_LIMIT_STATUS_CODE,
	RETRYABLE_STATUS,
	SERVICE_UNAVAILABLE_STATUS_CODE,
	sleep,
} from './utils';

const DEFAULT_TIMEOUT_IN_MS = 5_000;

/**
 * Represents the class that manages handlers for endpoints.
 */
export class REST {
	public constructor(
		/**
		 * Options to use in all requests.
		 */
		public options: RESTOptions = {},
	) {}

	/**
	 * Sets the authorization token that should be used for requests.
	 * @param secret The secret to use.
	 */
	public setSecret(secret: string) {
		this.options.secret = secret;

		return this;
	}

	/**
	 * Runs a GET request from the API.
	 */
	public get<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'GET' });
	}

	/**
	 * Runs a POST request from the API.
	 */
	public post<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'POST' });
	}

	/**
	 * Runs a DELETE request from the API.
	 */
	public delete<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'DELETE' });
	}

	/**
	 * Runs a PUT request from the API.
	 */
	public put<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'PUT' });
	}

	/**
	 * Runs a PATCH request from the API.
	 */
	public patch<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'PATCH' });
	}

	private async makeRequest<R>(
		route: string,
		options: MakeRequestOptions,
		attempt = 0,
	): Promise<R> {
		const url = this.makeURL(route, options.query);
		const { timeout = DEFAULT_TIMEOUT_IN_MS } = this.options;

		const retry = options.retry ?? this.options.retry ?? { max: 3 };

		try {
			const response = await fetch(url, {
				method: options.method,
				signal: AbortSignal.timeout(timeout),
				headers: this.makeHeaders(options.headers),
				body: 'body' in options ? JSON.stringify(options.body) : null,
			});

			if (!response.ok)
				return this.handleError({ route, retry, attempt, options, response });

			return this.process<R>(response);
		} catch (err) {
			if (isTimeoutError(err))
				return this.handleTimeout<R>({ retry, route, attempt, options });

			throw new HTTPError(`${err}`, route, 0, '');
		}
	}

	private async handleTimeout<R>({
		retry,
		route,
		attempt,
		options,
	}: InternalHandleTimeoutErrorOptions) {
		if (attempt >= retry.max)
			throw new HTTPError(
				`${retry.max} attempts were performed, all failed`,
				route,
				SERVICE_UNAVAILABLE_STATUS_CODE,
				options.method,
			);

		if (retry.onRetry)
			await retry.onRetry({
				attempt,
				options,
			});

		const delay = (retry.backoff ?? backoff)(attempt);

		await sleep(delay);

		return this.makeRequest<R>(route, options, attempt + 1);
	}

	private async handleError<R>({
		route,
		retry,
		options,
		attempt,
		response,
	}: InternalHandleErrorOptions) {
		if (!RETRYABLE_STATUS.includes(response.status)) {
			const { error } = await response.json();

			throw new AbacatePayError(error);
		}

		const { onRateLimit } = this.options;

		if (attempt >= retry.max)
			throw new HTTPError(
				`${retry.max} attempts were performed, all failed`,
				route,
				response.status,
				options.method,
			);
		if (retry.onRetry) await retry.onRetry({ attempt, options, response });
		if (response.status === RATE_LIMIT_STATUS_CODE && onRateLimit)
			await onRateLimit(response);

		const delay = (retry.backoff ?? backoff)(attempt);

		await sleep(delay);

		return this.makeRequest<R>(route, options, attempt + 1);
	}

	private async process<R>(response: Response) {
		const NO_CONTENT_STATUS_CODE = 204;

		if (response.status === NO_CONTENT_STATUS_CODE) return void 0 as R;

		const { data, error } = await response.json();

		// This should never happen
		if (error) throw new AbacatePayError(error);

		return data as R;
	}

	private makeURL(route: string, query?: MakeRequestOptions['query']) {
		const base = `${this.options.base ?? 'https://api.abacatepay.com/v'}${this.options.version ?? 1}${route}`;

		return query ? `${base}?${new URLSearchParams(query)}` : base;
	}

	private makeHeaders(custom?: Record<string, string>) {
		const {
			secret = process.env.ABACATEPAY_SECRET ?? process.env.ABACATEPAY_API_KEY,
		} = this.options;

		if (!secret)
			throw new AbacatePayError(
				'We could not find any AbacatePay secret, use REST({ secret })',
			);

		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${secret}`,
			...this.options.headers,
			...custom,
		};
	}
}
