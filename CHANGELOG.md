# Changelog

All notable changes to this SDK are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

Sections up to and including 2.19.0 were imported from [GitHub Releases](https://github.com/scalekit-inc/scalekit-sdk-node/releases). Their wording is kept, with small corrections.

## [2.19.0] - 2026-10-05

### Changes

- feat: accept multiple issuers in token validation (SK-2080) ([#233](https://github.com/scalekit-inc/scalekit-sdk-node/pull/233))

## [2.18.0] - 2026-09-29

### Changes

- [SK-1989] Add Virtual MCP and custom connector clients, complete the actions surface ([#227](https://github.com/scalekit-inc/scalekit-sdk-node/pull/227))

## [2.17.0] - 2026-09-25

### Changes

- [SK-2043] chore: update proto to v0.1.150.0 (v2.16.2) ([#229](https://github.com/scalekit-inc/scalekit-sdk-node/pull/229))
- Add getLoginRequestDetails to AuthClient ([#231](https://github.com/scalekit-inc/scalekit-sdk-node/pull/231))

## [2.16.1] - 2026-09-21

### Changes

- [SK-2034] fix(deps): resolve all open Dependabot alerts + bump to 2.16.1 ([#228](https://github.com/scalekit-inc/scalekit-sdk-node/pull/228))

## [2.16.0] - 2026-09-18

### Changes

- Adding support for Managing ResourceClients ([#226](https://github.com/scalekit-inc/scalekit-sdk-node/pull/226))

## [2.15.0] - 2026-09-11

### Changes

- Add listTools method to ActionsClient ([#222](https://github.com/scalekit-inc/scalekit-sdk-node/pull/222))

## [2.14.0] - 2026-09-09

### Changes

- [SK-1912] feat: add resources client for listing and revoking user consents ([#221](https://github.com/scalekit-inc/scalekit-sdk-node/pull/221))
- [SK-1291] feat(tools): add searchTools RPC support ([#217](https://github.com/scalekit-inc/scalekit-sdk-node/pull/217))

## [2.13.0] - 2026-09-08

### Changes

- fix: stop transport-level ECONNRESET from surfacing as ScalekitConflictException ([#216](https://github.com/scalekit-inc/scalekit-sdk-node/pull/216))

## [2.12.0] - 2026-08-18

### Changes

Scalekit v2.12.0 introduces encrypted-session middleware, mirroring the Python SDK’s middleware.

This release also includes a security fix by bumping axios to a more secure version. The middleware is framework-agnostic, with adapters for Express and Next.js, and includes features like transparent session refresh, full logout, and configurable local or full logout.

## [2.11.0] - 2026-07-28

### Changes

- [SK-1339] feat: typed updateLoginUserDetails response + listEventsPaginated ([#210](https://github.com/scalekit-inc/scalekit-sdk-node/pull/210))
- [SK-1357] Sanitize AxiosError to avoid leaking client_secret on token exchange failure ([#209](https://github.com/scalekit-inc/scalekit-sdk-node/pull/209))

## [2.10.0] - 2026-07-17

### Changes

- chore: update proto to v0.1.137.0 ([#206](https://github.com/scalekit-inc/scalekit-sdk-node/pull/206))

## [2.9.0] - 2026-07-13

### Changes

- [SK-1227] Add listConnections to Actions and Connection clients ([#201](https://github.com/scalekit-inc/scalekit-sdk-node/pull/201))
- [SK-1227] Re-export proto Timestamp as AppConnectionTimestamp ([#204](https://github.com/scalekit-inc/scalekit-sdk-node/pull/204))

## [2.8.0] - 2026-07-12

### Changes

#### Release Notes

This release introduces configurable timeouts for management APIs and tool-call APIs.

- New timeoutMs option — timeout for management API calls (organizations, users, connections, etc.). Default: 20 seconds.
- New toolTimeoutMs option — timeout for tool-call APIs (tools.*, actions.executeTool, actions.request), which can run longer as they call third-party providers. Default: 60 seconds.

```typescript
const scalekit = new ScalekitClient(envUrl, clientId, clientSecret, {
  timeoutMs: 20_000,
  toolTimeoutMs: 60_000,
});
```

- Calls that exceed the timeout now throw ScalekitGatewayTimeoutException instead of waiting indefinitely.
- Invalid timeout values (zero or negative) throw an error at client creation.
- actions.request default timeout changed from 30 to 60 seconds; it can still be overridden per call with timeoutMs.

## [2.7.0] - 2026-07-07

### Changes

- fix(SK-819, SK-821): provider error differentiation, blind retry fix, and upsert credentials ([#200](https://github.com/scalekit-inc/scalekit-sdk-node/pull/200))

## [2.6.3] - 2026-06-12

### Changes

- [SK-623] chore(deps): bump 5 low-risk Node deps ([#189](https://github.com/scalekit-inc/scalekit-sdk-node/pull/189))
- [SK-625] chore(deps): bump axios from 1.13.5 to 1.17.0 ([#190](https://github.com/scalekit-inc/scalekit-sdk-node/pull/190))
- [SK-626] chore(deps): bump @bufbuild stack (protobuf + buf + protoc-gen-es) ([#192](https://github.com/scalekit-inc/scalekit-sdk-node/pull/192))
- [SK-628] chore(deps): bump dotenv from 16.6.1 to 17.4.2 ([#193](https://github.com/scalekit-inc/scalekit-sdk-node/pull/193))
- [SK-630] chore(deps): bump jest + @types/jest from 29 to 30 ([#194](https://github.com/scalekit-inc/scalekit-sdk-node/pull/194))
- [SK-632] chore(deps): bump @types/node from 20 to 25 ([#195](https://github.com/scalekit-inc/scalekit-sdk-node/pull/195))
- [SK-633] chore(deps): bump jose from 5 to 6 ([#196](https://github.com/scalekit-inc/scalekit-sdk-node/pull/196))
- [SK-643] chore(deps): bump typescript from 5 to 6 ([#197](https://github.com/scalekit-inc/scalekit-sdk-node/pull/197))
- chore: release v2.6.3 ([#198](https://github.com/scalekit-inc/scalekit-sdk-node/pull/198))

## [2.6.2] - 2026-05-22

### Changes

- feat: organization session policy SDK methods ([#177](https://github.com/scalekit-inc/scalekit-sdk-node/pull/177))
- feat: regenerate protos from v0.1.123.0 and add slug/logoUrl to createOrganization ([#184](https://github.com/scalekit-inc/scalekit-sdk-node/pull/184))
- feat: add new organization and user SDK methods with external_id support ([#180](https://github.com/scalekit-inc/scalekit-sdk-node/pull/180))
- Releease tag 2.6.2 ([#185](https://github.com/scalekit-inc/scalekit-sdk-node/pull/185))

## [2.6.0] - 2026-04-24

### Changes

- [SK-2658] feat(token): add updateToken method ([#156](https://github.com/scalekit-inc/scalekit-sdk-node/pull/156))
- [SK-2664] feat(m2m): add M2MClient (ClientService org-client CRUD) ([#157](https://github.com/scalekit-inc/scalekit-sdk-node/pull/157))
- [SK-2668] feat(users): add listUserRoles and listUserPermissions ([#158](https://github.com/scalekit-inc/scalekit-sdk-node/pull/158))
- [SK-2671] feat(roles): add updateDefaultRoles and listDependentRoles ([#159](https://github.com/scalekit-inc/scalekit-sdk-node/pull/159))
- feat(connected-accounts): add user verification and magic link enhancements ([#161](https://github.com/scalekit-inc/scalekit-sdk-node/pull/161))
- Release version 20260402 ([#166](https://github.com/scalekit-inc/scalekit-sdk-node/pull/166))
- build(deps-dev): bump handlebars from 4.7.8 to 4.7.9 ([#163](https://github.com/scalekit-inc/scalekit-sdk-node/pull/163))
- build(deps-dev): bump picomatch from 2.3.1 to 2.3.2 ([#167](https://github.com/scalekit-inc/scalekit-sdk-node/pull/167))
- docs: add AGENTKIT.md for AgentKit APIs ([#169](https://github.com/scalekit-inc/scalekit-sdk-node/pull/169))
- feat(tools): sync proto v0.1.114.0 — is_custom_mcp + Filter fields for custom MCP ([#171](https://github.com/scalekit-inc/scalekit-sdk-node/pull/171))
- Adding Release Pipeline ([#172](https://github.com/scalekit-inc/scalekit-sdk-node/pull/172))
- Upgrade npm just before publishing ([#174](https://github.com/scalekit-inc/scalekit-sdk-node/pull/174))

## [2.5.0] - 2026-03-19

### Changes

- Adds support for Agent Auth And Connected Accounts.

## [2.4.0] - 2026-03-10

### Changes

- Updates for ci ([#152](https://github.com/scalekit-inc/scalekit-sdk-node/pull/152))
- Added Connection API - Add/Delete
- Release v2.4.0 ([#155](https://github.com/scalekit-inc/scalekit-sdk-node/pull/155))

## [2.3.0] - 2026-03-10

### Changes

- API Tokens support added.

## [2.2.2] - 2026-02-23

### Changes

- Bump axios from 1.13.4 to 1.13.5 ([#142](https://github.com/scalekit-inc/scalekit-sdk-node/pull/142))
- Using speckit: verify accuracy of snippets + make hyperlinks non-relative to base URL ([#145](https://github.com/scalekit-inc/scalekit-sdk-node/pull/145))
- Bump qs from 6.14.1 to 6.14.2 ([#144](https://github.com/scalekit-inc/scalekit-sdk-node/pull/144))

- Bump axios and qs versions ([#147](https://github.com/scalekit-inc/scalekit-sdk-node/pull/147))

## [2.2.0] - 2026-02-10

### Changes

- Migrate SDK to Connect/Protobuf v2 and cleanup ([#140](https://github.com/scalekit-inc/scalekit-sdk-node/pull/140))

## [2.1.9] - 2026-01-14

### Changes

- added changes for domain type ([#131](https://github.com/scalekit-inc/scalekit-sdk-node/pull/131))

#### Release Notes

#### Version 2.1.9

#### New Feature: Domain List API Type Filtering

Added optional type filtering to `listDomains()` method. Filter domains by `ALLOWED_EMAIL_DOMAIN` or `ORGANIZATION_DOMAIN` type.

**API:**
```typescript
// List all domains (no filter)
await client.domain.listDomains('org_123456');

// Filter by type
await client.domain.listDomains('org_123456', {
  domainType: DomainType.ALLOWED_EMAIL_DOMAIN  // or 'ORGANIZATION_DOMAIN'
});
```

**Highlights:**
- ✅ Fully backward compatible
- ✅ Supports enum and string values
- ✅ Comprehensive test coverage
- ✅ No migration required

#### Changes

**Added:**
- Type filtering parameter in `listDomains()`
- `resolveDomainType()` helper method
- Test coverage for all filtering scenarios

**Improved:**
- Error messages for invalid domain types
- Type safety for domain parameters

---

#### Migration

**No migration needed** - existing code works unchanged. The `domainType` parameter is optional.

---

**Documentation:** [Domain API Docs](https://docs.scalekit.com/apis/#tag/domains)

## [2.1.8] - 2026-01-04

### Changes

- Bump js-yaml from 3.14.1 to 3.14.2  in https://github.com/scalekit-inc/scalekit-sdk-node/pull/127
- Add WebAuthn support  in https://github.com/scalekit-inc/scalekit-sdk-node/pull/130
- Bump qs from 6.13.0 to 6.14.1  in https://github.com/scalekit-inc/scalekit-sdk-node/pull/134

## [2.1.7] - 2025-12-23

### Changes

- Add upsertUserManagementSettings method to OrganizationClient  in https://github.com/scalekit-inc/scalekit-sdk-node/pull/128

## [2.1.6] - 2025-11-19

### Changes

*Generate proto files to support given_name and family_name in user object in https://github.com/scalekit-inc/scalekit-sdk-node/pull/126

## [2.1.5] - 2025-11-13

### Changes

- add verifyInterceptorPayload method  in https://github.com/scalekit-inc/scalekit-sdk-node/pull/119

## [2.1.4] - 2025-10-13

### Changes

- Add  session management sdk methods  https://github.com/scalekit-inc/scalekit-sdk-node/pull/111

## [2.1.3] - 2025-09-18

### Changes

#### Enchancements
- Add getDomain and deleteDomain methods to DomainClient ([#108](https://github.com/scalekit-inc/scalekit-sdk-node/pull/108))
- Add role and permission management sdk methods

## [2.1.1] - 2025-09-02

### Changes

- Add domainType option to createDomain method and updated proto files ([#107](https://github.com/scalekit-inc/scalekit-sdk-node/pull/107))

## [2.1.0] - 2025-08-22

### Changes

- Update Error Handling for Node SDK ([#105](https://github.com/scalekit-inc/scalekit-sdk-node/pull/105))
- Rename sendActivationEmail to sendInvitationEmail and add resendInvite sdk method ([#106](https://github.com/scalekit-inc/scalekit-sdk-node/pull/106))

## [2.0.1] - 2025-07-16

### Changes

- Implemented issuer, audience, and scope validation in tokens ([#103](https://github.com/scalekit-inc/scalekit-sdk-node/pull/103))

## [2.0.0] - 2025-07-10

### Changes

- Implemented user CRUD methods and refresh token handling in SDK ([#96](https://github.com/scalekit-inc/scalekit-sdk-node/pull/96))

## [1.0.14] - 2025-07-03

### Changes

- Upgrade axios version from 1.7.5 to 1.10.0 ([#101](https://github.com/scalekit-inc/scalekit-sdk-node/pull/101))
- add @bufbuild/protobuf as peerDependencies ([#100](https://github.com/scalekit-inc/scalekit-sdk-node/pull/100))
- Upgrade undici version to 5.29.0 ([#102](https://github.com/scalekit-inc/scalekit-sdk-node/pull/102))

## [1.0.13] - 2025-07-03

### Changes

- made changes to support templateVariables in sendPasswordlessEmail method ([#99](https://github.com/scalekit-inc/scalekit-sdk-node/pull/99))

## [1.0.12] - 2025-06-03

### Changes

- Modified the SDK to handle passwordless authentication using magic links. ([#98](https://github.com/scalekit-inc/scalekit-sdk-node/pull/98))

## [1.0.11] - 2025-06-02

### Changes

- Add minimum requirements section ([#83](https://github.com/scalekit-inc/scalekit-sdk-node/pull/83))
- Implemented  methods for passwordless in the sdk ([#97](https://github.com/scalekit-inc/scalekit-sdk-node/pull/97))

## [1.0.10] - 2025-01-24

### Changes

- Bump undici from 5.28.4 to 5.28.5 ([#71](https://github.com/scalekit-inc/scalekit-sdk-node/pull/71))

## [1.0.9] - 2025-01-23

### Changes

- Nodejs minimum version ([#69](https://github.com/scalekit-inc/scalekit-sdk-node/pull/69))
- [SK-1062] Remove Get and Delete Portal Link Methods ([#67](https://github.com/scalekit-inc/scalekit-sdk-node/pull/67))

## [1.0.8] - 2024-11-16

### Changes

- Bump axios from 1.7.3 to 1.7.5 ([#30](https://github.com/scalekit-inc/scalekit-sdk-node/pull/30))
- Bump @bufbuild/buf from 1.36.0 to 1.42.0 ([#44](https://github.com/scalekit-inc/scalekit-sdk-node/pull/44))
- Export Scalekit for backward compatibility ([#32](https://github.com/scalekit-inc/scalekit-sdk-node/pull/32))
- Directory sync changes ([#47](https://github.com/scalekit-inc/scalekit-sdk-node/pull/47))

## [1.0.6] - 2024-08-09

### Changes

- Fix connection provider ([#22](https://github.com/scalekit-inc/scalekit-sdk-node/pull/22))
- IDP Initiated SSO DX v2 ([#23](https://github.com/scalekit-inc/scalekit-sdk-node/pull/23))

## [1.0.5] - 2024-07-18

### Changes

- Bump typescript from 5.4.5 to 5.5.3 ([#10](https://github.com/scalekit-inc/scalekit-sdk-node/pull/10))
- Release/v1.0.5 ([#11](https://github.com/scalekit-inc/scalekit-sdk-node/pull/11))
- Bump @types/node from 20.12.7 to 20.14.10 ([#9](https://github.com/scalekit-inc/scalekit-sdk-node/pull/9))
- Bump @types/node from 20.14.10 to 20.14.11 ([#12](https://github.com/scalekit-inc/scalekit-sdk-node/pull/12))

## [1.0.4] - 2024-06-24

### Changes

- Improve readme with examples
- Add enable/disable connection
- Add email as default scope

## [1.0.1] - 2024-06-13

### Changes

- First Release of the official Scalekit Node SDK

[2.19.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.19.0
[2.18.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.18.0
[2.17.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.17.0
[2.16.1]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.16.1
[2.16.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.16.0
[2.15.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.15.0
[2.14.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.14.0
[2.13.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.13.0
[2.12.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.12.0
[2.11.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.11.0
[2.10.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.10.0
[2.9.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.9.0
[2.8.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.8.0
[2.7.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.7.0
[2.6.3]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/2.6.3
[2.6.2]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/2.6.2
[2.6.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/2.6.0
[2.5.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.5.0
[2.4.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.4.0
[2.3.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.3.0
[2.2.2]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.2.2
[2.2.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.2.0
[2.1.9]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.9
[2.1.8]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.8
[2.1.7]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.7
[2.1.6]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.6
[2.1.5]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.5
[2.1.4]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.4
[2.1.3]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.3
[2.1.1]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.1
[2.1.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.1.0
[2.0.1]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.0.1
[2.0.0]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v2.0.0
[1.0.14]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.14
[1.0.13]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.13
[1.0.12]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.12
[1.0.11]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.11
[1.0.10]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.10
[1.0.9]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.9
[1.0.8]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.8
[1.0.6]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.6
[1.0.5]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.5
[1.0.4]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.4
[1.0.1]: https://github.com/scalekit-inc/scalekit-sdk-node/releases/tag/v1.0.1
