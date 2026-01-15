export class AbacatePayError extends Error {
	public constructor(public message: string) {
		super(message);

		this.name = 'AbacatePayError';
	}
}

export class HTTPError extends Error {
	public constructor(
		public route: string,
		public message: string,
	) {
		super(message);

		this.name = `AbacatePayError(${route})`;
	}
}
