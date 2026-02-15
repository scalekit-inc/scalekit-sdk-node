<!--
  === Sync Impact Report ===
  Version change: N/A (new) → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Authentication & Security
    - Developer Experience & Code Quality
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check section exists)
    - .specify/templates/spec-template.md ✅ compatible (user stories + requirements align)
    - .specify/templates/tasks-template.md ✅ compatible (test phases + polish phase align)
  Follow-up TODOs: None
-->

# Scalekit Node.js SDK Constitution

## Core Principles

### I. TypeScript-First Development

All code MUST be written in TypeScript with strict type safety enabled.
The `any` type is prohibited except in justified edge cases that MUST be
documented with an inline comment explaining why. Full type definitions
MUST be exported for all public APIs. The `tsconfig.json` MUST enforce
`strict: true`. Generic types SHOULD be preferred over type assertions.

**Rationale**: The SDK is consumed by TypeScript developers who depend on
accurate type information for IDE support, compile-time safety, and
self-documenting APIs.

### II. SDK Design Philosophy

Every feature MUST prioritize developer experience: intuitive method
signatures, clear and actionable error messages, and comprehensive JSDoc
comments. The SDK serves as a bridge between application developers and
Scalekit's authentication infrastructure. Method names MUST be
self-documenting. Configuration MUST use sensible defaults with explicit
override options.

**Rationale**: SDK adoption depends on how quickly developers can integrate
it. Poor DX creates support burden and slows adoption.

### III. Backward Compatibility (NON-NEGOTIABLE)

Breaking changes MUST trigger a major version bump per SemVer. All
deprecations MUST include migration paths and emit runtime warnings for
at least one minor version before removal. Public API surface changes
(method signatures, return types, error shapes) MUST NOT change without
a deprecation cycle. Internal restructuring MUST NOT affect the public
API contract.

**Rationale**: Downstream consumers pin SDK versions; unexpected breakage
erodes trust and creates upgrade friction across customer codebases.

### IV. Test Coverage Standards

A minimum of 80% code coverage is required. All public methods MUST have
unit tests. Integration tests are required for OAuth flows, SSO
authentication, and API client interactions. Error scenarios (network
failures, invalid tokens, malformed responses) MUST be tested. External
Scalekit API calls MUST be mocked with consistent fixtures. Documentation
code examples MUST have corresponding tests to prevent drift.

**Rationale**: The SDK handles authentication, a security-critical domain.
Untested code paths in auth flows create silent failure modes.

### V. Documentation Completeness (NON-NEGOTIABLE)

Every public method, class, and interface MUST have JSDoc documentation
with `@param`, `@returns`, `@throws`, and `@example` tags. The README
MUST be kept current with API changes. `REFERENCE.md` MUST be updated to
reflect all SDK methods with usage examples following the established
collapsible format:

- Each method entry MUST include: description, usage with complete code
  examples (imports, initialization, invocation), and parameter
  documentation with types and required/optional indicators.
- Code examples in documentation MUST be tested and functional.
- Every method MUST have at least one real-world usage example.
- Breaking changes MUST be documented in CHANGELOG.md with migration
  guides.
- `REFERENCE.md` MUST be included in the npm package for offline
  reference.

**Rationale**: Documentation is the primary interface for SDK consumers.
Incomplete or stale docs are functionally equivalent to missing features.

## Authentication & Security

- OAuth 2.1, PKCE, and MCP protocol implementations MUST follow their
  respective RFCs precisely. Deviations MUST be documented and justified.
- Token handling MUST be secure by default: no tokens in log output,
  proper rotation support, and secure storage guidance in docs.
- All credential management code MUST undergo security review before
  merge.
- Agent identity and human-in-the-loop flows MUST maintain immutable
  audit trails.
- No runtime dependencies on browser-only APIs are permitted.

## Developer Experience & Code Quality

### Developer Experience

- Error messages MUST be actionable: include what went wrong and how to
  fix it. Error objects MUST include machine-readable error codes.
- Examples MUST work out-of-the-box with minimal configuration.
- The SDK MUST support both ESM and CommonJS module formats.
- Node.js LTS versions MUST be supported (currently 18.14.1+).
- Method signatures MUST be intuitive and self-documenting.

### Code Quality Gates

- All PRs MUST pass: TypeScript compilation, Jest test suite, and ESLint.
- No `console.log` in production code; use proper logging abstractions.
- Dependencies MUST be audited for known security vulnerabilities before
  release.
- Performance-critical paths (token validation, API calls) MUST be
  benchmarked.
- Documentation MUST be updated in the same PR as the code change it
  documents.

### Technology Constraints

- **Runtime**: Node.js 18.14.1+ (LTS versions)
- **Language**: TypeScript 5.x with `strict: true`
- **Core dependencies**: axios (HTTP), jose (JWT),
  @connectrpc/connect (gRPC), @bufbuild/protobuf (serialization)
- **Dev tooling**: Jest (testing), buf (protobuf generation),
  ESLint (linting)

### Versioning & Release

- Semantic versioning is strictly enforced.
- CHANGELOG.md MUST be updated with every release.
- Breaking changes MUST include a migration guide in docs.
- The npm package MUST include only built artifacts (`lib/`) and
  essential files (README, LICENSE, REFERENCE.md, package.json).

## Governance

This constitution governs all development on the Scalekit Node.js SDK.
All code reviews MUST verify compliance with both code quality AND
documentation standards. The following governance rules apply:

1. **API Surface Changes**: Changes to public APIs require documentation
   updates in the same PR. API surface additions or removals require
   approval from DevRel and Product.
2. **Amendment Procedure**: Amendments to this constitution require a PR
   with rationale, review by at least one maintainer, and an updated
   version number following SemVer (MAJOR for principle removals or
   redefinitions, MINOR for new principles or expanded guidance, PATCH
   for clarifications and wording).
3. **Compliance Review**: Every PR review MUST include a constitution
   compliance check covering type safety, test coverage, documentation,
   and backward compatibility.
4. **Documentation Independence**: Documentation-only improvements are
   encouraged and MAY be merged independently of code changes.
5. **Runtime Guidance**: Use the project README and `REFERENCE.md` as
   the primary developer-facing guidance documents.

**Version**: 1.0.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15
