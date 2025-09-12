```javascript
const organizations = await scalekit.organization.listOrganization({
	pageSize: 10,
});
```

```python
options = ListOrganizationOptions()
options.page_size = 10

organizations = scalekit_client.organization.list_organizations(
  options=options
)
```

```go
organizations, err := scalekitClient.Organization.ListOrganizations(
  ctx,
  &scalekit.ListOrganizationOptions{
    PageSize: 10,
  }
)
```

```java
ListOrganizationsResponse organizations = scalekitClient.organizations().listOrganizations(10, "");
```
