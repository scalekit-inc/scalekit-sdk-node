# Feature Specification: SDK Reference Documentation

**Feature Branch**: `001-sdk-reference-docs`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "The REFERENCE.md should accurately reflect signatures of all the methods along with usage code snippets. They non negotiably should be accurate because many developers will rely on using it to try sdks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Looks Up a Method Signature (Priority: P1)

A developer integrating the Scalekit SDK needs to quickly find the exact
signature of a method (parameter names, types, optional vs required, return
type) so they can call it correctly without reading source code.

**Why this priority**: This is the primary use case. Inaccurate signatures
cause immediate integration failures and erode trust in the SDK.

**Independent Test**: A developer can open REFERENCE.md, navigate to any
public method (e.g., `authenticateWithCode`), and find the complete
signature with parameter types and return type that exactly matches the
actual SDK source code.

**Acceptance Scenarios**:

1. **Given** REFERENCE.md exists, **When** a developer looks up
   `getAuthorizationUrl`, **Then** the documented signature matches the
   actual method signature in the SDK source exactly (parameter names,
   types, optionality, return type).
2. **Given** REFERENCE.md exists, **When** a developer searches for any
   public method, **Then** every public method on ScalekitClient and all
   domain clients is documented.
3. **Given** a method has optional parameters, **When** the developer
   reads the parameter documentation, **Then** required vs optional is
   clearly indicated for each parameter.

---

### User Story 2 - Developer Copies a Working Code Example (Priority: P1)

A developer wants to copy a usage example from REFERENCE.md and have it
work in their project with minimal modification (only environment-specific
values like credentials and IDs).

**Why this priority**: Non-functional examples are worse than no examples.
Developers use reference docs as copy-paste starting points.

**Independent Test**: A developer copies any code example from
REFERENCE.md, replaces only placeholder values (env URL, client ID, etc.),
and the code compiles and runs without type errors.

**Acceptance Scenarios**:

1. **Given** REFERENCE.md has a usage example for `createOrganization`,
   **When** a developer copies it into a TypeScript project with the SDK
   installed, **Then** the code compiles without errors after replacing
   placeholder credentials.
2. **Given** REFERENCE.md has usage examples, **When** the developer
   reads any example, **Then** the example includes the import statement,
   client initialization, and the method call with realistic parameter
   values.
3. **Given** the SDK publishes a new version with API changes, **When**
   REFERENCE.md is reviewed, **Then** all examples reflect the current
   API surface (no references to removed or renamed methods).

---

### User Story 3 - Developer Navigates by API Domain (Priority: P2)

A developer working with a specific SDK domain (e.g., organizations,
connections, directories) wants to browse all available methods for that
domain without scrolling through unrelated content.

**Why this priority**: Organized navigation reduces time-to-answer and
supports exploration of related methods.

**Independent Test**: A developer looking for directory-related methods
can navigate to a "Directory" section and find all directory methods
grouped together with collapsible detail sections.

**Acceptance Scenarios**:

1. **Given** REFERENCE.md exists, **When** a developer opens it, **Then**
   methods are grouped by API domain (ScalekitClient, Organizations,
   Connections, Domains, Directories, Users, Sessions, Roles, Permissions,
   Passwordless, WebAuthn).
2. **Given** a domain section exists, **When** the developer expands it,
   **Then** each method has a collapsible entry with description, usage
   example, and parameter documentation.

---

### User Story 4 - Developer Understands Error Handling (Priority: P2)

A developer needs to understand what exceptions a method can throw and how
to handle errors in their integration.

**Why this priority**: Proper error handling is critical for production
applications. Developers need to know the exception hierarchy.

**Independent Test**: A developer can find the error/exception class
hierarchy and understand which exceptions to catch for specific failure
modes (e.g., not found, unauthorized, rate limited).

**Acceptance Scenarios**:

1. **Given** REFERENCE.md has an errors section, **When** a developer
   reads it, **Then** all exception classes are documented with their
   inheritance hierarchy and HTTP status code mappings.
2. **Given** a method can throw exceptions, **When** the developer reads
   the method documentation, **Then** key error scenarios are noted.

---

### Edge Cases

- What happens when a method signature changes between SDK versions?
  The REFERENCE.md MUST be updated in the same PR as the code change.
- What happens when a method is deprecated? The REFERENCE.md MUST
  indicate deprecated methods with migration guidance.
- What happens when REFERENCE.md is viewed offline (from npm package)?
  All content MUST be self-contained with no external dependencies for
  comprehension.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: REFERENCE.md MUST document every public method on
  ScalekitClient (constructor, getAuthorizationUrl, authenticateWithCode,
  getIdpInitiatedLoginClaims, validateAccessToken, getLogoutUrl,
  refreshAccessToken, validateToken, verifyScopes, verifyWebhookPayload,
  verifyInterceptorPayload).
- **FR-002**: REFERENCE.md MUST document every public method on all domain
  clients (OrganizationClient, ConnectionClient, DomainClient,
  DirectoryClient, UserClient, SessionClient, RoleClient,
  PermissionClient, PasswordlessClient, AuthClient, WebAuthnClient).
- **FR-003**: Each method entry MUST use the standard icon-labeled
  template with these exact subsections in order:
  📝 **Description** - what the method does and when to use it;
  🔌 **Usage** - complete code example with imports, initialization,
  and method invocation;
  ⚙️ **Parameters** - table with columns: Parameter, Type, Required,
  Description. Every method entry MUST follow this template consistently.
- **FR-004**: Method signatures in REFERENCE.md MUST exactly match the
  current SDK source code (parameter names, types, return types).
- **FR-005**: Usage examples MUST be syntactically valid TypeScript that
  compiles against the current SDK version.
- **FR-006**: Methods MUST be grouped by API domain. Each method MUST
  be wrapped in an HTML `<details>` collapsible section with the method
  signature in the `<summary>`. Within each collapsible, the three
  icon-labeled subsections (📝, 🔌, ⚙️) from FR-003 MUST appear in
  order, followed by the Source link from FR-012.
- **FR-007**: All SDK exception classes MUST be documented with their
  hierarchy, HTTP status code mappings, and common properties.
- **FR-008**: REFERENCE.md MUST include the ScalekitClient constructor
  with initialization example as the first entry.
- **FR-009**: Deprecated methods, if any, MUST be marked with deprecation
  notices and migration guidance.
- **FR-010**: REFERENCE.md MUST be included in the published npm package
  so developers can access it offline.
- **FR-011**: All source code hyperlinks in REFERENCE.md MUST use absolute
  GitHub URLs (e.g., `https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/scalekit.ts`).
  Relative paths (e.g., `/src/scalekit.ts`) are prohibited.
- **FR-012**: Each method entry MUST include a "Source" link pointing to
  the source file on the `main` branch of the GitHub repository. Links
  MUST always target the `main` branch, not version tags.
- **FR-013**: REFERENCE.md MUST include a Type Definitions section documenting key exported types (e.g., AuthorizationUrlOptions, AuthenticationResponse, User) with brief descriptions and links to source.

### Key Entities

- **ScalekitClient**: The main entry point; holds credentials and exposes
  domain client properties and top-level authentication methods.
- **Domain Clients**: Eleven specialized clients (Organization, Connection,
  Domain, Directory, User, Session, Role, Permission, Passwordless, Auth,
  WebAuthn) each managing a specific API domain.
- **Type Definitions**: Interfaces and types for request options, response
  objects, and configuration (AuthorizationUrlOptions,
  AuthenticationResponse, User, etc.).
- **Exception Classes**: Typed error hierarchy rooted at ScalekitException
  with specific subclasses for each HTTP error status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of public methods across all domain clients are
  documented in REFERENCE.md (zero omissions).
- **SC-002**: 100% of method signatures in REFERENCE.md match the
  actual SDK source code with zero discrepancies in parameter names,
  types, or return types.
- **SC-003**: 100% of usage examples compile successfully against the
  current SDK version when placeholder credentials are provided.
- **SC-004**: Every method has at least one usage example showing a
  real-world invocation pattern.
- **SC-005**: A developer unfamiliar with the SDK can find the correct
  method and understand how to call it within 60 seconds of opening
  REFERENCE.md (validated by: TOC links functional, collapsible sections render in GitHub, and no more than 3 clicks to method).
- **SC-006**: REFERENCE.md covers all 11 API domains with navigable
  section groupings.

## Clarifications

### Session 2026-02-15

- Q: Should source code hyperlinks in REFERENCE.md use relative paths or absolute GitHub URLs? → A: Absolute GitHub URLs. Links MUST point to `https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/...`, never relative paths like `/src/...`.
- Q: Should each method entry link to its source file on GitHub? → A: Yes, each method entry includes a "Source" link pointing to the specific file on GitHub's `main` branch.
- Q: Should source links pin to a version tag or always point to `main`? → A: Always link to `main` branch. Links stay current with the latest release.
- Q: What should the filename casing be? → A: `REFERENCE.md` (uppercase). All references normalized from `reference.md` to `REFERENCE.md`.
- Q: Must every method entry follow the same icon-labeled collapsible template? → A: Yes. Every method MUST use the consistent template: `<details>` collapsible with method signature in `<summary>`, then 📝 Description, 🔌 Usage (code example), ⚙️ Parameters (table), and Source link. No deviations.
- Q: What is the exact format for GitHub source links in REFERENCE.md? → A: https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/file.ts

### Assumptions

- The SDK's current public API surface (as of v2.2.0) is the baseline.
  All methods currently exported via src/index.ts and exposed through
  domain client properties are in scope.
- The collapsible format using HTML details tags is the chosen
  documentation structure, consistent with the constitution's
  documentation workflow requirements.
- Placeholder values in examples (e.g., process.env.SCALEKIT_ENV_URL)
  are acceptable and expected; only SDK API calls need to be accurate.
- The REFERENCE.md will be manually maintained alongside code changes,
  not auto-generated from source.
