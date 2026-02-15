---
description: "Task list for SDK Reference Documentation"
---

# Tasks: SDK Reference Documentation

**Input**: Design documents from `/specs/001-sdk-reference-docs/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Not explicitly requested. Test tasks omitted.

**Organization**: Tasks are grouped by user story. US1 and US2 are co-implemented (signatures and examples are written together per domain). US3 is the structural wrapper. US4 is error documentation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/sections, no dependencies)
- **[Story]**: Which user story this task belongs to

## Phase 1: Setup

**Purpose**: Create the REFERENCE.md file scaffold and document structure

- [ ] T001 Create REFERENCE.md at repository root with title, badges, and table of contents linking to all 12 domain sections per data-model.md hierarchy in REFERENCE.md
- [ ] T002 Add Getting Started section with ScalekitClient constructor documentation (📝 Description, 🔌 Usage with initialization example, ⚙️ Parameters table for envUrl/clientId/clientSecret) and Source link to src/scalekit.ts in REFERENCE.md
- [ ] T003 Add REFERENCE.md to package.json files array to include it in npm package

**Checkpoint**: REFERENCE.md exists with scaffold structure and constructor docs

---

## Phase 2: Foundational (ScalekitClient Core Methods)

**Purpose**: Document the 10 core authentication methods on ScalekitClient - these are the most critical methods developers use first

**⚠️ CRITICAL**: These methods must be documented before domain client sections because they are the entry point to all SDK usage

- [ ] T004 [P] [US1] Document `getAuthorizationUrl` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T005 [P] [US1] Document `authenticateWithCode` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T006 [P] [US1] Document `getIdpInitiatedLoginClaims` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T007 [P] [US1] Document `validateAccessToken` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T008 [P] [US1] Document `getLogoutUrl` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T009 [P] [US1] Document `refreshAccessToken` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T010 [P] [US1] Document `validateToken` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T011 [P] [US1] Document `verifyScopes` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T012 [P] [US1] Document `verifyWebhookPayload` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section
- [ ] T013 [P] [US1] Document `verifyInterceptorPayload` method entry (📝/🔌/⚙️ template, signature from src/scalekit.ts, Source link) in REFERENCE.md ScalekitClient section

**Checkpoint**: All ScalekitClient core methods documented with accurate signatures and working examples

---

## Phase 3: User Story 1+2 - Organizations, Connections, Domains (Priority: P1)

**Goal**: Document the three most common domain clients developers interact with after authentication

**Independent Test**: Developer can look up any Organization/Connection/Domain method and find accurate signature + working example

- [ ] T014 [P] [US1] Document all 10 OrganizationClient methods (createOrganization, listOrganization, getOrganization, getOrganizationByExternalId, updateOrganization, updateOrganizationByExternalId, deleteOrganization, generatePortalLink, updateOrganizationSettings, upsertUserManagementSettings) using 📝/🔌/⚙️ template with signatures from src/organization.ts in REFERENCE.md Organizations section
- [ ] T015 [P] [US1] Document all 5 ConnectionClient methods (getConnection, listConnections, listConnectionsByDomain, enableConnection, disableConnection) using 📝/🔌/⚙️ template with signatures from src/connection.ts in REFERENCE.md Connections section
- [ ] T016 [P] [US1] Document all 4 DomainClient methods (createDomain, getDomain, listDomains, deleteDomain) using 📝/🔌/⚙️ template with signatures from src/domain.ts in REFERENCE.md Domains section

**Checkpoint**: Organizations, Connections, and Domains sections complete with all method entries

---

## Phase 4: User Story 1+2 - Directory, Users, Sessions (Priority: P1)

**Goal**: Document directory sync, user management, and session management domains

**Independent Test**: Developer can look up any Directory/User/Session method and find accurate signature + working example

- [ ] T017 [P] [US1] Document all 7 DirectoryClient methods (listDirectories, getDirectory, getPrimaryDirectoryByOrganizationId, listDirectoryUsers, listDirectoryGroups, enableDirectory, disableDirectory) using 📝/🔌/⚙️ template with signatures from src/directory.ts in REFERENCE.md Directories section
- [ ] T018 [P] [US1] Document all 10 UserClient methods (createUserAndMembership, getUser, listUsers, updateUser, deleteUser, createMembership, deleteMembership, updateMembership, listOrganizationUsers, resendInvite) using 📝/🔌/⚙️ template with signatures from src/user.ts in REFERENCE.md Users section
- [ ] T019 [P] [US1] Document all 4 SessionClient methods (getSession, getUserSessions, revokeSession, revokeAllUserSessions) using 📝/🔌/⚙️ template with signatures from src/session.ts in REFERENCE.md Sessions section

**Checkpoint**: Directory, Users, and Sessions sections complete

---

## Phase 5: User Story 1+2 - Roles, Permissions, Remaining Clients (Priority: P1)

**Goal**: Document RBAC and remaining smaller domain clients

**Independent Test**: Developer can look up any Role/Permission/Passwordless/Auth/WebAuthn method and find accurate signature + working example

- [ ] T020 [P] [US1] Document all 14 RoleClient methods (createRole, getRole, listRoles, updateRole, deleteRole, getRoleUsersCount, createOrganizationRole, getOrganizationRole, listOrganizationRoles, updateOrganizationRole, deleteOrganizationRole, getOrganizationRoleUsersCount, updateDefaultOrganizationRoles, deleteOrganizationRoleBase) using 📝/🔌/⚙️ template with signatures from src/role.ts in REFERENCE.md Roles section
- [ ] T021 [P] [US1] Document all 9 PermissionClient methods (createPermission, getPermission, listPermissions, updatePermission, deletePermission, listRolePermissions, addPermissionsToRole, removePermissionFromRole, listEffectiveRolePermissions) using 📝/🔌/⚙️ template with signatures from src/permission.ts in REFERENCE.md Permissions section
- [ ] T022 [P] [US1] Document all 3 PasswordlessClient methods (sendPasswordlessEmail, verifyPasswordlessEmail, resendPasswordlessEmail) using 📝/🔌/⚙️ template with signatures from src/passwordless.ts in REFERENCE.md Passwordless section
- [ ] T023 [P] [US1] Document AuthClient method (updateLoginUserDetails) using 📝/🔌/⚙️ template with signature from src/auth.ts in REFERENCE.md Auth section
- [ ] T024 [P] [US1] Document all 3 WebAuthnClient methods (listCredentials, updateCredential, deleteCredential) using 📝/🔌/⚙️ template with signatures from src/webauthn.ts in REFERENCE.md WebAuthn section

**Checkpoint**: All 11 domain client sections complete. US1 (signatures) and US2 (examples) fully satisfied.

---

## Phase 6: User Story 3 - Domain Navigation Structure (Priority: P2)

**Goal**: Ensure collapsible domain grouping, table of contents, and navigation work correctly

**Independent Test**: Developer can navigate to any domain section from the TOC and expand/collapse individual methods

- [ ] T025 [US3] Verify and finalize table of contents with anchor links to all 12 domain sections (ScalekitClient + 11 domain clients) in REFERENCE.md
- [ ] T026 [US3] Verify all `<details>` collapsible sections render correctly in GitHub Markdown preview for REFERENCE.md
- [ ] T027 [US3] Add domain section headers with brief descriptions and `Access via scalekitClient.<property>` notes for each of the 11 domain client sections in REFERENCE.md

**Checkpoint**: Navigation structure complete. Developer can browse by domain.

---

## Phase 7: User Story 4 - Error Handling Documentation (Priority: P2)

**Goal**: Document the exception class hierarchy and error handling patterns

**Independent Test**: Developer can find the exception hierarchy and understand which exceptions to catch

- [ ] T028 [US4] Document the exception class hierarchy (ScalekitException → WebhookVerificationError, ScalekitValidateTokenFailureException, ScalekitServerException → 12 specific exceptions) with HTTP status mappings in REFERENCE.md Error Handling section. Source links to src/errors/base-exception.ts and src/errors/specific-exceptions.ts
- [ ] T029 [US4] Add error handling usage example showing try/catch with ScalekitServerException and specific exception types in REFERENCE.md Error Handling section
- [ ] T030 [US4] Document ScalekitServerException public properties (grpcStatus, httpStatus, errorCode, message, errDetails, unpackedDetails) in REFERENCE.md Error Handling section

**Checkpoint**: Error handling section complete. US4 fully satisfied.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, type definitions, and package configuration

- [ ] T031 [P] Add Type Definitions section documenting key exported types (AuthorizationUrlOptions, AuthenticationOptions, AuthenticationResponse, TokenValidationOptions, LogoutUrlOptions, RefreshTokenResponse, User, Identity, IdpInitiatedLoginClaims, CreateUserRequest, UpdateUserRequest, OrganizationSettings, GrantType) in REFERENCE.md
- [ ] T032 Verify all method signatures in REFERENCE.md match source code exactly by cross-referencing each entry against its source file (src/scalekit.ts, src/organization.ts, src/connection.ts, src/domain.ts, src/directory.ts, src/user.ts, src/session.ts, src/role.ts, src/permission.ts, src/passwordless.ts, src/auth.ts, src/webauthn.ts)
- [ ] T033 Verify all GitHub source links in REFERENCE.md use absolute URLs pointing to https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/ (no relative paths)
- [ ] T034 Verify all usage code examples in REFERENCE.md are syntactically valid TypeScript (correct imports, proper async/await, accurate parameter types)
- [ ] T035 Verify REFERENCE.md renders correctly in GitHub Markdown (collapsible sections, tables, code blocks, anchor links all functional)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (scaffold exists)
- **Phases 3-5 (Domain Clients)**: Depend on Phase 1 scaffold. Can run in parallel with each other.
- **Phase 6 (Navigation)**: Depends on Phases 3-5 completion (all sections exist)
- **Phase 7 (Errors)**: Depends on Phase 1 scaffold. Can run in parallel with Phases 3-5.
- **Phase 8 (Polish)**: Depends on all previous phases

### Parallel Opportunities

- All T004-T013 (ScalekitClient methods) can run in parallel
- T014, T015, T016 (Orgs/Connections/Domains) can run in parallel
- T017, T018, T019 (Directory/Users/Sessions) can run in parallel
- T020-T024 (Roles/Permissions/Passwordless/Auth/WebAuthn) can run in parallel
- Phases 3, 4, 5 can run in parallel with each other
- Phase 7 (Errors) can run in parallel with Phases 3-5

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

### MVP First (Phase 1 + 2)

1. Complete Phase 1: Create REFERENCE.md scaffold
2. Complete Phase 2: Document ScalekitClient core methods
3. **STOP and VALIDATE**: Verify signatures match source, examples compile
4. This alone provides value - core auth methods are most frequently referenced

### Incremental Delivery

1. Phase 1 + 2 → ScalekitClient documented (MVP)
2. Phase 3 → Organizations/Connections/Domains added
3. Phase 4 → Directory/Users/Sessions added
4. Phase 5 → Roles/Permissions/remaining clients added
5. Phase 6 → Navigation verified
6. Phase 7 → Error handling documented
7. Phase 8 → Full validation pass

---

## Notes

- [P] tasks = different sections of REFERENCE.md, no content overlap
- Each domain task reads its source file and writes only to its section
- Signature accuracy is NON-NEGOTIABLE per FR-004
- Every method uses the 📝/🔌/⚙️ icon template per FR-003
- Every method wrapped in `<details>` collapsible per FR-006
- All source links absolute GitHub URLs to `main` per FR-011/FR-012
