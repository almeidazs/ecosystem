import type {
	APICheckout,
	APICoupon,
	APICustomer,
	APIPayout,
	APIQRCodePIX,
	APIStore,
	CouponDiscountKind,
	PaymentMethod,
	PaymentStatus,
} from '.';
import type { APIProduct } from './entities/products';
import type { APISubscription } from './entities/subscription';

/**
 * Any response returned by the AbacatePay API
 */
export type APIResponse<Data> =
	| {
			/**
			 * The data of the response
			 */
			data: Data;
			error: null;
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API
			 */
			error: string;
	  };

/**
 * Any response returned by the AbacatePay API that has a `pagination` field (Not cursor based)
 */
export type APIResponseWithPagination<Data> =
	| {
			/**
			 * The data of the response
			 */
			data: Data;
			error: null;
			/**
			 * Pagination info
			 */
			pagination: {
				/**
				 * Current page
				 */
				page: number;
				/**
				 * Number of items per page
				 */
				limit: number;
				/**
				 * Number of items
				 */
				items: number;
				/**
				 * Number of pages
				 */
				totalPages: number;
			};
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API
			 */
			error: string;
	  };

/**
 * Any response returned by the AbacatePay API that has a `pagination` field and is cursor-based
 */
export type APIResponseWithCursorBasedPagination<Data> =
	| {
			/**
			 * The data of the response
			 */
			data: Data;
			error: null;
			/**
			 * Pagination info
			 */
			pagination: {
				/**
				 * Number of items per page
				 */
				limit: number;
				/**
				 * Indicates whether there is a next page.
				 */
				hasNext: boolean;
				/**
				 * Indicates whether there is a previous page.
				 */
				hasPrevious: boolean;
				/**
				 * Cursor for the next page
				 */
				nextCursor: string | null;
			};
	  }
	| {
			data: null;
			/**
			 * Error message returned from the API
			 */
			error: string;
	  };

/**
 * https://api.abacatepay.com/v2/customers/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = Pick<APICustomer, 'email'> &
	Partial<
		Pick<APICustomer, 'name' | 'taxId' | 'zipCode' | 'cellphone' | 'metadata'>
	>;

/**
 * https://api.abacatepay.com/v2/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = APICustomer;

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkout/create
 */
export interface RESTPostCreateNewCheckoutBody {
	/**
	 * Payment method that will be used.
	 *
	 * @see {@link PaymentMethod}
	 */
	methods?: PaymentMethod;
	/**
	 * URL to redirect the customer if they click on the "Back" option.
	 */
	returnUrl?: string;
	/**
	 * URL to redirect the customer when payment is completed.
	 */
	completionUrl?: string;
	/**
	 * The ID of a customer already registered in your store.
	 */
	customerId?: string;
	/**
	 * Your customer's data to create it.
	 * The customer object is not mandatory, but when entering any `customer` information, all `name`, `cellphone`, `email` and `taxId` fields are mandatory.
	 */
	customer?: Pick<APICustomer, 'name' | 'email' | 'taxId' | 'cellphone'>;
	/**
	 * List of coupons available for resem used with billing (0-50 max.).
	 */
	coupons?: string[];
	/**
	 * If you have a unique identifier for your billing application, completely optional.
	 */
	externalId?: string;
	/**
	 * Optional billing metadata.
	 */
	metadata?: Record<string, object>;
	/**
	 * List of items included in the charge.
	 * This is the only required field — the total value is calculated from these items.
	 */
	items: APICheckout['items'];
}

/**
 * https://api.abacatepay.com/v2/checkouts/create
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/create
 */
export type RESTPostCreateNewCheckoutData = APICheckout;

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export interface RESTPostCreateQRCodePixBody
	extends Pick<RESTPostCreateNewCheckoutBody, 'customer' | 'metadata'> {
	/**
	 * Charge amount in cents.
	 */
	amount: number;
	/**
	 * Billing expiration time in seconds.
	 */
	expiresIn?: number;
	/**
	 * Message that will appear when paying the PIX.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/create
 *
 * @reference https://docs.abacatepay.com/pages/transparents/create
 */
export type RESTPostCreateQRCodePixData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export interface RESTPostSimulateQRCodePixPaymentQueryParams {
	/**
	 * QRCode Pix ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export interface RESTPostSimulateQRCodePixPaymentBody {
	/**
	 * Optional metadata for the request.
	 */
	metadata?: Record<string, object>;
}

/**
 * https://api.abacatepay.com/v2/transparents/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/transparents/simulate-payment
 */
export type RESTPostSimulateQRCodePixPaymentData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
 */
export interface RESTGetCheckQRCodePixStatusQueryParams {
	/**
	 * QRCode Pix ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/transparents/check
 *
 * @reference https://docs.abacatepay.com/pages/transparents/check
 */
export interface RESTGetCheckQRCodePixStatusData {
	/**
	 * QRCode Pix expiration date.
	 */
	expiresAt: string;
	/**
	 * Information about the progress of QRCode Pix.
	 */
	status: PaymentStatus;
}

/**
 * https://api.abacatepay.com/v2/checkouts/list
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/list
 */
export type RESTGetListCheckoutsData = APICheckout[];

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export type RESTGetCheckoutData = APICheckout;

/**
 * https://api.abacatepay.com/v2/checkouts/get
 *
 * @reference https://docs.abacatepay.com/pages/checkouts/get
 */
export interface RESTGetCheckoutQueryParams {
	/**
	 * Unique billing identifier.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = APICustomer[];

/**
 * https://api.abacatepay.com/v2/customers/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export interface RESTGetListCustomersQueryParams {
	/**
	 * Number of the page.
	 */
	page?: number;
	/**
	 * Number of items per page.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export interface RESTGetCustomerQueryParams {
	/**
	 * The ID of the customer.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/get
 *
 * @reference https://docs.abacatepay.com/pages/client/get
 */
export type RESTGetCustomerData = Omit<APICustomer, 'country' | 'zipCode'>;

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export interface RESTDeleteCustomerBody {
	/**
	 * Unique public identifier of the customer to be deleted.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/customers/delete
 *
 * @reference https://docs.abacatepay.com/pages/client/delete
 */
export type RESTDeleteCustomerData = Omit<APICustomer, 'country' | 'zipCode'>;

/**
 * https://api.abacatepay.com/v2/coupons/create
 *
 * @reference https://docs.abacatepay.com/pages/coupons/create
 */
export interface RESTPostCreateCouponBody {
	/**
	 * Unique coupon identifier.
	 *
	 * @example "DEYVIN_20"
	 */
	code: string;
	/**
	 * Discount amount to be applied.
	 */
	discount: number;
	/**
	 * Type of discount applied, percentage or fixed.
	 *
	 * @see {@link CouponDiscountKind}
	 */
	discountKind: CouponDiscountKind;
	/**
	 * Coupon description
	 */
	notes?: string;
	/**
	 * Number of times the coupon can be redeemed. -1 means this coupon can be redeemed without limits.
	 *
	 * @default -1
	 */
	maxRedeems?: number;
	/**
	 * Key value object for coupon metadata.
	 */
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/coupon/create
 *
 * @reference https://docs.abacatepay.com/pages/coupon/create
 */
export type RESTPostCreateCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export interface RESTPostCreateNewPayoutBody {
	/**
	 * Unique identifier of the payout in your system.
	 */
	externalId: string;
	/**
	 * Payout value in cents (Min 350).
	 */
	amount: number;
	/**
	 * Optional payout description.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/create
 *
 * @reference https://docs.abacatepay.com/pages/payouts/create
 */
export type RESTPostCreateNewWPayoutData = APIPayout;

/**
 * https://api.abacatepay.com/v2/payouts/get
 *
 * @reference https://docs.abacatepay.com/pages/payouts/get
 */
export interface RESTGetSearchPayoutQueryParams {
	/**
	 * Unique payout identifier in your system.
	 */
	externalId: string;
}

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export interface RESTGetListPayoutsQueryParams {
	/**
	 * Number of the page
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export interface RESTGetRevenueByPeriodQueryParams {
	/**
	 * Period start date (YYYY-MM-DD format).
	 */
	startDate: string;
	/**
	 * Period end date (YYYY-MM-DD format).
	 */
	endDate: string;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/revenue
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/list
 */
export interface RESTGetRevenueByPeriodData {
	/**
	 * Total revenue for the period in cents.
	 */
	totalRevenue: number;
	/**
	 * Total transactions in the period.
	 */
	totalTransactions: number;
	/**
	 * Object with transactions grouped by day (key is the date in YYYY-MM-DD format).
	 */
	transactionsPerDay: Record<
		string,
		{
			/**
			 * Total value of the day's transactions in cents.
			 */
			amount: number;
			/**
			 * Number of transactions for the day.
			 */
			count: number;
		}
	>;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/merchant-info
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/get
 */
export interface RESTGetMerchantData {
	/**
	 * Store name.
	 */
	name: string;
	/**
	 * Store website.
	 */
	website: string;
	/**
	 * Store creation date.
	 */
	createdAt: string;
}

/**
 * https://api.abacatepay.com/v2/public-mrr/mrr
 *
 * @reference https://docs.abacatepay.com/pages/trustMRR/mrr
 */
export interface RESTGetMRRData {
	/**
	 * Monthly recurring revenue in cents. Value 0 indicates that there is no recurring revenue at the moment.
	 */
	mrr: number;
	/**
	 * Total active subscriptions. Value 0 indicates that there are no currently active subscriptions.
	 */
	totalActiveSubscriptions: number;
}

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = APIStore;

/**
 * https://api.abacatepay.com/v2/payouts/list
 *
 * @reference https://docs.abacatepay.com/pages/payouts/list
 */
export type RESTGetListPayoutsData = APIPayout[];

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export type RESTGetListCouponsData = APICoupon[];

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export interface RESTGetListCouponsQueryParams {
	/**
	 * Page number.
	 *
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export interface RESTGetCouponQueryParams {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/get
 *
 * @reference https://docs.abacatepay.com/pages/coupons/get
 */
export type RESTGetCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export interface RESTDeleteCouponBody {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/delete
 *
 * @reference https://docs.abacatepay.com/pages/coupons/delete
 */
export type RESTDeleteCouponData = APICoupon;

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export interface RESTPatchToggleCouponStatusBody {
	/**
	 * The ID of the coupon.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPatchToggleCouponStatusData = APICoupon;

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export interface RESTPostCreateProductBody
	extends Pick<APIProduct, 'externalId' | 'name' | 'price' | 'currency'> {
	/**
	 * Description for the product
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/products/create
 *
 * @reference https://docs.abacatepay.com/pages/products/create
 */
export type RESTPostCreateProductData = APIProduct;

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export interface RESTGetListProductsQueryParams {
	/**
	 * Page number.
	 */
	page?: number;
	/**
	 * Limit of products to return.
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/products/list
 *
 * @reference https://docs.abacatepay.com/pages/products/list
 */
export type RESTGetListProductsData = APIProduct[];

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export interface RESTGetProductQueryParams {
	/**
	 * The product ID.
	 */
	id?: string;
	/**
	 * External ID of the product.
	 */
	externalId?: string;
}

/**
 * https://api.abacatepay.com/v2/products/get
 *
 * @reference https://docs.abacatepay.com/pages/products/get
 */
export type RESTGetProductData = APIProduct;

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export interface RESTPostCreateSubscriptionBody
	extends Pick<
		APISubscription,
		| 'amount'
		| 'name'
		| 'externalId'
		| 'method'
		| 'frequency'
		| 'customerId'
		| 'retryPolicy'
	> {
	/**
	 * Subscription description.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/create
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/create
 */
export type RESTPostCreateSubscriptionData = APISubscription;

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export interface RESTGetListSubscriptionsQueryParams {
	/**
	 * Cursor for the pagination.
	 */
	cursor?: string;
	/**
	 * Number of items per page.
	 *
	 * @default 20
	 */
	limit?: number;
}

/**
 * https://api.abacatepay.com/v2/subscriptions/list
 *
 * @reference https://docs.abacatepay.com/pages/subscriptions/list
 */
export type RESTGetListSubscriptionsData = APISubscription[];
