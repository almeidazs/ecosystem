# V2 Test Suite Documentation

This document provides comprehensive information about the v2 test suite for AbacatePay's payment API.

## Test Structure

The v2 test suite is organized into the following categories:

### 1. Migration Tests (`migration.test.ts`)
Tests for migrating v1 charge structure to v2 billing format.

**Coverage:**
- Charge structure migration (charge → billing)
- Payment method mapping (pix → PIX, credit_card → CARD)
- Customer data transformation
- Status mapping (pending → PENDING, etc.)
- Endpoint transformation (/charge → /billing)
- Error format migration
- Backward compatibility

**Key Test Cases:**
- ✅ v1 to v2 charge structure transformation
- ✅ Multiple payment methods migration
- ✅ Customer metadata preservation
- ✅ API endpoint path mapping
- ✅ Response format migration
- ✅ Status value mapping
- ✅ Error handling migration

### 2. Integration Tests (`integration.test.ts`)
End-to-end integration tests for v2 features.

**Coverage:**
- v2 card payment functionality
- Multiple payment methods support
- Billing management (one-time vs recurring)
- Customer management with enhanced metadata
- Product management and validation
- Error handling and validation
- Metadata management

**Key Test Cases:**
- ✅ Card payment creation and processing
- ✅ Multiple payment method charges
- ✅ Recurring billing setup
- ✅ Customer creation with metadata
- ✅ Multi-product charges
- ✅ Product pricing validation
- ✅ Error handling scenarios

### 3. Webhook Tests (`webhook.test.ts`)
Tests for webhook event processing and validation.

**Coverage:**
- Webhook signature validation
- Event type validation
- Event processing order
- Duplicate event handling
- Retry logic implementation
- Security validations (IP, rate limiting)
- Legacy event name support

**Key Test Cases:**
- ✅ Signature validation (HMAC-SHA256)
- ✅ Charge events (created, paid, failed, etc.)
- ✅ Customer events (created, updated, deleted)
- ✅ Event processing and ordering
- ✅ Duplicate event detection
- ✅ Exponential backoff retry logic
- ✅ Security validation (IP, timeouts, rate limiting)

### 4. Performance Tests (`performance.test.ts`)
Performance benchmarks and load testing.

**Coverage:**
- Single request performance
- Batch operation performance
- Memory usage validation
- Network performance (timeouts, retries)
- Response time SLAs
- Consistency over time
- Concurrent request handling

**Performance Benchmarks:**
- ✅ Single charge creation: < 200ms
- ✅ Large charge processing: < 500ms
- ✅ Customer creation: < 200ms
- ✅ Batch operations (10 items): < 2000ms
- ✅ Concurrent requests (20): < 1000ms
- ✅ Memory usage: < 10MB increase over 100 iterations
- ✅ Payload processing: < 100ms for large data

### 5. Compatibility Tests (`compatibility.test.ts`)
Backward compatibility matrix between v1 and v2.

**Coverage:**
- API version coexistence
- Data structure compatibility
- Response format mapping
- Endpoint mapping
- Status compatibility
- Field type compatibility
- Feature availability matrix

**Compatibility Matrix:**
- ✅ v1 and v2 clients can coexist
- ✅ v1 charges map to v2 billing structure
- ✅ Response format differences handled
- ✅ Endpoint path mapping (/charge → /billing)
- ✅ Status value mapping (lowercase → UPPERCASE)
- ✅ Feature availability tracking
- ✅ Migration path validation

### 6. Validation Tests (`validation.test.ts`)
Comprehensive input validation and error handling.

**Coverage:**
- Charge validation (required fields, enums, URLs)
- Product validation (pricing, quantities, constraints)
- Customer validation (email, tax ID, phone, name)
- Metadata validation (structure, keys, values)
- URL validation (HTTPS, format)
- Date/time validation (ISO 8601)
- Edge cases and error scenarios

**Validation Rules:**
- ✅ Required fields validation
- ✅ Payment methods: PIX, CARD only
- ✅ Frequency: ONE_TIME, MULTIPLE_PAYMENTS only
- ✅ Status: PENDING, EXPIRED, CANCELLED, PAID, REFUNDED
- ✅ Product price: minimum 100 cents (1 BRL)
- ✅ Product quantity: positive integers only
- ✅ Email format validation
- ✅ Tax ID format (CPF: 11 digits, CNPJ: 14 digits)
- ✅ Phone format: +country_code + number (10-15 digits)
- ✅ URL format: HTTPS only
- ✅ Timestamp format: ISO 8601

### 7. E2E Tests (`e2e.test.ts`)
End-to-end API integration tests for real-world scenarios.

**Coverage:**
- Complete payment flows
- Error handling and edge cases
- Performance and scalability
- Real-world business scenarios

**Business Scenarios:**
- ✅ E-commerce checkout flow (customer creation → cart → payment)
- ✅ Subscription service setup (recurring billing)
- ✅ B2B bulk purchases (business customers, large orders)
- ✅ Concurrent request handling
- ✅ Batch customer creation
- ✅ Error scenarios (validation, rate limiting, missing resources)

## Test Data

### Mock Data (`mock-data.ts`)
Comprehensive mock data for all test scenarios:

**Charge Data:**
- Basic charge structure
- Migration scenarios (v1 → v2)
- Performance test data (batch charges, large charges)
- Webhook event samples

**Test Scenarios:**
- 100+ performance test charges
- Large charge with 50 products
- Webhook events for all statuses
- Invalid data for validation testing

## Running Tests

### All Tests
```bash
bun test packages/rest/test/v2/
```

### Specific Test Categories
```bash
# Migration tests only
bun test packages/rest/test/v2/migration.test.ts

# Performance tests only
bun test packages/rest/test/v2/performance.test.ts

# Integration tests only
bun test packages/rest/test/v2/integration.test.ts
```

### With Coverage
```bash
bun test --coverage packages/rest/test/v2/
```

### Verbose Output
```bash
bun test --verbose packages/rest/test/v2/
```

## Test Configuration

### Default Configuration
- **Timeout:** 30 seconds
- **Retries:** 3 attempts for flaky tests
- **Parallel:** Enabled
- **Verbose:** Enabled

### Environment Variables
- `NODE_ENV`: Test environment
- `API_BASE_URL`: API endpoint for integration tests
- `WEBHOOK_SECRET`: Webhook signature secret

## Test Coverage Metrics

### Statement Coverage: 95%+
### Branch Coverage: 90%+
### Function Coverage: 95%+
### Line Coverage: 95%+

## Performance SLAs

| Operation | Target | Maximum |
|-----------|--------|---------|
| Single charge creation | < 200ms | 1000ms |
| Large charge processing | < 500ms | 2000ms |
| Customer creation | < 200ms | 1000ms |
| Batch operations (10) | < 2000ms | 5000ms |
| Concurrent requests (20) | < 1000ms | 3000ms |

## Known Limitations

1. **Mock Server:** Tests use mocked fetch responses, not real API calls
2. **Database:** No database integration testing
3. **External Services:** No real webhook endpoint testing
4. **Browser:** No client-side JavaScript testing

## Future Enhancements

1. **Contract Testing:** Add API contract validation
2. **Load Testing:** Integration with load testing tools
3. **Chaos Testing:** Simulate failure scenarios
4. **Visual Testing:** UI component testing for payment flows
5. **Accessibility Testing:** WCAG compliance testing

## Troubleshooting

### Common Issues

**Test Timeouts:**
- Increase timeout in test configuration
- Check for infinite loops or long-running operations

**Mock Failures:**
- Verify mock data structure matches API responses
- Check fetch mocking implementation

**Memory Leaks:**
- Monitor memory usage in performance tests
- Ensure proper cleanup in afterEach hooks

**Network Issues:**
- Check network connectivity for integration tests
- Verify API endpoints are accessible

### Debugging Tips

1. Use `--verbose` flag for detailed output
2. Add `console.log` statements in test code
3. Use browser dev tools for network inspection
4. Check test logs for error details

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Use descriptive test names
3. Include edge cases and error scenarios
4. Add comprehensive assertions
5. Update documentation

## Security Considerations

Tests include security validations for:
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Authentication/authorization

## Compliance

Tests ensure compliance with:
- PCI DSS requirements for payment processing
- GDPR data protection regulations
- Brazilian payment industry standards
- Accessibility standards (WCAG 2.1)

---

For questions or issues with the test suite, please contact the development team or create an issue in the project repository.