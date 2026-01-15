import type {
	APICharge,
	APICoupon,
	APICustomer,
	APIQRCodePIX,
	APIStore,
	APIWithdraw,
	CouponDiscountKind,
	PaymentFrequency,
	PaymentMethod,
	PaymentStatus,
} from '.';

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
 * https://api.abacatepay.com/v2/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerBody = APICustomer['metadata'];

/**
 * https://api.abacatepay.com/v2/customer/create
 *
 * @reference https://docs.abacatepay.com/pages/client/create
 */
export type RESTPostCreateCustomerData = APICustomer;

/**
 * https://api.abacatepay.com/v2/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export interface RESTPostCreateNewChargeBody {
	/**
	 * Payment methods that will be used. Currently, only `PIX` is supported, `CARD` is in beta.
	 *
	 * @see {@link PaymentMethod}
	 */
	methods: PaymentMethod[];
	/**
	 * Defines the type of billing frequency. For one-time charges, use `ONE_TIME`. For charges that can be paid more than once, use `MULTIPLE_PAYMENTS`.
	 *
	 * @see {@link PaymentFrequency}
	 */
	frequency: PaymentFrequency;
	/**
	 * List of products your customer is paying for.
	 */
	products: {
		/**
		 * The product id on your system. We use this id to create your product on AbacatePay automatically, so make sure your id is unique.
		 *
		 * @example "prod-1234"
		 */
		externalId: string;
		/**
		 * Product name.
		 *
		 * @example "Assinatura de Programa Fitness"
		 */
		name: string;
		/**
		 * Quantity of product being purchased.
		 *
		 * @example 2
		 */
		quantity: number;
		/**
		 * Price per unit of product in cents. The minimum is 100 (1 BRL).
		 */
		price: number;
		/**
		 * Detailed product description.
		 */
		description?: string;
	}[];
	/**
	 * URL to redirect the customer if they click on the "Back" option.
	 */
	returnUrl: string;
	/**
	 * URL to redirect the customer when payment is completed.
	 */
	completionUrl: string;
	/**
	 * The ID of a customer already registered in your store.
	 */
	customerId?: string;
	/**
	 * /**
	 * Your customer's data to create it.
	 * The customer object is not mandatory, but when entering any `customer` information, all `name`, `cellphone`, `email` and `taxId` fields are mandatory.
	 */
	customer?: APICustomer['metadata'];
	/**
	 * If true coupons can be used in billing.
	 *
	 * @default false
	 */
	allowCoupons?: boolean;
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
	metadata?: Record<string, unknown>;
}

/**
 * https://api.abacatepay.com/v2/billing/create
 *
 * @reference https://docs.abacatepay.com/pages/payment/create
 */
export type RESTPostCreateNewChargeData = APICharge;

/**
 * https://api.abacatepay.com/v2/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export interface RESTPostCreateQRCodePixBody
	extends Pick<RESTPostCreateNewChargeBody, 'customer' | 'metadata'> {
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
 * https://api.abacatepay.com/v2/pixQrCode/create
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/create
 */
export type RESTPostCreateQRCodePixData = APIQRCodePIX;

/**
 * https://api.abacatepay.com/v2/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export interface RESTPostSimulatePaymentQueryParams {
	/**
	 * QRCode Pix ID.
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/pixQrCode/simulate-payment
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment
 */
export type RESTPostSimulatePaymentData = APIQRCodePIX;

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
 * https://api.abacatepay.com/v2/pixQrCode/check
 *
 * @reference https://docs.abacatepay.com/pages/pix-qrcode/check
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
};

/**
 * https://api.abacatepay.com/v2/billing/list
 *
 * @reference https://docs.abacatepay.com/pages/payment/list
 */
export type RESTGetListBillingsData = APICharge[];

/**
 * https://api.abacatepay.com/v2/customer/list
 *
 * @reference https://docs.abacatepay.com/pages/client/list
 */
export type RESTGetListCustomersData = APICustomer[];

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
 * https://api.abacatepay.com/v2/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export interface RESTPostCreateNewWithdrawBody {
	/**
	 * Unique identifier of the withdrawal in your system.
	 */
	externalId: string;
	/**
	 * Withdrawal method available.
	 */
	method: 'PIX';
	/**
	 * Withdrawal value in cents (Min 350).
	 */
	amount: number;
	/**
	 * PIX key data to receive the withdrawal.
	 */
	pix: {
		/**
		 * PIX key type.
		 */
		type: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM' | 'BR_CODE';
		/**
		 * PIX key value.
		 */
		key: string;
	};
	/**
	 * Optional description of the withdrawal.
	 */
	description?: string;
}

/**
 * https://api.abacatepay.com/v2/withdraw/create
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/create
 */
export type RESTPostCreateNewWithdrawData = APIWithdraw;

/**
 * https://api.abacatepay.com/v2/withdraw/get
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/get
 */
export interface RESTGetSearchWithdrawQueryParams {
	/**
	 * Unique identifier of the withdrawal in your system.
	 */
	externalId: string;
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
};

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
};

/**
 * https://api.abacatepay.com/v2/store/get
 *
 * @reference https://docs.abacatepay.com/pages/store/get
 */
export type RESTGetStoreDetailsData = APIStore;

/**
 * https://api.abacatepay.com/v2/withdraw/list
 *
 * @reference https://docs.abacatepay.com/pages/withdraw/list
 */
export type RESTGetListWithdrawsData = APIWithdraw[];

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
// TODO: Add `pagination` field
export type RESTGetListCouponsData = APICoupon[];

/**
 * https://api.abacatepay.com/v2/coupons/list
 *
 * @reference https://docs.abacatepay.com/pages/coupons/list
 */
export interface RESTGetListCouponsQueryParams {
	/**
	 * Page number
	 * 
	 * @default 1
	 */
	page?: number;
	/**
	 * Number of items per page
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
	 * The ID of the coupon
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
	 * The ID of the coupon
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
	 * The ID of the coupon
	 */
	id: string;
}

/**
 * https://api.abacatepay.com/v2/coupons/toggle
 *
 * @reference https://docs.abacatepay.com/pages/coupons/toggle
 */
export type RESTPatchToggleCouponStatusData = APICoupon;
