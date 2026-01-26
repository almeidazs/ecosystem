import { REST } from '@abacatepay/rest';
import type {
	APIWithdraw,
	RESTGetCheckQRCodePixStatusData,
	RESTGetListBillingsData,
	RESTGetListCouponsData,
	RESTGetListCustomersData,
	RESTGetListWithdrawsData,
	RESTGetMerchantData,
	RESTGetMRRData,
	RESTGetStoreDetailsData,
	RESTPostCreateCouponBody,
	RESTPostCreateCouponData,
	RESTPostCreateCustomerBody,
	RESTPostCreateCustomerData,
	RESTPostCreateNewChargeBody,
	RESTPostCreateNewChargeData,
	RESTPostCreateNewWithdrawBody,
	RESTPostCreateNewWithdrawData,
	RESTPostCreateQRCodePixBody,
	RESTPostSimulatePaymentData,
} from '@abacatepay/types/v1';
import { Routes } from '@abacatepay/types/v1/routes';
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
		version: 1,
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
			 * Create a new customer.
			 *
			 * @param body Customer creation payload.
			 * @returns The created customer.
			 */
			create(body: RESTPostCreateCustomerBody) {
				return client.post<RESTPostCreateCustomerData>(Routes.customer.create, {
					body,
				});
			},

			/**
			 * List customers.
			 *
			 * @returns The list of customers.
			 */
			list() {
				return client.get<RESTGetListCustomersData>(Routes.customer.list);
			},
		},

		/**
		 * Billing management operations.
		 */
		billings: {
			/**
			 * Create a new checkout.
			 *
			 * @param body Checkout creation payload.
			 * @returns The created checkout.
			 */
			create(body: RESTPostCreateNewChargeBody) {
				return client.post<RESTPostCreateNewChargeData>(Routes.billing.create, {
					body,
				});
			},

			/**
			 * List all checkouts.
			 *
			 * @returns A list of checkouts.
			 */
			list() {
				return client.get<RESTGetListBillingsData>(Routes.billing.list);
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
				return client.post<RESTPostCreateQRCodePixBody>(
					Routes.pix.createQRCode,
					{
						body,
					},
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
				return client.post<RESTPostSimulatePaymentData>(
					Routes.pix.simulatePayment({ id }),
					{
						body: { metadata },
					},
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
					Routes.pix.checkStatus({ id }),
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
				return client.post<RESTPostCreateCouponData>(Routes.coupon.create, {
					body,
				});
			},

			/**
			 * List coupons.
			 *
			 * @returns A list of coupons.
			 */
			list() {
				return client.get<RESTGetListCouponsData>(Routes.coupon.list);
			},
		},

		/**
		 * Withdraw management operations.
		 */
		withdraw: {
			/**
			 * Create a new withdraw.
			 *
			 * @param body Withdraw creation payload.
			 * @returns The created withdraw.
			 */
			create(body: RESTPostCreateNewWithdrawBody) {
				return client.post<RESTPostCreateNewWithdrawData>(
					Routes.withdraw.create,
					{ body },
				);
			},

			/**
			 * List withdraw.
			 *
			 * @returns A list of withdraw.
			 */
			list() {
				return client.get<RESTGetListWithdrawsData>(Routes.withdraw.list);
			},

			/**
			 * Retrieve a withdraw by ID.
			 *
			 * @param id Withdraw ID.
			 * @returns Withdraw details.
			 */
			get(id: string) {
				// TODO: Add this type do @abacatepay/types later
				return client.get<APIWithdraw>(Routes.withdraw.get({ externalId: id }));
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
			 * @returns Revenue metrics for the period.
			 */
			renevue(start: string, end: string) {
				// TODO: Add type and query params in Routes.mrr.revenue
				return client.get<{
					totalRevenue: number;
					totalTransactions: number;
					transactionPerDay: Record<
						string,
						{
							amount: number;
							count: number;
						}
					>;
				}>(`${Routes.mrr.revenue}?startDate=${start}&endDate=${end}`);
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
	};
};
