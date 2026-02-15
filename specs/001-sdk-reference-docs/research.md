# Research: SDK Reference Documentation

## Source File → Domain Client Mapping

| Domain Client | Source File | Method Count |
|---------------|-------------|--------------|
| ScalekitClient | `src/scalekit.ts` | 10 methods + constructor |
| OrganizationClient | `src/organization.ts` | 10 methods |
| ConnectionClient | `src/connection.ts` | 5 methods |
| DomainClient | `src/domain.ts` | 4 methods |
| DirectoryClient | `src/directory.ts` | 7 methods |
| UserClient | `src/user.ts` | 10 methods |
| SessionClient | `src/session.ts` | 4 methods |
| RoleClient | `src/role.ts` | 14 methods |
| PermissionClient | `src/permission.ts` | 9 methods |
| PasswordlessClient | `src/passwordless.ts` | 3 methods |
| AuthClient | `src/auth.ts` | 1 method |
| WebAuthnClient | `src/webauthn.ts` | 3 methods |
| **Total** | | **80 methods + constructor** |

## GitHub Base URL

All source links use:
`https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/`

### File-to-URL Mapping

| File | GitHub URL |
|------|-----------|
| src/scalekit.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/scalekit.ts |
| src/organization.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/organization.ts |
| src/connection.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/connection.ts |
| src/domain.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/domain.ts |
| src/directory.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/directory.ts |
| src/user.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/user.ts |
| src/session.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/session.ts |
| src/role.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/role.ts |
| src/permission.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/permission.ts |
| src/passwordless.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/passwordless.ts |
| src/auth.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/auth.ts |
| src/webauthn.ts | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/webauthn.ts |
| src/errors/ | https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/errors/ |

## Exception Hierarchy

```
ScalekitException (extends Error)
├── WebhookVerificationError
├── ScalekitValidateTokenFailureException
└── ScalekitServerException
    ├── ScalekitBadRequestException        (400)
    ├── ScalekitUnauthorizedException      (401)
    ├── ScalekitForbiddenException         (403)
    ├── ScalekitNotFoundException          (404)
    ├── ScalekitConflictException          (409)
    ├── ScalekitTooManyRequestsException   (429)
    ├── ScalekitInternalServerException    (500)
    ├── ScalekitNotImplementedException    (501)
    ├── ScalekitServiceUnavailableException(503)
    ├── ScalekitGatewayTimeoutException    (504)
    ├── ScalekitCancelledException         (cancelled)
    └── ScalekitUnknownException           (unknown)
```

## Document Format Decision

- **Decision**: Use HTML `<details>` collapsible sections per method
- **Rationale**: Allows developers to scan method names quickly and
  expand only the ones they need. GitHub renders these natively.
- **Alternatives considered**: Flat Markdown headers (too long to scroll),
  separate files per domain (harder to search), wiki pages (not in npm
  package).

## Exported Types & Interfaces

Key types that appear in method signatures:

| Type | Source | Used In |
|------|--------|---------|
| AuthorizationUrlOptions | src/types/scalekit.ts | getAuthorizationUrl |
| AuthenticationOptions | src/types/scalekit.ts | authenticateWithCode |
| AuthenticationResponse | src/types/scalekit.ts | authenticateWithCode |
| TokenValidationOptions | src/types/scalekit.ts | validateAccessToken, getIdpInitiatedLoginClaims |
| LogoutUrlOptions | src/types/scalekit.ts | getLogoutUrl |
| RefreshTokenResponse | src/types/scalekit.ts | refreshAccessToken |
| User | src/types/auth.ts | AuthenticationResponse |
| Identity | src/types/auth.ts | User |
| IdpInitiatedLoginClaims | src/types/auth.ts | getIdpInitiatedLoginClaims |
| CreateUserRequest | src/types/user.ts | createUserAndMembership |
| UpdateUserRequest | src/types/user.ts | updateUser |
| OrganizationSettings | src/types/organization.ts | updateOrganizationSettings |
| GrantType | src/types/scalekit.ts | (enum for auth flows) |
