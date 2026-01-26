import { REST } from '@abacatepay/rest';
import type {
	RESTDeleteCouponData,
	RESTDeleteCustomerData,
	RESTGetCheckoutData,
	RESTGetCheckQRCodePixStatusData,
	RESTGetCouponData,
	RESTGetCustomerData,
	RESTGetListCheckoutsData,
	RESTGetListCouponsData,
	RESTGetListCouponsQueryParams,
	RESTGetListCustomersData,
	RESTGetListCustomersQueryParams,
	RESTGetListPayoutsData,
	RESTGetListPayoutsQueryParams,
	RESTGetListProductsData,
	RESTGetListProductsQueryParams,
	RESTGetListSubscriptionsData,
	RESTGetListSubscriptionsQueryParams,
	RESTGetMerchantData,
	RESTGetMRRData,
	RESTGetProductData,
	RESTGetProductQueryParams,
	RESTGetRevenueByPeriodData,
	RESTGetRevenueByPeriodQueryParams,
	RESTGetSearchPayoutData,
	RESTGetStoreDetailsData,
	RESTPatchToggleCouponStatusData,
	RESTPostCreateCouponBody,
	RESTPostCreateCouponData,
	RESTPostCreateCustomerBody,
	RESTPostCreateCustomerData,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateNewCheckoutData,
	RESTPostCreateNewPayoutBody,
	RESTPostCreateNewWPayoutData,
	RESTPostCreateProductBody,
	RESTPostCreateProductData,
	RESTPostCreateQRCodePixBody,
	RESTPostCreateQRCodePixData,
	RESTPostCreateSubscriptionBody,
	RESTPostCreateSubscriptionData,
	RESTPostSimulateQRCodePixPaymentData,
} from '@abacatepay/types/v2';
import { Routes } from '@abacatepay/types/v2';
import type { AbacatePayOptions } from './types';

export * from './types';

/**
 * This is the main entry point for interacting with the AbacatePay API,
 * providing high-level, domain-oriented methods on top of the REST client.
 */
export const AbacatePay = ({ secret, rest }: AbacatePayOptions) => {
	const client = new REST({
		secret,
		...rest,
		version: 2,
	});

	return {
		/**
		 * Low-level REST client instance.
		 *
		 * Exposes the raw REST interface in case you need direct access
		 * to HTTP methods or custom routes.
		 */
		rest: client,

		/**
		 * Customer management operations.
		 */
		customers: {
			/**
			 * Retrieve a customer by its unique identifier.
			 *
			 * @param id Customer ID.
			 * @returns The customer data.
			 */
			get(id: string) {
				return client.get<RESTGetCustomerData>(Routes.customers.get(id));
			},

			/**
			 * Permanently delete a customer.
			 *
			 * @param id Customer ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.delete<RESTDeleteCustomerData>(Routes.customers.delete, {
					body: { id },
				});
			},

			/**
			 * Create a new customer.
			 *
			 * @param body Customer creation payload.
			 * @returns The created customer.
			 */
			create(body: RESTPostCreateCustomerBody) {
				return client.post<RESTPostCreateCustomerData>(
					Routes.customers.create,
					{ body },
				);
			},

			/**
			 * List customers with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A paginated list of customers.
			 */
			list(query?: RESTGetListCustomersQueryParams) {
				return client.get<RESTGetListCustomersData>(
					Routes.customers.list(query),
				);
			},
		},

		/**
		 * Checkout management operations.
		 */
		checkouts: {
			/**
			 * Create a new checkout.
			 *
			 * @param body Checkout creation payload.
			 * @returns The created checkout.
			 */
			create(body: RESTPostCreateNewCheckoutBody) {
				return client.post<RESTPostCreateNewCheckoutData>(
					Routes.checkouts.create,
					{ body },
				);
			},

			/**
			 * List all checkouts.
			 *
			 * @returns A list of checkouts.
			 */
			list() {
				return client.post<RESTGetListCheckoutsData>(Routes.checkouts.list);
			},

			/**
			 * Retrieve a checkout by ID.
			 *
			 * @param id Checkout ID.
			 * @returns The checkout data.
			 */
			get(id: string) {
				return client.get<RESTGetCheckoutData>(Routes.checkouts.get(id));
			},
		},

		/**
		 * PIX payment operations.
		 */
		pix: {
			/**
			 * Create a new PIX QR Code payment.
			 *
			 * @param body PIX creation payload.
			 * @returns The created PIX QR Code.
			 */
			create(body: RESTPostCreateQRCodePixBody) {
				return client.post<RESTPostCreateQRCodePixData>(
					Routes.transparents.createQRCode,
					{ body },
				);
			},

			/**
			 * Simulate a PIX payment for testing purposes.
			 *
			 * @param id PIX transaction ID.
			 * @param metadata Optional metadata to attach to the simulation.
			 * @returns The simulated payment result.
			 */
			simulate(id: string, metadata?: Record<string, object>) {
				return client.post<RESTPostSimulateQRCodePixPaymentData>(
					Routes.transparents.simulatePayment(id),
					{ body: { metadata } },
				);
			},

			/**
			 * Retrieve the current status of a PIX payment.
			 *
			 * @param id PIX transaction ID.
			 * @returns The PIX payment status.
			 */
			status(id: string) {
				return client.get<RESTGetCheckQRCodePixStatusData>(
					Routes.transparents.checkStatus(id),
				);
			},
		},

		/**
		 * Coupon management operations.
		 */
		coupons: {
			/**
			 * Create a new coupon.
			 *
			 * @param body Coupon creation payload.
			 * @returns The created coupon.
			 */
			create(body: RESTPostCreateCouponBody) {
				return client.post<RESTPostCreateCouponData>(Routes.coupons.create, {
					body,
				});
			},

			/**
			 * Delete a coupon.
			 *
			 * @param id Coupon ID.
			 * @returns Deletion result.
			 */
			delete(id: string) {
				return client.delete<RESTDeleteCouponData>(Routes.coupons.delete, {
					body: { id },
				});
			},

			/**
			 * Retrieve a coupon by ID.
			 *
			 * @param id Coupon ID.
			 * @returns The coupon data.
			 */
			get(id: string) {
				return client.get<RESTGetCouponData>(Routes.coupons.get(id));
			},

			/**
			 * List coupons with optional filters.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of coupons.
			 */
			list(query?: RESTGetListCouponsQueryParams) {
				return client.get<RESTGetListCouponsData>(Routes.coupons.list(query));
			},

			/**
			 * Toggle the status of a coupon.
			 *
			 * @param id Coupon ID.
			 * @returns Updated coupon status.
			 */
			toggleStatus(id: string) {
				return client.patch<RESTPatchToggleCouponStatusData>(
					Routes.coupons.toggleStatus,
					{ body: { id } },
				);
			},
		},

		/**
		 * Store-related operations.
		 */
		store: {
			/**
			 * Retrieve store details.
			 *
			 * @returns Store information.
			 */
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.store.get);
			},
		},

		/**
		 * Monthly recurring revenue (MRR) and analytics.
		 */
		mrr: {
			/**
			 * Retrieve MRR metrics.
			 *
			 * @returns MRR data.
			 */
			get() {
				return client.get<RESTGetMRRData>(Routes.mrr.get);
			},

			/**
			 * Retrieve revenue data for a specific period.
			 *
			 * @param params Date range parameters.
			 * @returns Revenue metrics for the period.
			 */
			revenue({ startDate, endDate }: RESTGetRevenueByPeriodQueryParams) {
				return client.get<RESTGetRevenueByPeriodData>(
					Routes.mrr.revenue(startDate, endDate),
				);
			},

			/**
			 * Retrieve merchant-level revenue data.
			 *
			 * @returns Merchant revenue data.
			 */
			merchant() {
				return client.get<RESTGetMerchantData>(Routes.mrr.merchant);
			},
		},

		/**
		 * Payout management operations.
		 */
		payouts: {
			/**
			 * Create a new payout.
			 *
			 * @param body Payout creation payload.
			 * @returns The created payout.
			 */
			create(body: RESTPostCreateNewPayoutBody) {
				return client.post<RESTPostCreateNewWPayoutData>(
					Routes.payouts.create,
					{ body },
				);
			},

			/**
			 * Retrieve a payout by ID.
			 *
			 * @param id Payout ID.
			 * @returns Payout details.
			 */
			get(id: string) {
				return client.get<RESTGetSearchPayoutData>(Routes.payouts.get(id));
			},

			/**
			 * List payouts with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of payouts.
			 */
			list(query?: RESTGetListPayoutsQueryParams) {
				return client.get<RESTGetListPayoutsData>(Routes.payouts.list(query));
			},
		},

		/**
		 * Subscription management operations.
		 */
		subscriptions: {
			/**
			 * Create a new subscription.
			 *
			 * @param body Subscription creation payload.
			 * @returns The created subscription.
			 */
			create(body: RESTPostCreateSubscriptionBody) {
				return client.post<RESTPostCreateSubscriptionData>(
					Routes.subscriptions.create,
					{ body },
				);
			},

			/**
			 * List subscriptions with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of subscriptions.
			 */
			list(query?: RESTGetListSubscriptionsQueryParams) {
				return client.get<RESTGetListSubscriptionsData>(
					Routes.subscriptions.list(query),
				);
			},
		},

		/**
		 * Product management operations.
		 */
		products: {
			/**
			 * Create a new product.
			 *
			 * @param body Product creation payload.
			 * @returns The created product.
			 */
			create(body: RESTPostCreateProductBody) {
				return client.post<RESTPostCreateProductData>(Routes.products.create, {
					body,
				});
			},

			/**
			 * Retrieve a product by query parameters.
			 *
			 * @param query Product query parameters.
			 * @returns The product data.
			 */
			get(query: RESTGetProductQueryParams) {
				return client.get<RESTGetProductData>(Routes.products.get(query));
			},

			/**
			 * List products with optional pagination.
			 *
			 * @param query Optional query parameters.
			 * @returns A list of products.
			 */
			list(query?: RESTGetListProductsQueryParams) {
				return client.get<RESTGetListProductsData>(Routes.products.list(query));
			},
		},
	};
};
