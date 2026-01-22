import type {
	WebhookBillingPaidEvent,
	WebhookEvent,
	WebhookPayoutDoneEvent,
	WebhookPayoutFailedEvent,
} from '@abacatepay/zod/v2';

/**
 * Options to use in Webhooks
 */
export interface WebhookOptions {
	/**
	 * The webhook secret to use in the validation
	 */
	secret: string;
	/**
	 * Catch-all function for all Webhook events
	 */
	onPayload?(data: WebhookEvent): unknown;
	/**
	 * Function to execute when a `payout.done` event is trigerred
	 */
	onPayoutDone?(data: WebhookPayoutDoneEvent): unknown;
	/**
	 * Function to execute when a `billind.paid` event is trigerred
	 */
	onBillingPaid?(data: WebhookBillingPaidEvent): unknown;
	/**
	 * Function to execute when a `payout.failed` event is trigerred
	 */
	onPayoutFailed?(data: WebhookPayoutFailedEvent): unknown;
}
