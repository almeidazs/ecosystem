import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@abacatepay/adapters/webhooks';
import type { Context } from 'elysia';

export { version } from './version';

/**
 * A simple utility which resolves incoming webhook payloads by signing the webhook secret properly.
 * @param options Options to use
 */
export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new Error('Webhook secret is missing in the options');

	return async (context: Context) => {
		if (context.query.webhookSecret !== options.secret) return;

		const signature = context.headers['x-webhook-signature'];

		if (!signature) return;

		const raw = await context.request.text();

		if (!verify(raw, signature)) return;

		const { data, success } = parse(context.body);

		if (!success) return;

		await dispatch(data, options);
	};
};
