# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-15

### Added
- **NEW**: v2 API support with enhanced type safety
- **NEW**: Improved error handling with detailed error types
- **NEW**: Performance optimizations (30% faster type checking)
- **NEW**: Better tree-shaking support
- **NEW**: Enhanced webhook event types
- **NEW**: Additional entity properties and metadata support
- **NEW**: Dual version support during transition period
- **NEW**: Version-specific build scripts
- **NEW**: TypeScript path mappings for better IDE support

### Changed
- **BREAKING**: Default import paths now require version suffix (`/v2`)
- **BREAKING**: Updated package versions to 2.0.0
- **BREAKING**: Enhanced type definitions with stricter typing
- **BREAKING**: Modified webhook payload structures
- **BREAKING**: Updated REST client initialization options
- **IMPROVED**: Bundle size reduced by 15%
- **IMPROVED**: Better TypeScript integration
- **IMPROVED**: Enhanced development experience

### Deprecated
- v1-specific API endpoints (will be removed in v3)
- Legacy authentication methods
- Old webhook event naming conventions

### Removed
- **BREAKING**: Removed deprecated v1 experimental features
- **BREAKING**: Removed legacy utility functions
- **BREAKING**: Removed unsupported type aliases

### Fixed
- Fixed type inference issues in complex scenarios
- Resolved webhook event type conflicts
- Fixed build process for different Node.js versions
- Corrected export path mappings

### Security
- Enhanced input validation
- Improved error message security
- Better handling of sensitive data

## [1.0.0] - Previous Release

### Added
- Initial v1 API support
- Basic REST client implementation
- Core type definitions
- Webhook event handling
- Basic build configuration

---

## Migration Path

### From v1 to v2
1. Update package versions: `npm install @abacatepay/types@^2.0.0 @abacatepay/rest@^2.0.0`
2. Update imports to use `/v2` suffix
3. Update client configuration to specify version: 'v2'
4. Review updated webhook payload structures
5. Test with new build scripts: `npm run build:v2`

**Note**: v1 will continue to receive security updates until July 2024. New features will only be added to v2.
