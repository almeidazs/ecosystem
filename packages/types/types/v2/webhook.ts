import type { APIPayout, PaymentMethod, PaymentStatus, PayoutStatus } from '.';

export interface BaseWebhookEvent<
	Type extends WebhookEventType,
	Data extends object,
> {
	/**
	 * The data received in the event.
	 */
	data: Data;
	/**
	 * Unique identifier for the webhook.
	 */
	id: string;
	/**
	 * This field identifies the type of event received.
	 */
	event: Type;
	/**
	 * Indicates whether the event occurred in the development environment.
	 */
	devMode: boolean;
}

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-failed
 */
export type WebhookPayoutFailedEvent = BaseWebhookEvent<
	WebhookEventType.PayoutFailed,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIPayout, 'status'> & {
			/**
			 * Status of the payout. Always `PayoutStatus.Cancelled`.
			 *
			 * @see {@link PayoutStatus.Cancelled}
			 */
			status: PayoutStatus.Cancelled;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#payout-done
 */
export type WebhookPayoutDoneEvent = BaseWebhookEvent<
	WebhookEventType.PayoutDone,
	{
		/**
		 * Transaction data.
		 */
		transaction: Omit<APIPayout, 'status'> & {
			/**
			 * Status of the payout. Always `PayoutStatus.Complete`.
			 *
			 * @see {@link PayoutStatus.Complete}
			 */
			status: PayoutStatus.Complete;
		};
	}
>;

/**
 * https://docs.abacatepay.com/pages/webhooks#billing-paid
 */
export type WebhookBillingPaidEvent = BaseWebhookEvent<
	WebhookEventType.BillingPaid,
	{
		/**
		 * Payment data.
		 */
		payment: {
			/**
			 * Charge amount in cents (e.g. 4000 = R$40.00).
			 */
			amount: number;
			/**
			 * The fee charged by AbacatePay.
			 */
			fee: 80;
			/**
			 * Payment method.
			 *
			 * @see {@link PaymentMethod}
			 */
			method: PaymentMethod;
		};
	} & (
		| {
				pixQrCode: {
					/**
					 * Charge amount in cents (e.g. 4000 = R$40.00).
					 */
					amount: number;
					/**
					 * Unique billing identifier.
					 */
					id: string;
					/**
					 * Kind of the payment
					 */
					kind: 'PIX';
					/**
					 * Billing status, can only be `PAID` here
					 *
					 * @see {@link PaymentStatus.Paid}
					 */
					status: PaymentStatus.Paid;
				};
		  }
		| {
				billing: {
					/**
					 * Charge amount in cents (e.g. 4000 = R$40.00).
					 */
					amount: number;
					/**
					 * Unique billing identifier.
					 */
					id: string;
					/**
					 * Bill ID in your system.
					 */
					externalId: string;
					/**
					 * Status of the payment. Always `PaymentStatus.Paid`.
					 *
					 * @see {@link PaymentStatus.Paid}
					 */
					status: PaymentStatus.Paid;
					/**
					 * URL where the user can complete the payment.
					 */
					url: string;
				};
		  }
	)
>;

/**
 * https://docs.abacatepay.com/pages/webhooks
 *
 * Any field that contains the tag "@unstable" means that the field is an assumption, it is uncertain (Since AbacatePay does not provide any information about).
 */
export type WebhookEvent =
	| WebhookPayoutDoneEvent
	| WebhookPayoutFailedEvent
	| WebhookBillingPaidEvent;

/**
 * https://docs.abacatepay.com/pages/webhooks
 */
export enum WebhookEventType {
	PayoutFailed = 'payout.failed',
	PayoutDone = 'payout.done',
	BillingPaid = 'billing.paid',
}
