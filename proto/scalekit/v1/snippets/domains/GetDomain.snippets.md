---
operationId: DomainService_GetDomain
---

```js
// Fetch details of a specific domain
const response = await client.domain.getDomain(organizationId, domainId);

// Domain object properties:
// - id: Domain identifier
// - domain: Domain name
// - organizationId: Owning organization
// - domainType: Domain configuration type
```
