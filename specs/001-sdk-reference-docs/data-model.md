# Data Model: REFERENCE.md Document Structure

## Document Hierarchy

```
REFERENCE.md
├── Title + badges
├── Table of Contents (linked to domain sections)
├── Getting Started (constructor + initialization)
├── Domain Sections (one per client, collapsible)
│   ├── ScalekitClient (Authentication & Authorization)
│   ├── Organizations
│   ├── Connections
│   ├── Domains
│   ├── Directories
│   ├── Users & Memberships
│   ├── Sessions
│   ├── Roles
│   ├── Permissions
│   ├── Passwordless
│   ├── Auth (BYOA)
│   └── WebAuthn
├── Error Handling (exception hierarchy + examples)
└── Type Definitions (key interfaces)
```

## Method Entry Structure

Each method follows this template:

```html
<details>
<summary><code>methodName(params): ReturnType</code></summary>

#### 📝 Description
What the method does and when to use it.

#### 🔌 Usage
```typescript
import { ScalekitClient } from "@scalekit-sdk/node";

const sc = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);

const result = await sc.domain.methodName(arg1, arg2);
```

#### ⚙️ Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | `string` | Yes | What it is |
| param2 | `Options` | No | Optional config |

**Returns**: `Promise<ResponseType>` - Description of return value.

**Source**: [src/file.ts](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/file.ts)

</details>
```

**IMPORTANT**: Every method entry MUST use this exact template with
the icon-labeled subsections (📝, 🔌, ⚙️) in this order. No deviations.

## Domain Section Template

```html
## Domain Name

<details>
<summary><strong>Domain Name</strong> - Brief description</summary>

Access via `scalekitClient.domainProperty`.

[Method entries...]

</details>
```

## Relationships

- ScalekitClient → owns 11 domain client instances as readonly properties
- Each domain client method → links to one source file
- Each method signature → references types from src/types/
- Error handling → shared across all domain clients
