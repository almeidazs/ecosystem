import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Request, Response } from 'express';
import { AbacatePayExpressError } from './errors';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_CONTENT_STATUS_CODE = 204;

export { AbacatePayExpressError } from './errors';
export { version } from './version';

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new AbacatePayExpressError(
			'Webhook secret is missing. Set ABACATEPAY_WEBHOOK_SECRET.',
			{ code: 'WEBHOOK_SECRET_MISSING' },
		);

	return async (req: Request, res: Response) => {
		const { webhookSecret } = req.query;

		if (webhookSecret !== options.secret)
			return res
				.status(UNAUTHORIZED_STATUS_CODE)
				.json({ error: 'Unauthorized' });

		const signature = req.headers['x-webhook-signature'];

		if (typeof signature !== 'string')
			return res
				.status(BAD_REQUEST_STATUS_CODE)
				.json({ error: 'Missing signature' });

		const { body } = req;

		if (!Buffer.isBuffer(body))
			return res
				.status(BAD_REQUEST_STATUS_CODE)
				.json({ error: 'Invalid raw body' });

		const raw = body.toString('utf8');

		if (!verify(raw, signature))
			return res
				.status(UNAUTHORIZED_STATUS_CODE)
				.json({ error: 'Invalid signature' });

		let parsed: unknown;

		try {
			parsed = JSON.parse(raw);
		} catch {
			return res
				.status(BAD_REQUEST_STATUS_CODE)
				.json({ error: 'Invalid JSON' });
		}

		const { data, success } = parse(parsed);

		if (!success)
			return res
				.status(BAD_REQUEST_STATUS_CODE)
				.json({ error: 'Invalid payload' });

		await dispatch(data, options);

		return res.status(NO_CONTENT_STATUS_CODE).send();
	};
};
