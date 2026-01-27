/**
 * Represents an API error returned by AbacatePay.
 */
export class AbacatePayError extends Error {
	public constructor(public message: string) {
		super(message);

		this.name = 'AbacatePayError';
	}
}

/**
 * Represents any HTTP error.
 */
export class HTTPError extends Error {
	public constructor(
		/**
		 * The content of the error message.
		 */
		public message: string,
		/**
		 * Route that returned the error (e.g. `/store/get`).
		 */
		public route: string,
		/**
		 * Status code of the response.
		 */
		public status: number,
		/**
		 * Method used in the request.
		 */
		public method: string,
	) {
		super(message);

		this.name = `HTTPError(${route})`;
	}
}
