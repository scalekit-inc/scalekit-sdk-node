---
operationId: DomainService_DeleteDomain
---

```js
// Remove a domain from an organization
// Caution: Deletion is permanent and may affect user access
const response = await client.domain.deleteDomain(organizationId, domainId);
```
