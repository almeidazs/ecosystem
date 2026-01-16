import type { PaymentStatus } from './checkout';

/**
 * https://docs.abacatepay.com/pages/transparents/reference
 */
export interface APIQRCodePIX {
	/**
	 * Unique QRCode PIX identifier.
	 */
	id: string;
	/**
	 * Charge amount in cents (e.g. 4000 = R$40.00).
	 */
	amount: number;
	/**
	 * PIX status. Can be `PENDING`, `EXPIRED`, `CANCELLED`, `PAID`, `REFUNDED`.
	 *
	 * @see {@link PaymentStatus}
	 */
	status: PaymentStatus;
	/**
	 * Indicates whether the charge is in a testing (true) or production (false) environment.
	 */
	devMode: boolean;
	/**
	 * PIX code (copy-and-paste) for payment.
	 */
	brCode: string;
	/**
	 * PIX code in Base64 format (Useful for displaying in images).
	 */
	brCodeBase64: string;
	/**
	 * Platform fee in cents. Example: 80 means R$0.80.
	 */
	platformFee: number;
	/**
	 * QRCode PIX creation date and time.
	 */
	createdAt: string;
	/**
	 * QRCode PIX last updated date and time.
	 */
	updatedAt: string;
	/**
	 * QRCode expiration date and time.
	 */
	expiresAt: string;
}
