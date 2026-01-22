import { WebhookEvent } from '@abacatepay/zod/v2';
import type { Context } from 'hono';
import { AbacatePayHonoError } from './errors';
import type { WebhookOptions } from './types';
import { verifyWebhookSignature } from './utils';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;

export { AbacatePayHonoError } from './errors';
export { version } from './version';

export const Webhooks = ({
	secret,
	onPayload,
	onPayoutDone,
	onBillingPaid,
	onPayoutFailed,
}: WebhookOptions) => {
	if (!secret)
		throw new AbacatePayHonoError(
			'Webhook secret is missing. Set ABACATEPAY_WEBHOOK_SECRET.',
			{
				code: 'WEBHOOK_SECRET_MISSING',
			},
		);

	return async (ctx: Context) => {
		const webhookSecret = ctx.req.query('webhookSecret');

		if (webhookSecret !== secret)
			return ctx.json({ error: 'Unauthorized' }, UNAUTHORIZED_STATUS_CODE);

		const signature = ctx.req.header('x-webhook-signature');

		if (!signature)
			return ctx.json({ error: 'Missing signature' }, BAD_REQUEST_STATUS_CODE);

		const raw = await ctx.req.text();

		if (!verifyWebhookSignature(raw, signature))
			return ctx.json({ error: 'Invalid signature' }, UNAUTHORIZED_STATUS_CODE);

		const { success, data } = WebhookEvent.safeParse(JSON.parse(raw));

		if (!success)
			return ctx.json({ error: 'Invalid payload' }, BAD_REQUEST_STATUS_CODE);

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
	};
};
