---
operationId: OrganizationService_CreateOrganization
---

## JavaScript/Node.js SDK

```javascript
const organization = await scalekit.organization.createOrganization(name, {
	externalId: "externalId",
});
```

## Python SDK

```python
options = CreateOrganizationOptions()
options.external_id = "externalId"
organization = scalekit_client.organization.create_organization(
  name,
  options=options
)
```

## Go SDK

```go
organization, err := ScalekitClient.Organization.CreateOrganization(
  ctx,
  name,
  scalekit.CreateOrganizationOptions{
    ExternalID: "externalId",
  },
)
```

## Java SDK

```java
CreateOrganization createOrganization = CreateOrganization.newBuilder()
  .setDisplayName("Test Org")
  .build();

Organization createdOrganization = scalekitClient.organizations().create(createOrganization);
```
