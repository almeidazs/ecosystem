import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AbacatePayFastifyError } from './errors';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_CONTENT_STATUS_CODE = 204;

export { AbacatePayFastifyError } from './errors';
export { version } from './version';

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new AbacatePayFastifyError(
			'Webhook secret is missing.',
			{ code: 'WEBHOOK_SECRET_MISSING' },
		);

	return async (req: FastifyRequest, reply: FastifyReply) => {
		const { webhookSecret } = req.query as Record<string, string | undefined>;

		if (webhookSecret !== options.secret)
			return reply
				.status(UNAUTHORIZED_STATUS_CODE)
				.send({ error: 'Unauthorized' });

		const signature = req.headers['x-webhook-signature'];

		if (typeof signature !== 'string')
			return reply
				.status(BAD_REQUEST_STATUS_CODE)
				.send({ error: 'Missing signature' });

		const { body } = req;

		if (typeof body !== 'string')
			return reply
				.status(BAD_REQUEST_STATUS_CODE)
				.send({ error: 'Invalid raw body' });

		if (!verify(body, signature))
			return reply
				.status(UNAUTHORIZED_STATUS_CODE)
				.send({ error: 'Invalid signature' });

		const { data, success } = parse(JSON.parse(body));

		if (!success)
			return reply
				.status(BAD_REQUEST_STATUS_CODE)
				.send({ error: 'Invalid payload' });

		await dispatch(data, options);

		return reply.status(NO_CONTENT_STATUS_CODE).send();
	};
};
