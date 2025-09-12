# Introduction

The Scalekit API is a RESTful API that enables you to manage organizations, users, and authentication settings. All requests must use HTTPS.

# Base URL

All API requests use the following base URLs:

```
https://{environment}.scalekit.dev (Development)
https://{environment}.scalekit.com (Production)
https://auth.example.com (Custom domain)
```

Scalekit operates two separate environments: Development and Production. Resources cannot be moved between environments.

# Authentication

The Scalekit API uses OAuth 2.0 Client Credentials for authentication.

Getting an access token

1. Get your credentials from the [Scalekit Dashboard](https://app.scalekit.com)

2. Request an access token:

```shell
curl https://{SCALEKIT_ENVIRONMENT_URL}/oauth/token \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id={client_id}' \
  -d 'client_secret={client_secret}' \
  -d 'grant_type=client_credentials'
```

3. Use the access token in API requests:

```shell
curl https://{SCALEKIT_ENVIRONMENT_URL}/api/v1/organizations \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

The response includes an access token:

```json
{
	"access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6InNua181Ok4OTEyMjU2NiIsInR5cCI6IkpXVCJ9...",
	"token_type": "Bearer",
	"expires_in": 86399,
	"scope": "openid"
}
```

# Response Codes

The API uses standard HTTP status codes:

| Code        | Description          |
| ----------- | -------------------- |
| 200/201     | Success              |
| 400         | Invalid request      |
| 401         | Authentication error |
| 404         | Resource not found   |
| 429         | Rate limit exceeded  |
| 500/501/504 | Server error         |

Error responses include detailed information:

```json
{
	"code": 16,
	"message": "Token empty",
	"details": [
		{
			"@type": "type.googleapis.com/scalekit.v1.errdetails.ErrorInfo",
			"error_code": "UNAUTHENTICATED"
		}
	]
}
```
