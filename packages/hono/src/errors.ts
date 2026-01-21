interface AbacatePayHonoErrorOptions {
	code: string;
}

export class AbacatePayHonoError extends Error {
	/**
	 * The code of the error.
	 */
	readonly code: string;
	/**
	 * URL for the docs of [@abacatepay/hono](https://www.npmjs.com/package/@abacatepay/hono)
	 */
	static readonly docs = 'https://docs.abacatepay.com/pages/ecosystem/hono';

	constructor(message: string, options: AbacatePayHonoErrorOptions) {
		super(message);

		this.code = options.code;
		this.name = 'AbacatePayHonoError';
	}
}
