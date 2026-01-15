import { z } from 'zod';

export const ValidationUtils = {
	validateCPF: (cpf: string): boolean => {
		const cleanCpf = cpf.replace(/\D+/g, '');
		if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
			return false;
		}

		let sum = 0;
		for (let i = 0; i < 9; i++) {
			sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
		}
		let remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) remainder = 0;
		if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

		sum = 0;
		for (let i = 0; i < 10; i++) {
			sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
		}
		remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) remainder = 0;
		return remainder === parseInt(cleanCpf.charAt(10));
	},

	/**
	 * Validate Brazilian CNPJ
	 */
	validateCNPJ: (cnpj: string): boolean => {
		const cleanCnpj = cnpj.replace(/\D+/g, '');
		if (cleanCnpj.length !== 14 || /^(\d)\1{13}$/.test(cleanCnpj)) {
			return false;
		}

		return cleanCnpj.length === 14;
	},

	/**
	 * Validate Brazilian phone number
	 */
	validatePhone: (phone: string): boolean => {
		const cleanPhone = phone.replace(/\D+/g, '');
		return cleanPhone.length >= 10 && cleanPhone.length <= 11;
	},

	/**
	 * Validate Brazilian postal code (CEP)
	 */
	validateCEP: (cep: string): boolean => {
		const cleanCep = cep.replace(/\D+/g, '');
		return cleanCep.length === 8;
	},

	/**
	 * Validate credit card number (Luhn algorithm)
	 */
	validateCreditCard: (cardNumber: string): boolean => {
		const cleanCard = cardNumber.replace(/\D+/g, '');
		if (cleanCard.length < 13 || cleanCard.length > 19) return false;

		let sum = 0;
		let isEven = false;

		for (let i = cleanCard.length - 1; i >= 0; i--) {
			let digit = parseInt(cleanCard.charAt(i));

			if (isEven) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}

			sum += digit;
			isEven = !isEven;
		}

		return sum % 10 === 0;
	},

	/**
	 * Detect card brand from card number
	 */
	detectCardBrand: (cardNumber: string): string | null => {
		const cleanCard = cardNumber.replace(/\D+/g, '');

		const patterns = [
			{ brand: 'VISA', pattern: /^4/ },
			{ brand: 'MASTERCARD', pattern: /^5[1-5]/ },
			{ brand: 'AMEX', pattern: /^3[47]/ },
			{
				brand: 'ELO',
				pattern:
					/^(4011|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|658|659)/,
			},
			{ brand: 'HIPERCARD', pattern: /^(606282|637095|637568)/ },
			{ brand: 'DISCOVER', pattern: /^(6011|65|64[4-9])/ },
			{ brand: 'JCB', pattern: /^35/ },
			{ brand: 'DINERS', pattern: /^3(0[0-5]|[68])/ },
			{ brand: 'UNIONPAY', pattern: /^(62|88)/ },
		];

		for (const { brand, pattern } of patterns) {
			if (pattern.test(cleanCard)) return brand;
		}

		return null;
	},

	/**
	 * Validate expiration date
	 */
	validateExpirationDate: (month: number, year: number): boolean => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth() + 1;

		if (year < currentYear) return false;
		if (year === currentYear && month < currentMonth) return false;

		return true;
	},
};

/**
 * Zod refinements for common validations
 */
export const ZodRefinements = {
	/**
	 * CPF refinement
	 */
	cpf: z.string().refine(ValidationUtils.validateCPF, {
		message: 'Invalid CPF number',
	}),

	/**
	 * CNPJ refinement
	 */
	cnpj: z.string().refine(ValidationUtils.validateCNPJ, {
		message: 'Invalid CNPJ number',
	}),

	/**
	 * Tax ID refinement (accepts CPF or CNPJ)
	 */
	taxId: z.string().refine(
		(taxId) => {
			const cleanTaxId = taxId.replace(/\D+/g, '');
			return (
				ValidationUtils.validateCPF(cleanTaxId) ||
				ValidationUtils.validateCNPJ(cleanTaxId)
			);
		},
		{
			message: 'Invalid Tax ID (must be valid CPF or CNPJ)',
		},
	),

	/**
	 * Phone refinement
	 */
	phone: z.string().refine(ValidationUtils.validatePhone, {
		message: 'Invalid Brazilian phone number',
	}),

	/**
	 * CEP refinement
	 */
	cep: z.string().refine(ValidationUtils.validateCEP, {
		message: 'Invalid Brazilian postal code',
	}),

	/**
	 * Credit card refinement
	 */
	creditCard: z.string().refine(ValidationUtils.validateCreditCard, {
		message: 'Invalid credit card number',
	}),

	/**
	 * Email domain refinement
	 */
	emailDomain: z
		.string()
		.email()
		.refine(
			(email) => {
				const allowedDomains = [
					'gmail.com',
					'yahoo.com',
					'hotmail.com',
					'outlook.com',
					'icloud.com',
				];
				const domain = email.split('@')[1]?.toLowerCase();
				return !domain || !allowedDomains.includes(domain) || domain;
			},
			{
				message: 'Please use a business email address',
			},
		),
};

/**
 * Formatting utilities
 */
export const FormatUtils = {
	/**
	 * Format currency for Brazilian Real
	 */
	formatBRL: (amount: number): string => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(amount);
	},

	/**
	 * Format CPF with mask
	 */
	formatCPF: (cpf: string): string => {
		const cleanCpf = cpf.replace(/\D+/g, '');
		if (cleanCpf.length !== 11) return cpf;
		return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	},

	/**
	 * Format CNPJ with mask
	 */
	formatCNPJ: (cnpj: string): string => {
		const cleanCnpj = cnpj.replace(/\D+/g, '');
		if (cleanCnpj.length !== 14) return cnpj;
		return cleanCnpj.replace(
			/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
			'$1.$2.$3/$4-$5',
		);
	},

	/**
	 * Format phone number with mask
	 */
	formatPhone: (phone: string): string => {
		const cleanPhone = phone.replace(/\D+/g, '');
		if (cleanPhone.length === 10) {
			return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
		} else if (cleanPhone.length === 11) {
			return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
		}
		return phone;
	},

	/**
	 * Format CEP with mask
	 */
	formatCEP: (cep: string): string => {
		const cleanCep = cep.replace(/\D+/g, '');
		if (cleanCep.length === 8) {
			return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
		}
		return cep;
	},

	/**
	 * Format credit card with mask
	 */
	formatCreditCard: (cardNumber: string): string => {
		const cleanCard = cardNumber.replace(/\D+/g, '');
		if (cleanCard.length >= 13) {
			return cleanCard.replace(/(\d{4})(?=\d)/g, '$1 ');
		}
		return cardNumber;
	},

	/**
	 * Format date to Brazilian format
	 */
	formatDate: (date: string | Date): string => {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	},

	/**
	 * Format datetime to Brazilian format
	 */
	formatDateTime: (datetime: string | Date): string => {
		const dateObj =
			typeof datetime === 'string' ? new Date(datetime) : datetime;
		return dateObj.toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	},
};

/**
 * Calculation utilities
 */
export const CalculationUtils = {
	/**
	 * Calculate installments with interest
	 */
	calculateInstallments: (
		amount: number,
		installments: number,
		monthlyInterestRate: number = 0,
	): Array<{ installment: number; amount: number; total: number }> => {
		if (monthlyInterestRate === 0) {
			const installmentAmount = amount / installments;
			return Array.from({ length: installments }, (_, i) => ({
				installment: i + 1,
				amount: installmentAmount,
				total: installmentAmount,
			}));
		}

		const totalAmount = amount * (1 + monthlyInterestRate) ** installments;
		const installmentAmount = totalAmount / installments;

		return Array.from({ length: installments }, (_, i) => ({
			installment: i + 1,
			amount: installmentAmount,
			total: installmentAmount,
		}));
	},

	/**
	 * Calculate discount amount
	 */
	calculateDiscount: (
		amount: number,
		discountType: 'PERCENTAGE' | 'FIXED',
		discountValue: number,
	): number => {
		if (discountType === 'PERCENTAGE') {
			return amount * (discountValue / 100);
		}
		return Math.min(discountValue, amount);
	},

	/**
	 * Calculate tax amount
	 */
	calculateTax: (
		amount: number,
		taxRate: number,
		taxable: boolean = true,
	): number => {
		if (!taxable) return 0;
		return amount * taxRate;
	},

	/**
	 * Calculate final amount with tax and shipping
	 */
	calculateFinalAmount: (params: {
		subtotal: number;
		taxAmount?: number;
		shippingAmount?: number;
		discounts?: Array<{ type: 'PERCENTAGE' | 'FIXED'; amount: number }>;
	}): number => {
		let total = params.subtotal;

		if (params.taxAmount) {
			total += params.taxAmount;
		}

		if (params.shippingAmount) {
			total += params.shippingAmount;
		}
		if (params.discounts) {
			for (const discount of params.discounts) {
				total -= CalculationUtils.calculateDiscount(
					total,
					discount.type,
					discount.amount,
				);
			}
		}

		return Math.max(0, total);
	},

	/**
	 * Calculate payment processing fee
	 */
	calculateProcessingFee: (
		amount: number,
		method: string,
		cardBrand?: string,
	): number => {
		const baseFee = {
			PIX: { fixed: 0, percentage: 0.99 },
			BOLETO: { fixed: 2.5, percentage: 2.99 },
			CARD: {
				fixed: 0.5,
				percentage: cardBrand === 'AMEX' ? 4.99 : 3.99,
			},
			BANK_TRANSFER: { fixed: 5.0, percentage: 0.99 },
		};

		const feeConfig = baseFee[method as keyof typeof baseFee] || baseFee.CARD;
		return feeConfig.fixed + (amount * feeConfig.percentage) / 100;
	},
};

/**
 * Error handling utilities
 */
export const ErrorUtils = {
	/**
	 * Standard API error response
	 */
	createApiError: (code: string, message: string, details?: unknown) => ({
		success: false,
		error: {
			code,
			message,
			details,
		},
		metadata: {
			timestamp: new Date().toISOString(),
			version: '2.0',
		},
	}),

	/**
	 * Validation error response
	 */
	createValidationError: (
		errors: Array<{ field: string; message: string }>,
	) => ({
		success: false,
		error: {
			code: 'VALIDATION_ERROR',
			message: 'Request validation failed',
			details: errors,
		},
		metadata: {
			timestamp: new Date().toISOString(),
			version: '2.0',
		},
	}),

	/**
	 * Not found error response
	 */
	createNotFoundError: (resource: string, id: string) => ({
		success: false,
		error: {
			code: 'NOT_FOUND',
			message: `${resource} with ID ${id} not found`,
		},
		metadata: {
			timestamp: new Date().toISOString(),
			version: '2.0',
		},
	}),

	/**
	 * Unauthorized error response
	 */
	createUnauthorizedError: (message: string = 'Unauthorized access') => ({
		success: false,
		error: {
			code: 'UNAUTHORIZED',
			message,
		},
		metadata: {
			timestamp: new Date().toISOString(),
			version: '2.0',
		},
	}),
};
