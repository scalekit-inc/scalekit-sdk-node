---
operationId: UserService_GetUser
---

```js
const { user } = await scalekit.user.getUser(user_id);
```

```python
response = users.get_user(
    organization_id,
    user_id
)
```

```go
resp, err := ScalekitClient.User().GetUser(ctx, userID)
```

```java
GetUserResponse resp = scalekitClient.users().getUser(userId);
```
