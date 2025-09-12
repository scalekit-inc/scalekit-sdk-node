---
operationId: PasswordlessService_ResendPasswordlessEmail
---

```js
const { authRequestId } = sendResponse;
const resendResponse = await scalekit.passwordless.resendPasswordlessEmail(
	authRequestId
);
```

```go
resendResponse, err := scalekitClient.Passwordless().ResendPasswordlessEmail(
    ctx,
    authRequestId,
)

if err != nil {
    // Handle error
    return
}
```

```java
SendPasswordlessResponse resendResponse = passwordlessClient.resendPasswordlessEmail(authRequestId);
```
