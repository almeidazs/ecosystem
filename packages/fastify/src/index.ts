import { WebhookEvent } from '@abacatepay/zod/v2';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AbacatePayFastifyError } from './errors';
import type { WebhookOptions } from './types';
import { verifyWebhookSignature } from './utils';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_CONTENT_STATUS_CODE = 204;

export { AbacatePayFastifyError } from './errors';
export * from './types';
export { version } from './version';

export const Webhooks = ({
	secret,
	onPayload,
	onPayoutDone,
	onBillingPaid,
	onPayoutFailed,
}: WebhookOptions) => {
	if (!secret)
		throw new AbacatePayFastifyError(
			'Webhook secret is missing. Set ABACATEPAY_WEBHOOK_SECRET.',
			{ code: 'WEBHOOK_SECRET_MISSING' },
		);

	return async (req: FastifyRequest, reply: FastifyReply) => {
		const { webhookSecret } = req.query as Record<string, string | undefined>;

		if (webhookSecret !== secret)
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

		if (!verifyWebhookSignature(body, signature))
			return reply
				.status(UNAUTHORIZED_STATUS_CODE)
				.send({ error: 'Invalid signature' });

		const { data, success } = WebhookEvent.safeParse(JSON.parse(body));

		if (!success)
			return reply
				.status(BAD_REQUEST_STATUS_CODE)
				.send({ error: 'Invalid payload' });

		switch (data.event) {
			case 'billing.paid':
				await (onBillingPaid ?? onPayload)?.(data);

				break;
			case 'payout.done':
				await (onPayoutDone ?? onPayload)?.(data);

				break;
			case 'payout.failed':
				await (onPayoutFailed ?? onPayload)?.(data);

				break;
		}

		return reply.status(NO_CONTENT_STATUS_CODE).send();
	};
};
