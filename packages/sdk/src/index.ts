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
import { Routes } from '@abacatepay/types/v2/routes';
import type { AbacatePayOptions } from './types';

export const AbacatePay = ({ secret, rest }: AbacatePayOptions) => {
	const client = new REST({
		secret,
		...rest,
	});

	return {
        rest: client,
		customers: {
			get(id: string) {
				return client.get<RESTGetCustomerData>(Routes.customers.get(id));
			},
			delete(id: string) {
				return client.delete<RESTDeleteCustomerData>(Routes.customers.delete, {
					body: { id },
				});
			},
			create(body: RESTPostCreateCustomerBody) {
				return client.post<RESTPostCreateCustomerData>(
					Routes.customers.create,
					{ body },
				);
			},
			list(query?: RESTGetListCustomersQueryParams) {
				return client.get<RESTGetListCustomersData>(Routes.customers.list, {
					// @ts-expect-error
					query,
				});
			},
		},
		checkouts: {
			create(body: RESTPostCreateNewCheckoutBody) {
				return client.post<RESTPostCreateNewCheckoutData>(
					Routes.checkouts.create,
					{ body },
				);
			},
			list() {
				return client.post<RESTGetListCheckoutsData>(Routes.checkouts.list);
			},
			get(id: string) {
				return client.get<RESTGetCheckoutData>(Routes.checkouts.get(id));
			},
		},
		pix: {
			create(body: RESTPostCreateQRCodePixBody) {
				return client.post<RESTPostCreateQRCodePixData>(
					Routes.transparents.createQRCode,
					{ body },
				);
			},
			simulate(id: string, metadata?: Record<string, object>) {
				return client.post<RESTPostSimulateQRCodePixPaymentData>(
					Routes.transparents.simulatePayment(id),
					{ body: { metadata } },
				);
			},
			status(id: string) {
				return client.get<RESTGetCheckQRCodePixStatusData>(
					Routes.transparents.checkStatus(id),
				);
			},
		},
		coupons: {
			create(body: RESTPostCreateCouponBody) {
				return client.post<RESTPostCreateCouponData>(Routes.coupons.create, {
					body,
				});
			},
			delete(id: string) {
				return client.delete<RESTDeleteCouponData>(Routes.coupons.delete, {
					body: { id },
				});
			},
			get(id: string) {
				return client.get<RESTGetCouponData>(Routes.coupons.get(id));
			},
			list(query?: RESTGetListCouponsQueryParams) {
				return client.get<RESTGetListCouponsData>(Routes.coupons.list, {
					// @ts-expect-error
					query,
				});
			},
			toggleStatus(id: string) {
				return client.patch<RESTPatchToggleCouponStatusData>(
					Routes.coupons.toggleStatus,
					{ body: { id } },
				);
			},
		},
		store: {
			get() {
				return client.get<RESTGetStoreDetailsData>(Routes.store.get);
			},
		},
		mrr: {
			get() {
				return client.get<RESTGetMRRData>(Routes.mrr.get);
			},
			revenue({ startDate, endDate }: RESTGetRevenueByPeriodQueryParams) {
				return client.get<RESTGetRevenueByPeriodData>(
					Routes.mrr.revenue(startDate, endDate),
				);
			},
			merchant() {
				return client.get<RESTGetMerchantData>(Routes.mrr.merchant);
			},
		},
		payouts: {
			create(body: RESTPostCreateNewPayoutBody) {
				return client.post<RESTPostCreateNewWPayoutData>(
					Routes.payouts.create,
					{ body },
				);
			},
			get(id: string) {
				// TODO: Add type here
				return client.get(Routes.payouts.get(id));
			},
			list(query?: RESTGetListPayoutsQueryParams) {
				return client.get<RESTGetListPayoutsData>(Routes.payouts.list(query));
			},
		},
		subscriptions: {
			create(body: RESTPostCreateSubscriptionBody) {
				return client.post<RESTPostCreateSubscriptionData>(
					Routes.subscriptions.create,
					{ body },
				);
			},
			list(query?: RESTGetListSubscriptionsQueryParams) {
				return client.get<RESTGetListSubscriptionsData>(
					Routes.subscriptions.list(query),
				);
			},
		},
		products: {
			create(body: RESTPostCreateProductBody) {
				return client.post<RESTPostCreateProductData>(Routes.products.create, {
					body,
				});
			},
			get(query: RESTGetProductQueryParams) {
				return client.get<RESTGetProductData>(Routes.products.get(query));
			},
			list(query?: RESTGetListProductsQueryParams) {
                // TODO: Fix the type
                // @ts-expect-error
				return client.get<RESTGetListProductsData>(Routes.products.list(query));
			},
		},
	};
};
