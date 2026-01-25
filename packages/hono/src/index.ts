import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Context } from 'hono';
import { AbacatePayHonoError } from './errors';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;

export { AbacatePayHonoError } from './errors';
export { version } from './version';

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new AbacatePayHonoError(
			'Webhook secret is missing. Set ABACATEPAY_WEBHOOK_SECRET.',
			{
				code: 'WEBHOOK_SECRET_MISSING',
			},
		);

	return async (ctx: Context) => {
		const webhookSecret = ctx.req.query('webhookSecret');

		if (webhookSecret !== options.secret)
			return ctx.json({ error: 'Unauthorized' }, UNAUTHORIZED_STATUS_CODE);

		const signature = ctx.req.header('x-webhook-signature');

		if (!signature)
			return ctx.json({ error: 'Missing signature' }, BAD_REQUEST_STATUS_CODE);

		const raw = await ctx.req.text();

		if (!verify(raw, signature))
			return ctx.json({ error: 'Invalid signature' }, UNAUTHORIZED_STATUS_CODE);

		const { success, data } = parse(JSON.parse(raw));

		if (!success)
			return ctx.json({ error: 'Invalid payload' }, BAD_REQUEST_STATUS_CODE);

		await dispatch(data, options);
	};
};
