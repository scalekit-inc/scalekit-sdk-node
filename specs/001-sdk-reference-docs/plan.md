# Implementation Plan: SDK Reference Documentation

**Branch**: `001-sdk-reference-docs` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sdk-reference-docs/spec.md`

## Summary

Create a comprehensive `REFERENCE.md` file at the repository root that
documents every public method across all 11 domain clients and the
ScalekitClient core class. Each method entry includes accurate TypeScript
signatures, working code examples, parameter documentation, and absolute
GitHub source links. The document uses HTML collapsible sections grouped
by API domain for easy navigation.

## Technical Context

**Language/Version**: TypeScript 5.x (documentation target; examples must
compile against current SDK)
**Primary Dependencies**: @scalekit-sdk/node v2.2.0 (the SDK being
documented)
**Storage**: N/A (single Markdown file at repo root)
**Testing**: Manual signature verification against source; TypeScript
compilation check for examples
**Target Platform**: GitHub Markdown rendering, npm package (offline
viewing), any Markdown viewer
**Project Type**: Single file documentation artifact
**Performance Goals**: N/A (static documentation)
**Constraints**: File must render correctly in GitHub, VS Code, and
offline Markdown viewers. No external image/asset dependencies.
**Scale/Scope**: ~70+ public methods across 12 classes (ScalekitClient +
11 domain clients), plus exception hierarchy and type definitions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. TypeScript-First | Examples MUST use TypeScript with proper types | PASS |
| II. SDK Design Philosophy | Documentation MUST prioritize DX | PASS |
| III. Backward Compatibility | N/A (no code changes) | PASS |
| IV. Test Coverage | Documentation examples SHOULD have tests to prevent drift | DEFERRED to Phase N |
| V. Documentation Completeness | REFERENCE.md MUST cover 100% of public API | PASS (primary goal) |
| Code Quality Gates | Documentation MUST be updated in same PR as code | PASS (this IS the documentation) |

No violations. Gate passed.

## Project Structure

### Documentation (this feature)

```text
specs/001-sdk-reference-docs/
├── plan.md              # This file
├── research.md          # Phase 0: Source file → method mapping
├── data-model.md        # Phase 1: Document structure model
├── quickstart.md        # Phase 1: How to maintain REFERENCE.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
REFERENCE.md             # The deliverable (new file at repo root)

src/
├── scalekit.ts          # ScalekitClient (core methods)
├── organization.ts      # OrganizationClient
├── connection.ts        # ConnectionClient
├── domain.ts            # DomainClient
├── directory.ts         # DirectoryClient
├── user.ts              # UserClient
├── session.ts           # SessionClient
├── role.ts              # RoleClient
├── permission.ts        # PermissionClient
├── passwordless.ts      # PasswordlessClient
├── auth.ts              # AuthClient
├── webauthn.ts          # WebAuthnClient
├── core.ts              # Base client (internal)
├── connect.ts           # gRPC connection helpers (internal)
├── errors/
│   ├── index.ts         # Error exports
│   ├── base-exception.ts    # ScalekitException base
│   └── specific-exceptions.ts # HTTP-mapped exceptions
├── types/
│   ├── auth.ts          # Auth type definitions
│   ├── organization.ts  # Organization types
│   ├── user.ts          # User types
│   └── scalekit.ts      # Core types
└── index.ts             # Package entry point (exports)
```

**Structure Decision**: Single Markdown file at repository root. Source
files listed above are read-only inputs; no code changes required.

## Complexity Tracking

No constitution violations to justify.
