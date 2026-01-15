export interface RESTOptions {
	base?: string;
	secret?: string;
	timeout?: number;
	retry?: RetryOptions;
	version?: string | number;
	headers?: Record<string, string>;
	onRateLimit?(response: Response): unknown;
}

export interface MakeRequestOptions
	extends Pick<RESTOptions, 'retry' | 'headers'> {
	body?: unknown;
	method: HTTPMethodLike;
	query?: string | Record<string, string> | URLSearchParams;
}

export type MakeRequestOptionsWithoutMethod = Omit<
	MakeRequestOptions,
	'method'
>;

export interface RetryOptions {
	max: number;
	// TODO: Change this to backoff
	delay?: number;
}

export type HTTPMethodLike =
	| 'GET'
	| 'PUT'
	| 'POST'
	| 'HEAD'
	| 'PATCH'
	| 'DELETE'
	| (string & {});
