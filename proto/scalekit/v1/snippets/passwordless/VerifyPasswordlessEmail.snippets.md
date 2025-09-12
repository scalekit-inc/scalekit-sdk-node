---
operationId: PasswordlessService_VerifyPasswordlessEmail
---

```js
const { authRequestId } = sendResponse;
const verifyResponse = await scalekit.passwordless.verifyPasswordlessEmail(
	// Verification Code (OTP)
	{ code: "123456" },
	// Magic Link Token
	{ linkToken: link_token },
	authRequestId
);
```

```go
// Verify with OTP code
verifyResponse, err := scalekitClient.Passwordless().VerifyPasswordlessEmail(
    ctx,
    &scalekit.VerifyPasswordlessOptions{
        Code:          "123456", // OTP code
        AuthRequestId: authRequestId,
    },
)

if err != nil {
    // Handle error
    return
}

// Verify with magic link token
verifyResponse, err := scalekitClient.Passwordless().VerifyPasswordlessEmail(
    ctx,
    &scalekit.VerifyPasswordlessOptions{
        LinkToken: linkToken, // Magic link token
    },
)

if err != nil {
    // Handle error
    return
}

// User verified successfully
userEmail := verifyResponse.Email
```

```java
// Verify with OTP code
VerifyPasswordlessOptions verifyOptions = new VerifyPasswordlessOptions();
verifyOptions.setCode("123456"); // OTP code
verifyOptions.setAuthRequestId(authRequestId);

VerifyPasswordLessResponse verifyResponse = passwordlessClient.verifyPasswordlessEmail(verifyOptions);

// User verified successfully
String userEmail = verifyResponse.getEmail();

// Verify with magic link token
VerifyPasswordlessOptions verifyOptions = new VerifyPasswordlessOptions();
verifyOptions.setLinkToken(linkToken); // Magic link token

VerifyPasswordLessResponse verifyResponse = passwordlessClient.verifyPasswordlessEmail(verifyOptions);

// User verified successfully
String userEmail = verifyResponse.getEmail();
```
