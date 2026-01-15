import { AbacatePayError, HTTPError } from './errors';
import type {
	MakeRequestOptions,
	MakeRequestOptionsWithoutMethod,
	RESTOptions,
} from './types';
import { RETRYABLE_STATUS, sleep } from './utils';

interface HandleErrorOptions {
	route: string;
	attempt: number;
	response: Response;
	options: MakeRequestOptions;
}

const FIVE_SEC_IN_MS = 5_000;
const THREE_SECONDS_IN_MS = 3_000;

export class REST {
	public constructor(public readonly options = {} as RESTOptions) {}

	public setSecret(secret: string) {
		this.options.secret = secret;

		return this;
	}

	public get<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'GET' });
	}

	public post<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'POST' });
	}

	public delete<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'DELETE' });
	}

	public put<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'PUT' });
	}

	public patch<R>(route: string, options?: MakeRequestOptionsWithoutMethod) {
		return this.makeRequest<R>(route, { ...options, method: 'PATCH' });
	}

	private async makeRequest<R>(
		route: string,
		options: MakeRequestOptions,
		attempt = 0,
	): Promise<R> {
		const url = this.makeURL(route, options.query);
		const timeout = this.options.timeout ?? FIVE_SEC_IN_MS;

		try {
			const response = await fetch(url, {
				method: options.method,
				signal: AbortSignal.timeout(timeout),
				headers: this.makeHeaders(options.headers),
				body: 'body' in options ? JSON.stringify(options.body) : null,
			});

			if (!response.ok)
				return this.handleError({ route, attempt, options, response });

			return this.process<R>(response);
		} catch (err) {
			const isTimeoutError = (err as any)?.name === 'TimeoutError';

			if (isTimeoutError)
				// TODO: Add retryable timeout
				throw new HTTPError(
					route,
					`Your request timed out (Waited for ${timeout}ms)`,
				);

			throw new HTTPError(route, `${err}`);
		}
	}

	private async handleError<R>({
		route,
		options,
		attempt,
		response,
	}: HandleErrorOptions) {
		if (RETRYABLE_STATUS.includes(response.status)) {
			const { onRateLimit, retry = options.retry ?? { max: 3 } } = this.options;

			if (attempt >= retry.max)
				throw new HTTPError(
					route,
					`${retry.max} attempts failed when fetching`,
				);

			if (onRateLimit) await onRateLimit(response);

			await sleep(retry.delay ?? THREE_SECONDS_IN_MS);

			return this.makeRequest<R>(route, options, attempt + 1);
		}

		const { error } = await response.json();

		throw new AbacatePayError(error);
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
		const { secret } = this.options;

		if (!secret)
			throw new AbacatePayError(
				'Your secret key is undefined. Use REST.setSecret(secret)',
			);

		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${secret}`,
			...this.options.headers,
			...custom,
		};
	}
}
