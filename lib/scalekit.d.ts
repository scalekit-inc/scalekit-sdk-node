import ConnectionClient from './connection';
import DirectoryClient from './directory';
import DomainClient from './domain';
import AuthClient from './auth';
import OrganizationClient from './organization';
import PasswordlessClient from './passwordless';
import UserClient from './user';
import SessionClient from './session';
import RoleClient from './role';
import PermissionClient from './permission';
import WebAuthnClient from './webauthn';
import { IdpInitiatedLoginClaims } from './types/auth';
import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, LogoutUrlOptions, RefreshTokenResponse, TokenValidationOptions } from './types/scalekit';
/**
 * Main Scalekit SDK client for interacting with all Scalekit API endpoints.
 *
 * TIP: You can use it as a singleton object - that is you can initialize it just once and use the same client variable wherever required.
 *
 * This is the primary entry point for interacting with Scalekit's authentication services,
 * including SSO, SCIM, user management, roles, permissions, and passwordless authentication.
 *
 * You can find the Environment URL, Client ID and Client Secret in Scalekit Dashboard -> Developers (Settings) -> API Credentials
 *
 * @param {string} envUrl - The Scalekit environment URL (e.g., "https://yourorg.scalekit.com" or your configured custom domain like "https://auth.yourapp.ai")
 * @param {string} clientId - Your Scalekit client ID from the Scalekit Dashboard
 * @param {string} clientSecret - Your Scalekit client secret from the Scalekit Dashboard
 *
 * @example
 * // Initialize the Scalekit client
 * import { ScalekitClient } from '@scalekit-sdk/node';
 *
 * const scalekitClient = new ScalekitClient(
 *   process.env.SCALEKIT_ENV_URL,
 *   process.env.SCALEKIT_CLIENT_ID,
 *   process.env.SCALEKIT_CLIENT_SECRET
 * );
 *
 * // Access various client modules
 * const organizations = await scalekitClient.organization.listOrganization();
 * const users = await scalekitClient.user.listUsers();
 *
 * @see {@link https://docs.scalekit.com/apis/ | Scalekit API Documentation}
 */
export default class ScalekitClient {
    private readonly coreClient;
    private readonly grpcConnect;
    readonly organization: OrganizationClient;
    readonly connection: ConnectionClient;
    readonly domain: DomainClient;
    readonly directory: DirectoryClient;
    readonly passwordless: PasswordlessClient;
    readonly user: UserClient;
    readonly session: SessionClient;
    readonly role: RoleClient;
    readonly permission: PermissionClient;
    readonly auth: AuthClient;
    readonly webauthn: WebAuthnClient;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    /**
     * Utility method to generate the OAuth 2.0 authorization URL to initiate the SSO authentication flow.
     *
     * This method doesn't make any network calls but instead generates a fully formed Authorization URL
     * as a string that you can redirect your users to initiate authentication.
     *
     * @param {string} redirectUri - The URL where users will be redirected after authentication.
     *                               Must match one of the redirect URIs configured in your Scalekit dashboard.
     * @param {AuthorizationUrlOptions} [options] - Optional configuration for the authorization request
     * @param {string[]} [options.scopes=['openid', 'profile', 'email']] - OAuth scopes to request. Default includes openid, profile, and email.
     * @param {string} [options.state] - Opaque value to maintain state between request and callback. Used to prevent CSRF attacks.
     * @param {string} [options.nonce] - String value used to associate a client session with an ID Token.
     * @param {string} [options.loginHint] - Hint to the authorization server about the login identifier the user might use (e.g., email address).
     * @param {string} [options.domainHint] - Domain hint to identify which organization's IdP to use for authentication.
     * @param {string} [options.connectionId] - Specific SSO connection ID to use for authentication.
     * @param {string} [options.organizationId] - Organization ID to authenticate against.
     * @param {string} [options.provider] - Social login provider (e.g., 'google', 'github', 'microsoft').
     * @param {string} [options.codeChallenge] - PKCE code challenge for enhanced security in public clients.
     * @param {string} [options.codeChallengeMethod] - Method used to generate the code challenge (we support only 'S256').
     * @param {string} [options.prompt] - Controls the authorization server's authentication behavior (e.g., 'login', 'consent', 'create').
     *
     * @returns {string} The complete authorization URL to redirect the user to
     *
     * @example
     * // Initiate Enterprise SSO authentication for a given org_id
     * const authUrl = scalekitClient.getAuthorizationUrl(
     *   'https://yourapp.com/auth/callback',
     *   {
     *     state: 'random-state-value',
     *     organizationId: 'org_123456'
     *   }
     * );
     * // Redirect user to authUrl
     *
     * @example
     * // Initiate Enterprise SSO authentication for a specific connection id
     * // optionally, pass the loginhint to the 3rd party identity provider.
     * const authUrl = scalekitClient.getAuthorizationUrl(
     *   'https://yourapp.com/auth/callback',
     *   {
     *     connectionId: 'conn_abc123',
     *     loginHint: 'user@company.com'
     *   }
     * );
     *
     * @example
     * // Social login
     * const authUrl = scalekitClient.getAuthorizationUrl(
     *   'https://yourapp.com/auth/callback',
     *   {
     *     provider: 'google',
     *     state: 'random-state'
     *   }
     * );
     *
     * @example
     * // PKCE flow for public clients
     * const authUrl = scalekitClient.getAuthorizationUrl(
     *   'https://yourapp.com/auth/callback',
     *   {
     *     codeChallenge: 'your-code-challenge',
     *     codeChallengeMethod: 'S256',
     *     organizationId: 'org_123456'
     *   }
     * );
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Authentication API Documentation}
     * @see {@link authenticateWithCode} - Use this method to exchange the authorization code for tokens
     */
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    /**
     * Exchanges an authorization code for access tokens and user information.
     *
     * This method completes the OAuth 2.0 authorization code flow by exchanging the code
     * received in the callback for access tokens, ID tokens, and user profile information.
     * Call this method in your redirect URI handler after receiving the authorization code.
     *
     * @param {string} code - The authorization code received in the callback URL after user authentication
     * @param {string} redirectUri - The same redirect URI used in getAuthorizationUrl(). Must match exactly.
     * @param {AuthenticationOptions} [options] - Optional authentication configuration
     * @param {string} [options.codeVerifier] - PKCE code verifier to validate the code challenge (required if PKCE was used)
     *
     * @returns {Promise<AuthenticationResponse>} Authentication response containing:
     *   - user: User profile information (email, name, organization, etc.)
     *   - idToken: JWT ID token containing user claims
     *   - accessToken: Access token for API authorization
     *   - expiresIn: Token expiration time in seconds
     *   - refreshToken: Refresh token for obtaining new access tokens
     *
     * @throws {Error} When the authorization code is invalid, expired, or already used
     * @throws {Error} When the redirect URI doesn't match the one used in authorization
     * @throws {Error} When PKCE code verifier is invalid or missing
     *
     * @example
     * // Basic code exchange (server-side flow)
     * app.get('/auth/callback', async (req, res) => {
     *   const { code } = req.query;
     *
     *   try {
     *     const result = await scalekitClient.authenticateWithCode(
     *       code,
     *       'https://yourapp.com/auth/callback'
     *     );
     *
     *     // Store tokens securely
     *     req.session.accessToken = result.accessToken;
     *     req.session.user = result.user;
     *
     *     res.redirect('/dashboard');
     *   } catch (error) {
     *     console.error('Authentication failed:', error);
     *     res.redirect('/login?error=auth_failed');
     *   }
     * });
     *
     * @example
     * // PKCE flow (for public clients)
     * app.get('/auth/callback', async (req, res) => {
     *   const { code } = req.query;
     *   const codeVerifier = req.session.codeVerifier; // Stored during authorization
     *
     *   const result = await scalekitClient.authenticateWithCode(
     *     code,
     *     'https://yourapp.com/auth/callback',
     *     { codeVerifier }
     *   );
     *
     *   // Use result.user, result.accessToken, etc.
     * });
     *
     * @see {@link getAuthorizationUrl} - Generate the authorization URL first
     * @see {@link validateAccessToken} - Validate tokens in subsequent requests
     */
    authenticateWithCode(code: string, redirectUri: string, options?: AuthenticationOptions): Promise<AuthenticationResponse>;
    /**
     * Extracts and validates claims from an IdP-initiated login token.
     *
     * Use this method when handling IdP-initiated SSO flows, where the authentication is
     * initiated from the identity provider's portal rather than your application. This validates
     * the token and returns the necessary information to initiate a new SP Initiated SSO workflow.
     *
     * @param {string} idpInitiatedLoginToken - The token received in the 'idp_initiated_login' query parameter
     * @param {TokenValidationOptions} [options] - Optional token validation configuration
     * @param {string} [options.issuer] - Expected token issuer for validation
     * @param {string} [options.audience] - Expected token audience for validation
     *
     * @returns {Promise<IdpInitiatedLoginClaims>} Claims containing:
     *   - connection_id: The SSO connection identifier
     *   - organization_id: The organization identifier
     *   - login_hint: User's email or login identifier
     *   - relay_state: Optional state parameter from the IdP
     *
     * @throws {ScalekitValidateTokenFailureException} When token validation fails
     *
     * @example
     * // Handle IdP-initiated login
     * app.get('/auth/callback', async (req, res) => {
     *   const { idp_initiated_login } = req.query;
     *
     *   if (idp_initiated_login) {
     *     try {
     *       const claims = await scalekitClient.getIdpInitiatedLoginClaims(idp_initiated_login);
     *
     *       // Redirect to authorization URL with the claims
     *       const authUrl = scalekitClient.getAuthorizationUrl(
     *         'https://yourapp.com/auth/callback',
     *         {
     *           connectionId: claims.connection_id,
     *           organizationId: claims.organization_id,
     *           loginHint: claims.login_hint,
     *           ...(claims.relay_state && { state: claims.relay_state })
     *         }
     *       );
     *
     *       return res.redirect(authUrl);
     *     } catch (error) {
     *       console.error('IdP-initiated login failed:', error);
     *       return res.redirect('/login?error=idp_login_failed');
     *     }
     *   }
     *   // Handle normal callback flow...
     * });
     *
     * @see {@link https://docs.scalekit.com/sso/guides/idp-init-sso/ | IdP-Initiated SSO Documentation}
     * @see {@link getAuthorizationUrl} - Use the claims to construct the authorization URL
     */
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string, options?: TokenValidationOptions): Promise<IdpInitiatedLoginClaims>;
    /**
     * Validates the access token and returns a boolean result.
     *
     * @param {string} token The token to be validated.
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token: string, options?: TokenValidationOptions): Promise<boolean>;
    /**
     * Returns the logout URL that can be used to log out the user.
     * @param {LogoutUrlOptions} options Logout URL options
     * @param {string} options.idTokenHint The ID Token previously issued to the client
     * @param {string} options.postLogoutRedirectUri URL to redirect after logout
     * @param {string} options.state Opaque value to maintain state between request and callback
     * @returns {string} The logout URL
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const logoutUrl = scalekit.getLogoutUrl({
     *   postLogoutRedirectUri: 'https://example.com',
     *   state: 'some-state'
     * });
     */
    getLogoutUrl(options?: LogoutUrlOptions): string;
    /**
     * Verifies the authenticity and integrity of webhook payloads from Scalekit.
     *
     * Use this method to validate webhook requests from Scalekit by verifying the HMAC signature.
     * This ensures the webhook was sent by Scalekit and hasn't been tampered with. The method
     * checks the signature and timestamp to prevent replay attacks (5-minute tolerance window).
     *
     * @param {string} secret - Your webhook signing secret from the Scalekit dashboard (format: 'whsec_...')
     * @param {Record<string, string>} headers - The HTTP headers from the webhook request
     * @param {string} payload - The raw webhook request body as a string
     *
     * @returns {boolean} Returns true if the webhook signature is valid
     *
     * @throws {WebhookVerificationError} When required headers are missing
     * @throws {WebhookVerificationError} When the secret format is invalid
     * @throws {WebhookVerificationError} When the signature doesn't match
     * @throws {WebhookVerificationError} When the timestamp is too old (>5 minutes) or in the future
     *
     * @example
     * // Express.js webhook handler
     * app.post('/webhooks/scalekit', express.raw({ type: 'application/json' }), (req, res) => {
     *   const secret = process.env.SCALEKIT_WEBHOOK_SECRET;
     *   const headers = req.headers;
     *   const payload = req.body.toString();
     *
     *   try {
     *     const isValid = scalekitClient.verifyWebhookPayload(secret, headers, payload);
     *
     *     if (isValid) {
     *       const event = JSON.parse(payload);
     *
     *       // Process the webhook event
     *       switch (event.type) {
     *         case 'user.created':
     *           console.log('New user created:', event.data);
     *           break;
     *         case 'connection.enabled':
     *           console.log('Connection enabled:', event.data);
     *           break;
     *       }
     *
     *       res.status(200).send('Webhook received');
     *     }
     *   } catch (error) {
     *     console.error('Webhook verification failed:', error);
     *     res.status(400).send('Invalid webhook signature');
     *   }
     * });
     *
     * @see {@link https://docs.scalekit.com/reference/webhooks/overview/ | Webhook Documentation}
     * @see {@link verifyInterceptorPayload} - Similar method for interceptor payloads
     */
    verifyWebhookPayload(secret: string, headers: Record<string, string>, payload: string): boolean;
    /**
     * Verifies the authenticity and integrity of interceptor payloads from Scalekit.
     *
     * Use this method to validate HTTP interceptor requests from Scalekit by verifying the HMAC signature.
     * This ensures the interceptor payload was sent by Scalekit and hasn't been tampered with. The method
     * checks the signature and timestamp to prevent replay attacks (5-minute tolerance window)
     *
     * @param {string} secret Your interceptor signing secret that you can copy from Scalekit Dashboard
     * @param {Record<string, string>} headers The HTTP headers from the interceptor request
     * @param {string} payload The raw interceptor request body as a string
     * @return {boolean} Returns true if the interceptor payload is valid.
     */
    verifyInterceptorPayload(secret: string, headers: Record<string, string>, payload: string): boolean;
    /**
     * Common payload signature verification logic
     *
     * @param {string} secret The secret
     * @param {string} id The webhook/interceptor id
     * @param {string} timestamp The timestamp
     * @param {string} signature The signature
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload signature is valid.
     */
    private verifyPayloadSignature;
    /**
     * Validates a token and returns the claims as json payload if valid.
     * Supports issuer, audience, and scope validation.
     *
     * @param {string} token The token to be validated
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<T>} Returns the token payload if valid
     * @throws {ScalekitValidateTokenFailureException} If token is invalid or missing required scopes
     */
    validateToken<T>(token: string, options?: TokenValidationOptions): Promise<T>;
    /**
     * Verify that the token contains the required scopes
     *
     * @param {string} token The token to verify
     * @param {string[]} requiredScopes The scopes that must be present in the token
     * @return {boolean} Returns true if all required scopes are present
     * @throws {ScalekitValidateTokenFailureException} If required scopes are missing, with details about which scopes are missing
     */
    verifyScopes(token: string, requiredScopes: string[]): boolean;
    /**
     * Extract scopes from token payload
     *
     * @param {any} payload The token payload
     * @return {string[]} Array of scopes found in the token
     */
    private extractScopesFromPayload;
    /**
     * Verify the timestamp
     *
     * @param {string} timestampStr The timestamp string
     * @return {Date} Returns the timestamp
     */
    private verifyTimestamp;
    /**
     * Compute the signature
     *
     * @param {Buffer} secretBytes The secret bytes
     * @param {string} data The data to be signed
     * @return {string} Returns the signature
     */
    private computeSignature;
    /**
     * Obtains a new access token using a refresh token.
     *
     * Use this method to get a new access token when the current one expires, without requiring
     * the user to re-authenticate. This implements the OAuth 2.0 refresh token grant type.
     * The method returns both a new access token and a new refresh token (token rotation).
     *
     * @param {string} refreshToken - The refresh token obtained from a previous authentication
     *
     * @returns {Promise<RefreshTokenResponse>} Response containing:
     *   - accessToken: New access token for API authorization
     *   - refreshToken: New refresh token (the old one is invalidated)
     *
     * @throws {Error} When the refresh token is missing
     * @throws {Error} When the refresh token is invalid, expired, or revoked
     * @throws {Error} When the authentication server response is invalid
     *
     * @example
     * // Refresh tokens before they expire
     * async function refreshUserToken(userId) {
     *   try {
     *     const oldRefreshToken = await getStoredRefreshToken(userId);
     *
     *     const result = await scalekitClient.refreshAccessToken(oldRefreshToken);
     *
     *     // Store the new tokens (old refresh token is now invalid)
     *     await storeTokens(userId, {
     *       accessToken: result.accessToken,
     *       refreshToken: result.refreshToken
     *     });
     *
     *     return result.accessToken;
     *   } catch (error) {
     *     console.error('Token refresh failed:', error);
     *     // Redirect user to login
     *     throw new Error('Please log in again');
     *   }
     * }
     *
     * @example
     * // Automatic token refresh middleware
     * app.use(async (req, res, next) => {
     *   const accessToken = req.session.accessToken;
     *   const refreshToken = req.session.refreshToken;
     *
     *   // Check if access token is expired (decode JWT and check exp claim)
     *   if (isTokenExpired(accessToken) && refreshToken) {
     *     try {
     *       const result = await scalekitClient.refreshAccessToken(refreshToken);
     *       req.session.accessToken = result.accessToken;
     *       req.session.refreshToken = result.refreshToken;
     *     } catch (error) {
     *       return res.redirect('/login');
     *     }
     *   }
     *   next();
     * });
     *
     */
    refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
}
