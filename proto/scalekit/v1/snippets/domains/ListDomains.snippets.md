---
operationId: DomainService_ListDomains
---

```js
// List all domains in an organization
const response = await client.domain.listDomains(organizationId);

// Domain object contains:
// - id: Domain identifier
// - domain: Domain name
// - organizationId: Owning organization
// - domainType: Configuration type
```
