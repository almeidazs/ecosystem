import type { PaymentMethod } from './checkout';

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export interface APISubscription {
	/**
	 * The ID of the subscription.
	 */
	id: string;
	/**
	 * The subscription value in cents.
	 */
	amount: number;
	/**
	 * Subscription currency.
	 */
	currency: string;
	/**
	 * Subscription name.
	 */
	name: string;
	/**
	 * Subscription description.
	 */
	description: string;
	/**
	 * Unique identifier of the subscription on your system.
	 */
	externalId: string;
	/**
	 * Indicates whether the signature was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Subscription creation date.
	 */
	createdAt: string;
	/**
	 * Subscription update date.
	 */
	updatedAt: string;
	/**
	 * Payment method for the subscription.
	 */
	method: PaymentMethod;
	/**
	 * Status of the subscription.
	 */
	status: SubscriptionStatus;
	/**
	 * Billing frequency configuration.
	 */
	frequency: {
		/**
		 * Subscription billing cycle.
		 */
		cycle: 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'DAILY';
		/**
		 * Day of the month the charge will be processed (1-31).
		 */
		dayOfProcessing: number;
	};
	/**
	 * Identifier of the customer who will have the signature.
	 */
	customerId: string;
	/**
	 * Retry policy in case of payment failure.
	 */
	retryPolicy: {
		/**
		 * Maximum number of billing attempts.
		 */
		maxRetry: number;
		/**
		 * Interval in days between charging attempts.
		 */
		retryEvery: number;
	};
	/**
	 * Array of events related to the subscription.
	 */
	events: APISubscriptionEvent[];
}

export enum SubscriptionStatus {
	Pending = 'PENDING',
	Active = 'ACTIVE',
	Cancelled = 'CANCELLED',
	Expired = 'EXPIRED',
	Failed = 'FAILED',
}

/**
 * https://docs.abacatepay.com/pages/subscriptions/reference#estrutura
 */
export interface APISubscriptionEvent {
	/**
	 * Event type.
	 *
	 * @remarks We need to use `(string & {})` because we don't know exactly all possible values.
	 */
	event: 'CREATED' | (string & {});
	/**
	 * Event description.
	 */
	description: string;
	/**
	 * Event creation date.
	 */
	createdAt: string;
}
