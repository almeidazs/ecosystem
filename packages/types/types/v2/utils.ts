import { type WebhookEvent, WebhookEventType } from './webhook';

/**
 * A type guard check for `payout.done` webhook events
 * @param event - The webhook event to check against
 * @returns A boolean that indicates if the webhook is a payout done webhook
 */
export function isPayoutDoneWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.PayoutDone;
}

/**
 * A type guard check for `payout.failed` webhook events
 * @param event - The webhook event to check against
 * @returns A boolean that indicates if the webhook is a payout failed webhook
 */
export function isPayoutFailedWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.PayoutFailed;
}

/**
 * A type guard check for `billing.paid` webhook events
 * @param event - The webhook event to check against
 * @returns A boolean that indicates if the webhook is a billing paid webhook
 */
export function isBillingPaidWebhookEvent(event: WebhookEvent) {
	return event.event === WebhookEventType.BillingPaid;
}
