---
description: "Task list for SDK Reference Documentation"
---

# Tasks: SDK Reference Documentation

**Input**: Design documents from `/specs/001-sdk-reference-docs/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested. Test tasks omitted.

**Organization**: Tasks are grouped by user story. US1 and US2 are co-implemented (signatures and examples are written together per domain). US3 is the structural wrapper. US4 is error documentation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/sections, no dependencies)
- **[Story]**: Which user story this task belongs to

## Path Conventions

- **Repository root**: `REFERENCE.md`
- **Package config**: `package.json`
- **Source files**: `src/*.ts`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create REFERENCE.md at repository root with title, badges, and table of contents linking to all 12 domain sections per data-model.md hierarchy in REFERENCE.md
- [ ] T002 Add Getting Started section with ScalekitClient constructor documentation (📝 Description, 🔌 Usage with initialization example, ⚙️ Parameters table for envUrl/clientId/clientSecret) and Source link to src/scalekit.ts in REFERENCE.md
- [ ] T003 Add REFERENCE.md to package.json files array to include it in npm package

**Checkpoint**: REFERENCE.md exists with scaffold structure and constructor docs

---

## Phase 2: Foundational (Prerequisites for All Stories)

**Purpose**: Prepare REFERENCE.md with correct hrefs and core structure

- [ ] T004 Convert all relative hrefs in REFERENCE.md to absolute GitHub URLs (e.g., change `/src/scalekit.ts` to `https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/scalekit.ts`) per research.md GitHub Base URL

**Checkpoint**: All links in REFERENCE.md use absolute GitHub URLs

---

## Phase 3: User Story 1 - Method Signatures + User Story 2 - Code Examples

**Goal**: Document accurate method signatures with working code examples for all public methods

**Independent Test**: Developer can look up any method signature and copy a working example that compiles

- [X] T005 [P] [US1] [US2] Document `getAuthorizationUrl` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T006 [P] [US1] [US2] Document `authenticateWithCode` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T007 [P] [US1] [US2] Document `getIdpInitiatedLoginClaims` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T008 [P] [US1] [US2] Document `validateAccessToken` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T009 [P] [US1] [US2] Document `getLogoutUrl` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T010 [P] [US1] [US2] Document `refreshAccessToken` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T011 [P] [US1] [US2] Document `validateToken` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T012 [P] [US1] [US2] Document `verifyScopes` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T013 [P] [US1] [US2] Document `verifyWebhookPayload` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T014 [P] [US1] [US2] Document `verifyInterceptorPayload` method entry (📝 Description, 🔌 Usage example, ⚙️ Parameters table, Source link) using template from data-model.md in REFERENCE.md ScalekitClient section
- [X] T015 [P] [US1] [US2] Document all 10 OrganizationClient methods (createOrganization, listOrganization, getOrganization, getOrganizationByExternalId, updateOrganization, updateOrganizationByExternalId, deleteOrganization, generatePortalLink, updateOrganizationSettings, upsertUserManagementSettings) using template from data-model.md with signatures from src/organization.ts in REFERENCE.md Organizations section
- [X] T016 [P] [US1] [US2] Document all 5 ConnectionClient methods (getConnection, listConnections, listConnectionsByDomain, enableConnection, disableConnection) using template from data-model.md with signatures from src/connection.ts in REFERENCE.md Connections section
- [X] T017 [P] [US1] [US2] Document all 4 DomainClient methods (createDomain, getDomain, listDomains, deleteDomain) using template from data-model.md with signatures from src/domain.ts in REFERENCE.md Domains section
- [X] T018 [P] [US1] [US2] Document all 7 DirectoryClient methods using template from data-model.md with signatures from src/directory.ts in REFERENCE.md Directories section
- [X] T019 [P] [US1] [US2] Document all 10 UserClient methods using template from data-model.md with signatures from src/user.ts in REFERENCE.md Users section
- [X] T020 [P] [US1] [US2] Document all 4 SessionClient methods using template from data-model.md with signatures from src/session.ts in REFERENCE.md Sessions section
- [X] T021 [P] [US1] [US2] Document all 14 RoleClient methods using template from data-model.md with signatures from src/role.ts in REFERENCE.md Roles section
- [X] T022 [P] [US1] [US2] Document all 9 PermissionClient methods using template from data-model.md with signatures from src/permission.ts in REFERENCE.md Permissions section
- [X] T023 [P] [US1] [US2] Document all 3 PasswordlessClient methods using template from data-model.md with signatures from src/passwordless.ts in REFERENCE.md Passwordless section
- [X] T024 [P] [US1] [US2] Document AuthClient method using template from data-model.md with signatures from src/auth.ts in REFERENCE.md Auth section
- [X] T025 [P] [US1] [US2] Document all 3 WebAuthnClient methods using template from data-model.md with signatures from src/webauthn.ts in REFERENCE.md WebAuthn section

**Checkpoint**: All 80+ public methods documented with accurate signatures and working examples

---

## Phase 4: User Story 3 - Domain Navigation

**Goal**: Ensure developers can navigate by API domain with functional TOC and collapsible sections

**Independent Test**: Developer can navigate to any domain section from the TOC and expand/collapse individual methods

- [X] T026 [US3] Verify and finalize table of contents with anchor links to all 12 domain sections (ScalekitClient + 11 domain clients) in REFERENCE.md
- [X] T027 [US3] Verify all `<details>` collapsible sections render correctly in GitHub Markdown preview for REFERENCE.md
- [X] T028 [US3] Add domain section headers with brief descriptions and `Access via scalekitClient.<property>` notes for each of the 11 domain client sections in REFERENCE.md

**Checkpoint**: Navigation structure complete. Developer can browse by domain.

---

## Phase 5: User Story 4 - Error Handling

**Goal**: Document exception hierarchy and error handling patterns

**Independent Test**: Developer can find the exception hierarchy and understand which exceptions to catch

- [X] T029 [US4] Document the exception class hierarchy (ScalekitException → WebhookVerificationError, ScalekitValidateTokenFailureException, ScalekitServerException → 12 specific exceptions) with HTTP status mappings in REFERENCE.md Error Handling section. Source links to src/errors/base-exception.ts and src/errors/specific-exceptions.ts
- [X] T030 [US4] Add error handling usage example showing try/catch with ScalekitServerException and specific exception types in REFERENCE.md Error Handling section
- [X] T031 [US4] Document ScalekitServerException public properties (grpcStatus, httpStatus, errorCode, message, errDetails, unpackedDetails) in REFERENCE.md Error Handling section

**Checkpoint**: Error handling section complete. US4 fully satisfied.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and enhancements

- [X] T032 [P] Add Type Definitions section documenting key exported types (AuthorizationUrlOptions, AuthenticationResponse, User, Identity, IdpInitiatedLoginClaims, CreateUserRequest, UpdateUserRequest, OrganizationSettings, GrantType) in REFERENCE.md
- [X] T033 Verify all method signatures in REFERENCE.md match source code exactly by cross-referencing each entry against its source file
- [X] T034 Verify all GitHub source links in REFERENCE.md use absolute URLs pointing to https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/
- [X] T035 Verify all usage code examples in REFERENCE.md are syntactically valid TypeScript
- [X] T036 Verify REFERENCE.md renders correctly in GitHub Markdown (collapsible sections, tables, code blocks, anchor links all functional)

---

## Phase 7: Documentation Example Tests

**Purpose**: Validate REFERENCE.md code examples to satisfy Constitution IV

- [X] T037 Run TypeScript compilation on all REFERENCE.md examples to ensure syntax validity
- [X] T038 [Optional] Add integration tests that execute key examples against a mock SDK environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (scaffold exists)
- **US1+US2 (Phase 3)**: Depends on Phase 1 scaffold and Phase 2 href conversion
- **US3 (Phase 4)**: Depends on Phase 3 completion (all sections exist)
- **US4 (Phase 5)**: Depends on Phase 1 scaffold
- **Polish (Phase 6)**: Depends on all previous phases
- **Tests (Phase 7)**: Depends on Phase 3 examples

### Parallel Opportunities

- All T005-T025 (method documentation) can run in parallel per domain
- T032-T036 (validation tasks) can run in parallel
- Phases 1,2,4,5 can overlap with Phase 3

### Within Each Domain Task

1. Read source file for exact method signatures
2. Write `<details>` collapsible with signature in `<summary>`
3. Write 📝 Description
4. Write 🔌 Usage with complete TypeScript example
5. Write ⚙️ Parameters table
6. Add **Returns** line
7. Add **Source** link with absolute GitHub URL

---

## Implementation Strategy

### MVP First (Phase 1 + 3)

1. Complete Phase 1: Create REFERENCE.md scaffold
2. Complete Phase 3: Document ScalekitClient core methods + 2-3 domain clients
3. **STOP and VALIDATE**: Verify signatures match source, examples compile
4. This alone provides value - core auth methods are most frequently referenced

### Incremental Delivery

1. Phase 1 + 2 → REFERENCE.md with correct links (foundation)
2. Phase 3 → All method signatures + examples added
3. Phase 4 → Navigation verified
4. Phase 5 → Error handling documented
5. Phase 6 → Full validation pass
6. Phase 7 → Example tests

---

## Notes

- [P] tasks = different sections of REFERENCE.md, no content overlap
- Each domain task reads its source file and writes only to its section
- Signature accuracy is NON-NEGOTIABLE per FR-004
- Every method uses the 📝/🔌/⚙️ icon template per FR-003
- Every method wrapped in `<details>` collapsible per FR-006
- All source links absolute GitHub URLs to `main` per FR-011/FR-012