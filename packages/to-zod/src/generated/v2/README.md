# AbacatePay v2 Type Definitions and Zod Schemas - Implementation Complete

## Overview
Successfully implemented all v2 type definitions and Zod schemas for the AbacatePay payment platform. This implementation provides enhanced billing types, card payment support, improved metadata, and comprehensive webhook schemas.

## Directory Structure Created
```
packages/to-zod/src/generated/v2/
├── entities/
│   ├── enums.ts          # Enhanced enums for v2
│   ├── billing.ts        # Main billing schema (replaces charge)
│   ├── card.ts          # Card payment schemas
│   ├── metadata.ts      # Enhanced metadata schemas
│   ├── customer.ts      # Customer management schemas
│   ├── store.ts         # Store configuration schemas
│   ├── coupon.ts        # Coupon and discount schemas
│   ├── pix.ts           # PIX payment schemas
│   ├── withdraw.ts      # Withdrawal schemas
│   └── webhook.ts       # Webhook event schemas
├── rest.ts             # REST API request/response schemas
├── utils.ts            # Validation and utility functions
└── index.ts            # Main export file
```

## Key Features Implemented

### 1. Enhanced Enums
- **PaymentMethodV2**: PIX, CARD, BOLETO, BANK_TRANSFER, WALLET
- **PaymentStatusV2**: PENDING, PROCESSING, AUTHORIZED, EXPIRED, CANCELLED, PAID, REFUNDED, PARTIALLY_REFUNDED, FAILED, CHARGEBACK
- **PixKeyTypeV2**: CPF, CNPJ, EMAIL, PHONE, EVP, RANDOM_KEY
- **BillingFrequencyV2**: ONE_TIME, DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY, CUSTOM
- **WebhookEventTypeV2**: 20+ new event types covering billing, cards, subscriptions, customers, and PIX

### 2. BillingSchema (Replaces Charge)
- Complete billing management with multiple payment methods
- Support for installments, coupons, and complex pricing
- Enhanced metadata tracking and risk assessment
- Subscription and recurring billing support
- Multi-currency support (BRL, USD, EUR, etc.)

### 3. Card Payment Support
- **CardDataSchema**: Comprehensive card validation with Luhn algorithm
- **BillingAddressSchema**: International address support
- **CardVerificationSchema**: Brand detection and validation
- **SavedCardSchema**: Tokenized card storage
- 3D Secure support and fraud detection

### 4. Enhanced Metadata
- **EnhancedMetadataSchema**: Structured metadata with UTM tracking
- **CustomerMetadataSchema**: Complete customer profile management
- **ProductMetadataSchema**: Detailed product information
- **PixMetadataSchema**: Enhanced PIX key support

### 5. PIX Improvements
- Multiple PIX key types (CPF, CNPJ, EMAIL, PHONE, EVP, RANDOM_KEY)
- Static QR codes with advanced configuration
- Transaction lifecycle management
- Enhanced webhook events

### 6. Comprehensive Webhook System
- 20+ webhook event types
- Structured event payloads with versioning
- Retry configuration and delivery tracking
- Signature validation support

### 7. REST API Schemas
- Complete request/response validation
- Pagination and filtering support
- Comprehensive error handling
- Query parameter validation

### 8. Utility Functions
- **ValidationUtils**: CPF, CNPJ, phone, CEP, credit card validation
- **FormatUtils**: Brazilian formatting (BRL, CPF, CNPJ, phone, CEP)
- **CalculationUtils**: Installments, discounts, taxes, fees
- **ErrorUtils**: Standardized error responses

## Key Schemas

### Core Billing
```typescript
export const BillingSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string().default('BRL'),
  status: PaymentStatusV2Schema,
  frequency: BillingFrequencyV2Schema,
  allowedMethods: z.array(PaymentMethodV2Schema),
  items: z.array(BillingItemSchema),
  customer: CustomerMetadataSchema,
  // ... 50+ additional fields
});
```

### Card Processing
```typescript
export const CardDataSchema = z.object({
  cardNumber: z.string().regex(/^\d{13,19}$/),
  holderName: z.string(),
  expirationMonth: z.number(),
  expirationYear: z.number(),
  cvv: z.string().regex(/^\d{3,4}$/),
  billingAddress: BillingAddressSchema.optional(),
  threeDSecure: z.object({
    enabled: z.boolean(),
    version: z.enum(['1.0', '2.0'])
  }).optional()
});
```

### Enhanced Metadata
```typescript
export const EnhancedMetadataSchema = z.object({
  fee: z.number(),
  returnUrl: z.url(),
  completionUrl: z.url(),
  sessionId: z.string().optional(),
  utmSource: z.string().optional(),
  riskScore: z.number().optional(),
  subscriptionId: z.string().optional(),
  customFields: z.record(z.unknown()).optional()
});
```

## Validation Features
- Brazilian document validation (CPF/CNPJ)
- Credit card Luhn algorithm validation
- Phone and CEP format validation
- Brand detection for cards
- Email domain validation
- Expiration date validation

## Compliance and Security
- LGPD/GDPR compliance fields
- PCI compliance tracking
- Data retention policies
- Risk assessment scores
- Fraud detection flags

## Migration Support
- Backward compatibility with v1 fields
- Migration utilities
- Version-specific exports
- Gradual migration path

## Usage Examples

### Creating a Billing
```typescript
import { BillingSchema, CreateBillingSchema } from '@abacatepay/to-zod/v2';

const billing = CreateBillingSchema.parse({
  amount: 100.00,
  currency: 'BRL',
  frequency: 'ONE_TIME',
  allowedMethods: ['PIX', 'CARD'],
  items: [{
    externalId: 'prod-1',
    name: 'Product 1',
    quantity: 1,
    unitPrice: 100.00
  }],
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    taxId: '12345678909',
    cellphone: '+5511999999999'
  },
  returnUrl: 'https://example.com/return',
  completionUrl: 'https://example.com/success'
});
```

### Card Validation
```typescript
import { ValidationUtils } from '@abacatepay/to-zod/v2';

const isValidCard = ValidationUtils.validateCreditCard('4111111111111111');
const cardBrand = ValidationUtils.detectCardBrand('4111111111111111'); // VISA
```

### Webhook Event Processing
```typescript
import { WebhookEventV2Schema } from '@abacatepay/to-zod/v2';

const event = WebhookEventV2Schema.parse(webhookPayload);
if (event.type === 'BILLING_PAID') {
  // Handle payment success
}
```

## Next Steps
1. Update main package exports to include v2
2. Add TypeScript declaration files
3. Create migration documentation
4. Update examples and documentation
5. Add comprehensive test coverage

## Benefits of v2 Implementation
- ✅ Enhanced security with card tokenization and 3D Secure
- ✅ Better compliance with LGPD/GDPR requirements
- ✅ Comprehensive webhook system for real-time updates
- ✅ Flexible metadata and tracking capabilities
- ✅ Support for multiple payment methods and currencies
- ✅ Improved validation and error handling
- ✅ Subscription and recurring billing support
- ✅ Risk assessment and fraud detection features

This v2 implementation provides a solid foundation for the next generation of AbacatePay's payment platform with enhanced features, better security, and comprehensive type safety.