import { a as LogoutUrlOptions, c as TokenValidationOptions, d as Identity, f as IdpInitiatedLoginClaims, i as GrantType, l as IdTokenClaim, m as User, n as AuthenticationResponse, o as RefreshTokenResponse, p as TokenResponse, r as AuthorizationUrlOptions, s as ScalekitOptions, t as AuthenticationOptions, u as IdTokenClaimIdentity } from "./scalekit.cjs";
import { DescService, JsonObject as JsonObject$1, Message, MessageInitShape, MessageShape } from "@bufbuild/protobuf";
import { Duration, EmptySchema, ListValue, Timestamp } from "@bufbuild/protobuf/wkt";
import { CallOptions, Client, Code, ConnectError } from "@connectrpc/connect";
import { Axios, AxiosError, AxiosResponse } from "axios";
import { GenMessage } from "@bufbuild/protobuf/codegenv2";

//#region \0rolldown/runtime.js
//#endregion
//#region node_modules/jose/dist/types/types.d.ts
/** Supported JWS "alg" (Algorithm) Header Parameter values. Availability depends on the runtime. */
type JWSAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'PS256' | 'PS384' | 'PS512' | 'ES256' | 'ES384' | 'ES512' | 'EdDSA' | 'Ed25519' | 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87' | (string & {});
/** Supported JWE "alg" (Algorithm) Header Parameter values. Availability depends on the runtime. */
type JWEKeyManagementAlgorithm = 'dir' | 'A128KW' | 'A192KW' | 'A256KW' | 'A128GCMKW' | 'A192GCMKW' | 'A256GCMKW' | 'ECDH-ES' | 'ECDH-ES+A128KW' | 'ECDH-ES+A192KW' | 'ECDH-ES+A256KW' | 'RSA-OAEP' | 'RSA-OAEP-256' | 'RSA-OAEP-384' | 'RSA-OAEP-512' | 'PBES2-HS256+A128KW' | 'PBES2-HS384+A192KW' | 'PBES2-HS512+A256KW' | (string & {});
/**
 * Supported JWE "enc" (Encryption Algorithm) Header Parameter values. Availability depends on the
 * runtime.
 */
type JWEContentEncryptionAlgorithm = 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' | 'A128GCM' | 'A192GCM' | 'A256GCM' | (string & {});
/** JWK "kty" (Key Type) Parameter values supported by this module. */
type JWKKeyType = 'EC' | 'RSA' | 'OKP' | 'AKP' | 'oct' | (string & {});
/**
 * JSON Web Key ({@link https://www.rfc-editor.org/info/rfc7517/ JWK}). "RSA", "EC", "OKP", "AKP",
 * and "oct" key types are supported.
 *
 * > Note: This is declared as a type alias rather than an interface so that it satisfies the implicit index
 * > signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`. It spells out the
 * > {@link JWKParameters} members rather than intersecting them so that every JWK member is documented
 * > in one place.
 */
type JWK = {
  /** JWK "kty" (Key Type) Parameter */kty?: JWKKeyType; /** JWK "alg" (Algorithm) Parameter */
  alg?: JWSAlgorithm | JWEKeyManagementAlgorithm | JWEContentEncryptionAlgorithm; /** JWK "key_ops" (Key Operations) Parameter (RFC 7517, Section 4.3). */
  key_ops?: string[]; /** Web Crypto "ext" (Extractable) member; whether the key may be exported. */
  ext?: boolean; /** JWK "use" (Public Key Use) Parameter */
  use?: 'sig' | 'enc' | (string & {});
  /**
   * "x5c" (X.509 Certificate Chain): base64-encoded DER certificates (RFC 7517, Section 4.7; RFC
   * 7515, Section 4.1.6).
   */
  x5c?: string[]; /** "x5t" (X.509 Certificate SHA-1 Thumbprint): base64url-encoded digest of the DER certificate. */
  x5t?: string;
  /**
   * "x5t#S256" (X.509 Certificate SHA-256 Thumbprint): base64url-encoded digest of the DER
   * certificate.
   */
  'x5t#S256'?: string; /** JWK "x5u" (X.509 URL) Parameter: URL of a PEM-encoded certificate or certificate chain. */
  x5u?: string; /** JWK "kid" (Key ID) Parameter */
  kid?: string; /** JWK "crv" Parameter: Curve for EC keys or Subtype of Key Pair for OKP keys. */
  crv?: string;
  /**
   * Private key material: Base64urlUInt for RSA (RFC 7518, Section 6.3.2.1), base64url-encoded
   * octets for EC (Section 6.2.2.1) or OKP (RFC 8037, Section 2).
   */
  d?: string; /** RSA first factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  dp?: string; /** RSA second factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  dq?: string; /** RSA public exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  e?: string; /** JWK "k" (Key Value): base64url-encoded key octets (RFC 7518, Section 6.4.1). */
  k?: string; /** RSA modulus, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  n?: string; /** RSA first prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  p?: string; /** RSA second prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  q?: string; /** RSA first CRT coefficient, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
  qi?: string;
  /**
   * Base64url-encoded EC x-coordinate (RFC 7518, Section 6.2.1.2) or OKP public key (RFC 8037,
   * Section 2).
   */
  x?: string; /** Base64url-encoded EC y-coordinate (RFC 7518, Section 6.2.1.3). */
  y?: string; /** AKP JWK "pub" (Public Key): base64url-encoded public key (RFC 9964, Section 3) */
  pub?: string;
  /**
   * AKP JWK "priv" (Private Key): base64url-encoded private key; ML-DSA uses a 32-octet seed (RFC
   * 9964, Sections 3-4)
   */
  priv?: string; /** Additional RSA prime factors. */
  oth?: Array<{
    /** Factor CRT exponent, encoded as Base64urlUInt (RFC 7518, Section 6.3). */d?: string; /** Prime factor, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
    r?: string; /** Factor CRT coefficient, encoded as Base64urlUInt (RFC 7518, Section 6.3). */
    t?: string;
  }>;
};
//#endregion
//#region src/core.d.ts
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}
declare class CoreClient {
  readonly envUrl: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly toolTimeoutMs: number;
  readonly timeoutMs: number;
  readonly pingIntervalMs: number;
  readonly pingTimeoutMs: number;
  keys: JWK[];
  accessToken: string | null;
  private pendingAuthentication;
  axios: Axios;
  sdkVersion: string;
  apiVersion: string;
  userAgent: string;
  constructor(envUrl: string, clientId: string, clientSecret: string, toolTimeoutMs?: number, timeoutMs?: number, pingIntervalMs?: number, pingTimeoutMs?: number);
  /**
   * Fetch a client-credentials token if this client doesn't have one yet.
   *
   * gRPC calls get a token lazily: `connectExec` authenticates when a call
   * returns 401 and retries it. HTTP calls that must not be retried on 401,
   * such as the actions proxy (a 401 there can come from the third-party API,
   * and retrying would replay the request), call this first instead.
   * Concurrent callers share one token request.
   */
  ensureAccessToken(): Promise<void>;
  private authenticateClient;
  /**
   * Authenticate with the code
   * @param {string} data Data to authenticate
   * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
   */
  authenticate(data: string): Promise<AxiosResponse<TokenResponse, any>>;
  /**
   * Replace an access token the server rejected.
   *
   * Pass the token the rejected request was sent with. If another caller has
   * already replaced it, this returns without a token request; otherwise
   * concurrent callers share one token request (the same one
   * `ensureAccessToken` uses). Callers resend only when `accessToken` has
   * changed afterwards.
   *
   * @internal
   */
  refreshAccessToken(rejectedToken: string | null): Promise<void>;
  /**
   * Get the JWKS from the server and store it in the client instance
   * @returns {Promise<void>} Returns nothing
   */
  getJwks(): Promise<void>;
  private sleep;
  /**
   * Execute a function with error handling and retry logic.
   *
   * @param fn Function to execute
   * @param data Data to pass to the function
   * @param options Optional per-call gRPC options (e.g. `timeoutMs`), forwarded to `fn` as-is.
   *                Omit to use the transport's default deadline.
   * @returns {Promise<TResponse>} Returns the response
   */
  connectExec<TRequest, TResponse>(fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>, data: TRequest, options?: CallOptions): Promise<TResponse>;
  private _connectExec;
}
//#endregion
//#region src/connect.d.ts
declare class GrpcConnect {
  private readonly coreClient;
  private transport;
  constructor(coreClient: CoreClient, timeoutMs?: number);
  createClient<T extends DescService>(service: T): Client<T>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/domains/domains_pb.d.ts
/**
 * @generated from message scalekit.v1.domains.CreateDomainResponse
 */
type CreateDomainResponse = Message<"scalekit.v1.domains.CreateDomainResponse"> & {
  /**
   * @generated from field: scalekit.v1.domains.Domain domain = 1;
   */
  domain?: Domain | undefined;
};
/**
 * @generated from message scalekit.v1.domains.GetDomainResponse
 */
type GetDomainResponse = Message<"scalekit.v1.domains.GetDomainResponse"> & {
  /**
   * @generated from field: scalekit.v1.domains.Domain domain = 1;
   */
  domain?: Domain | undefined;
};
/**
 * @generated from message scalekit.v1.domains.ListDomainResponse
 */
type ListDomainResponse = Message<"scalekit.v1.domains.ListDomainResponse"> & {
  /**
   * @generated from field: int32 page_size = 1;
   */
  pageSize: number;
  /**
   * @generated from field: int32 page_number = 2;
   */
  pageNumber: number;
  /**
   * @generated from field: repeated scalekit.v1.domains.Domain domains = 3;
   */
  domains: Domain[];
};
/**
 * @generated from message scalekit.v1.domains.Domain
 */
type Domain = Message<"scalekit.v1.domains.Domain"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string domain = 2;
   */
  domain: string;
  /**
   * @generated from field: string environment_id = 3;
   */
  environmentId: string;
  /**
   * @generated from field: string organization_id = 4;
   */
  organizationId: string;
  /**
   * @generated from field: string txt_record_key = 6;
   */
  txtRecordKey: string;
  /**
   * @generated from field: string txt_record_secret = 7;
   */
  txtRecordSecret: string;
  /**
   * @generated from field: scalekit.v1.domains.VerificationStatus verification_status = 8;
   */
  verificationStatus: VerificationStatus;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 9;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 10;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: scalekit.v1.domains.DomainType domain_type = 12;
   */
  domainType: DomainType;
  /**
   * @generated from field: scalekit.v1.domains.VerificationMethod verification_method = 13;
   */
  verificationMethod: VerificationMethod;
};
/**
 * @generated from enum scalekit.v1.domains.VerificationMethod
 */
declare enum VerificationMethod {
  /**
   * @generated from enum value: VERIFICATION_METHOD_UNSPECIFIED = 0;
   */
  VERIFICATION_METHOD_UNSPECIFIED = 0,
  /**
   * @generated from enum value: ADMIN = 1;
   */
  ADMIN = 1,
  /**
   * @generated from enum value: DNS = 2;
   */
  DNS = 2,
  /**
   * @generated from enum value: NOT_APPLICABLE = 3;
   */
  NOT_APPLICABLE = 3
}
/**
 * @generated from enum scalekit.v1.domains.VerificationStatus
 */
declare enum VerificationStatus {
  /**
   * @generated from enum value: VERIFICATION_STATUS_UNSPECIFIED = 0;
   */
  VERIFICATION_STATUS_UNSPECIFIED = 0,
  /**
   * @generated from enum value: PENDING = 1;
   */
  PENDING = 1,
  /**
   * @generated from enum value: VERIFIED = 2;
   */
  VERIFIED = 2,
  /**
   * @generated from enum value: FAILED = 3;
   */
  FAILED = 3,
  /**
   * @generated from enum value: AUTO_VERIFIED = 4;
   */
  AUTO_VERIFIED = 4
}
/**
 * @generated from enum scalekit.v1.domains.DomainType
 */
declare enum DomainType {
  /**
   * @generated from enum value: DOMAIN_TYPE_UNSPECIFIED = 0;
   */
  DOMAIN_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: ALLOWED_EMAIL_DOMAIN = 1;
   */
  ALLOWED_EMAIL_DOMAIN = 1,
  /**
   * @generated from enum value: ORGANIZATION_DOMAIN = 2;
   */
  ORGANIZATION_DOMAIN = 2
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/connections/connections_pb.d.ts
/**
 * @generated from message scalekit.v1.connections.CreateConnection
 */
type CreateConnection = Message<"scalekit.v1.connections.CreateConnection"> & {
  /**
   * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 1;
   */
  provider: ConnectionProvider;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionType type = 2;
   */
  type: ConnectionType;
  /**
   * @generated from field: string provider_key = 3;
   */
  providerKey: string;
  /**
   * @generated from field: optional string key_id = 4;
   */
  keyId?: string | undefined;
  /**
   * @generated from field: google.protobuf.Struct context = 5;
   */
  context?: JsonObject$1 | undefined;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionAuthMode auth_mode = 6;
   */
  authMode: ConnectionAuthMode;
};
/**
 * Describes the message scalekit.v1.connections.CreateConnection.
 * Use `create(CreateConnectionSchema)` to create a new message.
 */
declare const CreateConnectionSchema: GenMessage<CreateConnection>;
/**
 * @generated from message scalekit.v1.connections.Connection
 */
type Connection = Message<"scalekit.v1.connections.Connection"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
   */
  provider: ConnectionProvider;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
   */
  type: ConnectionType;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionStatus status = 4;
   */
  status: ConnectionStatus;
  /**
   * @generated from field: bool enabled = 5;
   */
  enabled: boolean;
  /**
   * @generated from field: bool debug_enabled = 6;
   */
  debugEnabled: boolean;
  /**
   * @generated from field: optional string organization_id = 7;
   */
  organizationId?: string | undefined;
  /**
   * @generated from field: string ui_button_title = 8;
   */
  uiButtonTitle: string;
  /**
   * @generated from field: scalekit.v1.connections.ConfigurationType configuration_type = 9;
   */
  configurationType: ConfigurationType;
  /**
   * @generated from field: string test_connection_uri = 12;
   */
  testConnectionUri: string;
  /**
   * @generated from field: map<string, string> attribute_mapping = 15;
   */
  attributeMapping: {
    [key: string]: string;
  };
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 16;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 17;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from oneof scalekit.v1.connections.Connection.settings
   */
  settings: {
    /**
     * @generated from field: scalekit.v1.connections.OIDCConnectionConfig oidc_config = 18;
     */
    value: OIDCConnectionConfig;
    case: "oidcConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.SAMLConnectionConfigResponse saml_config = 19;
     */
    value: SAMLConnectionConfigResponse;
    case: "samlConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.OAuthConnectionConfig oauth_config = 20;
     */
    value: OAuthConnectionConfig;
    case: "oauthConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.PasswordLessConfig passwordless_config = 22;
     */
    value: PasswordLessConfig;
    case: "passwordlessConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.StaticAuthConfig static_config = 26;
     */
    value: StaticAuthConfig;
    case: "staticConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration webauthn_config = 27;
     */
    value: WebAuthConfiguration;
    case: "webauthnConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.GoogleDWDConfig google_dwd_config = 28;
     */
    value: GoogleDWDConfig;
    case: "googleDwdConfig";
  } | {
    case: undefined;
    value?: undefined;
  };
  /**
   * @generated from field: optional string key_id = 25;
   */
  keyId?: string | undefined;
  /**
   * @generated from field: string provider_key = 23;
   */
  providerKey: string;
  /**
   * @generated from field: repeated scalekit.v1.domains.Domain domains = 24;
   */
  domains: Domain[];
  /**
   * @generated from field: optional string mcp_server_url = 29;
   */
  mcpServerUrl?: string | undefined;
  /**
   * @generated from field: optional string resolved_proxy_url = 30;
   */
  resolvedProxyUrl?: string | undefined;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionAuthMode auth_mode = 31;
   */
  authMode: ConnectionAuthMode;
};
/**
 * @generated from message scalekit.v1.connections.CreateConnectionResponse
 */
type CreateConnectionResponse = Message<"scalekit.v1.connections.CreateConnectionResponse"> & {
  /**
   * @generated from field: scalekit.v1.connections.Connection connection = 1;
   */
  connection?: Connection | undefined;
};
/**
 * @generated from message scalekit.v1.connections.UpdateConnection
 */
type UpdateConnection = Message<"scalekit.v1.connections.UpdateConnection"> & {
  /**
   * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
   */
  provider: ConnectionProvider;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
   */
  type: ConnectionType;
  /**
   * @generated from field: google.protobuf.BoolValue debug_enabled = 6;
   */
  debugEnabled?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue ui_button_title = 8;
   */
  uiButtonTitle?: string | undefined;
  /**
   * @generated from field: scalekit.v1.connections.ConfigurationType configuration_type = 11;
   */
  configurationType: ConfigurationType;
  /**
   * @generated from field: map<string, string> attribute_mapping = 15;
   */
  attributeMapping: {
    [key: string]: string;
  };
  /**
   * @generated from oneof scalekit.v1.connections.UpdateConnection.settings
   */
  settings: {
    /**
     * @generated from field: scalekit.v1.connections.OIDCConnectionConfig oidc_config = 16;
     */
    value: OIDCConnectionConfig;
    case: "oidcConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.SAMLConnectionConfigRequest saml_config = 17;
     */
    value: SAMLConnectionConfigRequest;
    case: "samlConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.OAuthConnectionConfig oauth_config = 18;
     */
    value: OAuthConnectionConfig;
    case: "oauthConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.PasswordLessConfig passwordless_config = 20;
     */
    value: PasswordLessConfig;
    case: "passwordlessConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.StaticAuthConfig static_config = 23;
     */
    value: StaticAuthConfig;
    case: "staticConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration webauthn_config = 24;
     */
    value: WebAuthConfiguration;
    case: "webauthnConfig";
  } | {
    /**
     * @generated from field: scalekit.v1.connections.GoogleDWDConfig google_dwd_config = 25;
     */
    value: GoogleDWDConfig;
    case: "googleDwdConfig";
  } | {
    case: undefined;
    value?: undefined;
  };
  /**
   * @generated from field: optional string key_id = 22;
   */
  keyId?: string | undefined;
  /**
   * @generated from field: string provider_key = 21;
   */
  providerKey: string;
};
/**
 * Describes the message scalekit.v1.connections.UpdateConnection.
 * Use `create(UpdateConnectionSchema)` to create a new message.
 */
declare const UpdateConnectionSchema: GenMessage<UpdateConnection>;
/**
 * @generated from message scalekit.v1.connections.UpdateConnectionResponse
 */
type UpdateConnectionResponse = Message<"scalekit.v1.connections.UpdateConnectionResponse"> & {
  /**
   * @generated from field: scalekit.v1.connections.Connection connection = 1;
   */
  connection?: Connection | undefined;
};
/**
 * @generated from message scalekit.v1.connections.GetConnectionResponse
 */
type GetConnectionResponse = Message<"scalekit.v1.connections.GetConnectionResponse"> & {
  /**
   * @generated from field: scalekit.v1.connections.Connection connection = 1;
   */
  connection?: Connection | undefined;
};
/**
 * @generated from message scalekit.v1.connections.ListConnectionsResponse
 */
type ListConnectionsResponse = Message<"scalekit.v1.connections.ListConnectionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 1;
   */
  connections: ListConnection[];
};
/**
 * @generated from message scalekit.v1.connections.ListConnection
 */
type ListConnection = Message<"scalekit.v1.connections.ListConnection"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
   */
  provider: ConnectionProvider;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
   */
  type: ConnectionType;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionStatus status = 4;
   */
  status: ConnectionStatus;
  /**
   * @generated from field: bool enabled = 5;
   */
  enabled: boolean;
  /**
   * @generated from field: string organization_id = 6;
   */
  organizationId: string;
  /**
   * @generated from field: string ui_button_title = 7;
   */
  uiButtonTitle: string;
  /**
   * @generated from field: repeated string domains = 8;
   */
  domains: string[];
  /**
   * @generated from field: string organization_name = 9;
   */
  organizationName: string;
  /**
   * @generated from field: string provider_key = 10;
   */
  providerKey: string;
  /**
   * @generated from field: string key_id = 11;
   */
  keyId: string;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 12;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: string mcp_server_url = 13;
   */
  mcpServerUrl: string;
  /**
   * @generated from field: scalekit.v1.connections.ConnectionAuthMode auth_mode = 14;
   */
  authMode: ConnectionAuthMode;
};
/**
 * @generated from message scalekit.v1.connections.ToggleConnectionResponse
 */
type ToggleConnectionResponse = Message<"scalekit.v1.connections.ToggleConnectionResponse"> & {
  /**
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   * @generated from field: optional string error_message = 2;
   */
  errorMessage?: string | undefined;
};
/**
 * @generated from message scalekit.v1.connections.OIDCConnectionConfig
 */
type OIDCConnectionConfig = Message<"scalekit.v1.connections.OIDCConnectionConfig"> & {
  /**
   * @generated from field: google.protobuf.StringValue issuer = 1;
   */
  issuer?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue discovery_endpoint = 2;
   */
  discoveryEndpoint?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue authorize_uri = 3;
   */
  authorizeUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue token_uri = 4;
   */
  tokenUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue user_info_uri = 5;
   */
  userInfoUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue jwks_uri = 6;
   */
  jwksUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue client_id = 8;
   */
  clientId?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue client_secret = 9;
   */
  clientSecret?: string | undefined;
  /**
   * @generated from field: repeated scalekit.v1.connections.OIDCScope scopes = 10;
   */
  scopes: OIDCScope[];
  /**
   * @generated from field: scalekit.v1.connections.TokenAuthType token_auth_type = 11;
   */
  tokenAuthType: TokenAuthType;
  /**
   * @generated from field: string redirect_uri = 12;
   */
  redirectUri: string;
  /**
   * @generated from field: google.protobuf.BoolValue pkce_enabled = 13;
   */
  pkceEnabled?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue idp_logout_required = 14;
   */
  idpLogoutRequired?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue post_logout_redirect_uri = 15;
   */
  postLogoutRedirectUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue backchannel_logout_redirect_uri = 16;
   */
  backchannelLogoutRedirectUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 17;
   */
  syncUserProfileOnLogin?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 18;
   */
  jitProvisioningWithSsoEnabled?: boolean | undefined;
};
/**
 * @generated from message scalekit.v1.connections.OAuthConnectionConfig
 */
type OAuthConnectionConfig = Message<"scalekit.v1.connections.OAuthConnectionConfig"> & {
  /**
   * @generated from field: google.protobuf.StringValue authorize_uri = 3;
   */
  authorizeUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue token_uri = 4;
   */
  tokenUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue user_info_uri = 5;
   */
  userInfoUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue client_id = 8;
   */
  clientId?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue client_secret = 9;
   */
  clientSecret?: string | undefined;
  /**
   * @generated from field: repeated string scopes = 10;
   */
  scopes: string[];
  /**
   * @generated from field: string redirect_uri = 12;
   */
  redirectUri: string;
  /**
   * @generated from field: google.protobuf.BoolValue pkce_enabled = 13;
   */
  pkceEnabled?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue prompt = 14;
   */
  prompt?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue use_platform_creds = 15;
   */
  usePlatformCreds?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue access_type = 16;
   */
  accessType?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue custom_scope_name = 17;
   */
  customScopeName?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 18;
   */
  syncUserProfileOnLogin?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue token_access_type = 19;
   */
  tokenAccessType?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue tenant_id = 20;
   */
  tenantId?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue is_cimd = 21;
   */
  isCimd?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue app_name = 22;
   */
  appName?: string | undefined;
  /**
   * @generated from field: optional scalekit.v1.connections.OptionalScopes optional_scopes = 23;
   */
  optionalScopes?: OptionalScopes | undefined;
  /**
   * @generated from field: optional scalekit.v1.connections.OauthExtensions extensions = 24;
   */
  extensions?: OauthExtensions | undefined;
  /**
   * @generated from field: google.protobuf.StringValue token_endpoint_auth_method = 25;
   */
  tokenEndpointAuthMethod?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue googleads_developer_token = 26;
   */
  googleadsDeveloperToken?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue scope_selection_allowed = 27;
   */
  scopeSelectionAllowed?: boolean | undefined;
  /**
   * @generated from field: repeated string required_scopes = 28;
   */
  requiredScopes: string[];
  /**
   * @generated from field: repeated string required_optional_scopes = 29;
   */
  requiredOptionalScopes: string[];
};
/**
 * OauthExtensions groups OAuth extension-profile configuration for a connection.
 * Significant profiles (e.g. SMART on FHIR) get a typed sub-message; the long tail
 * of one-off authorize parameters uses extra_authorize_params.
 *
 * @generated from message scalekit.v1.connections.OauthExtensions
 */
type OauthExtensions = Message<"scalekit.v1.connections.OauthExtensions"> & {
  /**
   * @generated from field: optional scalekit.v1.connections.SmartConfig smart = 1;
   */
  smart?: SmartConfig | undefined;
  /**
   * Additional provider-specific query parameters appended verbatim to the
   * authorization request. Reserved OAuth/OIDC parameters and parameters owned
   * by typed configuration are rejected. Use this only for parameters that do
   * not have a dedicated field.
   *
   * @generated from field: map<string, string> extra_authorize_params = 2;
   */
  extraAuthorizeParams: {
    [key: string]: string;
  };
};
/**
 * SmartConfig holds SMART on FHIR (SMART App Launch) parameters.
 *
 * @generated from message scalekit.v1.connections.SmartConfig
 */
type SmartConfig = Message<"scalekit.v1.connections.SmartConfig"> & {
  /**
   * @generated from field: string aud = 1;
   */
  aud: string;
  /**
   * @generated from field: string domain = 2;
   */
  domain: string;
};
/**
 * @generated from message scalekit.v1.connections.OptionalScopes
 */
type OptionalScopes = Message<"scalekit.v1.connections.OptionalScopes"> & {
  /**
   * @generated from field: repeated string scopes = 1;
   */
  scopes: string[];
  /**
   * @generated from field: string field_name = 2;
   */
  fieldName: string;
};
/**
 * @generated from message scalekit.v1.connections.GoogleDWDConfig
 */
type GoogleDWDConfig = Message<"scalekit.v1.connections.GoogleDWDConfig"> & {
  /**
   * @generated from field: google.protobuf.StringValue service_account_json = 1;
   */
  serviceAccountJson?: string | undefined;
  /**
   * @generated from field: repeated string scopes = 2;
   */
  scopes: string[];
  /**
   * @generated from field: google.protobuf.StringValue token_uri = 3;
   */
  tokenUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue scope_selection_allowed = 4;
   */
  scopeSelectionAllowed?: boolean | undefined;
  /**
   * @generated from field: repeated string required_scopes = 5;
   */
  requiredScopes: string[];
};
/**
 * @generated from message scalekit.v1.connections.PasswordLessConfig
 */
type PasswordLessConfig = Message<"scalekit.v1.connections.PasswordLessConfig"> & {
  /**
   * @generated from field: scalekit.v1.connections.PasswordlessType type = 1;
   */
  type: PasswordlessType$1;
  /**
   * @generated from field: optional google.protobuf.UInt32Value frequency = 2;
   */
  frequency?: number | undefined;
  /**
   * @generated from field: optional google.protobuf.UInt32Value validity = 3;
   */
  validity?: number | undefined;
  /**
   * @generated from field: optional google.protobuf.BoolValue enforce_same_browser_origin = 4;
   */
  enforceSameBrowserOrigin?: boolean | undefined;
  /**
   * @generated from field: optional google.protobuf.UInt32Value code_challenge_length = 5;
   */
  codeChallengeLength?: number | undefined;
  /**
   * @generated from field: optional scalekit.v1.connections.CodeChallengeType code_challenge_type = 6;
   */
  codeChallengeType?: CodeChallengeType | undefined;
  /**
   * @generated from field: optional google.protobuf.BoolValue regenerate_passwordless_credentials_on_resend = 7;
   */
  regeneratePasswordlessCredentialsOnResend?: boolean | undefined;
};
/**
 * @generated from message scalekit.v1.connections.StaticAuthConfig
 */
type StaticAuthConfig = Message<"scalekit.v1.connections.StaticAuthConfig"> & {
  /**
   * @generated from field: google.protobuf.Struct static_config = 1;
   */
  staticConfig?: JsonObject$1 | undefined;
};
/**
 * WebAuthConfiguration defines WebAuthn (passkeys) configuration limited to RP and Attestation
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration
 */
type WebAuthConfiguration = Message<"scalekit.v1.connections.WebAuthConfiguration"> & {
  /**
   * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Rp rp = 1;
   */
  rp?: WebAuthConfiguration_Rp | undefined;
  /**
   * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Attestation attestation = 2;
   */
  attestation?: WebAuthConfiguration_Attestation | undefined;
  /**
   * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Authenticators authenticators = 3;
   */
  authenticators?: WebAuthConfiguration_Authenticators | undefined;
  /**
   * @generated from field: scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection authenticator_selection = 4;
   */
  authenticatorSelection?: WebAuthConfiguration_AuthenticatorSelection | undefined;
  /**
   * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Timeout timeout = 5;
   */
  timeout?: WebAuthConfiguration_Timeout | undefined;
  /**
   * @generated from field: bool enable_auto_registration = 6;
   */
  enableAutoRegistration: boolean;
  /**
   * @generated from field: bool show_passkey_button = 7;
   */
  showPasskeyButton: boolean;
  /**
   * @generated from field: bool enable_conditional_login = 8;
   */
  enableConditionalLogin: boolean;
};
/**
 * Rp contains relying party identifiers and origins
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Rp
 */
type WebAuthConfiguration_Rp = Message<"scalekit.v1.connections.WebAuthConfiguration.Rp"> & {
  /**
   * Relying party IDs (derived from environment domain and verified custom domain)
   * At least one required; must be hostnames without scheme or path
   *
   * @generated from field: repeated string ids = 1;
   */
  ids: string[];
  /**
   * Allowed origins corresponding to the RP IDs (https://<domain>)
   * At least one required; must be HTTPS origins
   *
   * @generated from field: repeated string origins = 2;
   */
  origins: string[];
};
/**
 * Attestation preferences for registration
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Attestation
 */
type WebAuthConfiguration_Attestation = Message<"scalekit.v1.connections.WebAuthConfiguration.Attestation"> & {
  /**
   * Conveyance preference
   *
   * @generated from field: google.protobuf.StringValue conveyance_preference = 1;
   */
  conveyancePreference?: string | undefined;
  /**
   * Enterprise-approved IDs (optional allowlist when enterprise attestation is used)
   *
   * @generated from field: repeated string enterprise_approved_ids = 2;
   */
  enterpriseApprovedIds: string[];
};
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Authenticators
 */
type WebAuthConfiguration_Authenticators = Message<"scalekit.v1.connections.WebAuthConfiguration.Authenticators"> & {
  /**
   * @generated from field: google.protobuf.BoolValue validate_entry = 1;
   */
  validateEntry?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue validate_entry_permit_zero_aaguid = 2;
   */
  validateEntryPermitZeroAaguid?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue validate_anchors = 3;
   */
  validateAnchors?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue validate_status = 4;
   */
  validateStatus?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue validate_attestation_type = 5;
   */
  validateAttestationType?: boolean | undefined;
  /**
   * @generated from field: repeated string desired_authenticator_status = 6;
   */
  desiredAuthenticatorStatus: string[];
  /**
   * @generated from field: repeated string undesired_authenticator_status = 7;
   */
  undesiredAuthenticatorStatus: string[];
};
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection
 */
type WebAuthConfiguration_AuthenticatorSelection = Message<"scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection"> & {
  /**
   * User verification requirement
   *
   * @generated from field: google.protobuf.StringValue user_verification = 1;
   */
  userVerification?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue authenticator_attachment = 2;
   */
  authenticatorAttachment?: string | undefined;
};
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Timeout
 */
type WebAuthConfiguration_Timeout = Message<"scalekit.v1.connections.WebAuthConfiguration.Timeout"> & {
  /**
   * @generated from field: google.protobuf.Duration registration = 1;
   */
  registration?: Duration | undefined;
  /**
   * @generated from field: google.protobuf.Duration registration_uvd = 2;
   */
  registrationUvd?: Duration | undefined;
  /**
   * @generated from field: google.protobuf.Duration login = 3;
   */
  login?: Duration | undefined;
  /**
   * @generated from field: google.protobuf.Duration login_uvd = 4;
   */
  loginUvd?: Duration | undefined;
};
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigRequest
 */
type SAMLConnectionConfigRequest = Message<"scalekit.v1.connections.SAMLConnectionConfigRequest"> & {
  /**
   * @generated from field: google.protobuf.StringValue idp_metadata_url = 1;
   */
  idpMetadataUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_entity_id = 2;
   */
  idpEntityId?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_sso_url = 3;
   */
  idpSsoUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_certificate = 4;
   */
  idpCertificate?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_slo_url = 5;
   */
  idpSloUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue ui_button_title = 6;
   */
  uiButtonTitle?: string | undefined;
  /**
   * @generated from field: scalekit.v1.connections.NameIdFormat idp_name_id_format = 7;
   */
  idpNameIdFormat: NameIdFormat;
  /**
   * @generated from field: scalekit.v1.connections.RequestBinding idp_sso_request_binding = 8;
   */
  idpSsoRequestBinding: RequestBinding;
  /**
   * @generated from field: scalekit.v1.connections.RequestBinding idp_slo_request_binding = 9;
   */
  idpSloRequestBinding: RequestBinding;
  /**
   * @generated from field: scalekit.v1.connections.SAMLSigningOptions saml_signing_option = 10;
   */
  samlSigningOption: SAMLSigningOptions;
  /**
   * @generated from field: google.protobuf.BoolValue force_authn = 14;
   */
  forceAuthn?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue default_redirect_uri = 15;
   */
  defaultRedirectUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue assertion_encrypted = 16;
   */
  assertionEncrypted?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue want_request_signed = 17;
   */
  wantRequestSigned?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue certificate_id = 18;
   */
  certificateId?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue idp_slo_required = 19;
   */
  idpSloRequired?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue sp_entity_id = 20;
   */
  spEntityId?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue sp_assertion_url = 21;
   */
  spAssertionUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue sp_slo_url = 22;
   */
  spSloUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 23;
   */
  syncUserProfileOnLogin?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 24;
   */
  jitProvisioningWithSsoEnabled?: boolean | undefined;
};
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigResponse
 */
type SAMLConnectionConfigResponse = Message<"scalekit.v1.connections.SAMLConnectionConfigResponse"> & {
  /**
   * @generated from field: string sp_entity_id = 1;
   */
  spEntityId: string;
  /**
   * @generated from field: string sp_assertion_url = 2;
   */
  spAssertionUrl: string;
  /**
   * @generated from field: string sp_metadata_url = 3;
   */
  spMetadataUrl: string;
  /**
   * @generated from field: google.protobuf.StringValue idp_metadata_url = 4;
   */
  idpMetadataUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_entity_id = 5;
   */
  idpEntityId?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue idp_sso_url = 6;
   */
  idpSsoUrl?: string | undefined;
  /**
   * @generated from field: repeated scalekit.v1.connections.IDPCertificate idp_certificates = 7;
   */
  idpCertificates: IDPCertificate[];
  /**
   * @generated from field: google.protobuf.StringValue idp_slo_url = 8;
   */
  idpSloUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.StringValue ui_button_title = 9;
   */
  uiButtonTitle?: string | undefined;
  /**
   * @generated from field: scalekit.v1.connections.NameIdFormat idp_name_id_format = 10;
   */
  idpNameIdFormat: NameIdFormat;
  /**
   * @generated from field: scalekit.v1.connections.RequestBinding idp_sso_request_binding = 11;
   */
  idpSsoRequestBinding: RequestBinding;
  /**
   * @generated from field: scalekit.v1.connections.RequestBinding idp_slo_request_binding = 12;
   */
  idpSloRequestBinding: RequestBinding;
  /**
   * @generated from field: scalekit.v1.connections.SAMLSigningOptions saml_signing_option = 13;
   */
  samlSigningOption: SAMLSigningOptions;
  /**
   * @generated from field: google.protobuf.BoolValue allow_idp_initiated_login = 14;
   */
  allowIdpInitiatedLogin?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue force_authn = 15;
   */
  forceAuthn?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue default_redirect_uri = 16;
   */
  defaultRedirectUri?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue assertion_encrypted = 17;
   */
  assertionEncrypted?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue want_request_signed = 18;
   */
  wantRequestSigned?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue certificate_id = 19;
   */
  certificateId?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue idp_slo_required = 20;
   */
  idpSloRequired?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.StringValue sp_slo_url = 21;
   */
  spSloUrl?: string | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 22;
   */
  syncUserProfileOnLogin?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 23;
   */
  jitProvisioningWithSsoEnabled?: boolean | undefined;
};
/**
 * @generated from message scalekit.v1.connections.IDPCertificate
 */
type IDPCertificate = Message<"scalekit.v1.connections.IDPCertificate"> & {
  /**
   * @generated from field: string certificate = 1;
   */
  certificate: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 2;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp expiry_time = 3;
   */
  expiryTime?: Timestamp | undefined;
  /**
   * @generated from field: string id = 4;
   */
  id: string;
  /**
   * @generated from field: string issuer = 5;
   */
  issuer: string;
};
/**
 * @generated from message scalekit.v1.connections.Flags
 */
type Flags = Message<"scalekit.v1.connections.Flags"> & {
  /**
   * @generated from field: bool is_login = 1;
   */
  isLogin: boolean;
  /**
   * @generated from field: bool is_app = 2;
   */
  isApp: boolean;
};
/**
 * Describes the message scalekit.v1.connections.Flags.
 * Use `create(FlagsSchema)` to create a new message.
 */
declare const FlagsSchema: GenMessage<Flags>;
/**
 * @generated from message scalekit.v1.connections.ListAppConnectionsResponse
 */
type ListAppConnectionsResponse = Message<"scalekit.v1.connections.ListAppConnectionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 1;
   */
  connections: ListConnection[];
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: uint32 total_size = 4;
   */
  totalSize: number;
};
/**
 * @generated from enum scalekit.v1.connections.CodeChallengeType
 */
declare enum CodeChallengeType {
  /**
   * @generated from enum value: CODE_CHALLENGE_TYPE_UNSPECIFIED = 0;
   */
  CODE_CHALLENGE_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: NUMERIC = 1;
   */
  NUMERIC = 1,
  /**
   * @generated from enum value: ALPHANUMERIC = 2;
   */
  ALPHANUMERIC = 2
}
/**
 * @generated from enum scalekit.v1.connections.ConfigurationType
 */
declare enum ConfigurationType {
  /**
   * @generated from enum value: CONFIGURATION_TYPE_UNSPECIFIED = 0;
   */
  CONFIGURATION_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: DISCOVERY = 1;
   */
  DISCOVERY = 1,
  /**
   * @generated from enum value: MANUAL = 2;
   */
  MANUAL = 2
}
/**
 * @generated from enum scalekit.v1.connections.NameIdFormat
 */
declare enum NameIdFormat {
  /**
   * @generated from enum value: NAME_ID_FORMAT_NIL = 0;
   */
  NAME_ID_FORMAT_NIL = 0,
  /**
   * @generated from enum value: UNSPECIFIED = 1;
   */
  UNSPECIFIED = 1,
  /**
   * @generated from enum value: EMAIL = 2;
   */
  EMAIL = 2,
  /**
   * @generated from enum value: TRANSIENT = 3;
   */
  TRANSIENT = 3,
  /**
   * @generated from enum value: PERSISTENT = 4;
   */
  PERSISTENT = 4
}
/**
 * @generated from enum scalekit.v1.connections.PasswordlessType
 */
declare enum PasswordlessType$1 {
  /**
   * @generated from enum value: PasswordlessType_UNSPECIFIED = 0;
   */
  PasswordlessType_UNSPECIFIED = 0,
  /**
   * @generated from enum value: LINK = 1;
   */
  LINK = 1,
  /**
   * @generated from enum value: OTP = 2;
   */
  OTP = 2,
  /**
   * @generated from enum value: LINK_OTP = 3;
   */
  LINK_OTP = 3
}
/**
 * enums all
 *
 * @generated from enum scalekit.v1.connections.SAMLSigningOptions
 */
declare enum SAMLSigningOptions {
  /**
   * @generated from enum value: SAML_SIGNING_OPTIONS_UNSPECIFIED = 0;
   */
  SAML_SIGNING_OPTIONS_UNSPECIFIED = 0,
  /**
   * @generated from enum value: NO_SIGNING = 1;
   */
  NO_SIGNING = 1,
  /**
   * @generated from enum value: SAML_ONLY_RESPONSE_SIGNING = 2;
   */
  SAML_ONLY_RESPONSE_SIGNING = 2,
  /**
   * @generated from enum value: SAML_ONLY_ASSERTION_SIGNING = 3;
   */
  SAML_ONLY_ASSERTION_SIGNING = 3,
  /**
   * @generated from enum value: SAML_RESPONSE_ASSERTION_SIGNING = 4;
   */
  SAML_RESPONSE_ASSERTION_SIGNING = 4,
  /**
   * @generated from enum value: SAML_RESPONSE_OR_ASSERTION_SIGNING = 5;
   */
  SAML_RESPONSE_OR_ASSERTION_SIGNING = 5
}
/**
 * @generated from enum scalekit.v1.connections.RequestBinding
 */
declare enum RequestBinding {
  /**
   * @generated from enum value: REQUEST_BINDING_UNSPECIFIED = 0;
   */
  REQUEST_BINDING_UNSPECIFIED = 0,
  /**
   * @generated from enum value: HTTP_POST = 1;
   */
  HTTP_POST = 1,
  /**
   * @generated from enum value: HTTP_REDIRECT = 2;
   */
  HTTP_REDIRECT = 2
}
/**
 * @generated from enum scalekit.v1.connections.TokenAuthType
 */
declare enum TokenAuthType {
  /**
   * @generated from enum value: TOKEN_AUTH_TYPE_UNSPECIFIED = 0;
   */
  TOKEN_AUTH_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: URL_PARAMS = 1;
   */
  URL_PARAMS = 1,
  /**
   * @generated from enum value: BASIC_AUTH = 2;
   */
  BASIC_AUTH = 2
}
/**
 * @generated from enum scalekit.v1.connections.OIDCScope
 */
declare enum OIDCScope {
  /**
   * @generated from enum value: OIDC_SCOPE_UNSPECIFIED = 0;
   */
  OIDC_SCOPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: openid = 1;
   */
  openid = 1,
  /**
   * @generated from enum value: profile = 2;
   */
  profile = 2,
  /**
   * @generated from enum value: email = 3;
   */
  email = 3,
  /**
   * @generated from enum value: address = 4;
   */
  address = 4,
  /**
   * @generated from enum value: phone = 5;
   */
  phone = 5
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionType
 */
declare enum ConnectionType {
  /**
   * @generated from enum value: INVALID = 0;
   */
  INVALID = 0,
  /**
   * @generated from enum value: OIDC = 1;
   */
  OIDC = 1,
  /**
   * @generated from enum value: SAML = 2;
   */
  SAML = 2,
  /**
   * @generated from enum value: PASSWORD = 3;
   */
  PASSWORD = 3,
  /**
   * @generated from enum value: OAUTH = 4;
   */
  OAUTH = 4,
  /**
   * @generated from enum value: PASSWORDLESS = 5;
   */
  PASSWORDLESS = 5,
  /**
   * @generated from enum value: BASIC = 6;
   */
  BASIC = 6,
  /**
   * @generated from enum value: BEARER = 7;
   */
  BEARER = 7,
  /**
   * @generated from enum value: API_KEY = 8;
   */
  API_KEY = 8,
  /**
   * @generated from enum value: WEBAUTHN = 9;
   */
  WEBAUTHN = 9,
  /**
   * @generated from enum value: OAUTH_M2M = 10;
   */
  OAUTH_M2M = 10,
  /**
   * @generated from enum value: TRELLO_OAUTH1 = 11;
   */
  TRELLO_OAUTH1 = 11,
  /**
   * @generated from enum value: GOOGLE_DWD = 12;
   */
  GOOGLE_DWD = 12,
  /**
   * @generated from enum value: TRUSTED_IDP = 13;
   */
  TRUSTED_IDP = 13,
  /**
   * @generated from enum value: SMART_FHIR = 14;
   */
  SMART_FHIR = 14,
  /**
   * @generated from enum value: NO_AUTH = 15;
   */
  NO_AUTH = 15
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionStatus
 */
declare enum ConnectionStatus {
  /**
   * @generated from enum value: CONNECTION_STATUS_UNSPECIFIED = 0;
   */
  CONNECTION_STATUS_UNSPECIFIED = 0,
  /**
   * @generated from enum value: DRAFT = 1;
   */
  DRAFT = 1,
  /**
   * @generated from enum value: IN_PROGRESS = 2;
   */
  IN_PROGRESS = 2,
  /**
   * @generated from enum value: COMPLETED = 3;
   */
  COMPLETED = 3
}
/**
 * Credential-sharing mode for an MCP Gateway app connection.
 *
 * @generated from enum scalekit.v1.connections.ConnectionAuthMode
 */
declare enum ConnectionAuthMode {
  /**
   * Default/unknown — treated as USER
   *
   * @generated from enum value: CONNECTION_AUTH_MODE_UNSPECIFIED = 0;
   */
  CONNECTION_AUTH_MODE_UNSPECIFIED = 0,
  /**
   * Each end user authorizes and holds their own credential (default)
   *
   * @generated from enum value: USER = 1;
   */
  USER = 1,
  /**
   * One admin-authorized credential is shared; each end user still grants personal consent before it can act on their behalf
   *
   * @generated from enum value: ORG_WIDE = 2;
   */
  ORG_WIDE = 2
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionProvider
 */
declare enum ConnectionProvider {
  /**
   * @generated from enum value: CONNECTION_PROVIDER_UNSPECIFIED = 0;
   */
  CONNECTION_PROVIDER_UNSPECIFIED = 0,
  /**
   * @generated from enum value: OKTA = 1;
   */
  OKTA = 1,
  /**
   * @generated from enum value: GOOGLE = 2;
   */
  GOOGLE = 2,
  /**
   * @generated from enum value: MICROSOFT_AD = 3;
   */
  MICROSOFT_AD = 3,
  /**
   * @generated from enum value: AUTH0 = 4;
   */
  AUTH0 = 4,
  /**
   * @generated from enum value: ONELOGIN = 5;
   */
  ONELOGIN = 5,
  /**
   * @generated from enum value: PING_IDENTITY = 6;
   */
  PING_IDENTITY = 6,
  /**
   * @generated from enum value: JUMPCLOUD = 7;
   */
  JUMPCLOUD = 7,
  /**
   * @generated from enum value: CUSTOM = 8;
   */
  CUSTOM = 8,
  /**
   * @generated from enum value: GITHUB = 9;
   */
  GITHUB = 9,
  /**
   * @generated from enum value: GITLAB = 10;
   */
  GITLAB = 10,
  /**
   * @generated from enum value: LINKEDIN = 11;
   */
  LINKEDIN = 11,
  /**
   * @generated from enum value: SALESFORCE = 12;
   */
  SALESFORCE = 12,
  /**
   * @generated from enum value: MICROSOFT = 13;
   */
  MICROSOFT = 13,
  /**
   * @generated from enum value: IDP_SIMULATOR = 14;
   */
  IDP_SIMULATOR = 14,
  /**
   * @generated from enum value: SCALEKIT = 15;
   */
  SCALEKIT = 15,
  /**
   * @generated from enum value: ADFS = 16;
   */
  ADFS = 16
}
//#endregion
//#region src/connection.d.ts
/**
 * Client for managing enterprise SSO connections for organizations.
 *
 * Connections represent the SSO integration between an organization and their identity provider (IdP).
 * Each organization can have an enterprise connection supporting different protocols (SAML, OIDC) and
 * providers (Okta, Azure AD, Google Workspace, etc.). Use this client to retrieve connection details,
 * list connections, and enable/disable them.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const connectionClient = scalekitClient.connection;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/connections | Connection API Documentation}
 */
declare class ConnectionClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Retrieves complete configuration and status details for a specific SSO connection.
   *
   * Use this method to fetch comprehensive information about an organization's SSO connection,
   * including provider settings, protocol details (SAML/OIDC), enabled status, and configuration
   * metadata. This is useful for verifying connection setup, auditing configurations, checking
   * connection health before authentication flows, or displaying connection details to administrators.
   *
   * @param {string} organizationId - The organization ID that owns the connection (format: "org_...")
   * @param {string} id - The connection identifier to retrieve (format: "conn_...")
   *
   * @returns {Promise<GetConnectionResponse>} Response containing:
   *   - connection: Complete connection object with:
   *     - id: Unique connection identifier
   *     - organizationId: Parent organization ID
   *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
   *     - type: Protocol type ("saml", "oidc")
   *     - enabled: Whether the connection is active
   *     - status: Configuration status
   *     - domains: Associated email domains for this connection
   *     - metadata: Provider-specific configuration details
   *     - createTime: When the connection was created
   *     - updateTime: When the connection was last modified
   *
   * @throws {Error} If the organization or connection is not found
   *
   * @example
   * // Get connection details
   * const response = await scalekitClient.connection.getConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * const conn = response.connection;
   * console.log('Provider:', conn.provider);
   * console.log('Type:', conn.type);
   * console.log('Status:', conn.enabled ? 'Enabled' : 'Disabled');
   * console.log('Domains:', conn.domains);
   *
   * @example
   * // Verify connection is ready for authentication
   * const response = await scalekitClient.connection.getConnection(orgId, connId);
   *
   * if (response.connection.enabled && response.connection.status === 'active') {
   *   console.log('Connection is ready for SSO authentication');
   * } else {
   *   console.log('Connection not ready:', response.connection.status);
   * }
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Get Connection API}
   * @see {@link listConnections} - List all connections for an organization
   * @see {@link enableConnection} - Enable this connection
   * @see {@link disableConnection} - Disable this connection
   */
  getConnection(organizationId: string, id: string): Promise<GetConnectionResponse>;
  /**
   * Lists all SSO connections associated with a specific email domain.
   *
   * Use this method to discover which organizations have SSO configured for a particular
   * domain. This is useful for implementing domain-based SSO routing where users are
   * automatically directed to their organization's SSO based on their email domain.
   *
   * @param {string} domain - The email domain to search for (e.g., "acme.com")
   *
   * @returns {Promise<ListConnectionsResponse>} Response containing:
   *   - connections: Array of connection objects for the domain
   *
   * @example
   * // Find SSO connections for a domain
   * const response = await scalekitClient.connection.listConnectionsByDomain('acme.com');
   *
   * if (response.connections.length > 0) {
   *   console.log('SSO available for domain acme.com');
   *   const connection = response.connections[0];
   *   console.log('Organization:', connection.organizationId);
   *   console.log('Provider:', connection.provider);
   * }
   *
   * @example
   * // Implement domain-based SSO routing
   * app.post('/auth/login', async (req, res) => {
   *   const email = req.body.email;
   *   const domain = email.split('@')[1];
   *
   *   const response = await scalekitClient.connection.listConnectionsByDomain(domain);
   *
   *   if (response.connections.length > 0) {
   *     // Redirect to SSO
   *     const authUrl = scalekitClient.getAuthorizationUrl(redirectUri, {
   *       connectionId: response.connections[0].id,
   *       loginHint: email
   *     });
   *     return res.redirect(authUrl);
   *   } else {
   *     // Use password-based login
   *     return res.render('password-login');
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | List Connections API}
   * @see {@link listConnections} - List all connections for an organization
   */
  listConnectionsByDomain(domain: string): Promise<ListConnectionsResponse>;
  /**
   * Lists all SSO connections configured for an organization.
   *
   * Retrieves all enterprise SSO connections (SAML, OIDC) that have been configured for
   * the specified organization. Each connection includes details about the provider,
   * status, and configuration.
   *
   * @param {string} organizationId - The organization ID
   *
   * @returns {Promise<ListConnectionsResponse>} Response containing:
   *   - connections: Array of connection objects with provider details and status
   *
   * @example
   * // List all SSO connections for an organization
   * const response = await scalekitClient.connection.listConnections('org_123456');
   *
   * console.log(`Found ${response.connections.length} connections`);
   * response.connections.forEach(conn => {
   *   console.log(`- ${conn.provider} (${conn.type}): ${conn.enabled ? 'Enabled' : 'Disabled'}`);
   * });
   *
   * @example
   * // Check if organization has any enabled connections
   * const response = await scalekitClient.connection.listConnections('org_123456');
   * const hasEnabledSSO = response.connections.some(conn => conn.enabled);
   *
   * if (!hasEnabledSSO) {
   *   console.log('No SSO connections enabled for this organization');
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | List Connections API}
   * @see {@link getConnection} - Get details of a specific connection
   * @see {@link enableConnection} - Enable a connection
   * @see {@link disableConnection} - Disable a connection
   */
  listConnections(organizationId: string): Promise<ListConnectionsResponse>;
  /**
   * Lists app-level connections configured for the account (not scoped to an organization).
   *
   * Unlike {@link listConnections}, which returns the SSO connections for a specific
   * organization, this method returns the connections defined at the application level.
   * Results are paginated and can optionally be filtered by provider.
   *
   * @param {object} [params] - Optional pagination and filtering parameters
   * @param {number} [params.pageSize] - Maximum number of connections to return per page (max 30;
   *   a larger value fails with `[invalid_argument] Validation error`)
   * @param {string} [params.pageToken] - Token identifying the page of results to return
   * @param {string} [params.provider] - Filter results to a specific provider (e.g., "okta", "google")
   *
   * @returns {Promise<ListAppConnectionsResponse>} Response containing:
   *   - connections: Array of connection objects
   *   - nextPageToken: Token for retrieving the next page of results (empty if none)
   *   - prevPageToken: Token for retrieving the previous page of results (empty if none)
   *   - totalSize: Total number of connections matching the query
   *
   * @example
   * // List all app connections
   * const response = await scalekitClient.connection.listAppConnections();
   * console.log(`Found ${response.totalSize} app connections`);
   *
   * @example
   * // Paginate through app connections for a specific provider
   * let pageToken: string | undefined;
   * do {
   *   const response = await scalekitClient.connection.listAppConnections({
   *     pageSize: 20,
   *     pageToken,
   *     provider: 'okta',
   *   });
   *   response.connections.forEach(conn => console.log(conn.id));
   *   pageToken = response.nextPageToken || undefined;
   * } while (pageToken);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Connections API}
   * @see {@link listConnections} - List connections for a specific organization
   */
  listAppConnections(params?: {
    pageSize?: number;
    pageToken?: string;
    provider?: string;
    query?: string;
  }): Promise<ListAppConnectionsResponse>;
  /**
   * Enables an SSO connection for an organization.
   *
   * Activates a previously disabled or newly configured SSO connection, allowing users
   * from the organization to authenticate using this identity provider. Once enabled,
   * users can immediately start using SSO to log in.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} id - The connection ID to enable
   *
   * @returns {Promise<ToggleConnectionResponse>} Response with updated connection status
   *
   * @example
   * // Enable an SSO connection
   * const response = await scalekitClient.connection.enableConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * console.log('Connection enabled:', response.connection.enabled); // true
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Enable Connection API}
   * @see {@link disableConnection} - Disable a connection
   * @see {@link listConnections} - List all connections
   */
  enableConnection(organizationId: string, id: string): Promise<ToggleConnectionResponse>;
  /**
   * Disables an SSO connection for an organization.
   *
   * Deactivates an SSO connection, preventing users from authenticating via this identity
   * provider. This is useful for temporarily suspending SSO access, during maintenance,
   * or when migrating to a different provider. Existing user sessions remain valid.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} id - The connection ID to disable
   *
   * @returns {Promise<ToggleConnectionResponse>} Response with updated connection status
   *
   * @example
   * // Disable an SSO connection
   * const response = await scalekitClient.connection.disableConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * console.log('Connection disabled:', !response.connection.enabled); // true
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Disable Connection API}
   * @see {@link enableConnection} - Enable a connection
   * @see {@link listConnections} - List all connections
   */
  disableConnection(organizationId: string, id: string): Promise<ToggleConnectionResponse>;
  /**
   * Creates a new SSO connection for an organization.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {CreateConnection} connection - The connection configuration to create
   *
   * @returns {Promise<CreateConnectionResponse>} Response containing the created connection
   *
   * @throws {ScalekitServerException} If the organization is not found or connection configuration is invalid
   */
  createConnection(organizationId: string, connection: CreateConnection): Promise<CreateConnectionResponse>;
  /**
   * Deletes an SSO connection for an organization.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} id - The connection ID to delete (format: "conn_...")
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @throws {ScalekitServerException} If the organization or connection is not found
   */
  deleteConnection(organizationId: string, id: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Creates an environment-scoped connection.
   *
   * Unlike {@link createConnection}, which creates an SSO connection owned by an
   * organization, this creates a connection that belongs to the environment itself.
   * Use it for AgentKit app connections: pass `flags: { isApp: true }` and set
   * `providerKey` to the connector's identifier, such as a custom connector's
   * `provider.identifier` from `actions.providers.createCustomProvider`. The
   * returned connection's `keyId` is the connection name the AgentKit methods on
   * `actions` take.
   *
   * PREVIEW: the underlying `CreateEnvironmentConnection` RPC is marked preview
   * in the API and may change. It maps to `POST /api/v1/connections`, requires a
   * workspace client, and needs the `sso:write` permission.
   *
   * @param {CreateConnection} connection - The connection to create, as a plain object:
   *   - providerKey: Identifier of the connector the connection is for
   *   - type: Authentication type, e.g. `ConnectionType.OAUTH`
   *   - keyId: Optional connection name; generated when omitted
   * @param {Flags} [flags] - Optional flags. Set `isApp: true` for an AgentKit app connection.
   *
   * @returns {Promise<CreateConnectionResponse>} Response containing the created connection,
   *   including its `id` and `keyId`
   *
   * @throws {ScalekitServerException} If the connection configuration is invalid or the
   *   client lacks permission
   *
   * @example
   * // Create an AgentKit app connection for a custom OAuth connector
   * import { ConnectionType } from '@scalekit-sdk/node';
   *
   * const { connection } = await scalekitClient.connection.createEnvironmentConnection(
   *   { providerKey: provider.identifier, type: ConnectionType.OAUTH },
   *   { isApp: true }
   * );
   * console.log(connection?.id, connection?.keyId);
   *
   * @see {@link getEnvironmentConnection} - Fetch an environment connection by id
   * @see {@link updateEnvironmentConnection} - Update an environment connection
   */
  createEnvironmentConnection(connection: MessageInitShape<typeof CreateConnectionSchema>, flags?: MessageInitShape<typeof FlagsSchema>): Promise<CreateConnectionResponse>;
  /**
   * Retrieves an environment-scoped connection by id.
   *
   * Use this to read back a connection created with
   * {@link createEnvironmentConnection}, for example an AgentKit app connection.
   * For an organization's SSO connection, use {@link getConnection} instead.
   *
   * PREVIEW: the underlying `GetEnvironmentConnection` RPC is marked preview in
   * the API and may change. It maps to `GET /api/v1/connections/{connection_id}`,
   * accepts a workspace or actions-portal client, and needs the `sso:read`
   * permission.
   *
   * @param {string} connectionId - The connection identifier (format: "conn_...")
   *
   * @returns {Promise<GetConnectionResponse>} Response containing the connection
   *
   * @throws {ScalekitServerException} If the connection is not found or the client lacks
   *   permission
   *
   * @example
   * const { connection } =
   *   await scalekitClient.connection.getEnvironmentConnection('conn_abc123');
   * console.log(connection?.keyId, connection?.enabled);
   *
   * @see {@link createEnvironmentConnection} - Create an environment connection
   * @see {@link updateEnvironmentConnection} - Update an environment connection
   */
  getEnvironmentConnection(connectionId: string): Promise<GetConnectionResponse>;
  /**
   * Updates an environment-scoped connection.
   *
   * Use this to change the OAuth settings of a connection created with
   * {@link createEnvironmentConnection}. Organization SSO connections are not
   * updated through this method.
   *
   * Despite the `PATCH` verb, the server validates the whole connection rather
   * than merging a partial one. Read the connection with
   * {@link getEnvironmentConnection} first, then send `type`, `providerKey` and
   * `keyId` back alongside what you are changing. Each missing field fails
   * differently, and none of the errors name the method:
   * - no `keyId` -> `[invalid_argument] keyId is required`
   * - no `providerKey` -> `[invalid_argument] Validation error`
   * - no `type` -> `[internal] error converting connection`
   *
   * On an AgentKit app connection `settings` is the only field an update
   * actually changes. `provider`, `uiButtonTitle`, `debugEnabled`,
   * `configurationType` and `attributeMapping` are all accepted and then
   * discarded: the call succeeds and the stored values do not move. Change
   * those from the Scalekit dashboard instead.
   *
   * PREVIEW: the underlying `UpdateEnvironmentConnection` RPC is marked preview
   * in the API and may change. It maps to `PATCH /api/v1/connections/{connection_id}`,
   * requires a workspace client, and needs the `sso:write` permission.
   *
   * @param {string} connectionId - The connection identifier (format: "conn_...")
   * @param {UpdateConnection} connection - The connection to store, as a plain object.
   *   `type`, `providerKey` and `keyId` are required on every call. `settings` is a
   *   protobuf oneof, so it takes `{ case: 'oauthConfig', value: {...} }`.
   *
   * @returns {Promise<UpdateConnectionResponse>} Response containing the updated connection
   *
   * @throws {ScalekitServerException} If the connection is not found, the update is
   *   invalid, or the client lacks permission
   *
   * @example
   * // Narrow the OAuth scopes on an app connection
   * import { ConnectionType } from '@scalekit-sdk/node';
   *
   * const { connection: current } =
   *   await scalekitClient.connection.getEnvironmentConnection('conn_abc123');
   * if (current?.settings.case !== 'oauthConfig') {
   *   throw new Error('not an OAuth connection');
   * }
   *
   * const { connection } = await scalekitClient.connection.updateEnvironmentConnection(
   *   'conn_abc123',
   *   {
   *     type: ConnectionType.OAUTH,
   *     providerKey: current.providerKey,
   *     keyId: current.keyId,
   *     settings: {
   *       case: 'oauthConfig',
   *       value: { ...current.settings.value, scopes: ['openid', 'email', 'profile'] },
   *     },
   *   }
   * );
   * console.log(connection?.settings.value);
   *
   * @see {@link getEnvironmentConnection} - Fetch an environment connection by id
   */
  updateEnvironmentConnection(connectionId: string, connection: MessageInitShape<typeof UpdateConnectionSchema>): Promise<UpdateConnectionResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/directories/directories_pb.d.ts
/**
 * @generated from message scalekit.v1.directories.GetDirectoryResponse
 */
type GetDirectoryResponse = Message<"scalekit.v1.directories.GetDirectoryResponse"> & {
  /**
   * @generated from field: scalekit.v1.directories.Directory directory = 1;
   */
  directory?: Directory | undefined;
};
/**
 * @generated from message scalekit.v1.directories.CreateDirectory
 */
type CreateDirectory = Message<"scalekit.v1.directories.CreateDirectory"> & {
  /**
   * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 1;
   */
  directoryType: DirectoryType;
  /**
   * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 2;
   */
  directoryProvider: DirectoryProvider;
};
/**
 * @generated from message scalekit.v1.directories.CreateDirectoryResponse
 */
type CreateDirectoryResponse = Message<"scalekit.v1.directories.CreateDirectoryResponse"> & {
  /**
   * @generated from field: scalekit.v1.directories.Directory directory = 1;
   */
  directory?: Directory | undefined;
};
/**
 * @generated from message scalekit.v1.directories.ListDirectoriesResponse
 */
type ListDirectoriesResponse = Message<"scalekit.v1.directories.ListDirectoriesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.directories.Directory directories = 1;
   */
  directories: Directory[];
};
/**
 * @generated from message scalekit.v1.directories.ListDirectoryUsersResponse
 */
type ListDirectoryUsersResponse = Message<"scalekit.v1.directories.ListDirectoryUsersResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.directories.DirectoryUser users = 1;
   */
  users: DirectoryUser[];
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string next_page_token = 3;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsResponse
 */
type ListDirectoryGroupsResponse = Message<"scalekit.v1.directories.ListDirectoryGroupsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.directories.DirectoryGroup groups = 1;
   */
  groups: DirectoryGroup[];
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string next_page_token = 3;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.directories.Directory
 */
type Directory = Message<"scalekit.v1.directories.Directory"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 3;
   */
  directoryType: DirectoryType;
  /**
   * @generated from field: string organization_id = 4;
   */
  organizationId: string;
  /**
   * @generated from field: bool enabled = 5;
   */
  enabled: boolean;
  /**
   * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 6;
   */
  directoryProvider: DirectoryProvider;
  /**
   * @generated from field: google.protobuf.Timestamp last_synced_at = 7;
   */
  lastSyncedAt?: Timestamp | undefined;
  /**
   * @generated from field: string directory_endpoint = 8;
   */
  directoryEndpoint: string;
  /**
   * @generated from field: int32 total_users = 9;
   */
  totalUsers: number;
  /**
   * @generated from field: int32 total_groups = 10;
   */
  totalGroups: number;
  /**
   * @generated from field: repeated scalekit.v1.directories.Secret secrets = 11;
   */
  secrets: Secret[];
  /**
   * @generated from field: scalekit.v1.directories.Stats stats = 12;
   */
  stats?: Stats | undefined;
  /**
   * @generated from field: scalekit.v1.directories.RoleAssignments role_assignments = 13;
   */
  roleAssignments?: RoleAssignments | undefined;
  /**
   * @generated from field: scalekit.v1.directories.AttributeMappings attribute_mappings = 14;
   */
  attributeMappings?: AttributeMappings | undefined;
  /**
   * @generated from field: string status = 15;
   */
  status: string;
  /**
   * @generated from field: string email = 16;
   */
  email: string;
  /**
   * @generated from field: string groups_tracked = 17;
   */
  groupsTracked: string;
};
/**
 * @generated from message scalekit.v1.directories.ToggleDirectoryResponse
 */
type ToggleDirectoryResponse = Message<"scalekit.v1.directories.ToggleDirectoryResponse"> & {
  /**
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   * @generated from field: optional string error_message = 2;
   */
  errorMessage?: string | undefined;
};
/**
 * @generated from message scalekit.v1.directories.DirectoryUser
 */
type DirectoryUser = Message<"scalekit.v1.directories.DirectoryUser"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string email = 2;
   */
  email: string;
  /**
   * @generated from field: string preferred_username = 3;
   */
  preferredUsername: string;
  /**
   * @generated from field: string given_name = 4;
   */
  givenName: string;
  /**
   * @generated from field: string family_name = 5;
   */
  familyName: string;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 6;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: repeated string emails = 16;
   */
  emails: string[];
  /**
   * @generated from field: repeated scalekit.v1.directories.DirectoryGroup groups = 17;
   */
  groups: DirectoryGroup[];
  /**
   * @generated from field: google.protobuf.Struct user_detail = 18;
   */
  userDetail?: JsonObject$1 | undefined;
};
/**
 * @generated from message scalekit.v1.directories.DirectoryGroup
 */
type DirectoryGroup = Message<"scalekit.v1.directories.DirectoryGroup"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string display_name = 2;
   */
  displayName: string;
  /**
   * @generated from field: int32 total_users = 3;
   */
  totalUsers: number;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 4;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Struct group_detail = 5;
   */
  groupDetail?: JsonObject$1 | undefined;
};
/**
 * @generated from message scalekit.v1.directories.Secret
 */
type Secret = Message<"scalekit.v1.directories.Secret"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 2;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: string secret_suffix = 4;
   */
  secretSuffix: string;
  /**
   * @generated from field: scalekit.v1.directories.SecretStatus status = 5;
   */
  status: SecretStatus;
  /**
   * @generated from field: google.protobuf.Timestamp expire_time = 6;
   */
  expireTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp last_used_time = 7;
   */
  lastUsedTime?: Timestamp | undefined;
  /**
   * @generated from field: string directory_id = 9;
   */
  directoryId: string;
};
/**
 * @generated from message scalekit.v1.directories.Stats
 */
type Stats = Message<"scalekit.v1.directories.Stats"> & {
  /**
   * @generated from field: int32 total_users = 1;
   */
  totalUsers: number;
  /**
   * @generated from field: int32 total_groups = 2;
   */
  totalGroups: number;
  /**
   * @generated from field: google.protobuf.Timestamp group_updated_at = 3;
   */
  groupUpdatedAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp user_updated_at = 4;
   */
  userUpdatedAt?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.directories.RoleAssignments
 */
type RoleAssignments = Message<"scalekit.v1.directories.RoleAssignments"> & {
  /**
   * @generated from field: repeated scalekit.v1.directories.RoleAssignment assignments = 1;
   */
  assignments: RoleAssignment[];
};
/**
 * @generated from message scalekit.v1.directories.RoleAssignment
 */
type RoleAssignment = Message<"scalekit.v1.directories.RoleAssignment"> & {
  /**
   * @generated from field: string group_id = 1;
   */
  groupId: string;
  /**
   * @generated from field: string role_name = 2;
   */
  roleName: string;
  /**
   * @generated from field: string role_id = 3;
   */
  roleId: string;
};
/**
 * @generated from message scalekit.v1.directories.AttributeMappings
 */
type AttributeMappings = Message<"scalekit.v1.directories.AttributeMappings"> & {
  /**
   * @generated from field: repeated scalekit.v1.directories.AttributeMapping attributes = 1;
   */
  attributes: AttributeMapping[];
};
/**
 * @generated from message scalekit.v1.directories.AttributeMapping
 */
type AttributeMapping = Message<"scalekit.v1.directories.AttributeMapping"> & {
  /**
   * @generated from field: string key = 1;
   */
  key: string;
  /**
   * @generated from field: string map_to = 2;
   */
  mapTo: string;
};
/**
 * @generated from enum scalekit.v1.directories.DirectoryType
 */
declare enum DirectoryType {
  /**
   * @generated from enum value: DIRECTORY_TYPE_UNSPECIFIED = 0;
   */
  DIRECTORY_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: SCIM = 1;
   */
  SCIM = 1,
  /**
   * @generated from enum value: LDAP = 2;
   */
  LDAP = 2,
  /**
   * @generated from enum value: POLL = 3;
   */
  POLL = 3
}
/**
 * @generated from enum scalekit.v1.directories.DirectoryProvider
 */
declare enum DirectoryProvider {
  /**
   * @generated from enum value: DIRECTORY_PROVIDER_UNSPECIFIED = 0;
   */
  DIRECTORY_PROVIDER_UNSPECIFIED = 0,
  /**
   * @generated from enum value: OKTA = 1;
   */
  OKTA = 1,
  /**
   * @generated from enum value: GOOGLE = 2;
   */
  GOOGLE = 2,
  /**
   * @generated from enum value: MICROSOFT_AD = 3;
   */
  MICROSOFT_AD = 3,
  /**
   * @generated from enum value: AUTH0 = 4;
   */
  AUTH0 = 4,
  /**
   * @generated from enum value: ONELOGIN = 5;
   */
  ONELOGIN = 5,
  /**
   * @generated from enum value: JUMPCLOUD = 6;
   */
  JUMPCLOUD = 6,
  /**
   * @generated from enum value: PING_IDENTITY = 7;
   */
  PING_IDENTITY = 7
}
/**
 * @generated from enum scalekit.v1.directories.SecretStatus
 */
declare enum SecretStatus {
  /**
   * @generated from enum value: ACTIVE = 0;
   */
  ACTIVE = 0,
  /**
   * @generated from enum value: INACTIVE = 1;
   */
  INACTIVE = 1
}
//#endregion
//#region src/directory.d.ts
/**
 * Client for managing SCIM directory synchronization.
 *
 * Directories represent SCIM connections that automatically sync users and groups from an
 * organization's identity provider (Okta, Azure AD, Google Workspace, etc.) to your application.
 * Use this client to retrieve synchronized user/group data, manage directory settings, and
 * monitor sync status.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const directoryClient = scalekitClient.directory;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/directory | Directory API Documentation}
 * @see {@link https://docs.scalekit.com/directory/scim/quickstart/ | SCIM Directory Sync Guide}
 */
declare class DirectoryClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Retrieves all SCIM directories configured for an organization.
   *
   * Lists all directory sync connections that have been set up for the organization. Each directory
   * represents a SCIM integration with an identity provider (Okta, Azure AD, Google Workspace, etc.)
   * that automatically syncs users and groups. Use this to view directory configurations, check sync
   * status, and manage directory integrations.
   *
   * @param {string} organizationId - The organization ID to list directories for (format: "org_...")
   *
   * @returns {Promise<ListDirectoriesResponse>} Response containing:
   *   - directories: Array of directory objects with:
   *     - id: Unique directory identifier
   *     - organizationId: Parent organization ID
   *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
   *     - enabled: Whether directory sync is active
   *     - status: Current synchronization status
   *     - lastSyncTime: When the last sync occurred
   *     - userCount: Number of synced users
   *     - groupCount: Number of synced groups
   *
   * @throws {Error} If the organization is not found
   *
   * @example
   * // List all directories for an organization
   * const response = await scalekitClient.directory.listDirectories('org_123456');
   *
   * console.log(`Found ${response.directories.length} directories`);
   * response.directories.forEach(dir => {
   *   console.log(`- ${dir.provider}: ${dir.enabled ? 'Active' : 'Inactive'}`);
   *   console.log(`  Users: ${dir.userCount}, Groups: ${dir.groupCount}`);
   * });
   *
   * @example
   * // Check if organization has any active directories
   * const response = await scalekitClient.directory.listDirectories('org_123456');
   * const hasActiveDirectory = response.directories.some(dir => dir.enabled);
   *
   * if (hasActiveDirectory) {
   *   console.log('Directory sync is enabled for this organization');
   * } else {
   *   console.log('No active directory sync');
   * }
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directories API}
   * @see {@link getDirectory} - Get details of a specific directory
   * @see {@link enableDirectory} - Enable directory sync
   * @see {@link disableDirectory} - Disable directory sync
   */
  listDirectories(organizationId: string): Promise<ListDirectoriesResponse>;
  /**
   * Retrieves comprehensive details about a specific SCIM directory.
   *
   * Fetches complete configuration and status information for a directory, including provider settings,
   * synchronization status, user/group counts, and metadata. Use this to view directory configuration,
   * monitor sync health, verify setup, or display directory details in admin interfaces.
   *
   * @param {string} organizationId - The organization ID that owns the directory (format: "org_...")
   * @param {string} directoryId - The directory identifier to retrieve (format: "dir_...")
   *
   * @returns {Promise<GetDirectoryResponse>} Response containing:
   *   - directory: Complete directory object with:
   *     - id: Unique directory identifier
   *     - organizationId: Parent organization ID
   *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
   *     - enabled: Whether directory sync is active
   *     - status: Current synchronization status
   *     - scimBaseUrl: SCIM endpoint URL
   *     - scimToken: Authentication token (masked)
   *     - lastSyncTime: Timestamp of last successful sync
   *     - nextSyncTime: Scheduled time for next sync
   *     - userCount: Number of synced users
   *     - groupCount: Number of synced groups
   *     - createTime: When directory was created
   *     - updateTime: When directory was last updated
   *
   * @throws {Error} If the organization or directory is not found
   *
   * @example
   * // Get directory details
   * const response = await scalekitClient.directory.getDirectory(
   *   'org_123456',
   *   'dir_abc123'
   * );
   *
   * const dir = response.directory;
   * console.log('Provider:', dir.provider);
   * console.log('Status:', dir.enabled ? 'Active' : 'Inactive');
   * console.log('Last sync:', dir.lastSyncTime);
   * console.log('Users:', dir.userCount);
   * console.log('Groups:', dir.groupCount);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | Get Directory API}
   * @see {@link getPrimaryDirectoryByOrganizationId} - List the first directory in an Organization.
   *                                                  - Useful utility API if you don't know the directory ID but only have an organizationID.
   * @see {@link listDirectoryUsers} - List users in this directory
   * @see {@link listDirectoryGroups} - List groups in this directory
   */
  getDirectory(organizationId: string, directoryId: string): Promise<GetDirectoryResponse>;
  /**
   * Retrieves the primary (first) directory for an organization.
   *
   * This is a convenience method that fetches the first directory from the organization's list
   * of directories. Most organizations have a single directory, making this useful for quickly
   * accessing directory data without needing to know the specific directory ID. If the organization
   * has multiple directories, this returns the first one.
   *
   * @param {string} organizationId - The organization ID to get the primary directory for (format: "org_...")
   *
   * @returns {Promise<Directory>} The first directory object for the organization
   *
   * @throws {Error} When the organization has no directories configured
   *
   * @example
   * // Get primary directory for an organization
   * try {
   *   const directory = await scalekitClient.directory.getPrimaryDirectoryByOrganizationId('org_123456');
   *
   *   console.log('Primary Directory:', directory.provider);
   *   console.log('Users:', directory.userCount);
   *   console.log('Groups:', directory.groupCount);
   * } catch (error) {
   *   console.log('No directory configured for this organization');
   * }
   *
   *
   * @see {@link listDirectories} - List all directories for an organization
   * @see {@link getDirectory} - Get a specific directory by ID
   * @see {@link listDirectoryUsers} - List users in the directory
   */
  getPrimaryDirectoryByOrganizationId(organizationId: string): Promise<Directory>;
  /**
   * Lists users synchronized from an identity provider via SCIM directory sync.
   *
   * Retrieves all users that have been synced from the organization's IdP to your application.
   * This includes user profile information, group memberships, and sync status. Use this to
   * display organization users, implement user search, or track provisioning/deprovisioning.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} directoryId - The directory ID
   * @param {object} [options] - Optional filtering and pagination parameters
   * @param {number} [options.pageSize] - Number of users per page (max: 100)
   * @param {string} [options.pageToken] - Token for next page from previous response
   * @param {boolean} [options.includeDetail] - Include full user profile details
   * @param {string} [options.directoryGroupId] - Filter users by group membership
   * @param {string} [options.updatedAfter] - ISO 8601 timestamp to fetch only users updated after this time
   *
   * @returns {Promise<ListDirectoryUsersResponse>} Response containing:
   *   - users: Array of directory user objects with profiles and attributes
   *   - nextPageToken: Token for retrieving the next page
   *   - totalSize: Total number of users in the directory
   *
   * @example
   * // List all directory users with pagination
   * const response = await scalekitClient.directory.listDirectoryUsers(
   *   'org_123456',
   *   'dir_abc123',
   *   { pageSize: 50 }
   * );
   *
   * console.log(`Found ${response.totalSize} users`);
   * response.users.forEach(user => {
   *   console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directory Users API}
   * @see {@link listDirectoryGroups} - List directory groups
   * @see {@link listDirectories} - List all directories for an organization
   */
  listDirectoryUsers(organizationId: string, directoryId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    includeDetail?: boolean;
    directoryGroupId?: string;
    updatedAfter?: string;
  }): Promise<ListDirectoryUsersResponse>;
  /**
   * Retrieves groups synchronized from an identity provider via SCIM directory sync.
   *
   * Fetches all groups that have been synced from the organization's IdP to your application.
   * Groups typically represent teams, departments, or organizational units. Use this to display
   * group hierarchies, implement group-based access control, manage group memberships, or track
   * organizational structure changes.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} directoryId - The directory ID (format: "dir_...")
   * @param {object} [options] - Optional filtering and pagination parameters
   * @param {number} [options.pageSize] - Number of groups per page (max: 30, default: 10)
   * @param {string} [options.pageToken] - Token for next page from previous response
   * @param {boolean} [options.includeDetail] - Include full group details and member lists
   * @param {string} [options.updatedAfter] - ISO 8601 timestamp to fetch only groups updated after this time
   *
   * @returns {Promise<ListDirectoryGroupsResponse>} Response containing:
   *   - groups: Array of directory group objects with:
   *     - id: Group identifier
   *     - displayName: Group name
   *     - description: Group description
   *     - members: Array of member user IDs (when includeDetail is true)
   *     - attributes: Custom group attributes
   *     - updateTime: When the group was last updated
   *   - nextPageToken: Token for retrieving the next page
   *   - totalSize: Total number of groups in the directory
   *
   * @example
   * // List all directory groups with pagination
   * const response = await scalekitClient.directory.listDirectoryGroups(
   *   'org_123456',
   *   'dir_abc123',
   *   { pageSize: 30 }
   * );
   *
   * console.log(`Found ${response.totalSize} groups`);
   * response.groups.forEach(group => {
   *   console.log(`- ${group.displayName}`);
   *   if (group.description) console.log(`  ${group.description}`);
   * });
   *
   * @example
   * // Get groups with full member details
   * const response = await scalekitClient.directory.listDirectoryGroups(
   *   'org_123456',
   *   'dir_abc123',
   *   { includeDetail: true }
   * );
   *
   * response.groups.forEach(group => {
   *   console.log(`${group.displayName}: ${group.members?.length || 0} members`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directory Groups API}
   * @see {@link listDirectoryUsers} - List directory users
   * @see {@link getDirectory} - Get directory details
   */
  listDirectoryGroups(organizationId: string, directoryId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    includeDetail?: boolean;
    updatedAfter?: string;
  }): Promise<ListDirectoryGroupsResponse>;
  /**
   * Enables SCIM directory synchronization for an organization.
   *
   * Activates automatic user and group synchronization from the organization's identity provider.
   * Once enabled, users and groups from the IdP will be synced to your application, and any changes
   * in the IdP (additions, updates, deletions) will be automatically reflected. This is essential
   * for implementing automated user provisioning and deprovisioning.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} directoryId - The directory ID to enable (format: "dir_...")
   *
   * @returns {Promise<ToggleDirectoryResponse>} Response containing:
   *   - directory: The updated directory object with enabled status set to true
   *
   * @throws {Error} If the organization or directory is not found
   * @throws {Error} If the directory configuration is incomplete or invalid
   *
   * @example
   * // Enable directory sync
   * const response = await scalekitClient.directory.enableDirectory(
   *   'org_123456',
   *   'dir_abc123'
   * );
   *
   * console.log('Directory enabled:', response.directory.enabled); // true
   * console.log('Sync will start automatically');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | Enable Directory API}
   * @see {@link disableDirectory} - Disable directory sync
   * @see {@link getDirectory} - Check directory status
   * @see {@link listDirectoryUsers} - View synced users after enabling
   */
  enableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse>;
  /**
   * Disables SCIM directory synchronization for an organization.
   *
   * Stops automatic user and group synchronization from the organization's identity provider.
   * When disabled, no new updates will be received from the IdP, but existing synced users and
   * groups remain in your application. This is useful for temporarily pausing sync during maintenance,
   * troubleshooting, or when migrating to a different directory provider. Does not delete existing data.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} directoryId - The directory ID to disable (format: "dir_...")
   *
   * @returns {Promise<ToggleDirectoryResponse>} Response containing:
   *   - directory: The updated directory object with enabled status set to false
   *
   * @throws {Error} If the organization or directory is not found
   *
   * @example
   * // Disable directory sync
   * const response = await scalekitClient.directory.disableDirectory(
   *   'org_123456',
   *   'dir_abc123'
   * );
   *
   * console.log('Directory disabled:', !response.directory.enabled); // true
   * console.log('Existing users and groups are preserved');
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/directory | Disable Directory API}
   * @see {@link enableDirectory} - Enable directory sync
   * @see {@link getDirectory} - Check directory status
   * @see {@link listDirectories} - List all directories
   */
  disableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse>;
  /**
   * Creates a new SCIM directory for an organization.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {CreateDirectory} directory - The directory configuration to create
   *
   * @returns {Promise<CreateDirectoryResponse>} Response containing the created directory
   *
   * @throws {ScalekitServerException} If the organization is not found or directory configuration is invalid
   */
  createDirectory(organizationId: string, directory: CreateDirectory): Promise<CreateDirectoryResponse>;
  /**
   * Deletes a SCIM directory for an organization.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} directoryId - The directory ID to delete (format: "dir_...")
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @throws {ScalekitServerException} If the organization or directory is not found
   */
  deleteDirectory(organizationId: string, directoryId: string): Promise<MessageShape<typeof EmptySchema>>;
}
//#endregion
//#region src/domain.d.ts
/**
 * Client for managing domains for organizations.
 *
 * Domains enable automatic organization identification during SSO flows based on user email addresses.
 * You can configure domains as ORGANIZATION_DOMAIN (for SSO routing) or ALLOWED_EMAIL_DOMAIN
 * (for restricting which email domains can automatically join an organization).
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const domainClient = scalekitClient.domain;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/domains | Domain API Documentation}
 */
declare class DomainClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Adds a new domain configuration to an organization for SSO routing or user suggestions.
   *
   * Domains serve two purposes based on their type:
   * - **ORGANIZATION_DOMAIN**: Used to identify the SSO connection for the organization. When users
   *   authenticate with email addresses from this domain, they're automatically routed to the
   *   organization's SSO provider.
   * - **ALLOWED_EMAIL_DOMAIN**: Enables users to join the organization with automatic suggestions
   *   in the organization switcher during signup/login.
   *
   * Note: Public disposable domains (gmail.com, outlook.com, etc.) are automatically blocked for security.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} name - The domain name (e.g., "acme.com", "example.org")
   * @param {object} [options] - Optional domain configuration
   * @param {DomainType | string} [options.domainType] - Domain type: 'ALLOWED_EMAIL_DOMAIN' or 'ORGANIZATION_DOMAIN'
   *
   * @returns {Promise<CreateDomainResponse>} The created domain with ID and verification status
   *
   * @throws {Error} If domain type is invalid
   * @throws {Error} If domain is a blocked public domain (gmail.com, etc.)
   *
   * @example
   * // Add SSO routing domain
   * const response = await scalekitClient.domain.createDomain(
   *   'org_123456',
   *   'acme.com',
   *   { domainType: 'ORGANIZATION_DOMAIN' }
   * );
   * console.log('Domain created:', response.domain.id);
   * console.log('Verification required:', response.domain.verificationStatus);
   *
   * @example
   * // Add allowed email domain for user suggestions
   * await scalekitClient.domain.createDomain(
   *   'org_123456',
   *   'acme.io',
   *   { domainType: 'ALLOWED_EMAIL_DOMAIN' }
   * );
   *
   * @example
   * // Create domain with default type
   * await scalekitClient.domain.createDomain('org_123456', 'company.com');
   *
   * @example
   * // Configure multiple domains for an organization
   * const domains = ['acme.com', 'acme.io', 'acme.net'];
   * for (const domain of domains) {
   *   await scalekitClient.domain.createDomain('org_123456', domain, {
   *     domainType: 'ORGANIZATION_DOMAIN'
   *   });
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/domains | Create Domain API}
   * @see {@link listDomains} - List all domains for an organization
   * @see {@link deleteDomain} - Remove a domain
   */
  createDomain(organizationId: string, name: string, options?: {
    domainType?: DomainType | string;
  }): Promise<CreateDomainResponse>;
  /**
   * Retrieves detailed information about a specific domain configuration.
   *
   * Returns complete domain details including the domain name, type (ORGANIZATION_DOMAIN or
   * ALLOWED_EMAIL_DOMAIN), verification status, and when it was created/updated. Use this to
   * check domain configuration status or verification requirements.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   * @param {string} domainId - The domain ID (format: "domain_...")
   *
   * @returns {Promise<GetDomainResponse>} Complete domain configuration and status
   *
   * @example
   * // Check domain verification status
   * const response = await scalekitClient.domain.getDomain(
   *   'org_123456',
   *   'domain_abc123'
   * );
   * console.log('Domain:', response.domain.domain);
   * console.log('Type:', response.domain.domainType);
   * console.log('Verified:', response.domain.verificationStatus);
   *
   * @example
   * // Verify domain configuration after creation
   * const created = await scalekitClient.domain.createDomain(
   *   'org_123456',
   *   'acme.com',
   *   { domainType: 'ORGANIZATION_DOMAIN' }
   * );
   *
   * // Later, check if domain has been verified
   * const domain = await scalekitClient.domain.getDomain(
   *   'org_123456',
   *   created.domain.id
   * );
   * if (domain.domain.verificationStatus === 'VERIFIED') {
   *   console.log('Domain is ready for SSO routing');
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/domains | Get Domain API}
   * @see {@link createDomain} - Add a new domain
   * @see {@link listDomains} - List all domains for an organization
   */
  getDomain(organizationId: string, domainId: string): Promise<GetDomainResponse>;
  private resolveDomainType;
  /**
   * Retrieves all domain configurations for an organization.
   *
   * Returns a complete list of domains configured for the organization, including both
   * ORGANIZATION_DOMAIN (for SSO routing) and ALLOWED_EMAIL_DOMAIN (for user suggestions).
   * Each domain includes its verification status, type, and configuration details.
   *
   * Use this to audit domain configuration, check which domains are verified, or display
   * domain settings in an admin dashboard.
   *
   * @param {string} organizationId - The organization ID (format: "org_...")
   *
   * @param options Optional parameters for filtering domains
   * @param {DomainType | string} options.domainType Filter domains by type (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
   * @returns {Promise<ListDomainResponse>} List of all domains with their configurations
   *
   * @example
   * // List all domains for an organization
   * const response = await scalekitClient.domain.listDomains('org_123456');
   * console.log(`Found ${response.domains.length} domains`);
   * response.domains.forEach(domain => {
   *   console.log(`- ${domain.domain} (${domain.domainType}): ${domain.verificationStatus}`);
   * });
   *
   * @example
   * // Check which domains are verified for SSO
   * const response = await scalekitClient.domain.listDomains('org_123456');
   * const verifiedSSODomains = response.domains.filter(
   *   d => d.domainType === 'ORGANIZATION_DOMAIN' && d.verificationStatus === 'VERIFIED'
   * );
   * console.log('Verified SSO domains:', verifiedSSODomains.map(d => d.domain));
   * @see {@link https://docs.scalekit.com/apis/#tag/domains | List Domains API}
   * @see {@link createDomain} - Add a new domain
   * @see {@link getDomain} - Get details for a specific domain
   * @see {@link deleteDomain} - Remove a domain
   */
  listDomains(organizationId: string, options?: {
    domainType?: DomainType | string;
  }): Promise<ListDomainResponse>;
  /**
   * Deletes a domain from an organization.
   *
   * Removes the domain configuration from the organization. Users with email addresses from
   * this domain will no longer be automatically routed to this organization's SSO connection.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} domainId - The domain ID to delete
   *
   * @returns {Promise<MessageShape<EmptySchema>>} Empty response on successful deletion
   *
   * @example
   * // Remove a domain from an organization
   * await scalekitClient.domain.deleteDomain('org_123456', 'domain_abc123');
   * console.log('Domain deleted successfully');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/domains | Delete Domain API}
   * @see {@link createDomain} - Add a new domain
   * @see {@link listDomains} - List all domains for an organization
   */
  deleteDomain(organizationId: string, domainId: string): Promise<MessageShape<typeof EmptySchema>>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/commons/commons_pb.d.ts
/**
 * @generated from message scalekit.v1.commons.OrganizationMembership
 */
type OrganizationMembership = Message<"scalekit.v1.commons.OrganizationMembership"> & {
  /**
   * @generated from field: string organization_id = 1;
   */
  organizationId: string;
  /**
   * @generated from field: google.protobuf.Timestamp join_time = 2;
   */
  joinTime?: Timestamp | undefined;
  /**
   * @generated from field: scalekit.v1.commons.MembershipStatus membership_status = 3;
   */
  membershipStatus: MembershipStatus;
  /**
   * @generated from field: repeated scalekit.v1.commons.Role roles = 4;
   */
  roles: Role$1[];
  /**
   * @generated from field: optional string name = 5;
   */
  name?: string | undefined;
  /**
   * @generated from field: map<string, string> metadata = 7;
   */
  metadata: {
    [key: string]: string;
  };
  /**
   * @generated from field: optional string display_name = 9;
   */
  displayName?: string | undefined;
  /**
   * @generated from field: optional string inviter_email = 10;
   */
  inviterEmail?: string | undefined;
  /**
   * @generated from field: optional google.protobuf.Timestamp created_at = 11;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: optional google.protobuf.Timestamp accepted_at = 12;
   */
  acceptedAt?: Timestamp | undefined;
  /**
   * @generated from field: optional google.protobuf.Timestamp expires_at = 13;
   */
  expiresAt?: Timestamp | undefined;
  /**
   * @generated from field: optional string provisioning_method = 14;
   */
  provisioningMethod?: string | undefined;
  /**
   * @generated from field: repeated string permissions = 15;
   */
  permissions: string[];
};
/**
 * @generated from message scalekit.v1.commons.Role
 */
type Role$1 = Message<"scalekit.v1.commons.Role"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string display_name = 3;
   */
  displayName: string;
};
/**
 * @generated from message scalekit.v1.commons.UserProfile
 */
type UserProfile = Message<"scalekit.v1.commons.UserProfile"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string given_name = 2;
   */
  givenName: string;
  /**
   * @generated from field: string family_name = 3;
   */
  familyName: string;
  /**
   * @generated from field: string name = 4;
   */
  name: string;
  /**
   * @generated from field: string locale = 5;
   */
  locale: string;
  /**
   * @generated from field: bool email_verified = 6;
   */
  emailVerified: boolean;
  /**
   * @generated from field: string phone_number = 7;
   */
  phoneNumber: string;
  /**
   * @generated from field: map<string, string> metadata = 8;
   */
  metadata: {
    [key: string]: string;
  };
  /**
   * @generated from field: map<string, string> custom_attributes = 9;
   */
  customAttributes: {
    [key: string]: string;
  };
  /**
   * @generated from field: string first_name = 21 [deprecated = true];
   * @deprecated
   */
  firstName: string;
  /**
   * @generated from field: string last_name = 22 [deprecated = true];
   * @deprecated
   */
  lastName: string;
  /**
   * @generated from field: string preferred_username = 12;
   */
  preferredUsername: string;
  /**
   * @generated from field: bool phone_number_verified = 13;
   */
  phoneNumberVerified: boolean;
  /**
   * @generated from field: string picture = 14;
   */
  picture: string;
  /**
   * @generated from field: repeated string groups = 15;
   */
  groups: string[];
  /**
   * @generated from field: string gender = 16;
   */
  gender: string;
  /**
   * @generated from field: repeated scalekit.v1.commons.ExternalIdentity external_identities = 10;
   */
  externalIdentities: ExternalIdentity[];
};
/**
 * @generated from message scalekit.v1.commons.ExternalIdentity
 */
type ExternalIdentity = Message<"scalekit.v1.commons.ExternalIdentity"> & {
  /**
   * Identifier for this connection.
   *
   * @generated from field: string connection_id = 1;
   */
  connectionId: string;
  /**
   * Connection name.
   *
   * @generated from field: string connection_type = 2;
   */
  connectionType: string;
  /**
   * Name of connection, e.g. Google.
   *
   * @generated from field: scalekit.v1.commons.IdentityProviderType connection_provider = 3;
   */
  connectionProvider: IdentityProviderType;
  /**
   * Unique identifier of the user for this identity.
   *
   * @generated from field: string connection_user_id = 4;
   */
  connectionUserId: string;
  /**
   * Whether this identity is from a social provider (true) or not (false).
   *
   * @generated from field: bool is_social = 5;
   */
  isSocial: boolean;
  /**
   * Last successful login time with this IdP for the user.
   *
   * @generated from field: google.protobuf.Timestamp last_login_time = 6;
   */
  lastLoginTime?: Timestamp | undefined;
  /**
   * Creation of this external identity with the IdP for the user.
   *
   * @generated from field: google.protobuf.Timestamp created_time = 7;
   */
  createdTime?: Timestamp | undefined;
  /**
   * Last time when sync of data happened for this user from external IdP.
   *
   * @generated from field: google.protobuf.Timestamp last_synced_time = 8;
   */
  lastSyncedTime?: Timestamp | undefined;
};
/**
 * @generated from enum scalekit.v1.commons.RegionCode
 */
declare enum RegionCode {
  /**
   *
   * If the region code is unspecified the selected region will automatically be decided based on the origin of the call.
   *
   * @generated from enum value: REGION_CODE_UNSPECIFIED = 0;
   */
  REGION_CODE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: US = 1;
   */
  US = 1,
  /**
   * @generated from enum value: EU = 2;
   */
  EU = 2
}
/**
 * @generated from enum scalekit.v1.commons.MembershipStatus
 */
declare enum MembershipStatus {
  /**
   * @generated from enum value: Membership_Status_UNSPECIFIED = 0;
   */
  Membership_Status_UNSPECIFIED = 0,
  /**
   * @generated from enum value: ACTIVE = 1;
   */
  ACTIVE = 1,
  /**
   * @generated from enum value: INACTIVE = 2;
   */
  INACTIVE = 2,
  /**
   * @generated from enum value: PENDING_INVITE = 3;
   */
  PENDING_INVITE = 3,
  /**
   * @generated from enum value: INVITE_EXPIRED = 4;
   */
  INVITE_EXPIRED = 4
}
/**
 * @generated from enum scalekit.v1.commons.IdentityProviderType
 */
declare enum IdentityProviderType {
  /**
   * @generated from enum value: IDENTITY_PROVIDER_UNSPECIFIED = 0;
   */
  IDENTITY_PROVIDER_UNSPECIFIED = 0,
  /**
   * @generated from enum value: OKTA = 1;
   */
  OKTA = 1,
  /**
   * @generated from enum value: GOOGLE = 2;
   */
  GOOGLE = 2,
  /**
   * @generated from enum value: MICROSOFT_AD = 3;
   */
  MICROSOFT_AD = 3,
  /**
   * @generated from enum value: AUTH0 = 4;
   */
  AUTH0 = 4,
  /**
   * @generated from enum value: ONELOGIN = 5;
   */
  ONELOGIN = 5,
  /**
   * @generated from enum value: PING_IDENTITY = 6;
   */
  PING_IDENTITY = 6,
  /**
   * @generated from enum value: JUMPCLOUD = 7;
   */
  JUMPCLOUD = 7,
  /**
   * @generated from enum value: CUSTOM = 8;
   */
  CUSTOM = 8,
  /**
   * @generated from enum value: GITHUB = 9;
   */
  GITHUB = 9,
  /**
   * @generated from enum value: GITLAB = 10;
   */
  GITLAB = 10,
  /**
   * @generated from enum value: LINKEDIN = 11;
   */
  LINKEDIN = 11,
  /**
   * @generated from enum value: SALESFORCE = 12;
   */
  SALESFORCE = 12,
  /**
   * @generated from enum value: MICROSOFT = 13;
   */
  MICROSOFT = 13,
  /**
   * @generated from enum value: IDP_SIMULATOR = 14;
   */
  IDP_SIMULATOR = 14,
  /**
   * @generated from enum value: SCALEKIT = 15;
   */
  SCALEKIT = 15,
  /**
   * @generated from enum value: ADFS = 16;
   */
  ADFS = 16
}
/**
 * @generated from enum scalekit.v1.commons.TimeUnit
 */
declare enum TimeUnit$1 {
  /**
   * @generated from enum value: SESSION_TIME_UNIT_UNSPECIFIED = 0;
   */
  SESSION_TIME_UNIT_UNSPECIFIED = 0,
  /**
   * @generated from enum value: MINUTES = 1;
   */
  MINUTES = 1,
  /**
   * @generated from enum value: HOURS = 2;
   */
  HOURS = 2,
  /**
   * @generated from enum value: DAYS = 3;
   */
  DAYS = 3
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/auth/auth_pb.d.ts
/**
 * @generated from message scalekit.v1.auth.UpdateLoginUserDetailsResponse
 */
type UpdateLoginUserDetailsResponse = Message<"scalekit.v1.auth.UpdateLoginUserDetailsResponse"> & {
  /**
   * @generated from field: string auth_request_id = 1;
   */
  authRequestId: string;
};
/**
 * @generated from message scalekit.v1.auth.GetLoginRequestDetailsResponse
 */
type GetLoginRequestDetailsResponse = Message<"scalekit.v1.auth.GetLoginRequestDetailsResponse"> & {
  /**
   * @generated from field: scalekit.v1.auth.AuthRequestDetails auth_request = 1;
   */
  authRequest?: AuthRequestDetails | undefined;
  /**
   * @generated from field: scalekit.v1.auth.AuthRequestClient client = 2;
   */
  client?: AuthRequestClient | undefined;
  /**
   * @generated from field: scalekit.v1.auth.AuthRequestResource resource = 3;
   */
  resource?: AuthRequestResource | undefined;
};
/**
 * @generated from message scalekit.v1.auth.AuthRequestDetails
 */
type AuthRequestDetails = Message<"scalekit.v1.auth.AuthRequestDetails"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: repeated string scopes = 2;
   */
  scopes: string[];
};
/**
 * @generated from message scalekit.v1.auth.AuthRequestClient
 */
type AuthRequestClient = Message<"scalekit.v1.auth.AuthRequestClient"> & {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;
  /**
   * @generated from field: string sk_client_id = 2;
   */
  skClientId: string;
  /**
   * @generated from field: string client_name = 3;
   */
  clientName: string;
  /**
   * @generated from field: bool is_dcr = 4;
   */
  isDcr: boolean;
  /**
   * @generated from field: bool is_cimd = 5;
   */
  isCimd: boolean;
};
/**
 * @generated from message scalekit.v1.auth.AuthRequestResource
 */
type AuthRequestResource = Message<"scalekit.v1.auth.AuthRequestResource"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
};
/**
 * @generated from message scalekit.v1.auth.User
 */
type User$2 = Message<"scalekit.v1.auth.User"> & {
  /**
   * @generated from field: string sub = 1;
   */
  sub: string;
  /**
   * @generated from field: string email = 2;
   */
  email: string;
  /**
   * @generated from field: string given_name = 3;
   */
  givenName: string;
  /**
   * @generated from field: string family_name = 4;
   */
  familyName: string;
  /**
   * @generated from field: bool email_verified = 5;
   */
  emailVerified: boolean;
  /**
   * @generated from field: string phone_number = 6;
   */
  phoneNumber: string;
  /**
   * @generated from field: bool phone_number_verified = 7;
   */
  phoneNumberVerified: boolean;
  /**
   * @generated from field: string name = 8;
   */
  name: string;
  /**
   * @generated from field: string preferred_username = 9;
   */
  preferredUsername: string;
  /**
   * @generated from field: string picture = 10;
   */
  picture: string;
  /**
   * @generated from field: string gender = 11;
   */
  gender: string;
  /**
   * @generated from field: string locale = 12;
   */
  locale: string;
  /**
   * @generated from field: repeated string groups = 13;
   */
  groups: string[];
  /**
   * @generated from field: google.protobuf.Struct custom_attributes = 14;
   */
  customAttributes?: JsonObject$1 | undefined;
  /**
   * @generated from field: optional string organization_external_id = 15;
   */
  organizationExternalId?: string | undefined;
  /**
   * @generated from field: repeated string roles = 16;
   */
  roles: string[];
  /**
   * @generated from field: optional string organization_external_name = 17;
   */
  organizationExternalName?: string | undefined;
  /**
   * @generated from field: bool login_failed = 18;
   */
  loginFailed: boolean;
};
//#endregion
//#region src/auth.d.ts
/** User input for updateLoginUserDetails; customAttributes is a plain object (proto Struct → JsonObject in v2). */
type UserInput = Partial<User$2> & {
  customAttributes?: JsonObject$1;
};
/**
 * If you are using Auth for MCP solution of Scalekit in "Bring your own Auth" mode, this client helps updating Scalekit with the currently logged in user details for the ongoing authentication request.
 *
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const authClient = scalekitClient.auth;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Authentication API Documentation}
 */
declare class AuthClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private readonly client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Updates user details for an ongoing authentication request.
   *
   *
   * @param {string} connectionId - The SSO connection ID being used for authentication
   * @param {string} loginRequestId - The unique login request identifier from the auth flow
   * @param {UserInput} user - User details to update or associate with the login request
   * @param {string} [user.email] - User's email address
   * @param {string} [user.sub] - Unique user identifier (subject)
   *
   * @returns {Promise<UpdateLoginUserDetailsResponse>} Response containing the auth request ID,
   *   which can be used to look up the authentication journey of the user using auth logs
   *
   * @throws {Error} When connectionId is missing or invalid
   * @throws {Error} When loginRequestId is missing or invalid
   * @throws {Error} When user object is invalid
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * await scalekitClient.auth.updateLoginUserDetails(
   *   'conn_abc123',
   *   'login_xyz789',
   *   {
   *     email: 'john.doe@company.com',
   *     sub: 'unique_user_id_456',
   *   }
   * );
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Update Login User Details API}
   */
  updateLoginUserDetails(connectionId: string, loginRequestId: string, user: UserInput): Promise<UpdateLoginUserDetailsResponse>;
  /**
   * Resolves a login request ID into the authorization request it was issued for,
   * the OAuth client that started it, and the resource being accessed.
   *
   * Call this when your own authentication service receives a login request ID on
   * the authorize redirect and needs to know which client is asking, which scopes
   * were requested, and which resource is being accessed.
   *
   * The login request ID is ephemeral: it is created when the authorization request
   * is handed off to your authentication service and lives for 15 minutes. Once it
   * expires the authorization request has expired too, and this call fails from then on.
   *
   * @param {string} loginRequestId - The login request identifier from the authorize
   *   redirect, in `lri_` format
   *
   * @returns {Promise<GetLoginRequestDetailsResponse>} The authorization request and its
   *   requested scopes, the client that started it, and the resource it targets.
   *   `resource` is absent when the authorization request is not scoped to a resource.
   *
   * @throws {Error} When loginRequestId is missing or invalid
   * @throws {ScalekitServerException} If a network or server error occurs, including when
   *   the login request ID is unknown, expired, or belongs to another environment — all of
   *   which return the same error, so it cannot be used to probe whether an ID exists.
   *
   * @example
   * const details = await scalekitClient.auth.getLoginRequestDetails('lri_73415099636808061');
   *
   * console.log(details.authRequest?.scopes);   // scopes the client requested
   * console.log(details.client?.clientName);    // who is asking
   * console.log(details.client?.clientId);      // CIMD metadata URL for a CIMD client, otherwise m2m_xxx
   * console.log(details.client?.skClientId);    // always m2m_xxx, for every client
   * console.log(details.resource?.name);        // may be undefined
   *
   * @see {@link https://docs.scalekit.com/mcp/auth-methods/custom-auth/ | Bring Your Own Auth}
   */
  getLoginRequestDetails(loginRequestId: string): Promise<GetLoginRequestDetailsResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/organizations/organizations_pb.d.ts
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationResponse
 */
type CreateOrganizationResponse = Message<"scalekit.v1.organizations.CreateOrganizationResponse"> & {
  /**
   * @generated from field: scalekit.v1.organizations.Organization organization = 1;
   */
  organization?: Organization | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.Organization
 */
type Organization = Message<"scalekit.v1.organizations.Organization"> & {
  /**
   * Id
   *
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * Created Time
   *
   * @generated from field: google.protobuf.Timestamp create_time = 2;
   */
  createTime?: Timestamp | undefined;
  /**
   * Updated time
   *
   * @generated from field: google.protobuf.Timestamp update_time = 3;
   */
  updateTime?: Timestamp | undefined;
  /**
   * Name of the org to be used in display
   *
   * @generated from field: string display_name = 4;
   */
  displayName: string;
  /**
   * Optional regioncode
   *
   * @generated from field: scalekit.v1.commons.RegionCode region_code = 5;
   */
  regionCode: RegionCode;
  /**
   * External Id is useful to store a unique identifier for a given Org that. The unique Identifier can be the id of your tenant / org in your SaaSApp
   *
   * @generated from field: optional string external_id = 6;
   */
  externalId?: string | undefined;
  /**
   * Key value pairs extension attributes.
   *
   * @generated from field: map<string, string> metadata = 7;
   */
  metadata: {
    [key: string]: string;
  };
  /**
   * Organization Settings
   *
   * @generated from field: scalekit.v1.organizations.OrganizationSettings settings = 8;
   */
  settings?: OrganizationSettings$1 | undefined;
  /**
   * @generated from field: optional string slug = 9;
   */
  slug?: string | undefined;
  /**
   * @generated from field: optional string logo_url = 10;
   */
  logoUrl?: string | undefined;
};
/**
 * For update messages ensure the indexes are same as the base model itself.
 *
 * @generated from message scalekit.v1.organizations.UpdateOrganization
 */
type UpdateOrganization = Message<"scalekit.v1.organizations.UpdateOrganization"> & {
  /**
   * @generated from field: optional string display_name = 4;
   */
  displayName?: string | undefined;
  /**
   * @generated from field: optional string external_id = 6;
   */
  externalId?: string | undefined;
  /**
   * @generated from field: map<string, string> metadata = 7;
   */
  metadata: {
    [key: string]: string;
  };
  /**
   * @generated from field: optional string slug = 9;
   */
  slug?: string | undefined;
  /**
   * @generated from field: optional string logo_url = 10;
   */
  logoUrl?: string | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationResponse
 */
type UpdateOrganizationResponse = Message<"scalekit.v1.organizations.UpdateOrganizationResponse"> & {
  /**
   * @generated from field: scalekit.v1.organizations.Organization organization = 1;
   */
  organization?: Organization | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationResponse
 */
type GetOrganizationResponse = Message<"scalekit.v1.organizations.GetOrganizationResponse"> & {
  /**
   * @generated from field: scalekit.v1.organizations.Organization organization = 1;
   */
  organization?: Organization | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.ListOrganizationsResponse
 */
type ListOrganizationsResponse = Message<"scalekit.v1.organizations.ListOrganizationsResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: repeated scalekit.v1.organizations.Organization organizations = 3;
   */
  organizations: Organization[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.organizations.SearchOrganizationsResponse
 */
type SearchOrganizationsResponse = Message<"scalekit.v1.organizations.SearchOrganizationsResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: repeated scalekit.v1.organizations.Organization organizations = 3;
   */
  organizations: Organization[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.organizations.Link
 */
type Link = Message<"scalekit.v1.organizations.Link"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string location = 2;
   */
  location: string;
  /**
   * @generated from field: google.protobuf.Timestamp expire_time = 3;
   */
  expireTime?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.OrganizationSessionPolicySettings
 */
type OrganizationSessionPolicySettings = Message<"scalekit.v1.organizations.OrganizationSessionPolicySettings"> & {
  /**
   * @generated from field: scalekit.v1.organizations.SessionPolicyType policy_source = 1;
   */
  policySource: SessionPolicyType;
  /**
   * Timeout value interpreted with absolute_session_timeout_unit on write; always returned in minutes on read.
   *
   * @generated from field: google.protobuf.Int32Value absolute_session_timeout = 2;
   */
  absoluteSessionTimeout?: number | undefined;
  /**
   * Unit for absolute_session_timeout: "minutes", "hours", or "days". Responses always use "minutes".
   *
   * @generated from field: optional scalekit.v1.commons.TimeUnit absolute_session_timeout_unit = 3;
   */
  absoluteSessionTimeoutUnit?: TimeUnit$1 | undefined;
  /**
   * @generated from field: google.protobuf.BoolValue idle_session_timeout_enabled = 4;
   */
  idleSessionTimeoutEnabled?: boolean | undefined;
  /**
   * Timeout value interpreted with idle_session_timeout_unit on write; always returned in minutes on read.
   *
   * @generated from field: google.protobuf.Int32Value idle_session_timeout = 5;
   */
  idleSessionTimeout?: number | undefined;
  /**
   * Unit for idle_session_timeout: "minutes", "hours", or "days". Responses always use "minutes".
   *
   * @generated from field: optional scalekit.v1.commons.TimeUnit idle_session_timeout_unit = 6;
   */
  idleSessionTimeoutUnit?: TimeUnit$1 | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.OrganizationUserManagementSettings
 */
type OrganizationUserManagementSettings = Message<"scalekit.v1.organizations.OrganizationUserManagementSettings"> & {
  /**
   * @generated from field: google.protobuf.Int32Value max_allowed_users = 1;
   */
  maxAllowedUsers?: number | undefined;
};
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettings
 */
type OrganizationSettings$1 = Message<"scalekit.v1.organizations.OrganizationSettings"> & {
  /**
   * @generated from field: repeated scalekit.v1.organizations.OrganizationSettingsFeature features = 1;
   */
  features: OrganizationSettingsFeature[];
};
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettingsFeature
 */
type OrganizationSettingsFeature = Message<"scalekit.v1.organizations.OrganizationSettingsFeature"> & {
  /**
   * @generated from field: string name = 1;
   */
  name: string;
  /**
   * @generated from field: bool enabled = 2;
   */
  enabled: boolean;
};
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse
 */
type GetOrganizationUserManagementSettingsResponse = Message<"scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse"> & {
  /**
   * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 1;
   */
  settings?: OrganizationUserManagementSettings | undefined;
};
/**
 * @generated from enum scalekit.v1.organizations.SessionPolicyType
 */
declare enum SessionPolicyType {
  /**
   * @generated from enum value: SESSION_POLICY_TYPE_UNSPECIFIED = 0;
   */
  SESSION_POLICY_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: APPLICATION = 1;
   */
  APPLICATION = 1,
  /**
   * @generated from enum value: CUSTOM = 2;
   */
  CUSTOM = 2
}
//#endregion
//#region src/types/organization.d.ts
type OrganizationSettings = {
  features: Feature[];
};
type Feature = {
  name: string;
  enabled: boolean;
};
type OrganizationUserManagementSettingsInput = {
  maxAllowedUsers?: number | null;
};
type TimeUnit = 'MINUTES' | 'HOURS' | 'DAYS';
type ApplicationSessionPolicyInput = {
  policySource: 'APPLICATION';
};
type CustomSessionPolicyInput = {
  policySource: 'CUSTOM';
  absoluteSessionTimeout: number;
  absoluteSessionTimeoutUnit: TimeUnit;
  idleSessionTimeoutEnabled?: boolean;
  idleSessionTimeout?: number;
  idleSessionTimeoutUnit?: TimeUnit;
};
type OrganizationSessionPolicyInput = ApplicationSessionPolicyInput | CustomSessionPolicyInput;
//#endregion
//#region src/organization.d.ts
/**
 * Client for managing organizations (tenants) in your Scalekit application.
 *
 * Organizations represent your B2B customers or tenants. Each organization can have
 * its own SSO connection, users, and settings. Use this client to perform CRUD
 * operations on organizations and manage organization-level configurations.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const orgClient = scalekitClient.organization;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Organization API Documentation}
 */
declare class OrganizationClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new organization (tenant) in your Scalekit application.
   *
   * Organizations represent your B2B customers. Each organization can have its own
   * SSO connections, users, and configuration. Use the external ID to map Scalekit
   * organizations to your internal system's identifiers.
   *
   * @param {string} name - Display name for the organization (e.g., "Acme Corporation")
   * @param {object} [options] - Optional configuration
   * @param {string} [options.externalId] - Your system's unique identifier for this organization.
   *                                        Useful for mapping to your internal database.
   * @param {string} [options.logoUrl] - Publicly accessible URL of the organization's logo.
   *                                     Used for organization logo branding on hosted pages.
   * @param {string} [options.slug] - DNS-safe slug for the organization (e.g., "acme" or "app.acmecorp.com").
   *                                  Used to expand {{slug}} in template redirect URIs.
   *
   * @returns {Promise<CreateOrganizationResponse>} The created organization with:
   *   - id: Scalekit's unique organization identifier
   *   - displayName: The organization's name
   *   - externalId: Unique Identifier of this organization as identified in your system. (if provided)
   *   - createTime: When the organization was created
   *   - updateTime: When the organization was last updated
   *
   * @example
   * // Create a basic organization
   * const org = await scalekitClient.organization.createOrganization('Acme Corp');
   * console.log('Organization ID:', org.organization.id);
   *
   * @example
   * // Create organization with external ID mapping
   * const org = await scalekitClient.organization.createOrganization(
   *   'Acme Corporation',
   *   { externalId: 'customer_12345' }
   * );
   * // Now you can look up this organization using either Scalekit ID or your external ID
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Create Organization API}
   * @see {@link getOrganization} - Retrieve organization by Scalekit ID
   * @see {@link getOrganizationByExternalId} - Retrieve organization by your external ID
   */
  createOrganization(name: string, options?: {
    externalId?: string;
    logoUrl?: string;
    slug?: string;
  }): Promise<CreateOrganizationResponse>;
  /**
   * Retrieves a paginated list of all organizations in your Scalekit environment.
   *
   * This method returns all organizations with support for pagination. Use this to
   * display a list of your B2B customers, search for organizations, or perform bulk operations.
   *
   * @param {object} [options] - Optional pagination parameters
   * @param {number} [options.pageSize] - Number of organizations to return per page (default: 10, max: 100)
   * @param {string} [options.pageToken] - Token for retrieving the next page of results.
   *                                       Obtained from the previous response's nextPageToken.
   *
   * @returns {Promise<ListOrganizationsResponse>} Response containing:
   *   - organizations: Array of organization objects
   *   - nextPageToken: Token for fetching the next page (empty if no more pages)
   *   - totalSize: Total number of organizations
   *
   * @example
   * // List first page of organizations
   * const response = await scalekitClient.organization.listOrganization({
   *   pageSize: 20
   * });
   *
   * console.log('Organizations:', response.organizations);
   * console.log('Total:', response.totalSize);
   *
   * @example
   * // Paginate through all organizations
   * let pageToken = undefined;
   * let allOrgs = [];
   *
   * do {
   *   const response = await scalekitClient.organization.listOrganization({
   *     pageSize: 50,
   *     pageToken
   *   });
   *
   *   allOrgs.push(...response.organizations);
   *   pageToken = response.nextPageToken;
   * } while (pageToken);
   *
   * console.log('Fetched all organizations:', allOrgs.length);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | List Organizations API}
   * @see {@link getOrganization} - Get a specific organization by ID
   */
  listOrganization(options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListOrganizationsResponse>;
  /**
   * Retrieves detailed information about a specific organization using its Scalekit ID.
   *
   * Use this method to fetch complete organization details including display name, region,
   * metadata, settings, and configuration. This is useful for displaying organization info
   * in your application or checking organization status.
   *
   * @param {string} id - The Scalekit-generated organization identifier (format: "org_...")
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with:
   *     - id: Scalekit's unique identifier
   *     - displayName: Organization's display name
   *     - externalId: Your system's identifier (if set)
   *     - metadata: Custom metadata key-value pairs
   *     - createTime: When the organization was created
   *     - updateTime: When the organization was last updated
   *
   * @throws {Error} If the organization is not found or access is denied
   *
   * @example
   * // Get organization details
   * const response = await scalekitClient.organization.getOrganization('org_12345');
   * const org = response.organization;
   *
   * console.log('Organization:', org.displayName);
   * console.log('External ID:', org.externalId);
   *
   * @example
   * // Check if organization exists before operations
   * try {
   *   const response = await scalekitClient.organization.getOrganization(orgId);
   *   // Proceed with organization operations
   * } catch (error) {
   *   console.error('Organization not found:', error);
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Get Organization API}
   * @see {@link getOrganizationByExternalId} - Retrieve organization using your external ID
   * @see {@link listOrganization} - List all organizations
   */
  getOrganization(id: string): Promise<GetOrganizationResponse>;
  /**
   * Retrieves detailed information about an organization using your system's external identifier.
   *
   * This is particularly useful when you need to look up an organization using your own
   * internal identifiers rather than Scalekit's ID. The external ID is typically set when
   * creating or updating an organization to maintain a mapping between your system and Scalekit.
   *
   * @param {string} externalId - Your system's unique identifier for the organization
   *                               (e.g., "customer_12345", "tenant_abc")
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with all details
   *     (same structure as {@link getOrganization})
   *
   * @throws {Error} If no organization is found with the provided external ID
   *
   * @example
   * // Retrieve organization using your internal customer ID
   * const response = await scalekitClient.organization.getOrganizationByExternalId('customer_12345');
   * const org = response.organization;
   *
   * console.log('Scalekit ID:', org.id);
   * console.log('Organization:', org.displayName);
   *
   * @example
   * // Use in API endpoints where you have your customer ID
   * app.get('/api/customers/:customerId/sso', async (req, res) => {
   *   const { customerId } = req.params;
   *
   *   try {
   *     const response = await scalekitClient.organization.getOrganizationByExternalId(customerId);
   *     res.json({ organization: response.organization });
   *   } catch (error) {
   *     res.status(404).json({ error: 'Organization not found' });
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Get Organization API}
   * @see {@link getOrganization} - Retrieve organization using Scalekit ID
   * @see {@link createOrganization} - Create organization with external ID mapping
   */
  getOrganizationByExternalId(externalId: string): Promise<GetOrganizationResponse>;
  /**
   * Updates an organization's properties using its Scalekit ID.
   *
   * Use this method to modify an organization's display name, external ID, or custom metadata.
   * Only the fields you specify in the update object will be changed; all other fields remain
   * unchanged. Note that the region code cannot be modified once set.
   *
   * @param {string} id - The Scalekit organization identifier (format: "org_...")
   * @param {Partial<UpdateOrganization>} organization - Object containing fields to update:
   *   - displayName?: New display name for the organization
   *   - externalId?: New external ID to map to your system
   *   - metadata?: Custom key-value pairs for storing additional data
   *
   * @returns {Promise<UpdateOrganizationResponse>} Response containing:
   *   - organization: The updated organization object with all current values
   *
   * @throws {Error} If the organization is not found or update fails
   *
   * @example
   * // Update organization display name
   * const response = await scalekitClient.organization.updateOrganization('org_12345', {
   *   displayName: 'Acme Corporation (Updated)'
   * });
   *
   * console.log('Updated:', response.organization.displayName);
   *
   * @example
   * // Add external ID to existing organization
   * await scalekitClient.organization.updateOrganization('org_12345', {
   *   externalId: 'customer_abc'
   * });
   *
   * @example
   * // Update multiple fields including metadata
   * const response = await scalekitClient.organization.updateOrganization('org_12345', {
   *   displayName: 'Acme Corp',
   *   metadata: {
   *     industry: 'Technology',
   *     size: 'Enterprise',
   *     plan: 'Premium'
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization API}
   * @see {@link updateOrganizationByExternalId} - Update using your external ID
   * @see {@link getOrganization} - Retrieve current organization details
   */
  updateOrganization(id: string, organization: Partial<UpdateOrganization>): Promise<UpdateOrganizationResponse>;
  /**
   * Updates an organization's properties using your system's external identifier.
   *
   * This method provides the same functionality as {@link updateOrganization} but allows you
   * to reference the organization using your own internal identifier instead of Scalekit's ID.
   * Only specified fields will be updated; all other fields remain unchanged.
   *
   * @param {string} externalId - Your system's unique identifier for the organization
   * @param {Partial<UpdateOrganization>} organization - Object containing fields to update:
   *   - displayName?: New display name for the organization
   *   - externalId?: New external ID (useful for migrating identifiers)
   *   - metadata?: Custom key-value pairs for storing additional data
   *
   * @returns {Promise<UpdateOrganizationResponse>} Response containing:
   *   - organization: The updated organization object with all current values
   *
   * @throws {Error} If no organization is found with the provided external ID
   *
   * @example
   * // Update organization using your customer ID
   * const response = await scalekitClient.organization.updateOrganizationByExternalId(
   *   'customer_12345',
   *   { displayName: 'New Company Name' }
   * );
   *
   * @example
   * // Update metadata for reporting and analytics
   * await scalekitClient.organization.updateOrganizationByExternalId('customer_12345', {
   *   metadata: {
   *     accountManager: 'john@example.com',
   *     renewalDate: '2025-12-31',
   *     tier: 'enterprise'
   *   }
   * });
   *
   * @example
   * // Use in API endpoints with your customer identifiers
   * app.patch('/api/customers/:customerId', async (req, res) => {
   *   const { customerId } = req.params;
   *   const { name } = req.body;
   *
   *   const response = await scalekitClient.organization.updateOrganizationByExternalId(
   *     customerId,
   *     { displayName: name }
   *   );
   *
   *   res.json({ organization: response.organization });
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization API}
   * @see {@link updateOrganization} - Update using Scalekit ID
   * @see {@link getOrganizationByExternalId} - Retrieve organization by external ID
   */
  updateOrganizationByExternalId(externalId: string, organization: Partial<UpdateOrganization>): Promise<UpdateOrganizationResponse>;
  /**
   * Permanently deletes an organization from your Scalekit environment.
   *
   * This operation removes the organization and all associated data including SSO connections,
   * users, and settings. This action cannot be undone, so use with caution.
   *
   * @param {string} organizationId - The Scalekit organization identifier to delete
   *
   * @returns {Promise<MessageShape<EmptySchema>>} Empty response on successful deletion
   *
   * @throws {Error} If the organization is not found or deletion fails
   *
   * @example
   * // Delete an organization
   * await scalekitClient.organization.deleteOrganization('org_12345');
   * console.log('Organization deleted successfully');
   *
   * @example
   * // Delete with confirmation flow
   * const confirmDelete = await askUserConfirmation(
   *   'Are you sure you want to delete this organization? This cannot be undone.'
   * );
   *
   * if (confirmDelete) {
   *   try {
   *     await scalekitClient.organization.deleteOrganization(orgId);
   *     console.log('Organization deleted');
   *   } catch (error) {
   *     console.error('Failed to delete organization:', error);
   *   }
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Delete Organization API}
   * @see {@link getOrganization} - Check if organization exists before deletion
   */
  deleteOrganization(organizationId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Creates a single use Admin Portal URL valid for 1 minute.
   *
   * Once the generated admin portal URL is accessed or rendered, a temporary session of 6 hours
   * is created to allow the admin to update SSO/SCIM configuration.
   *
   *
   * @param {string} organizationId - The Scalekit organization ID
   *
   * @returns {Promise<Link>} Link object containing:
   *   - location: The complete portal URL to redirect the admin to
   *   - expiresAt: Timestamp when the link expires (60 seconds from generation)
   *
   * @throws {Error} When the link generation fails
   *
   * @example
   * // Generate admin portal link
   * app.get('/admin/sso-settings', async (req, res) => {
   *   const organizationId = req.user.organizationId;
   *
   *   try {
   *     const link = await scalekitClient.organization.generatePortalLink(organizationId);
   *
   *     // Redirect the admin to the portal
   *     res.redirect(link.location);
   *   } catch (error) {
   *     console.error('Failed to generate portal link:', error);
   *     res.status(500).send('Unable to access admin portal');
   *   }
   * });
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Generate Portal Link API}
   * @see {@link https://docs.scalekit.com/authenticate/sso/admin-portal/ | Admin Portal Guide}
   */
  generatePortalLink(organizationId: string): Promise<Link>;
  /**
   * Updates configuration settings and feature flags for an organization.
   *
   * Use this method to enable or disable organization-level features such as SSO configuration,
   * directory synchronization, session management, and other organization-specific settings.
   * This allows you to customize the capabilities available to each organization based on
   * their subscription tier or requirements.
   *
   * @param {string} organizationId - The Scalekit organization identifier (format: "org_...")
   * @param {OrganizationSettings} settings - Configuration settings object containing:
   *   - features: Array of feature objects, each with:
   *     - name: Feature identifier (e.g., "sso", "directory_sync")
   *     - enabled: Boolean flag to enable/disable the feature
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with updated settings
   *
   * @throws {Error} If the organization is not found or settings update fails
   *
   * @example
   * // Enable SSO and directory sync for an organization
   * const response = await scalekitClient.organization.updateOrganizationSettings('org_12345', {
   *   features: [
   *     { name: 'sso', enabled: true },
   *     { name: 'directory_sync', enabled: true }
   *   ]
   * });
   *
   * console.log('Settings updated:', response.organization.settings);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization Settings API}
   * @see {@link getOrganization} - Retrieve current organization settings
   * @see {@link upsertUserManagementSettings} - Update user management settings
   */
  updateOrganizationSettings(organizationId: string, settings: OrganizationSettings): Promise<GetOrganizationResponse>;
  /**
   * Creates or updates user management settings for an organization.
   *
   * This method allows you to configure user-related constraints and policies at the
   * organization level, such as setting a maximum number of allowed users. This is
   * useful for enforcing subscription limits, preventing overuse, or managing capacity.
   * If settings already exist, they will be updated; otherwise, new settings are created.
   *
   * @param {string} organizationId - The Scalekit organization identifier (format: "org_...")
   * @param {OrganizationUserManagementSettingsInput} settings - User management configuration:
   *   - maxAllowedUsers?: Maximum number of users allowed in the organization.
   *                       Set to null or undefined to remove the limit.
   *
   * @returns {Promise<OrganizationUserManagementSettingsMessage | undefined>} The updated settings object containing:
   *   - maxAllowedUsers: The configured user limit (if set)
   *
   * @throws {Error} If the organization is not found or settings update fails
   *
   * @example
   * // Set maximum user limit for an organization
   * const settings = await scalekitClient.organization.upsertUserManagementSettings(
   *   'org_12345',
   *   { maxAllowedUsers: 100 }
   * );
   *
   * console.log('Max users allowed:', settings?.maxAllowedUsers);
   *
   * @example
   * // Remove user limit (set to unlimited)
   * await scalekitClient.organization.upsertUserManagementSettings('org_12345', {
   *   maxAllowedUsers: null
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | User Management Settings API}
   * @see {@link getOrganization} - Retrieve current organization settings
   * @see {@link updateOrganizationSettings} - Update other organization settings
   */
  upsertUserManagementSettings(organizationId: string, settings: OrganizationUserManagementSettingsInput): Promise<OrganizationUserManagementSettings | undefined>;
  /**
   * Searches for organizations matching a query string.
   *
   * @param {string} query - Search query string
   * @param {number} [pageSize] - Number of results per page
   * @param {string} [pageToken] - Pagination token for the next page
   *
   * @returns {Promise<SearchOrganizationsResponse>} Response containing matching organizations
   */
  searchOrganization(query: string, pageSize?: number, pageToken?: string): Promise<SearchOrganizationsResponse>;
  /**
   * Retrieves the user management settings for a specific organization.
   *
   * @param {string} organizationId - The Scalekit organization identifier
   *
   * @returns {Promise<GetOrganizationUserManagementSettingsResponse>} Response containing user management settings
   */
  getOrganizationUserManagementSetting(organizationId: string): Promise<GetOrganizationUserManagementSettingsResponse>;
  /**
   * Sets a custom session policy for an organization or reverts it to application defaults.
   *
   * Send `policySource: 'APPLICATION'` to revert to application-level settings. Send
   * `policySource: 'CUSTOM'` with timeout values to activate a custom policy. The system
   * applies the stricter of application and organization values at session creation time.
   *
   * @param {string} organizationId - The Scalekit organization identifier (format: "org_...")
   * @param {OrganizationSessionPolicyInput} policy - The policy to apply.
   *
   * @returns {Promise<OrganizationSessionPolicySettings>} The updated session policy.
   *
   * @example
   * // Set a custom policy
   * await scalekit.organization.updateOrganizationSessionPolicy('org_12345', {
   *   policySource: 'CUSTOM',
   *   absoluteSessionTimeout: 360,
   *   absoluteSessionTimeoutUnit: 'MINUTES',
   *   idleSessionTimeoutEnabled: true,
   *   idleSessionTimeout: 84,
   *   idleSessionTimeoutUnit: 'MINUTES',
   * });
   *
   * @example
   * // Revert to application defaults
   * await scalekit.organization.updateOrganizationSessionPolicy('org_12345', {
   *   policySource: 'APPLICATION',
   * });
   */
  updateOrganizationSessionPolicy(organizationId: string, policy: OrganizationSessionPolicyInput): Promise<OrganizationSessionPolicySettings>;
  /**
   * Retrieves the session policy for a specific organization.
   *
   * @param {string} organizationId - The Scalekit organization identifier
   *
   * @returns {Promise<OrganizationSessionPolicySettings>} The organization's session policy settings
   *
   * @example
   * const policy = await scalekit.organization.getOrganizationSessionPolicy('org_12345');
   * if (policy.policySource === SessionPolicyType.CUSTOM) {
   *   console.log('Absolute timeout (minutes):', policy.absoluteSessionTimeout);
   * }
   */
  getOrganizationSessionPolicy(organizationId: string): Promise<OrganizationSessionPolicySettings>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/auth/passwordless_pb.d.ts
/**
 * @generated from message scalekit.v1.auth.passwordless.SendPasswordlessResponse
 */
type SendPasswordlessResponse = Message<"scalekit.v1.auth.passwordless.SendPasswordlessResponse"> & {
  /**
   * @generated from field: string auth_request_id = 1;
   */
  authRequestId: string;
  /**
   * @generated from field: int64 expires_at = 2;
   */
  expiresAt: bigint;
  /**
   * @generated from field: uint32 expires_in = 3;
   */
  expiresIn: number;
  /**
   * @generated from field: scalekit.v1.auth.passwordless.PasswordlessType passwordless_type = 4;
   */
  passwordlessType: PasswordlessType;
};
/**
 * @generated from message scalekit.v1.auth.passwordless.VerifyPasswordLessResponse
 */
type VerifyPasswordLessResponse = Message<"scalekit.v1.auth.passwordless.VerifyPasswordLessResponse"> & {
  /**
   * @generated from field: string email = 1;
   */
  email: string;
  /**
   * @generated from field: optional string state = 2;
   */
  state?: string | undefined;
  /**
   * @generated from field: optional scalekit.v1.auth.passwordless.TemplateType template = 3;
   */
  template?: TemplateType | undefined;
  /**
   * @generated from field: scalekit.v1.auth.passwordless.PasswordlessType passwordless_type = 4;
   */
  passwordlessType: PasswordlessType;
};
/**
 * @generated from enum scalekit.v1.auth.passwordless.TemplateType
 */
declare enum TemplateType {
  /**
   * @generated from enum value: UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,
  /**
   * @generated from enum value: SIGNIN = 1;
   */
  SIGNIN = 1,
  /**
   * @generated from enum value: SIGNUP = 2;
   */
  SIGNUP = 2
}
/**
 * @generated from enum scalekit.v1.auth.passwordless.PasswordlessType
 */
declare enum PasswordlessType {
  /**
   * @generated from enum value: PASSWORDLESS_TYPE_UNSPECIFIED = 0;
   */
  PASSWORDLESS_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: OTP = 1;
   */
  OTP = 1,
  /**
   * @generated from enum value: LINK = 2;
   */
  LINK = 2,
  /**
   * @generated from enum value: LINK_OTP = 3;
   */
  LINK_OTP = 3
}
//#endregion
//#region src/passwordless.d.ts
declare class PasswordlessClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Send a passwordless authentication email
   * @param {string} email The email address to send the passwordless link to
   * @param {object} options The options for sending the passwordless email
   * @param {TemplateType} options.template The template type (SIGNIN/SIGNUP)
   * @param {string} options.state Optional state parameter to maintain state between request and callback
   * @param {string} options.magiclinkAuthUri Optional auth URI for magic link authentication
   * @param {number} options.expiresIn Optional expiration time in seconds (default: 3600)
   * @param {object} options.templateVariables Optional template variables
   * @returns {Promise<SendPasswordlessResponse>} The response containing:
   * - authRequestId: Unique identifier for the passwordless authentication request
   * - expiresAt: Expiration time in seconds since epoch
   * - expiresIn: Expiration time in seconds
   * - passwordlessType: Type of passwordless authentication (OTP/LINK/LINK_OTP)
   */
  sendPasswordlessEmail(email: string, options?: {
    template?: TemplateType;
    state?: string;
    magiclinkAuthUri?: string;
    expiresIn?: number;
    templateVariables?: Record<string, string>;
  }): Promise<SendPasswordlessResponse>;
  /**
   * Verify a passwordless authentication code or link token
   * @param {object} credential The credential to verify
   * @param {string} credential.code The one-time code received via email
   * @param {string} credential.linkToken The link token received via email
   * @param {string} [authRequestId] Optional auth request ID from the send response
   * @returns {Promise<VerifyPasswordLessResponse>} The response containing:
   * - email: The email address that was verified
   * - state: Optional state parameter that was passed in the send request
   * - template: The template type used for the authentication
   * - passwordlessType: Type of passwordless authentication used
   */
  verifyPasswordlessEmail(credential: {
    code?: string;
    linkToken?: string;
  }, authRequestId?: string): Promise<VerifyPasswordLessResponse>;
  /**
   * Resend a passwordless authentication email
   * @param {string} authRequestId The auth request ID from the original send response
   * @returns {Promise<SendPasswordlessResponse>} The response containing:
   * - authRequestId: New unique identifier for the passwordless authentication request
   * - expiresAt: New expiration time in seconds since epoch
   * - expiresIn: New expiration time in seconds
   * - passwordlessType: Type of passwordless authentication (OTP/LINK/LINK_OTP)
   */
  resendPasswordlessEmail(authRequestId: string): Promise<SendPasswordlessResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/users/users_pb.d.ts
/**
 * @generated from message scalekit.v1.users.User
 */
type User$1 = Message<"scalekit.v1.users.User"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string environment_id = 2;
   */
  environmentId: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 3;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 4;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: string email = 5;
   */
  email: string;
  /**
   * @generated from field: optional string external_id = 6;
   */
  externalId?: string | undefined;
  /**
   * @generated from field: repeated scalekit.v1.commons.OrganizationMembership memberships = 7;
   */
  memberships: OrganizationMembership[];
  /**
   * @generated from field: scalekit.v1.commons.UserProfile user_profile = 8;
   */
  userProfile?: UserProfile | undefined;
  /**
   * @generated from field: map<string, string> metadata = 9;
   */
  metadata: {
    [key: string]: string;
  };
  /**
   * @generated from field: google.protobuf.Timestamp last_login_time = 10;
   */
  lastLoginTime?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.users.CreateUserAndMembershipResponse
 */
type CreateUserAndMembershipResponse = Message<"scalekit.v1.users.CreateUserAndMembershipResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.User user = 1;
   */
  user?: User$1 | undefined;
};
/**
 * @generated from message scalekit.v1.users.UpdateUserResponse
 */
type UpdateUserResponse = Message<"scalekit.v1.users.UpdateUserResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.User user = 1;
   */
  user?: User$1 | undefined;
};
/**
 * @generated from message scalekit.v1.users.GetUserResponse
 */
type GetUserResponse = Message<"scalekit.v1.users.GetUserResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.User user = 1;
   */
  user?: User$1 | undefined;
};
/**
 * @generated from message scalekit.v1.users.ListOrganizationUsersResponse
 */
type ListOrganizationUsersResponse = Message<"scalekit.v1.users.ListOrganizationUsersResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: repeated scalekit.v1.users.User users = 3;
   */
  users: User$1[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.users.CreateMembershipResponse
 */
type CreateMembershipResponse = Message<"scalekit.v1.users.CreateMembershipResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.User user = 1;
   */
  user?: User$1 | undefined;
};
/**
 * @generated from message scalekit.v1.users.ListUsersResponse
 */
type ListUsersResponse = Message<"scalekit.v1.users.ListUsersResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.users.User users = 1;
   */
  users: User$1[];
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 3;
   */
  totalSize: number;
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.users.SearchUsersResponse
 */
type SearchUsersResponse = Message<"scalekit.v1.users.SearchUsersResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: repeated scalekit.v1.users.User users = 3;
   */
  users: User$1[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.users.UpdateMembershipResponse
 */
type UpdateMembershipResponse = Message<"scalekit.v1.users.UpdateMembershipResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.User user = 1;
   */
  user?: User$1 | undefined;
};
/**
 * @generated from message scalekit.v1.users.SearchOrganizationUsersResponse
 */
type SearchOrganizationUsersResponse = Message<"scalekit.v1.users.SearchOrganizationUsersResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: repeated scalekit.v1.users.User users = 3;
   */
  users: User$1[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.users.Invite
 */
type Invite = Message<"scalekit.v1.users.Invite"> & {
  /**
   * @generated from field: string organization_id = 1;
   */
  organizationId: string;
  /**
   * @generated from field: string user_id = 2;
   */
  userId: string;
  /**
   * @generated from field: optional string inviter_email = 3;
   */
  inviterEmail?: string | undefined;
  /**
   * @generated from field: string status = 4;
   */
  status: string;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 5;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp expires_at = 6;
   */
  expiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp resent_at = 7;
   */
  resentAt?: Timestamp | undefined;
  /**
   * @generated from field: int32 resent_count = 8;
   */
  resentCount: number;
};
/**
 * @generated from message scalekit.v1.users.ResendInviteResponse
 */
type ResendInviteResponse = Message<"scalekit.v1.users.ResendInviteResponse"> & {
  /**
   * @generated from field: scalekit.v1.users.Invite invite = 1;
   */
  invite?: Invite | undefined;
};
/**
 * @generated from message scalekit.v1.users.ListUserRolesResponse
 */
type ListUserRolesResponse = Message<"scalekit.v1.users.ListUserRolesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
   */
  roles: Role$1[];
};
/**
 * @generated from message scalekit.v1.users.AssignUserRolesResponse
 */
type AssignUserRolesResponse = Message<"scalekit.v1.users.AssignUserRolesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
   */
  roles: Role$1[];
};
/**
 * @generated from message scalekit.v1.users.Permission
 */
type Permission$1 = Message<"scalekit.v1.users.Permission"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: repeated string tags = 4;
   */
  tags: string[];
};
/**
 * @generated from message scalekit.v1.users.ListUserPermissionsResponse
 */
type ListUserPermissionsResponse = Message<"scalekit.v1.users.ListUserPermissionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.users.Permission permissions = 1;
   */
  permissions: Permission$1[];
};
//#endregion
//#region src/types/user.d.ts
interface CreateUserRequest {
  email: string;
  externalId?: string;
  phoneNumber?: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
  };
  metadata?: Record<string, string>;
  sendInvitationEmail?: boolean;
}
interface UpdateUserRequest {
  email?: string;
  externalId?: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
  };
  metadata?: Record<string, string>;
}
//#endregion
//#region src/user.d.ts
declare class UserClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new user and adds them as a member of an organization in a single operation.
   *
   * This is the primary method for user provisioning. It creates the user account and establishes
   * their membership in the specified organization. Optionally sends an invitation email to the user
   * with instructions to activate their account.
   *
   * @param {string} organizationId - The organization ID to add the user to
   * @param {CreateUserRequest} options - User creation configuration
   * @param {string} options.email - User's email address (required, must be unique)
   * @param {object} [options.userProfile] - Optional user profile information
   * @param {string} [options.userProfile.firstName] - User's first name
   * @param {string} [options.userProfile.lastName] - User's last name
   * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
   * @param {boolean} [options.sendInvitationEmail=true] - Whether to send invitation email to the user
   *
   * @returns {Promise<CreateUserAndMembershipResponse>} Response containing:
   *   - user: The created user object with profile and membership details
   *
   * @throws {Error} When organizationId is missing or invalid
   * @throws {Error} When email is missing or already exists
   * @throws {Error} When user creation fails
   *
   * @example
   * // Create user with profile and send invitation
   * const response = await scalekitClient.user.createUserAndMembership(
   *   'org_123456',
   *   {
   *     email: 'john.doe@company.com',
   *     userProfile: {
   *       firstName: 'John',
   *       lastName: 'Doe'
   *     },
   *     sendInvitationEmail: true,
   *     metadata: {
   *       department: 'Engineering',
   *       role: 'Developer'
   *     }
   *   }
   * );
   *
   * console.log('User created:', response.user.id);
   *
   * @example
   * // Create user without sending invitation
   * const response = await scalekitClient.user.createUserAndMembership(
   *   'org_123456',
   *   {
   *     email: 'jane.smith@company.com',
   *     sendInvitationEmail: false
   *   }
   * );
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Create User API}
   * @see {@link createMembership} - Add existing user to another organization
   * @see {@link resendInvite} - Resend invitation email to a user
   */
  createUserAndMembership(organizationId: string, options: CreateUserRequest): Promise<CreateUserAndMembershipResponse>;
  /**
   * Retrieves comprehensive details about a specific user including their profile and memberships.
   *
   * Use this method to fetch complete user information including their organization memberships,
   * roles, profile details, and custom metadata. This is useful for displaying user profiles,
   * verifying user access, or checking membership status across organizations.
   *
   * @param {string} userId - The Scalekit-generated user identifier (format: "usr_...")
   *
   * @returns {Promise<GetUserResponse>} Response containing:
   *   - user: Complete user object with:
   *     - id: Scalekit's unique user identifier
   *     - email: User's email address
   *     - userProfile: Profile information (firstName, lastName)
   *     - memberships: Array of organization memberships with roles
   *     - metadata: Custom metadata key-value pairs
   *     - createTime: When the user was created
   *     - updateTime: When the user was last updated
   *
   * @throws {Error} If the user is not found or access is denied
   *
   * @example
   * // Get user details
   * const response = await scalekitClient.user.getUser('usr_123456');
   * const user = response.user;
   *
   * console.log('User:', user.email);
   * console.log('Name:', user.userProfile?.firstName, user.userProfile?.lastName);
   * console.log('Organizations:', user.memberships?.length);
   *
   * @example
   * // Check user's organization memberships
   * const response = await scalekitClient.user.getUser(userId);
   * const userOrgs = response.user.memberships?.map(m => m.organizationId) || [];
   *
   * if (userOrgs.includes('org_12345')) {
   *   console.log('User is a member of this organization');
   * }
   *
   * @example
   * // Display user profile in application
   * app.get('/api/profile', async (req, res) => {
   *   const userId = req.user.id;
   *
   *   try {
   *     const response = await scalekitClient.user.getUser(userId);
   *     res.json({
   *       email: response.user.email,
   *       profile: response.user.userProfile,
   *       organizations: response.user.memberships
   *     });
   *   } catch (error) {
   *     res.status(404).json({ error: 'User not found' });
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Get User API}
   * @see {@link listUsers} - List all users across the environment
   * @see {@link listOrganizationUsers} - List users in a specific organization
   */
  getUser(userId: string): Promise<GetUserResponse>;
  /**
   * Retrieves a paginated list of all users across your Scalekit environment.
   *
   * This method returns all users in your environment regardless of organization membership.
   * It's useful for administrative oversight, auditing, user management interfaces, and
   * searching across all users. Use pagination to efficiently handle large user bases.
   *
   * @param {object} [options] - Optional pagination parameters
   * @param {number} [options.pageSize] - Number of users to return per page (valid range: 10-100, default: 10)
   * @param {string} [options.pageToken] - Token for retrieving the next page of results.
   *                                       Obtained from the previous response's nextPageToken.
   *
   * @returns {Promise<ListUsersResponse>} Response containing:
   *   - users: Array of user objects with profiles and membership details
   *   - nextPageToken: Token for fetching the next page (empty if no more pages)
   *   - totalSize: Total number of users in the environment
   *
   * @example
   * // List first page of users
   * const response = await scalekitClient.user.listUsers({
   *   pageSize: 20
   * });
   *
   * console.log('Users:', response.users.length);
   * console.log('Total users:', response.totalSize);
   *
   * @example
   * // Paginate through all users
   * let pageToken = undefined;
   * let allUsers = [];
   *
   * do {
   *   const response = await scalekitClient.user.listUsers({
   *     pageSize: 50,
   *     pageToken
   *   });
   *
   *   allUsers.push(...response.users);
   *   pageToken = response.nextPageToken;
   * } while (pageToken);
   *
   * console.log('Fetched all users:', allUsers.length);
   *
   * @example
   * // Build user management dashboard
   * app.get('/api/admin/users', async (req, res) => {
   *   const { pageSize = 25, pageToken } = req.query;
   *
   *   try {
   *     const response = await scalekitClient.user.listUsers({
   *       pageSize: parseInt(pageSize),
   *       pageToken
   *     });
   *
   *     res.json({
   *       users: response.users,
   *       nextPageToken: response.nextPageToken,
   *       total: response.totalSize
   *     });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to fetch users' });
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | List Users API}
   * @see {@link listOrganizationUsers} - List users in a specific organization
   * @see {@link getUser} - Get details of a specific user
   */
  listUsers(options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListUsersResponse>;
  /**
   * Updates a user's profile information and custom metadata.
   *
   * Use this method to modify user profile details such as name or to update custom metadata
   * associated with the user. Note that the user's email address and user ID cannot be changed.
   * Only the fields you specify in the update object will be modified; all other fields remain unchanged.
   *
   * @param {string} userId - The Scalekit user identifier (format: "usr_...")
   * @param {UpdateUserRequestType} options - Object containing fields to update:
   *   - userProfile?: Profile information to update
   *     - firstName?: User's first name
   *     - lastName?: User's last name
   *   - metadata?: Custom key-value pairs for storing additional data
   *
   * @returns {Promise<UpdateUserResponse>} Response containing:
   *   - user: The updated user object with all current values
   *
   * @throws {Error} If the user is not found or update fails
   *
   * @example
   * // Update user's name
   * const response = await scalekitClient.user.updateUser('usr_123456', {
   *   userProfile: {
   *     firstName: 'John',
   *     lastName: 'Smith'
   *   }
   * });
   *
   * console.log('Updated user:', response.user.userProfile);
   *
   * @example
   * // Update user metadata only
   * await scalekitClient.user.updateUser('usr_123456', {
   *   metadata: {
   *     department: 'Engineering',
   *     title: 'Senior Developer',
   *     employeeId: 'EMP-12345'
   *   }
   * });
   *
   * @example
   * // Update both profile and metadata
   * const response = await scalekitClient.user.updateUser('usr_123456', {
   *   userProfile: {
   *     firstName: 'Jane',
   *     lastName: 'Doe'
   *   },
   *   metadata: {
   *     phoneNumber: '+1-555-0123',
   *     timezone: 'America/New_York'
   *   }
   * });
   *
   * @example
   * // Update user profile via API endpoint
   * app.patch('/api/users/:userId', async (req, res) => {
   *   const { userId } = req.params;
   *   const { firstName, lastName, metadata } = req.body;
   *
   *   try {
   *     const response = await scalekitClient.user.updateUser(userId, {
   *       userProfile: { firstName, lastName },
   *       metadata
   *     });
   *     res.json({ user: response.user });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to update user' });
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Update User API}
   * @see {@link getUser} - Retrieve current user details
   * @see {@link createUserAndMembership} - Create a new user
   */
  updateUser(userId: string, options: UpdateUserRequest): Promise<UpdateUserResponse>;
  /**
   * Permanently deletes a user from your Scalekit environment.
   *
   * This operation removes the user's profile, all organization memberships, and related data
   * across all organizations. This action is irreversible and cannot be undone. Use with extreme
   * caution, especially in production environments. Consider deactivating users or removing specific
   * memberships instead of full deletion for compliance and audit purposes.
   *
   * @param {string} userId - The Scalekit user identifier to delete (format: "usr_...")
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on successful deletion
   *
   * @throws {Error} If the user is not found or deletion fails
   *
   * @example
   * // Delete a user
   * await scalekitClient.user.deleteUser('usr_123456');
   * console.log('User deleted successfully');
   *
   * @example
   * // Delete user with confirmation flow
   * const confirmDelete = await askUserConfirmation(
   *   'Are you sure you want to permanently delete this user? This action cannot be undone.'
   * );
   *
   * if (confirmDelete) {
   *   try {
   *     await scalekitClient.user.deleteUser(userId);
   *     console.log('User permanently deleted');
   *   } catch (error) {
   *     console.error('Failed to delete user:', error);
   *   }
   * }
   *
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Delete User API}
   * @see {@link deleteMembership} - Remove user from a specific organization only
   * @see {@link getUser} - Check if user exists before deletion
   */
  deleteUser(userId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Adds an existing user as a member of a new organization with specified roles.
   *
   * Use this method to grant organization access to users who already have accounts in your
   * Scalekit environment. This is useful for adding users to additional organizations, managing
   * multi-tenant access, or onboarding existing users to new teams. Optionally sends an invitation
   * email to notify the user of their new organization access.
   *
   * @param {string} organizationId - The organization ID to add the user to (format: "org_...")
   * @param {string} userId - The user ID to add as a member (format: "usr_...")
   * @param {object} [options={}] - Optional membership configuration
   * @param {string[]} [options.roles] - Array of role names to assign to the user
   *                                     (e.g., ['admin', 'editor', 'viewer'])
   * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
   *                                                       for this specific membership
   * @param {boolean} [options.sendInvitationEmail=true] - Whether to send invitation email
   *                                                        notifying the user of new access
   *
   * @returns {Promise<CreateMembershipResponse>} Response containing:
   *   - user: The updated user object including the new membership details
   *
   * @throws {Error} When the user or organization is not found
   * @throws {Error} When the user is already a member of the organization
   *
   * @example
   * // Add user to organization with admin role
   * const response = await scalekitClient.user.createMembership(
   *   'org_123456',
   *   'usr_789012',
   *   {
   *     roles: ['admin'],
   *     sendInvitationEmail: true
   *   }
   * );
   *
   * console.log('Membership created:', response.user.memberships);
   *
   * @example
   * // Add user with multiple roles and metadata
   * await scalekitClient.user.createMembership(
   *   'org_123456',
   *   'usr_789012',
   *   {
   *     roles: ['member', 'billing_admin'],
   *     metadata: {
   *       department: 'Finance',
   *       accessLevel: 'full'
   *     },
   *     sendInvitationEmail: true
   *   }
   * );
   *
   * @example
   * // Add user to organization without sending email
   * await scalekitClient.user.createMembership(
   *   'org_123456',
   *   'usr_789012',
   *   { sendInvitationEmail: false }
   * );
      *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Create Membership API}
   * @see {@link createUserAndMembership} - Create new user with initial membership
   * @see {@link updateMembership} - Modify existing membership roles
   * @see {@link deleteMembership} - Remove user from organization
   */
  createMembership(organizationId: string, userId: string, options?: {
    roles?: string[];
    metadata?: Record<string, string>;
    sendInvitationEmail?: boolean;
  }): Promise<CreateMembershipResponse>;
  /**
   * Removes a user's membership from a specific organization.
   *
   * This operation revokes the user's access to the specified organization while keeping their
   * user account intact. The user remains in the system and can still access other organizations
   * they're a member of. This is the recommended approach when you want to remove access to a
   * specific organization without deleting the entire user account. This action is irreversible.
   *
   * @param {string} organizationId - The organization ID to remove the user from (format: "org_...")
   * @param {string} userId - The user ID to remove (format: "usr_...")
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on successful removal
   *
   * @throws {Error} If the user or organization is not found
   * @throws {Error} If the membership doesn't exist
   *
   * @example
   * // Remove user from organization
   * await scalekitClient.user.deleteMembership('org_123456', 'usr_789012');
   * console.log('User removed from organization');
   *
   * @example
   * // Remove user with confirmation
   * const confirmRemoval = await askUserConfirmation(
   *   'Remove this user from the organization?'
   * );
   *
   * if (confirmRemoval) {
   *   try {
   *     await scalekitClient.user.deleteMembership(organizationId, userId);
   *     console.log('User access revoked');
   *   } catch (error) {
   *     console.error('Failed to remove user:', error);
   *   }
   * }
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Delete Membership API}
   * @see {@link deleteUser} - Permanently delete user from all organizations
   * @see {@link createMembership} - Add user to an organization
   * @see {@link updateMembership} - Modify user's roles in organization
   */
  deleteMembership(organizationId: string, userId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Updates a user's roles and metadata within a specific organization.
   *
   * Use this method to modify a user's permissions by changing their assigned roles or to
   * update membership-specific metadata. This allows you to adjust user access levels,
   * promote/demote users, or track organization-specific information without affecting
   * the user's memberships in other organizations.
   *
   * @param {string} organizationId - The organization ID where the membership exists (format: "org_...")
   * @param {string} userId - The user ID whose membership to update (format: "usr_...")
   * @param {object} [options={}] - Fields to update
   * @param {string[]} [options.roles] - Array of role names to assign (replaces existing roles)
   *                                     (e.g., ['admin'], ['member', 'billing'])
   * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
   *                                                       specific to this membership
   *
   * @returns {Promise<UpdateMembershipResponse>} Response containing:
   *   - user: The updated user object with modified membership details
   *
   * @throws {Error} If the user, organization, or membership is not found
   *
   * @example
   * // Promote user to admin
   * const response = await scalekitClient.user.updateMembership(
   *   'org_123456',
   *   'usr_789012',
   *   { roles: ['admin'] }
   * );
   *
   * console.log('User promoted:', response.user.memberships);
   *
   * @example
   * // Assign multiple roles
   * await scalekitClient.user.updateMembership(
   *   'org_123456',
   *   'usr_789012',
   *   { roles: ['member', 'billing_admin', 'support'] }
   * );
   *
   * @example
   * // Update membership metadata
   * await scalekitClient.user.updateMembership(
   *   'org_123456',
   *   'usr_789012',
   *   {
   *     metadata: {
   *       department: 'Engineering',
   *       team: 'Backend',
   *       startDate: '2025-01-01'
   *     }
   *   }
   * );
   *
   * @example
   * // Update both roles and metadata
   * await scalekitClient.user.updateMembership(
   *   'org_123456',
   *   'usr_789012',
   *   {
   *     roles: ['team_lead', 'developer'],
   *     metadata: {
   *       level: 'senior',
   *       permissions: 'full'
   *     }
   *   }
   * );
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Update Membership API}
   * @see {@link createMembership} - Add user to organization
   * @see {@link deleteMembership} - Remove user from organization
   * @see {@link getUser} - View current user roles and memberships
   */
  updateMembership(organizationId: string, userId: string, options?: {
    roles?: string[];
    metadata?: Record<string, string>;
  }): Promise<UpdateMembershipResponse>;
  /**
   * Retrieves a paginated list of all users who are members of a specific organization.
   *
   * This method returns all users with access to the specified organization, including their
   * roles, membership details, and profiles. This is useful for displaying team member lists,
   * managing organization access, or building user management interfaces. Use pagination to
   * efficiently handle organizations with large member counts.
   *
   * @param {string} organizationId - The organization ID to list users from (format: "org_...")
   * @param {object} [options] - Optional pagination parameters
   * @param {number} [options.pageSize] - Number of users to return per page (valid range: 1-100)
   * @param {string} [options.pageToken] - Token for retrieving the next page of results.
   *                                       Obtained from the previous response's nextPageToken.
   *
   * @returns {Promise<ListOrganizationUsersResponse>} Response containing:
   *   - users: Array of user objects with profiles, roles, and membership details
   *   - nextPageToken: Token for fetching the next page (empty if no more pages)
   *   - totalSize: Total number of users in the organization
   *
   * @throws {Error} If the organization is not found
   *
   * @example
   * // List first page of organization users
   * const response = await scalekitClient.user.listOrganizationUsers('org_123456', {
   *   pageSize: 25
   * });
   *
   * console.log('Organization users:', response.users.length);
   * console.log('Total members:', response.totalSize);
   *
   * @example
   * // Paginate through all organization members
   * let pageToken = undefined;
   * let allMembers = [];
   *
   * do {
   *   const response = await scalekitClient.user.listOrganizationUsers(
   *     'org_123456',
   *     { pageSize: 50, pageToken }
   *   );
   *
   *   allMembers.push(...response.users);
   *   pageToken = response.nextPageToken;
   * } while (pageToken);
   *
   * console.log('All organization members:', allMembers.length);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | List Organization Users API}
   * @see {@link listUsers} - List all users across the environment
   * @see {@link getUser} - Get details of a specific user
   * @see {@link createMembership} - Add user to organization
   */
  listOrganizationUsers(organizationId: string, options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListOrganizationUsersResponse>;
  /**
   * Resends an invitation email to a user for a specific organization.
   *
   * Use this method when a user hasn't received or has lost their invitation email. If the
   * original invitation is still valid, a reminder email will be sent. If the invitation has
   * expired, a new invitation with a secure magic link will be created and sent. This is useful
   * for helping users who need to complete their account setup or activate their organization access.
   *
   * @param {string} organizationId - The organization ID for which to resend the invite (format: "org_...")
   * @param {string} userId - The user ID who should receive the invite (format: "usr_...")
   *
   * @returns {Promise<ResendInviteResponse>} Response containing:
   *   - invite: The invitation details including status and expiration
   *
   * @throws {Error} When organizationId is missing or invalid
   * @throws {Error} When userId is missing or invalid
   * @throws {Error} When the user or organization is not found
   * @throws {Error} When the membership doesn't exist
   *
   * @example
   * // Resend invitation to a user
   * const response = await scalekitClient.user.resendInvite('org_123456', 'usr_789012');
   * console.log('Invitation resent:', response.invite);
   *
   * @example
   * // Resend invitation with error handling
   * try {
   *   await scalekitClient.user.resendInvite(organizationId, userId);
   *   console.log('Invitation email sent successfully');
   * } catch (error) {
   *   console.error('Failed to resend invitation:', error);
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | Resend Invite API}
   * @see {@link createUserAndMembership} - Create user with initial invitation
   * @see {@link createMembership} - Add user to organization with invitation option
   * @see {@link getUser} - Check user's invitation status
   */
  resendInvite(organizationId: string, userId: string): Promise<ResendInviteResponse>;
  /**
   * Lists all roles assigned to a user within a specific organization.
   *
   * Use this method to retrieve the complete set of roles that have been granted to a user
   * in a given organization. This is useful for authorization checks, displaying user
   * permissions in a management UI, or auditing access control assignments.
   *
   * @param {string} organizationId - The organization ID to query roles for (format: "org_...")
   * @param {string} userId - The user ID whose roles to list (format: "usr_...")
   *
   * @returns {Promise<ListUserRolesResponse>} Response containing:
   *   - roles: Array of Role objects assigned to the user in the organization
   *
   * @throws {ScalekitServerException} When the request fails (e.g. org or user not found)
   * @throws {Error} When organizationId is missing
   * @throws {Error} When userId is missing
   *
   * @example
   * // List roles for a user in an organization
   * const response = await scalekitClient.user.listUserRoles('org_123456', 'usr_789012');
   * console.log('Roles:', response.roles.map(r => r.name));
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | User Roles API}
   * @see {@link listUserPermissions} - List effective permissions for the user
   * @see {@link updateMembership} - Update the roles assigned to a user
   */
  listUserRoles(organizationId: string, userId: string): Promise<ListUserRolesResponse>;
  /**
   * Lists all effective permissions for a user within a specific organization.
   *
   * Use this method to retrieve the complete set of permissions that a user has been
   * granted in a given organization, including those derived from their assigned roles.
   * This is useful for fine-grained authorization checks and auditing access.
   *
   * @param {string} organizationId - The organization ID to query permissions for (format: "org_...")
   * @param {string} userId - The user ID whose permissions to list (format: "usr_...")
   *
   * @returns {Promise<ListUserPermissionsResponse>} Response containing:
   *   - permissions: Array of Permission objects effective for the user in the organization
   *
   * @throws {ScalekitServerException} When the request fails (e.g. org or user not found)
   * @throws {Error} When organizationId is missing
   * @throws {Error} When userId is missing
   *
   * @example
   * // List permissions for a user in an organization
   * const response = await scalekitClient.user.listUserPermissions('org_123456', 'usr_789012');
   * console.log('Permissions:', response.permissions.map(p => p.name));
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/users | User Permissions API}
   * @see {@link listUserRoles} - List roles assigned to the user
   */
  listUserPermissions(organizationId: string, userId: string): Promise<ListUserPermissionsResponse>;
  /**
   * Searches for users matching a query string across the environment.
   *
   * @param {string} query - Search query string
   * @param {number} [pageSize] - Number of results per page
   * @param {string} [pageToken] - Pagination token for the next page
   *
   * @returns {Promise<SearchUsersResponse>} Response containing matching users
   */
  searchUsers(query: string, pageSize?: number, pageToken?: string): Promise<SearchUsersResponse>;
  /**
   * Searches for users matching a query string within a specific organization.
   *
   * @param {string} organizationId - The organization ID to search within
   * @param {string} query - Search query string
   * @param {number} [pageSize] - Number of results per page
   * @param {string} [pageToken] - Pagination token for the next page
   *
   * @returns {Promise<SearchOrganizationUsersResponse>} Response containing matching users
   */
  searchOrganizationUsers(organizationId: string, query: string, pageSize?: number, pageToken?: string): Promise<SearchOrganizationUsersResponse>;
  /**
   * Assigns roles to a user within a specific organization.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} userId - The user ID to assign roles to
   * @param {string[]} roles - Array of role names to assign
   *
   * @returns {Promise<AssignUserRolesResponse>} Response containing the updated roles
   */
  assignUserRoles(organizationId: string, userId: string, roles: string[]): Promise<AssignUserRolesResponse>;
  /**
   * Removes a specific role from a user within an organization.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} userId - The user ID to remove the role from
   * @param {string} roleName - The name of the role to remove
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   */
  removeUserRole(organizationId: string, userId: string, roleName: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Retrieves a user by their external ID.
   *
   * @param {string} externalId - The external identifier for the user
   * @returns {Promise<GetUserResponse>} Response containing the user details
   */
  getUserByExternalId(externalId: string): Promise<GetUserResponse>;
  /**
   * Updates a user identified by their external ID.
   *
   * @param {string} externalId - The external identifier for the user
   * @param {UpdateUserRequestType} options - Fields to update
   * @returns {Promise<UpdateUserResponse>} Response containing the updated user
   */
  updateUserByExternalId(externalId: string, options: Omit<UpdateUserRequest, 'externalId'>): Promise<UpdateUserResponse>;
  /**
   * Permanently deletes a user identified by their external ID.
   *
   * @param {string} externalId - The external identifier for the user
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   */
  deleteUserByExternalId(externalId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Adds a user identified by external ID as a member of an organization.
   *
   * @param {string} organizationId - The organization ID to add the user to
   * @param {string} externalId - The external identifier for the user
   * @param {object} [options={}] - Optional membership configuration
   * @param {string[]} [options.roles] - Array of role names to assign
   * @param {Record<string, string>} [options.metadata] - Custom metadata for this membership
   * @param {boolean} [options.sendInvitationEmail] - Whether to send invitation email
   * @returns {Promise<CreateMembershipResponse>} Response containing the updated user
   */
  createMembershipByExternalId(organizationId: string, externalId: string, options?: {
    roles?: string[];
    metadata?: Record<string, string>;
    sendInvitationEmail?: boolean;
  }): Promise<CreateMembershipResponse>;
  /**
   * Removes the membership of a user identified by external ID from an organization.
   *
   * @param {string} organizationId - The organization ID to remove the user from
   * @param {string} externalId - The external identifier for the user
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   */
  deleteMembershipByExternalId(organizationId: string, externalId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Updates the membership of a user identified by external ID within an organization.
   *
   * @param {string} organizationId - The organization ID where the membership exists
   * @param {string} externalId - The external identifier for the user
   * @param {object} [options={}] - Fields to update
   * @param {string[]} [options.roles] - Array of role names to assign (replaces existing)
   * @param {Record<string, string>} [options.metadata] - Custom metadata for this membership
   * @returns {Promise<UpdateMembershipResponse>} Response containing the updated user
   */
  updateMembershipByExternalId(organizationId: string, externalId: string, options?: {
    roles?: string[];
    metadata?: Record<string, string>;
  }): Promise<UpdateMembershipResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/sessions/sessions_pb.d.ts
/**
 * @generated from message scalekit.v1.sessions.RevokeSessionResponse
 */
type RevokeSessionResponse = Message<"scalekit.v1.sessions.RevokeSessionResponse"> & {
  /**
   * @generated from field: scalekit.v1.sessions.RevokedSessionDetails revoked_session = 1;
   */
  revokedSession?: RevokedSessionDetails | undefined;
};
/**
 * @generated from message scalekit.v1.sessions.RevokeAllUserSessionsResponse
 */
type RevokeAllUserSessionsResponse = Message<"scalekit.v1.sessions.RevokeAllUserSessionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.sessions.RevokedSessionDetails revoked_sessions = 1;
   */
  revokedSessions: RevokedSessionDetails[];
  /**
   * @generated from field: uint32 total_revoked = 2;
   */
  totalRevoked: number;
};
/**
 * @generated from message scalekit.v1.sessions.UserSessionDetails
 */
type UserSessionDetails = Message<"scalekit.v1.sessions.UserSessionDetails"> & {
  /**
   * @generated from field: repeated scalekit.v1.sessions.SessionDetails sessions = 1;
   */
  sessions: SessionDetails[];
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: uint32 total_size = 4;
   */
  totalSize: number;
};
/**
 * @generated from message scalekit.v1.sessions.SessionDetails
 */
type SessionDetails = Message<"scalekit.v1.sessions.SessionDetails"> & {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId: string;
  /**
   * @generated from field: string user_id = 2;
   */
  userId: string;
  /**
   * @generated from field: repeated string authenticated_organizations = 3;
   */
  authenticatedOrganizations: string[];
  /**
   * @generated from field: string organization_id = 4;
   */
  organizationId: string;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 5;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 6;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp idle_expires_at = 7;
   */
  idleExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp absolute_expires_at = 8;
   */
  absoluteExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp expired_at = 9;
   */
  expiredAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp logout_at = 10;
   */
  logoutAt?: Timestamp | undefined;
  /**
   * @generated from field: string status = 11;
   */
  status: string;
  /**
   * @generated from field: scalekit.v1.sessions.DeviceDetails device = 12;
   */
  device?: DeviceDetails | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp last_active_at = 13;
   */
  lastActiveAt?: Timestamp | undefined;
  /**
   * @generated from field: repeated scalekit.v1.sessions.AuthenticatedClients authenticated_clients = 14;
   */
  authenticatedClients: AuthenticatedClients[];
};
/**
 * @generated from message scalekit.v1.sessions.DeviceDetails
 */
type DeviceDetails = Message<"scalekit.v1.sessions.DeviceDetails"> & {
  /**
   * @generated from field: string user_agent = 12;
   */
  userAgent: string;
  /**
   * @generated from field: string os = 13;
   */
  os: string;
  /**
   * @generated from field: string os_version = 14;
   */
  osVersion: string;
  /**
   * @generated from field: string browser = 15;
   */
  browser: string;
  /**
   * @generated from field: string browser_version = 16;
   */
  browserVersion: string;
  /**
   * @generated from field: string device_type = 17;
   */
  deviceType: string;
  /**
   * @generated from field: string ip = 19;
   */
  ip: string;
  /**
   * @generated from field: scalekit.v1.sessions.Location location = 20;
   */
  location?: Location | undefined;
};
/**
 * @generated from message scalekit.v1.sessions.RevokedSessionDetails
 */
type RevokedSessionDetails = Message<"scalekit.v1.sessions.RevokedSessionDetails"> & {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId: string;
  /**
   * @generated from field: string user_id = 2;
   */
  userId: string;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 5;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 6;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp idle_expires_at = 7;
   */
  idleExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp absolute_expires_at = 8;
   */
  absoluteExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp expired_at = 9;
   */
  expiredAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp logout_at = 10;
   */
  logoutAt?: Timestamp | undefined;
  /**
   * @generated from field: string status = 11;
   */
  status: string;
  /**
   * @generated from field: google.protobuf.Timestamp last_active_at = 12;
   */
  lastActiveAt?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.sessions.Location
 */
type Location = Message<"scalekit.v1.sessions.Location"> & {
  /**
   * @generated from field: string region = 1;
   */
  region: string;
  /**
   * @generated from field: string region_subdivision = 2;
   */
  regionSubdivision: string;
  /**
   * @generated from field: string city = 3;
   */
  city: string;
  /**
   * @generated from field: string latitude = 4;
   */
  latitude: string;
  /**
   * @generated from field: string longitude = 5;
   */
  longitude: string;
};
/**
 * AuthenticatedClients represents an authenticated client in a session along with its organization context.
 *
 * @generated from message scalekit.v1.sessions.AuthenticatedClients
 */
type AuthenticatedClients = Message<"scalekit.v1.sessions.AuthenticatedClients"> & {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;
  /**
   * @generated from field: string organization_id = 2;
   */
  organizationId: string;
};
//#endregion
//#region src/session.d.ts
declare class SessionClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Retrieves comprehensive metadata and status for a specific user session.
   *
   * Fetches complete session information including authentication status, device details,
   * IP address, geolocation, and expiration timelines.
   *
   * @param {string} sessionId - The session identifier to retrieve (format: "ses_...")
   *
   * @returns {Promise<SessionDetails>} Session details containing:
   *   - sessionId: Unique session identifier
   *   - userId: User who owns this session
   *   - organizationId: Organization context for the session
   *   - status: Current session status ('active', 'expired', 'revoked', 'logout')
   *   - deviceInfo: Browser and operating system information
   *   - ipAddress: IP address from which session was created
   *   - geoLocation: Geographic location data (city, region, country)
   *   - createTime: When the session was created
   *   - lastActivityTime: Most recent session activity
   *   - idleExpirationTime: When session expires due to inactivity
   *   - absoluteExpirationTime: Maximum session lifetime
   *   - expirationTime: Actual expiration time (if session has ended)
   *
   * @throws {Error} If the session is not found
   *
   * @example
   * // Get session details
   * const session = await scalekitClient.session.getSession('ses_123456');
   *
   * console.log('Status:', session.status);
   * console.log('User:', session.userId);
   * console.log('Device:', session.deviceInfo);
   * console.log('Location:', session.geoLocation);
   * console.log('Last active:', session.lastActivityTime);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Get Session API}
   * @see {@link getUserSessions} - List all sessions for a user
   * @see {@link revokeSession} - Revoke this session
   */
  getSession(sessionId: string): Promise<SessionDetails>;
  /**
   * Retrieves a paginated list of all sessions for a specific user across all devices and browsers.
   *
   * Lists all user sessions with support for filtering by status and time range. Essential for
   * displaying active sessions in account management, auditing user activity, verifying authentication
   * across devices, or identifying suspicious sessions. Use filtering to find active sessions,
   * sessions from specific time periods, or sessions with particular statuses.
   *
   * @param {string} userId - The user identifier (format: "usr_...")
   * @param {object} [options] - Optional pagination and filtering parameters
   * @param {number} [options.pageSize] - Number of sessions to return per page
   * @param {string} [options.pageToken] - Token for retrieving the next page from previous response
   * @param {object} [options.filter] - Filter criteria for sessions
   * @param {string[]} [options.filter.status] - Filter by status values: 'active', 'expired', 'revoked', 'logout'
   *                                             (multiple values use OR logic)
   * @param {Date} [options.filter.startTime] - Include sessions created on or after this time
   * @param {Date} [options.filter.endTime] - Include sessions created before this time
   *                                           (must be after startTime)
   *
   * @returns {Promise<UserSessionDetails>} Response containing:
   *   - sessions: Array of session objects with device info, location, and status
   *   - nextPageToken: Token for fetching the next page
   *   - totalSize: Total number of sessions matching the filter
   *
   * @example
   * // List all active sessions for a user
   * const response = await scalekitClient.session.getUserSessions('usr_123456', {
   *   filter: { status: ['active'] },
   *   pageSize: 20
   * });
   *
   * console.log(`User has ${response.totalSize} active sessions`);
   * response.sessions.forEach(session => {
   *   console.log(`- ${session.deviceInfo} from ${session.geoLocation?.city}`);
   *   console.log(`  Last active: ${session.lastActivityTime}`);
   * });
   *
   * @example
   * // Get all sessions (active and inactive)
   * const response = await scalekitClient.session.getUserSessions('usr_123456');
   * console.log(`Total sessions: ${response.totalSize}`);
   *
   * @example
   * // Find sessions from the last 7 days
   * const sevenDaysAgo = new Date();
   * sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
   *
   * const response = await scalekitClient.session.getUserSessions('usr_123456', {
   *   filter: {
   *     startTime: sevenDaysAgo,
   *     status: ['active', 'logout']
   *   }
   * });
   *
   * console.log(`Sessions in last 7 days: ${response.sessions.length}`);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | List User Sessions API}
   * @see {@link getSession} - Get details of a specific session
   * @see {@link revokeSession} - Revoke a specific session
   * @see {@link revokeAllUserSessions} - Revoke all sessions for user
   */
  getUserSessions(userId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    filter?: {
      status?: string[];
      startTime?: Date;
      endTime?: Date;
    };
  }): Promise<UserSessionDetails>;
  /**
   * Immediately invalidates a specific user session by setting its status to 'revoked'.
   *
   * Terminates a single session, forcing the user to re-authenticate on that specific device.
   * Use this for session-level logout, terminating suspicious sessions, forcing re-authentication
   * on specific devices, or implementing "logout from this device" functionality. The revocation
   * is instantaneous and irreversible - once revoked, the session cannot be used for any future
   * API requests or application access.
   *
   * @param {string} sessionId - The session identifier to revoke (format: "ses_...")
   *
   * @returns {Promise<RevokeSessionResponse>} Response containing:
   *   - sessionId: The ID of the revoked session
   *   - userId: User who owned the session
   *   - revokedAt: Timestamp when the session was revoked
   *   - status: Updated session status ('revoked')
   *
   * @throws {Error} If the session is not found
   *
   * @example
   * // Revoke a specific session
   * const response = await scalekitClient.session.revokeSession('ses_123456');
   * console.log('Session revoked at:', response.revokedAt);
   * console.log('Status:', response.status); // 'revoked'
   *
   * @example
   * // Logout from specific device
   * app.post('/api/sessions/:sessionId/logout', async (req, res) => {
   *   const { sessionId } = req.params;
   *
   *   try {
   *     await scalekitClient.session.revokeSession(sessionId);
   *     res.json({ message: 'Session terminated successfully' });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to revoke session' });
   *   }
   * });
   *
   * @example
   * // Revoke suspicious session
   * const session = await scalekitClient.session.getSession(sessionId);
   *
   * if (session.geoLocation?.country !== expectedCountry) {
   *   console.log('Suspicious session detected');
   *   console.log(`Location: ${session.geoLocation?.city}, ${session.geoLocation?.country}`);
   *   console.log(`IP: ${session.ipAddress}`);
   *
   *   await scalekitClient.session.revokeSession(sessionId);
   *   console.log('Session revoked for security');
   *
   *   // Send security alert to user
   *   await sendSecurityAlert(session.userId, {
   *     message: 'Unusual login location detected and session terminated',
   *     location: session.geoLocation
   *   });
   * }
   *
   * @example
   * // Revoke all non-current sessions for a user
   * const response = await scalekitClient.session.getUserSessions(userId, {
   *   filter: { status: ['active'] }
   * });
   *
   * for (const session of response.sessions) {
   *   if (session.sessionId !== currentSessionId) {
   *     await scalekitClient.session.revokeSession(session.sessionId);
   *     console.log(`Revoked session from: ${session.deviceInfo}`);
   *   }
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Revoke Session API}
   * @see {@link revokeAllUserSessions} - Revoke all sessions for a user
   * @see {@link getUserSessions} - List user sessions to find suspicious ones
   * @see {@link getSession} - Get session details before revoking
   */
  revokeSession(sessionId: string): Promise<RevokeSessionResponse>;
  /**
   * Immediately invalidates all active sessions for a user across all devices and browsers.
   *
   * Terminates all active sessions simultaneously, forcing the user to re-authenticate everywhere.
   * Use this to implement global logout, force re-authentication after security incidents (password
   * compromise, suspicious activity), terminate all sessions following password reset, or revoke
   * access after account changes. Only active sessions are revoked; already expired, logout, or
   * previously revoked sessions remain unchanged. This operation is atomic, instantaneous, and
   * cannot be undone.
   *
   * @param {string} userId - The user identifier whose sessions should be revoked (format: "usr_...")
   *
   * @returns {Promise<RevokeAllUserSessionsResponse>} Response containing:
   *   - revokedSessions: Array of all revoked session objects with details
   *   - totalCount: Number of sessions that were revoked
   *   - revokedAt: Timestamp when revocation occurred
   *
   * @throws {Error} When userId is missing or invalid
   * @throws {Error} If the user is not found
   *
   * @example
   * // Revoke all user sessions (global logout)
   * const response = await scalekitClient.session.revokeAllUserSessions('usr_123456');
   *
   * console.log(`Revoked ${response.totalCount} sessions`);
   * console.log('User must re-authenticate on all devices');
   *
   * @example
   * // Force logout after password reset
   * app.post('/api/users/:userId/reset-password', async (req, res) => {
   *   const { userId } = req.params;
   *   const { newPassword } = req.body;
   *
   *   try {
   *     // Update password
   *     await updateUserPassword(userId, newPassword);
   *
   *     // Revoke all existing sessions
   *     const response = await scalekitClient.session.revokeAllUserSessions(userId);
   *
   *     res.json({
   *       message: 'Password updated successfully',
   *       sessionsRevoked: response.totalCount,
   *       note: 'Please log in again with your new password'
   *     });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to reset password' });
   *   }
   * });
   *
   * @example
   * // Force re-authentication after role change
   * async function updateUserRole(userId, newRole) {
   *   await updateRole(userId, newRole);
   *
   *   // Force re-authentication to apply new permissions
   *   await scalekitClient.session.revokeAllUserSessions(userId);
   *   console.log('User will re-authenticate with new role permissions');
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Revoke All Sessions API}
   * @see {@link revokeSession} - Revoke a specific session
   * @see {@link getUserSessions} - View user's active sessions before revoking
   */
  revokeAllUserSessions(userId: string): Promise<RevokeAllUserSessionsResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/roles/roles_pb.d.ts
/**
 * @generated from message scalekit.v1.roles.Role
 */
type Role = Message<"scalekit.v1.roles.Role"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string display_name = 3;
   */
  displayName: string;
  /**
   * @generated from field: string description = 4;
   */
  description: string;
  /**
   * @generated from field: bool default_creator = 6;
   */
  defaultCreator: boolean;
  /**
   * @generated from field: bool default_member = 7;
   */
  defaultMember: boolean;
  /**
   * @generated from field: optional string extends = 8;
   */
  extends?: string | undefined;
  /**
   * @generated from field: repeated scalekit.v1.roles.RolePermission permissions = 9;
   */
  permissions: RolePermission[];
  /**
   * @generated from field: int32 dependent_roles_count = 10;
   */
  dependentRolesCount: number;
  /**
   * @generated from field: bool is_org_role = 11;
   */
  isOrgRole: boolean;
};
/**
 * @generated from message scalekit.v1.roles.CreateRole
 */
type CreateRole = Message<"scalekit.v1.roles.CreateRole"> & {
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string display_name = 3;
   */
  displayName: string;
  /**
   * @generated from field: optional string description = 4;
   */
  description?: string | undefined;
  /**
   * @generated from field: optional string extends = 8;
   */
  extends?: string | undefined;
  /**
   * @generated from field: repeated string permissions = 9;
   */
  permissions: string[];
};
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRole
 */
type CreateOrganizationRole = Message<"scalekit.v1.roles.CreateOrganizationRole"> & {
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string display_name = 3;
   */
  displayName: string;
  /**
   * @generated from field: optional string description = 4;
   */
  description?: string | undefined;
  /**
   * @generated from field: optional string extends = 8;
   */
  extends?: string | undefined;
  /**
   * @generated from field: repeated string permissions = 9;
   */
  permissions: string[];
};
/**
 * @generated from message scalekit.v1.roles.CreateRoleResponse
 */
type CreateRoleResponse = Message<"scalekit.v1.roles.CreateRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.GetRoleResponse
 */
type GetRoleResponse = Message<"scalekit.v1.roles.GetRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.ListRolesResponse
 */
type ListRolesResponse = Message<"scalekit.v1.roles.ListRolesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
   */
  roles: Role[];
};
/**
 * @generated from message scalekit.v1.roles.UpdateRole
 */
type UpdateRole = Message<"scalekit.v1.roles.UpdateRole"> & {
  /**
   * @generated from field: optional string display_name = 1;
   */
  displayName?: string | undefined;
  /**
   * @generated from field: optional string description = 2;
   */
  description?: string | undefined;
  /**
   * @generated from field: optional string extends = 6;
   */
  extends?: string | undefined;
  /**
   * @generated from field: repeated string permissions = 7;
   */
  permissions: string[];
};
/**
 * @generated from message scalekit.v1.roles.UpdateRoleResponse
 */
type UpdateRoleResponse = Message<"scalekit.v1.roles.UpdateRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRoleResponse
 */
type CreateOrganizationRoleResponse = Message<"scalekit.v1.roles.CreateOrganizationRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleResponse
 */
type GetOrganizationRoleResponse = Message<"scalekit.v1.roles.GetOrganizationRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.ListOrganizationRolesResponse
 */
type ListOrganizationRolesResponse = Message<"scalekit.v1.roles.ListOrganizationRolesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
   */
  roles: Role[];
};
/**
 * @generated from message scalekit.v1.roles.UpdateOrganizationRoleResponse
 */
type UpdateOrganizationRoleResponse = Message<"scalekit.v1.roles.UpdateOrganizationRoleResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role role = 1;
   */
  role?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.GetRoleUsersCountResponse
 */
type GetRoleUsersCountResponse = Message<"scalekit.v1.roles.GetRoleUsersCountResponse"> & {
  /**
   * @generated from field: int64 count = 1;
   */
  count: bigint;
};
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleUsersCountResponse
 */
type GetOrganizationRoleUsersCountResponse = Message<"scalekit.v1.roles.GetOrganizationRoleUsersCountResponse"> & {
  /**
   * @generated from field: int64 count = 1;
   */
  count: bigint;
};
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRolesResponse
 */
type UpdateDefaultRolesResponse = Message<"scalekit.v1.roles.UpdateDefaultRolesResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role default_creator = 1;
   */
  defaultCreator?: Role | undefined;
  /**
   * @generated from field: scalekit.v1.roles.Role default_member = 2;
   */
  defaultMember?: Role | undefined;
};
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse
 */
type UpdateDefaultOrganizationRolesResponse = Message<"scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Role default_member = 2;
   */
  defaultMember?: Role | undefined;
};
/**
 * Permission Entity
 *
 * @generated from message scalekit.v1.roles.Permission
 */
type Permission = Message<"scalekit.v1.roles.Permission"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 4;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 5;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: bool is_scalekit_permission = 6;
   */
  isScalekitPermission: boolean;
};
/**
 * RolePermissions represents a permission with role source information
 *
 * @generated from message scalekit.v1.roles.RolePermission
 */
type RolePermission = Message<"scalekit.v1.roles.RolePermission"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 4;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 5;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: string role_name = 6;
   */
  roleName: string;
};
/**
 * @generated from message scalekit.v1.roles.CreatePermission
 */
type CreatePermission = Message<"scalekit.v1.roles.CreatePermission"> & {
  /**
   * @generated from field: string name = 1;
   */
  name: string;
  /**
   * @generated from field: string description = 2;
   */
  description: string;
};
/**
 * @generated from message scalekit.v1.roles.CreatePermissionResponse
 */
type CreatePermissionResponse = Message<"scalekit.v1.roles.CreatePermissionResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Permission permission = 1;
   */
  permission?: Permission | undefined;
};
/**
 * @generated from message scalekit.v1.roles.GetPermissionResponse
 */
type GetPermissionResponse = Message<"scalekit.v1.roles.GetPermissionResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Permission permission = 1;
   */
  permission?: Permission | undefined;
};
/**
 * @generated from message scalekit.v1.roles.UpdatePermissionResponse
 */
type UpdatePermissionResponse = Message<"scalekit.v1.roles.UpdatePermissionResponse"> & {
  /**
   * @generated from field: scalekit.v1.roles.Permission permission = 1;
   */
  permission?: Permission | undefined;
};
/**
 * @generated from message scalekit.v1.roles.ListPermissionsResponse
 */
type ListPermissionsResponse = Message<"scalekit.v1.roles.ListPermissionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
   */
  permissions: Permission[];
  /**
   * @generated from field: string prev_page_token = 2;
   */
  prevPageToken: string;
  /**
   * @generated from field: string next_page_token = 3;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 4;
   */
  totalSize: number;
};
/**
 * @generated from message scalekit.v1.roles.ListRolePermissionsResponse
 */
type ListRolePermissionsResponse = Message<"scalekit.v1.roles.ListRolePermissionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
   */
  permissions: Permission[];
};
/**
 * @generated from message scalekit.v1.roles.AddPermissionsToRoleResponse
 */
type AddPermissionsToRoleResponse = Message<"scalekit.v1.roles.AddPermissionsToRoleResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
   */
  permissions: Permission[];
};
/**
 * @generated from message scalekit.v1.roles.ListEffectiveRolePermissionsResponse
 */
type ListEffectiveRolePermissionsResponse = Message<"scalekit.v1.roles.ListEffectiveRolePermissionsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
   */
  permissions: Permission[];
};
/**
 * @generated from message scalekit.v1.roles.ListDependentRolesResponse
 */
type ListDependentRolesResponse = Message<"scalekit.v1.roles.ListDependentRolesResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
   */
  roles: Role[];
};
//#endregion
//#region src/role.d.ts
/**
 * Client for managing roles at both environment and organization levels.
 *
 * Roles define sets of permissions that control user access to resources and operations.
 * This client provides comprehensive role management including role hierarchies, permission
 * inheritance, and both environment-wide and organization-specific roles.
 *
 * **Environment Roles**: Available across your entire Scalekit environment, shared by all organizations
 * **Organization Roles**: Scoped to specific organizations for multi-tenant isolation. These are additional custom roles
 * that are only applicable for that organization beyond the Environment Roles that are applicable for all organizations.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const roleClient = scalekitClient.role;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/roles | Role API Documentation}
 */
declare class RoleClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new environment-level role with specified permissions.
   *
   * Environment roles are available across all organizations in your environment. Use this to
   * establish foundational access control structures, create role hierarchies, or define granular
   * permission sets that can be reused across organizations.
   *
   * @param {CreateRole} role - Role creation object containing:
   *   - name: Unique role identifier (alphanumeric with underscores, 1-64 chars)
   *   - displayName: Human-readable name for display
   *   - description: Purpose and scope of the role
   *   - permissions: Array of permission strings
   *   - baseRole?: Optional parent role for permission inheritance
   *
   * @returns {Promise<CreateRoleResponse>} The created role with metadata
   *
   * @example
   * // Create a basic role
   * const response = await scalekitClient.role.createRole({
   *   name: 'content_editor',
   *   displayName: 'Content Editor',
   *   description: 'Can create and edit content',
   *   permissions: ['content:read', 'content:write', 'content:edit']
   * });
   *
   * @example
   * // Create role with inheritance
   * await scalekitClient.role.createRole({
   *   name: 'senior_editor',
   *   displayName: 'Senior Editor',
   *   description: 'Editor with publishing rights',
   *   baseRole: 'content_editor',
   *   permissions: ['content:publish', 'content:delete']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Create Role API}
   */
  createRole(role: CreateRole): Promise<CreateRoleResponse>;
  /**
   * Retrieves complete information for a specific environment role.
   *
   * @param {string} roleName - Unique role identifier (alphanumeric with underscores, 1-64 chars)
   *
   * @returns {Promise<GetRoleResponse>} Role details including permissions and inheritance
   *
   * @example
   * const response = await scalekitClient.role.getRole('content_editor');
   * console.log('Role:', response.role.displayName);
   * console.log('Permissions:', response.role.permissions);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Role API}
   */
  getRole(roleName: string): Promise<GetRoleResponse>;
  /**
   * Lists all environment-level roles available in your Scalekit environment.
   *
   * @returns {Promise<ListRolesResponse>} Array of all roles with their metadata
   *
   * @example
   * const response = await scalekitClient.role.listRoles();
   * response.roles.forEach(role => {
   *   console.log(`${role.displayName}: ${role.permissions.length} permissions`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | List Roles API}
   */
  listRoles(): Promise<ListRolesResponse>;
  /**
   * Updates an existing environment role's properties and permissions.
   *
   * Only specified fields are updated. The new permission list replaces existing permissions.
   *
   * @param {string} roleName - Role to update
   * @param {UpdateRole} role - Updated role properties
   *
   * @returns {Promise<UpdateRoleResponse>} Updated role details
   *
   * @example
   * await scalekitClient.role.updateRole('content_editor', {
   *   displayName: 'Content Editor (Updated)',
   *   permissions: ['content:read', 'content:write', 'content:edit', 'content:review']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Role API}
   */
  updateRole(roleName: string, role: UpdateRole): Promise<UpdateRoleResponse>;
  /**
   * Deletes an environment role and reassigns its users to another role.
   *
   * Cannot delete if dependent roles exist. Users must be reassigned before deletion.
   * This operation is irreversible.
   *
   * @param {string} roleName - Role to delete
   * @param {string} [reassignRoleName] - Target role for user migration
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteRole('old_role', 'new_role');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Role API}
   */
  deleteRole(roleName: string, reassignRoleName?: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Removes an environment role's inheritance relationship, eliminating inherited permissions from its base role.
   *
   * The role retains only its directly assigned permissions after removal. This action cannot be undone.
   *
   * @param {string} roleName - Role to remove inheritance from
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @throws {ScalekitServerException} If the role is not found
   *
   * @example
   * await scalekitClient.role.deleteRoleBase('custom_role');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Role Base API}
   */
  deleteRoleBase(roleName: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Gets the number of users assigned to an environment role.
   *
   * Useful for capacity planning, security auditing, and impact assessment before role changes.
   *
   * @param {string} roleName - Role to count users for
   *
   * @returns {Promise<GetRoleUsersCountResponse>} Total user count (direct and inherited)
   *
   * @example
   * const response = await scalekitClient.role.getRoleUsersCount('admin');
   * console.log(`${response.count} users have admin role`);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Role User Count API}
   */
  getRoleUsersCount(roleName: string): Promise<GetRoleUsersCountResponse>;
  /**
   * Creates a new organization-specific role with custom permissions.
   *
   * Organization roles are scoped to a specific organization for multi-tenant isolation.
   * Use this for organization-specific access control and compartmentalized role management.
   *
   * @param {string} orgId - Organization identifier (format: "org_...")
   * @param {CreateOrganizationRole} role - Role configuration containing:
   *   - name: Unique role identifier within the organization
   *   - displayName: Human-readable name
   *   - description: Purpose and scope
   *   - permissions: Organization-specific permission array
   *   - baseRole?: Parent role for inheritance
   *
   * @returns {Promise<CreateOrganizationRoleResponse>} Created organization role
   *
   * @example
   * await scalekitClient.role.createOrganizationRole('org_123456', {
   *   name: 'department_lead',
   *   displayName: 'Department Lead',
   *   description: 'Manages department members',
   *   permissions: ['dept:members:read', 'dept:members:invite']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Create Organization Role API}
   */
  createOrganizationRole(orgId: string, role: CreateOrganizationRole): Promise<CreateOrganizationRoleResponse>;
  /**
   * Retrieves details for a specific organization role.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role name to retrieve
   *
   * @returns {Promise<GetOrganizationRoleResponse>} Organization role details
   *
   * @example
   * const response = await scalekitClient.role.getOrganizationRole(
   *   'org_123456',
   *   'department_lead'
   * );
   * console.log('Permissions:', response.role.permissions);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Organization Role API}
   */
  getOrganizationRole(orgId: string, roleName: string): Promise<GetOrganizationRoleResponse>;
  /**
   * Lists all roles available to an organization (environment + organization-specific).
   *
   * Returns both environment-level roles and organization-scoped roles.
   *
   * @param {string} orgId - Organization identifier
   *
   * @returns {Promise<ListOrganizationRolesResponse>} Array of available roles
   *
   * @example
   * const response = await scalekitClient.role.listOrganizationRoles('org_123456');
   * response.roles.forEach(role => {
   *   console.log(`${role.displayName} (${role.scope})`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | List Organization Roles API}
   */
  listOrganizationRoles(orgId: string): Promise<ListOrganizationRolesResponse>;
  /**
   * Updates an organization role's properties and permissions.
   *
   * Only specified fields are updated. New permissions replace existing ones.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to update
   * @param {UpdateRole} role - Updated role properties
   *
   * @returns {Promise<UpdateOrganizationRoleResponse>} Updated role
   *
   * @example
   * await scalekitClient.role.updateOrganizationRole('org_123456', 'department_lead', {
   *   permissions: ['dept:members:read', 'dept:members:invite', 'dept:members:remove']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Organization Role API}
   */
  updateOrganizationRole(orgId: string, roleName: string, role: UpdateRole): Promise<UpdateOrganizationRoleResponse>;
  /**
   * Deletes an organization role and reassigns its users.
   *
   * Cannot delete if dependent roles exist. Users must be reassigned. Operation is irreversible.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to delete
   * @param {string} [reassignRoleName] - Target role for user migration
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteOrganizationRole(
   *   'org_123456',
   *   'old_role',
   *   'new_role'
   * );
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Organization Role API}
   */
  deleteOrganizationRole(orgId: string, roleName: string, reassignRoleName?: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Gets the number of users assigned to an organization role.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to count users for
   *
   * @returns {Promise<GetOrganizationRoleUsersCountResponse>} User count
   *
   * @example
   * const response = await scalekitClient.role.getOrganizationRoleUsersCount(
   *   'org_123456',
   *   'admin'
   * );
   * console.log(`${response.count} admins in this organization`);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Organization Role User Count API}
   */
  getOrganizationRoleUsersCount(orgId: string, roleName: string): Promise<GetOrganizationRoleUsersCountResponse>;
  /**
   * Sets the default creator and/or member roles for the environment.
   *
   * These roles are automatically assigned to users when they are created or added as members
   * at the environment level. Both parameters are optional — only the provided fields are updated.
   *
   * @param {object} options - Update options
   * @param {string} [options.defaultCreatorRole] - Role assigned to users who create resources
   * @param {string} [options.defaultMemberRole] - Role assigned to new environment members
   *
   * @returns {Promise<UpdateDefaultRolesResponse>} Updated default roles configuration
   *
   * @throws {ScalekitServerException} If the specified role names do not exist
   *
   * @example
   * await scalekitClient.role.updateDefaultRoles({
   *   defaultCreatorRole: 'owner',
   *   defaultMemberRole: 'member',
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Default Roles API}
   */
  updateDefaultRoles(options?: {
    defaultCreatorRole?: string;
    defaultMemberRole?: string;
  }): Promise<UpdateDefaultRolesResponse>;
  /**
   * Lists all roles that extend (depend on) the specified role.
   *
   * Dependent roles are roles that use the given role as their base role and inherit its permissions.
   * Use this to understand the impact of modifying or deleting a role.
   *
   * @param {string} roleName - Role to find dependents for
   *
   * @returns {Promise<ListDependentRolesResponse>} Array of roles that depend on the given role
   *
   * @throws {Error} If roleName is empty
   * @throws {ScalekitServerException} If the role is not found
   *
   * @example
   * const response = await scalekitClient.role.listDependentRoles('base_role');
   * response.roles.forEach(r => console.log(`${r.name} depends on base_role`));
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | List Dependent Roles API}
   */
  listDependentRoles(roleName: string): Promise<ListDependentRolesResponse>;
  /**
   * Sets the default role automatically assigned to new organization members.
   * This is the role that is by default assigned to every new user added to this organization.
   *
   * Affects all new user invitations and memberships within the organization.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} defaultMemberRole - Role name to assign by default
   *
   * @returns {Promise<UpdateDefaultOrganizationRolesResponse>} Updated configuration
   *
   * @example
   * await scalekitClient.role.updateDefaultOrganizationRoles('org_123456', 'member');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Default Organization Roles API}
   */
  updateDefaultOrganizationRoles(orgId: string, defaultMemberRole: string): Promise<UpdateDefaultOrganizationRolesResponse>;
  /**
   * Removes a role's inheritance relationship, eliminating inherited permissions from base role.
   *
   * Role retains only directly assigned permissions after removal. This action cannot be undone.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to remove inheritance from
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteOrganizationRoleBase('org_123456', 'custom_role');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Organization Role Base API}
   */
  deleteOrganizationRoleBase(orgId: string, roleName: string): Promise<MessageShape<typeof EmptySchema>>;
}
//#endregion
//#region src/permission.d.ts
/**
 * Client for managing permissions and role-permission assignments.
 *
 * Permissions represent granular access controls defining specific actions users can perform
 * on resources (e.g., 'read:documents', 'write:settings', 'delete:users'). This client provides
 * comprehensive permission management including CRUD operations and role assignment.
 *
 * **Key Concepts:**
 * - **Direct Permissions**: Explicitly assigned to a role
 * - **Effective Permissions**: Direct + inherited from parent roles through hierarchy
 * - **Permission Format**: 'action:resource' (e.g., 'read:invoices', 'admin:users')
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const permissionClient = scalekitClient.permission;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Permission API Documentation}
 */
declare class PermissionClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new permission defining a specific action users can perform.
   *
   * Permissions represent granular access controls following the 'action:resource' format.
   * Use this to define the building blocks of your access control system.
   *
   * @param {CreatePermission} permission - Permission object containing:
   *   - name: Permission identifier in 'action:resource' format (e.g., 'read:documents', 'write:settings')
   *   - description: Optional explanation of what this permission grants
   *
   * @returns {Promise<CreatePermissionResponse>} Created permission with ID and timestamps
   *
   * @example
   * // Create basic permissions
   * await scalekitClient.permission.createPermission({
   *   name: 'read:invoices',
   *   description: 'View invoice details'
   * });
  
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Create Permission API}
   */
  createPermission(permission: CreatePermission): Promise<CreatePermissionResponse>;
  /**
   * Retrieves complete information for a specific permission.
   *
   * @param {string} permissionName - Permission identifier (e.g., 'read:documents')
   *
   * @returns {Promise<GetPermissionResponse>} Permission details including description and timestamps
   *
   * @example
   * const response = await scalekitClient.permission.getPermission('read:invoices');
   * console.log('Description:', response.permission.description);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Get Permission API}
   */
  getPermission(permissionName: string): Promise<GetPermissionResponse>;
  /**
   * Lists all permissions with pagination support.
   *
   * View all permission definitions for auditing, role management, or understanding available access controls.
   *
   * @param {string} [pageToken] - Token for retrieving the next page
   * @param {number} [pageSize] - Number of permissions per page (max: 100)
   *
   * @returns {Promise<ListPermissionsResponse>} Paginated list of permissions
   *
   * @example
   * // List all permissions
   * const response = await scalekitClient.permission.listPermissions();
   * response.permissions.forEach(perm => {
   *   console.log(`${perm.name}: ${perm.description}`);
   * });
   *
   * @example
   * // Paginate through permissions
   * let pageToken = undefined;
   * do {
   *   const response = await scalekitClient.permission.listPermissions(pageToken, 50);
   *   // Process permissions
   *   pageToken = response.nextPageToken;
   * } while (pageToken);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Permissions API}
   */
  listPermissions(pageToken?: string, pageSize?: number): Promise<ListPermissionsResponse>;
  /**
   * Updates an existing permission's attributes.
   *
   * Note: The permission name itself cannot be changed as it serves as the immutable identifier.
   *
   * @param {string} permissionName - Permission to update
   * @param {CreatePermission} permission - Updated permission properties
   *
   * @returns {Promise<UpdatePermissionResponse>} Updated permission details
   *
   * @example
   * await scalekitClient.permission.updatePermission('read:invoices', {
   *   name: 'read:invoices',
   *   description: 'View invoice details and history (updated)'
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Update Permission API}
   */
  updatePermission(permissionName: string, permission: CreatePermission): Promise<UpdatePermissionResponse>;
  /**
   * Permanently removes a permission.
   *
   * Ensure no active roles depend on the permission before deletion.
   *
   * @param {string} permissionName - Permission identifier to delete
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * await scalekitClient.permission.deletePermission('deprecated:feature');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Delete Permission API}
   */
  deletePermission(permissionName: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Lists direct permissions assigned to a role (excluding inherited permissions).
   *
   * Use this to view explicit permission assignments without inheritance from base roles.
   *
   * @param {string} roleName - Role to examine
   *
   * @returns {Promise<ListRolePermissionsResponse>} List of directly assigned permissions only
   *
   * @example
   * const response = await scalekitClient.permission.listRolePermissions('editor');
   * console.log('Direct permissions:', response.permissions);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Role Permissions API}
   * @see {@link listEffectiveRolePermissions} - Get all permissions including inherited
   */
  listRolePermissions(roleName: string): Promise<ListRolePermissionsResponse>;
  /**
   * Grants additional permissions to a role without removing existing assignments.
   *
   * This is an incremental operation that adds new permissions while preserving existing ones.
   * System validates permission existence before assignment.
   *
   * @param {string} roleName - Target role to enhance
   * @param {string[]} permissionNames - Array of permission identifiers to add
   *
   * @returns {Promise<AddPermissionsToRoleResponse>} Updated list of all role permissions
   *
   * @example
   * // Add multiple permissions to a role
   * await scalekitClient.permission.addPermissionsToRole('editor', [
   *   'read:documents',
   *   'write:documents',
   *   'edit:documents'
   * ]);
   *
   * @example
   * // Incrementally add permissions
   * await scalekitClient.permission.addPermissionsToRole('support', ['read:tickets']);
   * await scalekitClient.permission.addPermissionsToRole('support', ['update:tickets']);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Add Permissions to Role API}
   */
  addPermissionsToRole(roleName: string, permissionNames: string[]): Promise<AddPermissionsToRoleResponse>;
  /**
   * Revokes a specific permission from a role, restricting access for all assigned users.
   *
   * Only affects direct assignments; doesn't impact inherited permissions from base roles.
   *
   * @param {string} roleName - Role to modify
   * @param {string} permissionName - Permission to remove
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * // Remove delete permission from editor role
   * await scalekitClient.permission.removePermissionFromRole('editor', 'delete:documents');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Remove Permission from Role API}
   */
  removePermissionFromRole(roleName: string, permissionName: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Lists all effective permissions for a role including both direct and inherited permissions.
   *
   * This returns the complete set of capabilities available through the role hierarchy.
   * Essential for understanding the full scope of access granted to users assigned to this role.
   *
   * @param {string} roleName - Role to analyze
   *
   * @returns {Promise<ListEffectiveRolePermissionsResponse>} Complete list including inherited permissions
   *
   * @example
   * // Compare direct vs effective permissions
   * const direct = await scalekitClient.permission.listRolePermissions('senior_editor');
   * const effective = await scalekitClient.permission.listEffectiveRolePermissions('senior_editor');
   *
   * console.log('Direct permissions:', direct.permissions.length);
   * console.log('Total effective permissions:', effective.permissions.length);
   * console.log('Inherited:', effective.permissions.length - direct.permissions.length);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Effective Role Permissions API}
   * @see {@link listRolePermissions} - Get only direct permissions
   */
  listEffectiveRolePermissions(roleName: string): Promise<ListEffectiveRolePermissionsResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/auth/webauthn_pb.d.ts
/**
 * @generated from message scalekit.v1.auth.webauthn.ListCredentialsResponse
 */
type ListCredentialsResponse = Message<"scalekit.v1.auth.webauthn.ListCredentialsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.auth.webauthn.WebAuthnCredential credentials = 1;
   */
  credentials: WebAuthnCredential[];
  /**
   * @generated from field: scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions all_accepted_credentials_options = 2;
   */
  allAcceptedCredentialsOptions?: AllAcceptedCredentialsOptions | undefined;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.DeleteCredentialResponse
 */
type DeleteCredentialResponse = Message<"scalekit.v1.auth.webauthn.DeleteCredentialResponse"> & {
  /**
   * @generated from field: bool success = 1;
   */
  success: boolean;
  /**
   * @generated from field: scalekit.v1.auth.webauthn.UnknownCredentialOptions unknown_credential_options = 2;
   */
  unknownCredentialOptions?: UnknownCredentialOptions | undefined;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.UnknownCredentialOptions
 */
type UnknownCredentialOptions = Message<"scalekit.v1.auth.webauthn.UnknownCredentialOptions"> & {
  /**
   * @generated from field: string rp_id = 1;
   */
  rpId: string;
  /**
   * @generated from field: string credential_id = 2;
   */
  credentialId: string;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions
 */
type AllAcceptedCredentialsOptions = Message<"scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions"> & {
  /**
   * @generated from field: string rp_id = 1;
   */
  rpId: string;
  /**
   * @generated from field: string user_id = 2;
   */
  userId: string;
  /**
   * @generated from field: repeated string all_accepted_credential_ids = 3;
   */
  allAcceptedCredentialIds: string[];
};
/**
 * @generated from message scalekit.v1.auth.webauthn.UpdateCredentialResponse
 */
type UpdateCredentialResponse = Message<"scalekit.v1.auth.webauthn.UpdateCredentialResponse"> & {
  /**
   * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential credential = 1;
   */
  credential?: WebAuthnCredential | undefined;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential
 */
type WebAuthnCredential = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string user_id = 2;
   */
  userId: string;
  /**
   * @generated from field: bytes credential_id = 3;
   */
  credentialId: Uint8Array;
  /**
   * @generated from field: string attestation_type = 4;
   */
  attestationType: string;
  /**
   * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator authenticator = 5;
   */
  authenticator?: WebAuthnCredential_Authenticator | undefined;
  /**
   * @generated from field: repeated string transports = 6;
   */
  transports: string[];
  /**
   * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags authenticator_flags = 7;
   */
  authenticatorFlags?: WebAuthnCredential_AuthenticatorFlags | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 8;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 9;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent user_agent = 10;
   */
  userAgent?: WebAuthnCredential_UserAgent | undefined;
  /**
   * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo client_info = 11;
   */
  clientInfo?: WebAuthnCredential_ClientInfo | undefined;
  /**
   * @generated from field: optional string display_name = 12;
   */
  displayName?: string | undefined;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags
 */
type WebAuthnCredential_AuthenticatorFlags = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags"> & {
  /**
   * @generated from field: bool user_present = 1;
   */
  userPresent: boolean;
  /**
   * @generated from field: bool user_verified = 2;
   */
  userVerified: boolean;
  /**
   * @generated from field: bool backup_eligible = 3;
   */
  backupEligible: boolean;
  /**
   * @generated from field: bool backup_state = 4;
   */
  backupState: boolean;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator
 */
type WebAuthnCredential_Authenticator = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator"> & {
  /**
   * @generated from field: string aaguid = 1;
   */
  aaguid: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string attachment = 3;
   */
  attachment: string;
  /**
   * @generated from field: string icon_dark = 4;
   */
  iconDark: string;
  /**
   * @generated from field: string icon_light = 5;
   */
  iconLight: string;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent
 */
type WebAuthnCredential_UserAgent = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent"> & {
  /**
   * @generated from field: string raw = 1;
   */
  raw: string;
  /**
   * @generated from field: string url = 2;
   */
  url: string;
  /**
   * @generated from field: string browser = 3;
   */
  browser: string;
  /**
   * @generated from field: string browser_version = 4;
   */
  browserVersion: string;
  /**
   * @generated from field: string os = 5;
   */
  os: string;
  /**
   * @generated from field: string os_version = 6;
   */
  osVersion: string;
  /**
   * @generated from field: string device_type = 7;
   */
  deviceType: string;
  /**
   * @generated from field: string device_model = 8;
   */
  deviceModel: string;
};
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo
 */
type WebAuthnCredential_ClientInfo = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo"> & {
  /**
   * @generated from field: string ip = 1;
   */
  ip: string;
  /**
   * @generated from field: string region = 2;
   */
  region: string;
  /**
   * @generated from field: string region_subdivision = 3;
   */
  regionSubdivision: string;
  /**
   * @generated from field: string city = 4;
   */
  city: string;
};
//#endregion
//#region src/webauthn.d.ts
declare class WebAuthnClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * List all WebAuthn credentials for a user
   * @param {string} userId The user ID to list credentials for
   * @returns {Promise<ListCredentialsResponse>} The response containing:
   * - credentials: Array of WebAuthn credentials
   * - allAcceptedCredentialsOptions: Options for all accepted credentials
   */
  listCredentials(userId: string): Promise<ListCredentialsResponse>;
  /**
   * Update a WebAuthn credential's display name
   * @param {string} credentialId The credential ID to update
   * @param {string} displayName The new display name for the credential
   * @returns {Promise<UpdateCredentialResponse>} The response containing:
   * - credential: The updated WebAuthn credential
   */
  updateCredential(credentialId: string, displayName: string): Promise<UpdateCredentialResponse>;
  /**
   * Delete a WebAuthn credential
   * @param {string} credentialId The credential ID to delete
   * @returns {Promise<DeleteCredentialResponse>} The response containing:
   * - success: Boolean indicating if the deletion was successful
   * - unknownCredentialOptions: Options if the credential was not found
   */
  deleteCredential(credentialId: string): Promise<DeleteCredentialResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/tokens/tokens_pb.d.ts
/**
 * @generated from message scalekit.v1.tokens.CreateTokenResponse
 */
type CreateTokenResponse = Message<"scalekit.v1.tokens.CreateTokenResponse"> & {
  /**
   * @generated from field: string token = 1;
   */
  token: string;
  /**
   * @generated from field: string token_id = 2;
   */
  tokenId: string;
  /**
   * @generated from field: scalekit.v1.tokens.Token token_info = 3;
   */
  tokenInfo?: Token | undefined;
};
/**
 * @generated from message scalekit.v1.tokens.ValidateTokenResponse
 */
type ValidateTokenResponse = Message<"scalekit.v1.tokens.ValidateTokenResponse"> & {
  /**
   * @generated from field: scalekit.v1.tokens.Token token_info = 1;
   */
  tokenInfo?: Token | undefined;
};
/**
 * @generated from message scalekit.v1.tokens.ListTokensResponse
 */
type ListTokensResponse = Message<"scalekit.v1.tokens.ListTokensResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.tokens.Token tokens = 1;
   */
  tokens: Token[];
  /**
   * @generated from field: int32 total_count = 2;
   */
  totalCount: number;
  /**
   * @generated from field: string next_page_token = 3;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.tokens.UpdateTokenResponse
 */
type UpdateTokenResponse = Message<"scalekit.v1.tokens.UpdateTokenResponse"> & {
  /**
   * @generated from field: scalekit.v1.tokens.Token token_info = 1;
   */
  tokenInfo?: Token | undefined;
};
/**
 * @generated from message scalekit.v1.tokens.Token
 */
type Token = Message<"scalekit.v1.tokens.Token"> & {
  /**
   * @generated from field: string token_id = 1;
   */
  tokenId: string;
  /**
   * @generated from field: string organization_id = 2;
   */
  organizationId: string;
  /**
   * @generated from field: string organization_external_id = 3;
   */
  organizationExternalId: string;
  /**
   * @generated from field: optional string user_id = 4;
   */
  userId?: string | undefined;
  /**
   * @generated from field: optional string user_external_id = 5;
   */
  userExternalId?: string | undefined;
  /**
   * @generated from field: map<string, string> custom_claims = 6;
   */
  customClaims: {
    [key: string]: string;
  };
  /**
   * @generated from field: optional google.protobuf.Timestamp expiry = 7;
   */
  expiry?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp created_at = 8;
   */
  createdAt?: Timestamp | undefined;
  /**
   * @generated from field: optional string description = 9;
   */
  description?: string | undefined;
  /**
   * @generated from field: string token_suffix = 10;
   */
  tokenSuffix: string;
  /**
   * @generated from field: optional string email = 11;
   */
  email?: string | undefined;
  /**
   * @generated from field: repeated string roles = 12;
   */
  roles: string[];
};
//#endregion
//#region src/token.d.ts
/**
 * Options for creating an API token.
 */
interface CreateTokenOptions {
  /** Optional User ID to scope token to a specific user */
  userId?: string;
  /** Optional custom claims key-value pairs (max 20 entries) */
  customClaims?: {
    [key: string]: string;
  };
  /** Optional expiry timestamp */
  expiry?: Timestamp;
  /** Optional human-readable label (max 255 chars) */
  description?: string;
}
/**
 * Options for updating an API token.
 */
interface UpdateTokenOptions {
  /** Custom claims to merge into the token (set value to empty string to remove a claim) */
  customClaims?: {
    [key: string]: string;
  };
  /** Optional description replacement (empty string clears) */
  description?: string;
}
/**
 * Options for listing API tokens.
 */
interface ListTokensOptions {
  /** Optional User ID to filter tokens */
  userId?: string;
  /** Page size (default 10, max 30) */
  pageSize?: number;
  /** Pagination cursor for next page */
  pageToken?: string;
}
/**
 * Client for managing API tokens in your Scalekit application.
 *
 * API tokens provide programmatic access credentials for automated clients
 * and external systems. Each token is scoped to an organization and optionally
 * to a specific user.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const tokenClient = scalekitClient.token;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Token API Documentation}
 */
declare class TokenClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new API token for an organization.
   *
   * Generates an opaque token string that can be used for programmatic access.
   * The plain-text token value is returned only at creation time.
   *
   * @param {string} organizationId - The organization ID to scope the token to
   * @param {CreateTokenOptions} [options] - Optional configuration
   * @param {string} [options.userId] - Optional user ID to scope the token to
   * @param {object} [options.customClaims] - Optional custom claims key-value pairs
   * @param {Timestamp} [options.expiry] - Optional expiry timestamp
   * @param {string} [options.description] - Optional human-readable label
   *
   * @returns {Promise<CreateTokenResponse>} Response containing:
   *   - token: The opaque token string (only returned at creation)
   *   - tokenId: Internal token identifier (format: apit_xxxxx)
   *   - tokenInfo: Token metadata
   *
   * @example
   * // Create a basic organization token
   * const response = await scalekitClient.token.createToken('org_12345');
   * console.log('Token:', response.token);
   * console.log('Token ID:', response.tokenId);
   *
   * @example
   * // Create a user-scoped token with custom claims
   * const response = await scalekitClient.token.createToken('org_12345', {
   *   userId: 'usr_67890',
   *   customClaims: { env: 'production', scope: 'read' },
   *   description: 'CI/CD pipeline token'
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Create Token API}
   */
  createToken(organizationId: string, options?: CreateTokenOptions): Promise<CreateTokenResponse>;
  /**
   * Validates an API token and returns associated context.
   *
   * Verifies the token is valid and returns the organization/user context
   * along with any custom claims.
   *
   * @param {string} token - The opaque token string or token_id (apit_xxxxx)
   *
   * @returns {Promise<ValidateTokenResponse>} Response containing:
   *   - tokenInfo: Token metadata including organization, user, and custom claims
   *
   * @throws {ScalekitValidateTokenFailureException} If the token is invalid, expired, or not found
   * @throws {ScalekitServerException} If a network or server error occurs
   *
   * @example
   * // Validate a token
   * try {
   *   const response = await scalekitClient.token.validateToken('opaque_token_string');
   *   console.log('Organization:', response.tokenInfo?.organizationId);
   *   console.log('Custom Claims:', response.tokenInfo?.customClaims);
   * } catch (error) {
   *   console.error('Invalid token:', error);
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Validate Token API}
   */
  validateToken(token: string): Promise<ValidateTokenResponse>;
  /**
   * Invalidates (soft deletes) an API token.
   *
   * Marks the token as invalid. This operation is idempotent - it succeeds
   * even if the token was already invalidated.
   *
   * @param {string} token - The opaque token string or token_id (apit_xxxxx)
   *
   * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
   *
   * @example
   * // Revoke a token
   * await scalekitClient.token.invalidateToken('apit_123456789');
   * console.log('Token invalidated');
   *
   * @example
   * // Revoke using opaque token string
   * await scalekitClient.token.invalidateToken(opaqueTokenString);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Invalidate Token API}
   */
  invalidateToken(token: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Lists API tokens for an organization with pagination.
   *
   * Retrieves all active tokens for an organization, with optional
   * filtering by user and support for pagination.
   *
   * @param {string} organizationId - The organization ID to list tokens for
   * @param {ListTokensOptions} [options] - Optional configuration
   * @param {string} [options.userId] - Optional user ID to filter tokens
   * @param {number} [options.pageSize] - Page size (default 10, max 30)
   * @param {string} [options.pageToken] - Pagination cursor for next page
   *
   * @returns {Promise<ListTokensResponse>} Response containing:
   *   - tokens: Array of token metadata objects
   *   - totalCount: Total number of matching tokens
   *   - nextPageToken: Cursor for next page (empty if no more pages)
   *   - prevPageToken: Cursor for previous page
   *
   * @example
   * // List tokens for an organization
   * const response = await scalekitClient.token.listTokens('org_12345', {
   *   pageSize: 20
   * });
   *
   * console.log('Tokens:', response.tokens);
   * console.log('Total:', response.totalCount);
   *
   * @example
   * // List tokens for a specific user
   * const response = await scalekitClient.token.listTokens('org_12345', {
   *   userId: 'usr_67890'
   * });
   *
   * @example
   * // Paginate through all tokens
   * let pageToken: string | undefined;
   * let allTokens: Token[] = [];
   *
   * do {
   *   const response = await scalekitClient.token.listTokens('org_12345', {
   *     pageSize: 30,
   *     pageToken
   *   });
   *
   *   allTokens.push(...response.tokens);
   *   pageToken = response.nextPageToken || undefined;
   * } while (pageToken);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/tokens | List Tokens API}
   */
  listTokens(organizationId: string, options?: ListTokensOptions): Promise<ListTokensResponse>;
  /**
   * Updates the custom claims and/or description of an existing API token.
   *
   * When customClaims is provided, it replaces the entire existing claims map.
   *
   * @param {string} token - The opaque token string or token_id (apit_xxxxx)
   * @param {UpdateTokenOptions} [options] - Fields to update
   * @param {object} [options.customClaims] - New claims map; replaces all existing claims
   * @param {string} [options.description] - Replacement description; empty string clears it
   *
   * @returns {Promise<UpdateTokenResponse>} Response containing updated token_info
   *
   * @throws {ScalekitServerException} If a network or server error occurs
   *
   * @example
   * const response = await scalekitClient.token.updateToken('apit_123456789', {
   *   customClaims: { env: 'production', scope: 'read' },
   *   description: 'Updated CI token'
   * });
   */
  updateToken(token: string, options?: UpdateTokenOptions): Promise<UpdateTokenResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/clients/clients_pb.d.ts
/**
 * @generated from message scalekit.v1.clients.GetResourceResponse
 */
type GetResourceResponse = Message<"scalekit.v1.clients.GetResourceResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.Resource resource = 1;
   */
  resource?: Resource | undefined;
};
/**
 * CimdAllowlistEntry restricts which CIMD MCP clients may complete OAuth flows against a
 * resource. The meaning of value depends on type: a predefined vendor identifier (e.g.
 * "CLAUDE", "CHATGPT", "VSCODE") for type "PREDEFINED", or a CIMD client metadata URL for
 * type "URL". Predefined identifiers are not a fixed proto enum — the set of valid identifiers
 * and the real URL/pattern behind each one are resolved live from the
 * FeatureCimdPredefinedClientCatalog OpenFeature flag, so a vendor addition/change never
 * requires a proto change or a deploy.
 *
 * @generated from message scalekit.v1.clients.CimdAllowlistEntry
 */
type CimdAllowlistEntry = Message<"scalekit.v1.clients.CimdAllowlistEntry"> & {
  /**
   * @generated from field: string type = 1;
   */
  type: string;
  /**
   * @generated from field: string value = 2;
   */
  value: string;
};
/**
 * @generated from message scalekit.v1.clients.Resource
 */
type Resource = Message<"scalekit.v1.clients.Resource"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string resource_uri = 3;
   */
  resourceUri: string;
  /**
   * @generated from field: string description = 4;
   */
  description: string;
  /**
   * @generated from field: scalekit.v1.clients.ResourceType resource_type = 5;
   */
  resourceType: ResourceType;
  /**
   * @generated from field: bool disable_dynamic_client_registration = 6;
   */
  disableDynamicClientRegistration: boolean;
  /**
   * @generated from field: string logo_uri = 7;
   */
  logoUri: string;
  /**
   * @generated from field: int64 access_token_expiry = 8;
   */
  accessTokenExpiry: bigint;
  /**
   * @generated from field: int64 refresh_token_expiry = 9;
   */
  refreshTokenExpiry: bigint;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 10;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 11;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: string provider = 12;
   */
  provider: string;
  /**
   * @generated from field: google.protobuf.Struct protected_metadata = 13;
   */
  protectedMetadata?: JsonObject$1 | undefined;
  /**
   * @generated from field: string protected_metadata_uri = 14;
   */
  protectedMetadataUri: string;
  /**
   * @generated from field: string resource_id = 15;
   */
  resourceId: string;
  /**
   * @generated from field: repeated scalekit.v1.clients.Scope scopes = 16;
   */
  scopes: Scope[];
  /**
   * @generated from field: scalekit.v1.clients.ResourceConnection connection_details = 17;
   */
  connectionDetails?: ResourceConnection | undefined;
  /**
   * @generated from field: bool disallow_connection_update = 18;
   */
  disallowConnectionUpdate: boolean;
  /**
   * @generated from field: bool intersect_scopes_user_permission = 19;
   */
  intersectScopesUserPermission: boolean;
  /**
   * @generated from field: bool enable_cimd = 20;
   */
  enableCimd: boolean;
  /**
   * @generated from field: bool xaa_enabled = 21;
   */
  xaaEnabled: boolean;
  /**
   * @generated from field: repeated scalekit.v1.clients.CimdAllowlistEntry cimd_client_allowlist = 22;
   */
  cimdClientAllowlist: CimdAllowlistEntry[];
  /**
   * @generated from field: bool cimd_client_allowlist_enabled = 23;
   */
  cimdClientAllowlistEnabled: boolean;
  /**
   * @generated from field: bool resource_scope_selection_allowed = 24;
   */
  resourceScopeSelectionAllowed: boolean;
};
/**
 * @generated from message scalekit.v1.clients.ListResourcesResponse
 */
type ListResourcesResponse = Message<"scalekit.v1.clients.ListResourcesResponse"> & {
  /**
   * @generated from field: uint32 total_size = 1;
   */
  totalSize: number;
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: repeated scalekit.v1.clients.Resource resources = 3;
   */
  resources: Resource[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.clients.CreateResourceClientResponse
 */
type CreateResourceClientResponse = Message<"scalekit.v1.clients.CreateResourceClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 1;
   */
  client?: M2MClient$1 | undefined;
  /**
   * @generated from field: string plain_secret = 2;
   */
  plainSecret: string;
};
/**
 * @generated from message scalekit.v1.clients.UpdateResourceClientResponse
 */
type UpdateResourceClientResponse = Message<"scalekit.v1.clients.UpdateResourceClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 1;
   */
  client?: M2MClient$1 | undefined;
};
/**
 * @generated from message scalekit.v1.clients.GetResourceClientResponse
 */
type GetResourceClientResponse = Message<"scalekit.v1.clients.GetResourceClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 2;
   */
  client?: M2MClient$1 | undefined;
  /**
   * @generated from field: repeated scalekit.v1.clients.ConsentedUser consented_users = 3;
   */
  consentedUsers: ConsentedUser[];
};
/**
 * @generated from message scalekit.v1.clients.ConsentedUser
 */
type ConsentedUser = Message<"scalekit.v1.clients.ConsentedUser"> & {
  /**
   * @generated from field: string consent_id = 1;
   */
  consentId: string;
  /**
   * @generated from field: string external_user_id = 2;
   */
  externalUserId: string;
  /**
   * @generated from field: repeated string scopes = 3;
   */
  scopes: string[];
};
/**
 * @generated from message scalekit.v1.clients.ListResourceUserConsentsResponse
 */
type ListResourceUserConsentsResponse = Message<"scalekit.v1.clients.ListResourceUserConsentsResponse"> & {
  /**
   * @generated from field: uint32 total_size = 1;
   */
  totalSize: number;
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: repeated scalekit.v1.clients.ResourceUserConsent consents = 3;
   */
  consents: ResourceUserConsent[];
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.clients.ResourceUserConsent
 */
type ResourceUserConsent = Message<"scalekit.v1.clients.ResourceUserConsent"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string external_user_id = 2;
   */
  externalUserId: string;
  /**
   * @generated from field: string client_id = 3;
   */
  clientId: string;
  /**
   * @generated from field: string client_name = 4;
   */
  clientName: string;
  /**
   * @generated from field: repeated string scopes = 5;
   */
  scopes: string[];
  /**
   * @generated from field: google.protobuf.Timestamp granted_at = 6;
   */
  grantedAt?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.clients.ListResourceClientsResponse
 */
type ListResourceClientsResponse = Message<"scalekit.v1.clients.ListResourceClientsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.clients.M2MClient clients = 2;
   */
  clients: M2MClient$1[];
  /**
   * @generated from field: int32 total_dcr_clients = 3;
   */
  totalDcrClients: number;
  /**
   * @generated from field: int32 total_static_clients = 4;
   */
  totalStaticClients: number;
};
/**
 * @generated from message scalekit.v1.clients.DeleteResourceClientResponse
 */
type DeleteResourceClientResponse = Message<"scalekit.v1.clients.DeleteResourceClientResponse"> & {};
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientResponse
 */
type CreateOrganizationClientResponse = Message<"scalekit.v1.clients.CreateOrganizationClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 1;
   */
  client?: M2MClient$1 | undefined;
  /**
   * @generated from field: string plain_secret = 2;
   */
  plainSecret: string;
};
/**
 * @generated from message scalekit.v1.clients.UpdateOrganizationClientResponse
 */
type UpdateOrganizationClientResponse = Message<"scalekit.v1.clients.UpdateOrganizationClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 1;
   */
  client?: M2MClient$1 | undefined;
};
/**
 * @generated from message scalekit.v1.clients.M2MClient
 */
type M2MClient$1 = Message<"scalekit.v1.clients.M2MClient"> & {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;
  /**
   * @generated from field: repeated scalekit.v1.clients.ClientSecret secrets = 2;
   */
  secrets: ClientSecret[];
  /**
   * @generated from field: string name = 3;
   */
  name: string;
  /**
   * @generated from field: string description = 4;
   */
  description: string;
  /**
   * @generated from field: string organization_id = 5;
   */
  organizationId: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 6;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 7;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: repeated string scopes = 8;
   */
  scopes: string[];
  /**
   * @generated from field: repeated string audience = 9;
   */
  audience: string[];
  /**
   * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 10;
   */
  customClaims: CustomClaim[];
  /**
   * @generated from field: int64 expiry = 11;
   */
  expiry: bigint;
  /**
   * @generated from field: string resource_id = 12;
   */
  resourceId: string;
  /**
   * @generated from field: repeated string redirect_uris = 13;
   */
  redirectUris: string[];
  /**
   * @generated from field: bool is_dcr = 15;
   */
  isDcr: boolean;
  /**
   * @generated from field: bool is_cimd = 16;
   */
  isCimd: boolean;
  /**
   * @generated from field: string metadata_uri = 17;
   */
  metadataUri: string;
};
/**
 * @generated from message scalekit.v1.clients.GetOrganizationClientResponse
 */
type GetOrganizationClientResponse = Message<"scalekit.v1.clients.GetOrganizationClientResponse"> & {
  /**
   * @generated from field: scalekit.v1.clients.M2MClient client = 1;
   */
  client?: M2MClient$1 | undefined;
};
/**
 * @generated from message scalekit.v1.clients.CustomClaim
 */
type CustomClaim = Message<"scalekit.v1.clients.CustomClaim"> & {
  /**
   * @generated from field: string key = 1;
   */
  key: string;
  /**
   * @generated from field: string value = 2;
   */
  value: string;
};
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientSecretResponse
 */
type CreateOrganizationClientSecretResponse = Message<"scalekit.v1.clients.CreateOrganizationClientSecretResponse"> & {
  /**
   * @generated from field: string plain_secret = 1;
   */
  plainSecret: string;
  /**
   * @generated from field: scalekit.v1.clients.ClientSecret secret = 2;
   */
  secret?: ClientSecret | undefined;
};
/**
 * @generated from message scalekit.v1.clients.ListOrganizationClientsResponse
 */
type ListOrganizationClientsResponse = Message<"scalekit.v1.clients.ListOrganizationClientsResponse"> & {
  /**
   * Pagination token for the next page of results
   *
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * Total number of clients in the organization
   *
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * List of organization API clients
   *
   * @generated from field: repeated scalekit.v1.clients.M2MClient clients = 3;
   */
  clients: M2MClient$1[];
  /**
   * Pagination token for the previous page of results
   *
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.clients.CreateClientSecretResponse
 */
type CreateClientSecretResponse = Message<"scalekit.v1.clients.CreateClientSecretResponse"> & {
  /**
   * The unhashed secret value; only returned once at creation time
   *
   * @generated from field: string plain_secret = 1;
   */
  plainSecret: string;
  /**
   * Metadata about the created secret (doesn't include the plain secret value)
   *
   * @generated from field: scalekit.v1.clients.ClientSecret secret = 2;
   */
  secret?: ClientSecret | undefined;
};
/**
 * @generated from message scalekit.v1.clients.ClientSecret
 */
type ClientSecret = Message<"scalekit.v1.clients.ClientSecret"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: google.protobuf.Timestamp create_time = 2;
   */
  createTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp update_time = 3;
   */
  updateTime?: Timestamp | undefined;
  /**
   * @generated from field: string secret_suffix = 4;
   */
  secretSuffix: string;
  /**
   * @generated from field: optional string created_by = 5;
   */
  createdBy?: string | undefined;
  /**
   * @generated from field: scalekit.v1.clients.ClientSecretStatus status = 6;
   */
  status: ClientSecretStatus;
  /**
   * @generated from field: google.protobuf.Timestamp expire_time = 7;
   */
  expireTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp last_used_time = 8;
   */
  lastUsedTime?: Timestamp | undefined;
  /**
   * @generated from field: optional string plain_secret = 9;
   */
  plainSecret?: string | undefined;
};
/**
 * @generated from message scalekit.v1.clients.Scope
 */
type Scope = Message<"scalekit.v1.clients.Scope"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: bool enabled = 4;
   */
  enabled: boolean;
};
/**
 * @generated from message scalekit.v1.clients.RevokeUserConsentResponse
 */
type RevokeUserConsentResponse = Message<"scalekit.v1.clients.RevokeUserConsentResponse"> & {};
/**
 * @generated from message scalekit.v1.clients.ResourceConnection
 */
type ResourceConnection = Message<"scalekit.v1.clients.ResourceConnection"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: scalekit.v1.clients.ResourceConnectionType type = 2;
   */
  type: ResourceConnectionType;
  /**
   * @generated from field: string status = 3;
   */
  status: string;
  /**
   * @generated from field: bool enabled = 4;
   */
  enabled: boolean;
  /**
   * @generated from field: google.protobuf.Struct settings = 5;
   */
  settings?: JsonObject$1 | undefined;
  /**
   * @generated from field: string provider = 6;
   */
  provider: string;
};
/**
 * @generated from enum scalekit.v1.clients.ResourceType
 */
declare enum ResourceType {
  /**
   * @generated from enum value: RESOURCE_TYPE_UNSPECIFIED = 0;
   */
  RESOURCE_TYPE_UNSPECIFIED = 0,
  /**
   * Web resource
   *
   * @generated from enum value: WEB = 1;
   */
  WEB = 1,
  /**
   * Mobile resource
   *
   * @generated from enum value: MOBILE = 2;
   */
  MOBILE = 2,
  /**
   * Desktop resource
   *
   * @generated from enum value: DESKTOP = 3;
   */
  DESKTOP = 3,
  /**
   * Server resource OR Microservices
   *
   * @generated from enum value: SERVER = 4;
   */
  SERVER = 4,
  /**
   * Model Context Protocol Server
   *
   * @generated from enum value: MCP_SERVER = 5;
   */
  MCP_SERVER = 5
}
/**
 * ClientSecretStatus indicates whether a client secret can be used for authentication.
 * ACTIVE secrets can be used for authentication while INACTIVE secrets cannot.
 *
 * @generated from enum scalekit.v1.clients.ClientSecretStatus
 */
declare enum ClientSecretStatus {
  /**
   * The secret is active and can be used for authentication
   *
   * @generated from enum value: ACTIVE = 0;
   */
  ACTIVE = 0,
  /**
   * The secret is inactive and cannot be used for authentication
   *
   * @generated from enum value: INACTIVE = 1;
   */
  INACTIVE = 1
}
/**
 * @generated from enum scalekit.v1.clients.ResourceConnectionType
 */
declare enum ResourceConnectionType {
  /**
   * @generated from enum value: INVALID = 0;
   */
  INVALID = 0,
  /**
   * @generated from enum value: CUSTOM = 1;
   */
  CUSTOM = 1
}
//#endregion
//#region src/m2mclient.d.ts
interface CreateOrganizationClientOptions {
  /** Human-readable name for the client */
  name?: string;
  /** Optional description */
  description?: string;
  /** Custom claims to embed in access tokens (key-value pairs) */
  customClaims?: {
    [key: string]: string;
  };
  /** Audience values for access tokens */
  audience?: string[];
  /** Scopes to grant */
  scopes?: string[];
}
interface UpdateOrganizationClientOptions {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Custom claims to set (replaces existing) */
  customClaims?: {
    [key: string]: string;
  };
  /** Updated audience values */
  audience?: string[];
  /** Updated scopes */
  scopes?: string[];
}
interface ListOrganizationClientsOptions {
  /** Page size (between 10 and 100) */
  pageSize?: number;
  /** Pagination cursor for next page */
  pageToken?: string;
}
/**
 * Client for managing M2M (machine-to-machine) API clients per organization.
 *
 * Each organization client represents an automated system credential scoped
 * to one organization, using the client_credentials OAuth flow.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const m2m = scalekitClient.m2m;
 *
 * @see {@link https://docs.scalekit.com/m2m/overview | M2M Documentation}
 */
declare class M2MClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a new M2M API client for an organization.
   *
   * Returns a `clientId` and a plain `secret` (only available at creation time).
   *
   * @param organizationId - The organization to create the client for
   * @param options - Optional client properties (name, description, customClaims, audience, scopes)
   * @returns CreateOrganizationClientResponse with clientId, secret, and client metadata
   */
  createOrganizationClient(organizationId: string, options?: CreateOrganizationClientOptions): Promise<CreateOrganizationClientResponse>;
  /**
   * Retrieves details of a specific M2M client for an organization.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID (format: skc_xxxxx)
   * @returns GetOrganizationClientResponse with client metadata and active secrets (values hidden)
   */
  getOrganizationClient(organizationId: string, clientId: string): Promise<GetOrganizationClientResponse>;
  /**
   * Updates the configuration of an existing M2M client.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to update
   * @param options - Fields to update (name, description, customClaims, audience, scopes)
   * @returns UpdateOrganizationClientResponse with updated client metadata
   */
  updateOrganizationClient(organizationId: string, clientId: string, options?: UpdateOrganizationClientOptions): Promise<UpdateOrganizationClientResponse>;
  /**
   * Permanently deletes an M2M client from an organization.
   *
   * This operation cannot be undone. All associated secrets are invalidated.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to delete
   * @returns Empty response on success
   */
  deleteOrganizationClient(organizationId: string, clientId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Adds a new secret to an M2M client.
   *
   * The plain secret value is returned only at creation time and cannot be retrieved again.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to add a secret to
   * @returns CreateOrganizationClientSecretResponse with secretId and plain secret
   */
  addOrganizationClientSecret(organizationId: string, clientId: string): Promise<CreateOrganizationClientSecretResponse>;
  /**
   * Permanently removes a secret from an M2M client.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID
   * @param secretId - The secret ID to remove
   * @returns Empty response on success
   */
  removeOrganizationClientSecret(organizationId: string, clientId: string, secretId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Lists all M2M clients for an organization with pagination.
   *
   * @param organizationId - The organization ID
   * @param options - Optional pagination options (pageSize 10–100, pageToken)
   * @returns ListOrganizationClientsResponse with clients array and pagination cursors
   */
  listOrganizationClients(organizationId: string, options?: ListOrganizationClientsOptions): Promise<ListOrganizationClientsResponse>;
}
//#endregion
//#region src/resource.d.ts
interface ListResourcesOptions {
  /** Page size, max 30. */
  pageSize?: number;
  /** Pagination cursor. */
  pageToken?: string;
}
interface ListUserConsentsOptions {
  /** Case-insensitive substring match on external user IDs. Ignored when userIds is set. */
  search?: string;
  /** Page size, max 30. */
  pageSize?: number;
  /** Pagination cursor. */
  pageToken?: string;
  /** Exact match on external user IDs, max 25. Takes precedence over search. */
  userIds?: string[];
}
interface CreateResourceClientOptions {
  /** Human-readable name for the client. Defaults to "Resource Client" if omitted. */
  name?: string;
  /** Optional description */
  description?: string;
  /** Scopes to grant */
  scopes?: string[];
  /** Custom claims to embed in access tokens (key-value pairs) */
  customClaims?: {
    [key: string]: string;
  };
  /** Access token lifetime in seconds. Defaults to the resource's configured expiry, or one day. */
  expiry?: number;
  /** Allowed redirect URIs, for a pre-registered (non-DCR) client */
  redirectUris?: string[];
}
interface UpdateResourceClientOptions {
  /** Updated name. An empty string is a no-op server-side, not a clear — the server only applies this field when non-empty. */
  name?: string;
  /** Updated description. An empty string is a no-op server-side, not a clear — the server only applies this field when non-empty. */
  description?: string;
  /** Updated scopes (replaces existing; pass [] to clear) */
  scopes?: string[];
  /** Custom claims to set (replaces existing; pass {} to clear) */
  customClaims?: {
    [key: string]: string;
  };
  /** Updated access token lifetime in seconds */
  expiry?: number;
  /** Updated redirect URIs (replaces existing; pass [] to clear) */
  redirectUris?: string[];
}
/**
 * Client for reading resources, managing the API clients scoped to a
 * resource, and reading and revoking end-user consents granted against one.
 *
 * A resource (for example an MCP server) can have one or more API clients
 * registered against it, each using the client_credentials OAuth flow scoped
 * to that resource. A consent records that one of your end users allowed a
 * specific client to act on their behalf against the resource. Each consent
 * identifies the user by `externalUserId` — the identifier your own
 * application supplied when the consent was granted.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const resources = scalekitClient.resources;
 */
declare class ResourceClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Retrieves a single resource by id.
   *
   * A resource client's `scopes` are only actually granted in an issued
   * token when they also appear in the resource's own `scopes` allowlist
   * (the server intersects requested scopes against the environment's
   * permissions, the resource's allowed scopes, and the client's own
   * scopes) — call this first to see what the resource actually allows
   * before creating or updating a resource client with `scopes`.
   *
   * The returned `resource.scopes` is every scope defined in the
   * environment, not just the ones this resource allows — each entry
   * carries an `enabled` flag, and only the ones with `enabled: true` are
   * actually usable on this resource. Filter on that flag (and read `name`,
   * not the whole object) to get the actual allowlist:
   * `resource.resource?.scopes.filter((s) => s.enabled).map((s) => s.name)`.
   *
   * @param resourceId - The resource to fetch (format: res_xxxxx)
   * @returns GetResourceResponse with the resource, including every environment scope annotated with `enabled`
   */
  getResource(resourceId: string): Promise<GetResourceResponse>;
  /**
   * Lists resources of a given type in the environment, with pagination.
   *
   * `resourceType` is required by the underlying API — there is no way to
   * list every type in one call; list each type separately if needed.
   *
   * @param resourceType - The resource type to filter by (e.g. ResourceType.MCP_SERVER)
   * @param options - Optional pagination options
   * @returns ListResourcesResponse with resources array and pagination cursors
   */
  listResources(resourceType: ResourceType, options?: ListResourcesOptions): Promise<ListResourcesResponse>;
  /**
   * Creates a new API client scoped to a resource.
   *
   * Returns the created `client` and a `plainSecret` — the plaintext client
   * secret, only available at creation time.
   *
   * There is no `audience` option here — audience is always server-determined
   * and can never be set through this SDK, on create or update, for any
   * resource type.
   *
   * @param resourceId - The resource to create the client for (format: res_xxxxx)
   * @param options - Optional client properties (name, description, scopes, customClaims, expiry, redirectUris)
   * @returns CreateResourceClientResponse with client metadata and plainSecret
   */
  createResourceClient(resourceId: string, options?: CreateResourceClientOptions): Promise<CreateResourceClientResponse>;
  /**
   * Retrieves a single API client scoped to a resource, along with the
   * end-users who have granted it consent.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID (format: m2m_xxxxx)
   * @returns GetResourceClientResponse with client metadata and consentedUsers
   */
  getResourceClient(resourceId: string, clientId: string): Promise<GetResourceClientResponse>;
  /**
   * Lists every API client scoped to a resource.
   *
   * @param resourceId - The resource whose clients to list (format: res_xxxxx)
   * @returns ListResourceClientsResponse with clients array and DCR/static client counts
   */
  listResourceClients(resourceId: string): Promise<ListResourceClientsResponse>;
  /**
   * Updates an existing API client scoped to a resource.
   *
   * Only the fields present in `options` are changed. An `update_mask` built
   * from those same fields is sent alongside the partial `client` payload, but
   * the server only honors that mask for `scopes`, `customClaims` and
   * `redirectUris` — pass an empty value (e.g. `scopes: []`) to clear one of
   * those. `name` and `description` are applied only when non-empty (an empty
   * string is a no-op, not a clear).
   *
   * There is no `audience` option here — audience is always server-determined
   * and can never be set through this SDK, on create or update, for any
   * resource type.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to update
   * @param options - Fields to update (name, description, scopes, customClaims, expiry, redirectUris)
   * @returns UpdateResourceClientResponse with updated client metadata
   */
  updateResourceClient(resourceId: string, clientId: string, options?: UpdateResourceClientOptions): Promise<UpdateResourceClientResponse>;
  /**
   * Permanently deletes an API client scoped to a resource.
   *
   * `DeleteResourceClient` shares its underlying delete path with client
   * deletion in general, so nothing forces the given `clientId` to actually
   * belong to `resourceId` — but this method lives under `this.resources`,
   * so callers reasonably expect it to only ever touch clients within that
   * resource. This fetches the client first and verifies its own
   * `resourceId` matches before deleting, and refuses instead of trusting
   * the id pair blindly.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to delete
   * @returns Empty response on success; throws if the client does not belong to resourceId
   */
  deleteResourceClient(resourceId: string, clientId: string): Promise<DeleteResourceClientResponse>;
  /**
   * Creates a new secret for an API client scoped to a resource.
   *
   * The underlying secret-creation call is keyed by `clientId` alone — it has
   * no notion of a resource — so this fetches the client first and verifies
   * it belongs to `resourceId` before creating a secret for it, the same
   * ownership check `deleteResourceClient` applies.
   *
   * The backend caps how many secrets a client can hold at once (a
   * configurable limit — 5 in Scalekit's own dev environment, verified live;
   * treat the exact number as environment-specific, not a fixed constant).
   * Exceeding it throws (the server rejects it as INVALID_ARGUMENT, "only N
   * secrets are allowed") — delete an existing secret first via
   * `deleteResourceClientSecret`. The dashboard itself is more conservative
   * than the server limit: it only shows an "Add new secret" action while a
   * client has fewer than 2 secrets. Match whichever threshold — the actual
   * server limit or the dashboard's stricter 2 — fits your own UX.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to create a secret for
   * @returns CreateClientSecretResponse with the new secret's plainSecret and metadata; throws if the client does not belong to resourceId
   */
  createResourceClientSecret(resourceId: string, clientId: string): Promise<CreateClientSecretResponse>;
  /**
   * Permanently deletes a secret from an API client scoped to a resource.
   *
   * Like `createResourceClientSecret`, the underlying delete call is keyed by
   * `clientId` alone, so this verifies the client belongs to `resourceId`
   * first rather than trusting the id pair blindly.
   *
   * A client must always keep at least 1 secret. Calling this on a client's
   * last remaining secret throws (the server rejects it as INVALID_ARGUMENT,
   * "at least one secret is required"). Mirror the dashboard's own UX: only
   * offer a "Revoke" action on a secret while the client has more than 1.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID the secret belongs to
   * @param secretId - The secret ID to delete
   * @returns Empty response on success; throws if the client does not belong to resourceId
   */
  deleteResourceClientSecret(resourceId: string, clientId: string, secretId: string): Promise<MessageShape<typeof EmptySchema>>;
  /**
   * Lists the end-user consents granted against a resource, with pagination.
   *
   * Each returned consent carries `id`, `externalUserId`, `clientId`,
   * `clientName`, `scopes` and `grantedAt`. The response also carries
   * `totalSize` plus `nextPageToken` / `prevPageToken` cursors.
   *
   * Pass `userIds` to match specific users exactly, or `search` for a
   * case-insensitive substring match. When both are given, `userIds` wins and
   * `search` is ignored.
   *
   * @param resourceId - The resource whose consents to list (format: res_xxxxx)
   * @param options - Optional filter, search and pagination options
   * @returns ListResourceUserConsentsResponse with consents array and pagination cursors
   */
  listUserConsents(resourceId: string, options?: ListUserConsentsOptions): Promise<ListResourceUserConsentsResponse>;
  /**
   * Revokes a single end-user consent held by an API client.
   *
   * Deletes the consent, so the client is prompted for consent again on its
   * next authorization attempt, and revokes every active refresh token issued
   * to that client for the same user. Access tokens already issued stay valid
   * until they expire.
   *
   * Note that `clientId` is the API client that holds the consent (format:
   * m2m_xxxxx), not the resource id.
   *
   * @param clientId - The client holding the consent (format: m2m_xxxxx)
   * @param consentId - The consent to revoke (format: usrcnst_xxxxx)
   * @returns Empty response on success; throws on failure
   */
  revokeUserConsent(clientId: string, consentId: string): Promise<RevokeUserConsentResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/tools/tools_pb.d.ts
/**
 * @generated from message scalekit.v1.tools.Tool
 */
type Tool = Message<"scalekit.v1.tools.Tool"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string provider = 2;
   */
  provider: string;
  /**
   * @generated from field: google.protobuf.Struct definition = 3;
   */
  definition?: JsonObject$1 | undefined;
  /**
   * @generated from field: google.protobuf.Struct metadata = 4;
   */
  metadata?: JsonObject$1 | undefined;
  /**
   * @generated from field: repeated string tags = 5;
   */
  tags: string[];
  /**
   * @generated from field: google.protobuf.BoolValue is_default = 6;
   */
  isDefault?: boolean | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 7;
   */
  updatedAt?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.tools.ScopedTool
 */
type ScopedTool = Message<"scalekit.v1.tools.ScopedTool"> & {
  /**
   * @generated from field: scalekit.v1.tools.Tool tool = 1;
   */
  tool?: Tool | undefined;
  /**
   * @generated from field: string identifier = 2;
   */
  identifier: string;
  /**
   * @generated from field: string connected_account_id = 3;
   */
  connectedAccountId: string;
};
/**
 * @generated from message scalekit.v1.tools.Filter
 */
type Filter = Message<"scalekit.v1.tools.Filter"> & {
  /**
   * @generated from field: google.protobuf.BoolValue summary = 1;
   */
  summary?: boolean | undefined;
  /**
   * @generated from field: string provider = 2;
   */
  provider: string;
  /**
   * @generated from field: string identifier = 3;
   */
  identifier: string;
  /**
   * @generated from field: repeated string tool_name = 4;
   */
  toolName: string[];
  /**
   * @generated from field: optional string query = 5;
   */
  query?: string | undefined;
  /**
   * Fields 6-9 mirror GetConnectedAccountByIdentifierRequest, enabling ListTools to
   * resolve a specific connected account and include its custom MCP tools alongside
   * global tools. When connector or connected_account_id is set, a CA lookup is performed.
   *
   * @generated from field: optional string connector = 6;
   */
  connector?: string | undefined;
  /**
   * @generated from field: optional string organization_id = 7;
   */
  organizationId?: string | undefined;
  /**
   * @generated from field: optional string user_id = 8;
   */
  userId?: string | undefined;
  /**
   * @generated from field: optional string connected_account_id = 9;
   */
  connectedAccountId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.tools.Filter.
 * Use `create(FilterSchema)` to create a new message.
 */
declare const FilterSchema: GenMessage<Filter>;
/**
 * @generated from message scalekit.v1.tools.ListToolsResponse
 */
type ListToolsResponse = Message<"scalekit.v1.tools.ListToolsResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: repeated string tool_names = 4;
   */
  toolNames: string[];
  /**
   * @generated from field: repeated scalekit.v1.tools.Tool tools = 5;
   */
  tools: Tool[];
};
/**
 * @generated from message scalekit.v1.tools.ExecuteToolResponse
 */
type ExecuteToolResponse = Message<"scalekit.v1.tools.ExecuteToolResponse"> & {
  /**
   * @generated from field: google.protobuf.Struct data = 1;
   */
  data?: JsonObject$1 | undefined;
  /**
   * @generated from field: string execution_id = 2;
   */
  executionId: string;
};
/**
 * @generated from message scalekit.v1.tools.ListScopedToolsResponse
 */
type ListScopedToolsResponse = Message<"scalekit.v1.tools.ListScopedToolsResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: repeated scalekit.v1.tools.ScopedTool tools = 5;
   */
  tools: ScopedTool[];
};
/**
 * @generated from message scalekit.v1.tools.ScopedToolFilter
 */
type ScopedToolFilter = Message<"scalekit.v1.tools.ScopedToolFilter"> & {
  /**
   * @generated from field: repeated string providers = 1;
   */
  providers: string[];
  /**
   * @generated from field: repeated string tool_names = 2;
   */
  toolNames: string[];
  /**
   * @generated from field: repeated string connection_names = 3;
   */
  connectionNames: string[];
};
/**
 * Describes the message scalekit.v1.tools.ScopedToolFilter.
 * Use `create(ScopedToolFilterSchema)` to create a new message.
 */
declare const ScopedToolFilterSchema: GenMessage<ScopedToolFilter>;
/**
 * @generated from message scalekit.v1.tools.ListAvailableToolsResponse
 */
type ListAvailableToolsResponse = Message<"scalekit.v1.tools.ListAvailableToolsResponse"> & {
  /**
   * @generated from field: string next_page_token = 1;
   */
  nextPageToken: string;
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: repeated scalekit.v1.tools.Tool tools = 4;
   */
  tools: Tool[];
};
/**
 * @generated from message scalekit.v1.tools.SearchToolsResponse
 */
type SearchToolsResponse = Message<"scalekit.v1.tools.SearchToolsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.tools.SearchedTool tools = 1;
   */
  tools: SearchedTool[];
};
/**
 * @generated from message scalekit.v1.tools.SearchedTool
 */
type SearchedTool = Message<"scalekit.v1.tools.SearchedTool"> & {
  /**
   * @generated from field: string name = 1;
   */
  name: string;
  /**
   * @generated from field: string provider = 2;
   */
  provider: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: double score = 4;
   */
  score: number;
  /**
   * @generated from field: repeated scalekit.v1.tools.ConnectionReadiness connections = 5;
   */
  connections: ConnectionReadiness[];
};
/**
 * @generated from message scalekit.v1.tools.ConnectionReadiness
 */
type ConnectionReadiness = Message<"scalekit.v1.tools.ConnectionReadiness"> & {
  /**
   * @generated from field: string connection_name = 1;
   */
  connectionName: string;
  /**
   * @generated from field: string connected_account_id = 2;
   */
  connectedAccountId: string;
  /**
   * @generated from field: scalekit.v1.tools.ToolReadinessState readiness_state = 3;
   */
  readinessState: ToolReadinessState;
};
/**
 * ToolReadinessState describes whether a tool in a search result can be
 * invoked right now for a given connected-account identifier and one specific
 * connection, or needs a setup step first. Set per-connection (see
 * ConnectionReadiness) — only meaningful when the search request supplies an
 * identifier; otherwise it is TOOL_READINESS_STATE_UNSPECIFIED.
 *
 * @generated from enum scalekit.v1.tools.ToolReadinessState
 */
declare enum ToolReadinessState {
  /**
   * Readiness was not evaluated (no identifier supplied in the request).
   *
   * @generated from enum value: TOOL_READINESS_STATE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,
  /**
   * The identifier has an active connected account for this connection; the
   * tool can be executed immediately via ExecuteTool using its
   * connected_account_id.
   *
   * @generated from enum value: TOOL_READINESS_STATE_READY = 1;
   */
  READY = 1,
  /**
   * A connected account exists for this connection but is not active (e.g.
   * disconnected or pending); the end user must re-establish the connection
   * before the tool can be used through it. A connection the identifier has
   * never connected at all is not represented by this state — it is left
   * out of the connections list entirely instead.
   *
   * @generated from enum value: TOOL_READINESS_STATE_NEEDS_CONNECTION = 2;
   */
  NEEDS_CONNECTION = 2,
  /**
   * A connected account exists for this connection but its token is expired;
   * the end user must re-authenticate before the tool can be used through it.
   *
   * @generated from enum value: TOOL_READINESS_STATE_NEEDS_REAUTH = 3;
   */
  NEEDS_REAUTH = 3
}
//#endregion
//#region src/tools.d.ts
/**
 * Client for listing and executing tools.
 *
 * This client provides convenient helpers around the `ToolService` for:
 * - listing all tools available in your workspace
 * - listing tools scoped to a specific connected account identifier
 * - executing tools using connected account credentials
 *
 * It mirrors the capabilities of the Python SDK `ToolsClient` while following
 * the idioms and patterns used across the Node SDK.
 */
declare class ToolsClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Lists tools available in your workspace with optional filtering and pagination.
   *
   * @param options Optional filter and pagination parameters
   * @param options.filter Filter configuration. Supports `provider`, `identifier`, `toolName`, `summary`, `query`,
   *                       `connector`, `organizationId`, `userId`, and `connectedAccountId` fields.
   *                       Use `query` to do a text search across tool metadata (names, descriptions, identifiers).
   *                       Use `connector` together with `identifier` to resolve a specific connected account and include its custom MCP tools.
   *                       Use `connectedAccountId` as a direct alternative to the `identifier` + `connector` combination.
   * @param options.pageSize Maximum number of tools to return per page.
   * @param options.pageToken Token from a previous `listTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listTools(options?: {
    filter?: MessageInitShape<typeof FilterSchema>;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListToolsResponse>;
  /**
   * Lists tools that are scoped to a specific connected account identifier.
   *
   * @param identifier Connected account identifier to scope the tools list (for example,
   *                   a workspace identifier or email).
   * @param options Filter and pagination parameters
   * @param options.filter Filter configuration for scoped tools (providers, tool names, connection names). Required.
   * @param options.pageSize Maximum number of tools to return per page.
   * @param options.pageToken Token from a previous `listScopedTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listScopedTools(identifier: string, options: {
    filter: MessageInitShape<typeof ScopedToolFilterSchema>;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListScopedToolsResponse>;
  /**
   * Lists tools that are available for a specific connected account identifier.
   *
   * This is similar to `listScopedTools` but returns the tools that can be
   * made available for a given identifier, rather than the tools that are
   * already scoped to it.
   *
   * @param identifier Connected account identifier to scope the available tools list (for example,
   *                   a workspace identifier or email).
   * @param options Optional pagination parameters
   * @param options.pageSize Maximum number of tools to return per page.
   * @param options.pageToken Token from a previous `listAvailableTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listAvailableTools(identifier: string, options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListAvailableToolsResponse>;
  /**
   * Searches tools ranked by relevance to a natural-language query — the job to be
   * done, not an exact tool name.
   *
   * Each result's `score` is a relevance score where higher is better; it is only
   * comparable within the results of a single response, not across separate calls.
   *
   * Pass `identifier` to also get per-connection readiness (usable now, needs a new
   * connection, or needs re-auth) on each result's `connections`. `connections` is
   * populated only when `identifier` is set: an empty array means the identifier has
   * no connection at all for that tool's provider (not an error, and different from
   * `NEEDS_CONNECTION`, which means a connected-account row exists but is inactive);
   * more than one entry means the identifier has accounts on multiple connections for
   * that provider (for example, two Slack workspaces) — inspect each entry's own
   * `readinessState` rather than assuming one answer for the whole tool.
   *
   * @param query Natural-language query or keywords describing the job to be done. 1-256 characters.
   * @param options Optional parameters
   * @param options.identifier Connected-account identifier (for example, email or workspace ID).
   *                            When set, each result is annotated with readiness for this identifier's connections.
   * @param options.topK Maximum number of ranked results to return. Defaults to 10, capped at 50.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  searchTools(query: string, options?: {
    identifier?: string;
    topK?: number;
  }): Promise<SearchToolsResponse>;
  /**
   * Executes a tool using credentials from a connected account.
   *
   * You can either:
   * - reference the connected account directly via `connectedAccountId`, or
   * - identify it using a combination of `identifier`, `connector`, `organizationId`, and `userId`.
   *
   * @param params Execution configuration
   * @param params.toolName Name of the tool to execute.
   * @param params.identifier Optional connected account identifier (for example, email or workspace ID).
   * @param params.params JSON parameters required by the tool. These will be sent as a structured payload.
   * @param params.connectedAccountId Optional direct ID of the connected account (`ca_...`).
   * @param params.connector Optional connector/provider name when using identifier-based lookup.
   * @param params.organizationId Optional organization ID to scope the connected account lookup.
   * @param params.userId Optional user ID to scope the connected account lookup.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  executeTool(params: {
    toolName: string;
    identifier?: string;
    params?: Record<string, unknown>;
    connectedAccountId?: string;
    connector?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<ExecuteToolResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb.d.ts
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsResponse
 */
type ListConnectedAccountsResponse = Message<"scalekit.v1.connected_accounts.ListConnectedAccountsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.connected_accounts.ConnectedAccountForList connected_accounts = 1;
   */
  connectedAccounts: ConnectedAccountForList[];
  /**
   * @generated from field: uint32 total_size = 2;
   */
  totalSize: number;
  /**
   * @generated from field: string next_page_token = 3;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 4;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccountResponse
 */
type CreateConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.CreateConnectedAccountResponse"> & {
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
   */
  connectedAccount?: ConnectedAccount | undefined;
};
/**
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccountResponse
 */
type UpdateConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.UpdateConnectedAccountResponse"> & {
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
   */
  connectedAccount?: ConnectedAccount | undefined;
};
/**
 * @generated from message scalekit.v1.connected_accounts.DeleteConnectedAccountResponse
 */
type DeleteConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.DeleteConnectedAccountResponse"> & {};
/**
 * @generated from message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse
 */
type GetMagicLinkForConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse"> & {
  /**
   * @generated from field: string link = 1;
   */
  link: string;
  /**
   * @generated from field: google.protobuf.Timestamp expiry = 2;
   */
  expiry?: Timestamp | undefined;
};
/**
 * @generated from message scalekit.v1.connected_accounts.VerifyConnectedAccountUserResponse
 */
type VerifyConnectedAccountUserResponse = Message<"scalekit.v1.connected_accounts.VerifyConnectedAccountUserResponse"> & {
  /**
   * @generated from field: string post_user_verify_redirect_url = 1;
   */
  postUserVerifyRedirectUrl: string;
};
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse
 */
type GetConnectedAccountByIdentifierResponse = Message<"scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse"> & {
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
   */
  connectedAccount?: ConnectedAccount | undefined;
};
/**
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccount
 */
type ConnectedAccount = Message<"scalekit.v1.connected_accounts.ConnectedAccount"> & {
  /**
   * @generated from field: string identifier = 1;
   */
  identifier: string;
  /**
   * @generated from field: string provider = 2;
   */
  provider: string;
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectorStatus status = 3;
   */
  status: ConnectorStatus;
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectorType authorization_type = 4;
   */
  authorizationType: ConnectorType;
  /**
   * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
   */
  authorizationDetails?: AuthorizationDetails | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp token_expires_at = 6;
   */
  tokenExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 7;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: string connector = 8;
   */
  connector: string;
  /**
   * @generated from field: google.protobuf.Timestamp last_used_at = 9;
   */
  lastUsedAt?: Timestamp | undefined;
  /**
   * @generated from field: string id = 10;
   */
  id: string;
  /**
   * @generated from field: string connection_id = 11;
   */
  connectionId: string;
  /**
   * @generated from field: google.protobuf.Struct api_config = 12;
   */
  apiConfig?: JsonObject$1 | undefined;
  /**
   * @generated from field: bool is_org_wide_credential = 13;
   */
  isOrgWideCredential: boolean;
};
/**
 * Payload for creating a new connected account - authorization details are optional
 *
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccount
 */
type CreateConnectedAccount = Message<"scalekit.v1.connected_accounts.CreateConnectedAccount"> & {
  /**
   * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
   */
  authorizationDetails?: AuthorizationDetails | undefined;
  /**
   * @generated from field: google.protobuf.Struct api_config = 11;
   */
  apiConfig?: JsonObject$1 | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.CreateConnectedAccount.
 * Use `create(CreateConnectedAccountSchema)` to create a new message.
 */
declare const CreateConnectedAccountSchema: GenMessage<CreateConnectedAccount>;
/**
 * Payload for updating an existing connected account - all fields optional
 *
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccount
 */
type UpdateConnectedAccount = Message<"scalekit.v1.connected_accounts.UpdateConnectedAccount"> & {
  /**
   * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
   */
  authorizationDetails?: AuthorizationDetails | undefined;
  /**
   * @generated from field: google.protobuf.Struct api_config = 10;
   */
  apiConfig?: JsonObject$1 | undefined;
};
/**
 * Connected account summary for list operations - excludes sensitive authorization details
 *
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccountForList
 */
type ConnectedAccountForList = Message<"scalekit.v1.connected_accounts.ConnectedAccountForList"> & {
  /**
   * @generated from field: string identifier = 1;
   */
  identifier: string;
  /**
   * @generated from field: string provider = 2;
   */
  provider: string;
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectorStatus status = 3;
   */
  status: ConnectorStatus;
  /**
   * @generated from field: scalekit.v1.connected_accounts.ConnectorType authorization_type = 4;
   */
  authorizationType: ConnectorType;
  /**
   * @generated from field: google.protobuf.Timestamp token_expires_at = 6;
   */
  tokenExpiresAt?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 7;
   */
  updatedAt?: Timestamp | undefined;
  /**
   * @generated from field: string connector = 8;
   */
  connector: string;
  /**
   * @generated from field: google.protobuf.Timestamp last_used_at = 9;
   */
  lastUsedAt?: Timestamp | undefined;
  /**
   * @generated from field: string id = 10;
   */
  id: string;
  /**
   * @generated from field: string connection_id = 11;
   */
  connectionId: string;
  /**
   * @generated from field: bool is_org_wide_credential = 12;
   */
  isOrgWideCredential: boolean;
};
/**
 * Authentication credentials container supporting multiple auth types
 *
 * @generated from message scalekit.v1.connected_accounts.AuthorizationDetails
 */
type AuthorizationDetails = Message<"scalekit.v1.connected_accounts.AuthorizationDetails"> & {
  /**
   * @generated from oneof scalekit.v1.connected_accounts.AuthorizationDetails.details
   */
  details: {
    /**
     * OAuth 2.0 credentials
     *
     * @generated from field: scalekit.v1.connected_accounts.OauthToken oauth_token = 1;
     */
    value: OauthToken;
    case: "oauthToken";
  } | {
    /**
     * Static authentication credentials
     *
     * @generated from field: scalekit.v1.connected_accounts.StaticAuth static_auth = 2;
     */
    value: StaticAuth;
    case: "staticAuth";
  } | {
    /**
     * Google Domain-Wide Delegation credentials
     *
     * @generated from field: scalekit.v1.connected_accounts.GoogleDWDAuth google_dwd = 3;
     */
    value: GoogleDWDAuth;
    case: "googleDwd";
  } | {
    /**
     * Trusted IDP federated credentials (e.g. AWS STS temporary credentials)
     *
     * @generated from field: scalekit.v1.connected_accounts.TrustedIDPAuth trusted_idp = 4;
     */
    value: TrustedIDPAuth;
    case: "trustedIdp";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message scalekit.v1.connected_accounts.AuthorizationDetails.
 * Use `create(AuthorizationDetailsSchema)` to create a new message.
 */
declare const AuthorizationDetailsSchema: GenMessage<AuthorizationDetails>;
/**
 * Google Domain-Wide Delegation authentication — used for GOOGLE_DWD connections.
 * Send only subject in requests; access_token, scopes, and token_expires_at are response-only.
 *
 * @generated from message scalekit.v1.connected_accounts.GoogleDWDAuth
 */
type GoogleDWDAuth = Message<"scalekit.v1.connected_accounts.GoogleDWDAuth"> & {
  /**
   * @generated from field: string subject = 1;
   */
  subject: string;
  /**
   * @generated from field: string access_token = 2;
   */
  accessToken: string;
  /**
   * @generated from field: repeated string scopes = 3;
   */
  scopes: string[];
  /**
   * @generated from field: google.protobuf.Timestamp token_expires_at = 4;
   */
  tokenExpiresAt?: Timestamp | undefined;
};
/**
 * Trusted IDP federated authentication — used for TRUSTED_IDP connections (e.g. AWS Redshift).
 * Send only db_user in requests; cached temporary credentials are managed server-side and
 * returned only on output paths. secret_access_key and session_token are never exposed in
 * public API responses.
 *
 * @generated from message scalekit.v1.connected_accounts.TrustedIDPAuth
 */
type TrustedIDPAuth = Message<"scalekit.v1.connected_accounts.TrustedIDPAuth"> & {
  /**
   * @generated from field: string db_user = 1;
   */
  dbUser: string;
  /**
   * @generated from field: string access_key_id = 2;
   */
  accessKeyId: string;
  /**
   * @generated from field: string secret_access_key = 3;
   */
  secretAccessKey: string;
  /**
   * @generated from field: string session_token = 4;
   */
  sessionToken: string;
  /**
   * @generated from field: google.protobuf.Timestamp expiry = 5;
   */
  expiry?: Timestamp | undefined;
};
/**
 * OAuth 2.0 access and refresh tokens with scopes
 *
 * @generated from message scalekit.v1.connected_accounts.OauthToken
 */
type OauthToken = Message<"scalekit.v1.connected_accounts.OauthToken"> & {
  /**
   * @generated from field: string access_token = 1;
   */
  accessToken: string;
  /**
   * @generated from field: string refresh_token = 2;
   */
  refreshToken: string;
  /**
   * @generated from field: repeated string scopes = 3;
   */
  scopes: string[];
  /**
   * @generated from field: string domain = 4;
   */
  domain: string;
};
/**
 * Static authentication credentials for API keys, bearer tokens, or basic auth
 *
 * @generated from message scalekit.v1.connected_accounts.StaticAuth
 */
type StaticAuth = Message<"scalekit.v1.connected_accounts.StaticAuth"> & {
  /**
   * @generated from field: google.protobuf.Struct details = 1;
   */
  details?: JsonObject$1 | undefined;
};
/**
 * Status of a connected account indicating its current state
 *
 * @generated from enum scalekit.v1.connected_accounts.ConnectorStatus
 */
declare enum ConnectorStatus {
  /**
   * Default/unknown status
   *
   * @generated from enum value: CONNECTION_STATUS_UNSPECIFIED = 0;
   */
  CONNECTION_STATUS_UNSPECIFIED = 0,
  /**
   * Account is connected and credentials are valid
   *
   * @generated from enum value: ACTIVE = 1;
   */
  ACTIVE = 1,
  /**
   * Access token has expired and needs refresh
   *
   * @generated from enum value: EXPIRED = 2;
   */
  EXPIRED = 2,
  /**
   * Account awaiting user authorization (re-auth initiated)
   *
   * @generated from enum value: PENDING_AUTH = 3;
   */
  PENDING_AUTH = 3,
  /**
   * OAuth complete; awaiting user identity verification before activation
   *
   * @generated from enum value: PENDING_VERIFICATION = 4;
   */
  PENDING_VERIFICATION = 4,
  /**
   * Account has been manually disconnected
   *
   * @generated from enum value: DISCONNECTED = 5;
   */
  DISCONNECTED = 5
}
/**
 * Type of authentication mechanism used for the connected account
 *
 * @generated from enum scalekit.v1.connected_accounts.ConnectorType
 */
declare enum ConnectorType {
  /**
   * Default/unknown type
   *
   * @generated from enum value: CONNECTION_TYPE_UNSPECIFIED = 0;
   */
  CONNECTION_TYPE_UNSPECIFIED = 0,
  /**
   * OAuth 2.0 authorization with access and refresh tokens
   *
   * @generated from enum value: OAUTH = 1;
   */
  OAUTH = 1,
  /**
   * Static API key authentication
   *
   * @generated from enum value: API_KEY = 2;
   */
  API_KEY = 2,
  /**
   * HTTP Basic Authentication (username/password)
   *
   * @generated from enum value: BASIC_AUTH = 3;
   */
  BASIC_AUTH = 3,
  /**
   * Bearer token authentication
   *
   * @generated from enum value: BEARER_TOKEN = 4;
   */
  BEARER_TOKEN = 4,
  /**
   * Custom authentication mechanism
   *
   * @generated from enum value: CUSTOM = 5;
   */
  CUSTOM = 5,
  /**
   * Basic authentication (alias)
   *
   * @generated from enum value: BASIC = 6;
   */
  BASIC = 6,
  /**
   * OAuth 2.0 client credentials (machine-to-machine)
   *
   * @generated from enum value: OAUTH_M2M = 7;
   */
  OAUTH_M2M = 7,
  /**
   * Trello token-based OAuth1-style browser authorization
   *
   * @generated from enum value: TRELLO_OAUTH1 = 8;
   */
  TRELLO_OAUTH1 = 8,
  /**
   * Google Domain-Wide Delegation
   *
   * @generated from enum value: GOOGLE_DWD = 9;
   */
  GOOGLE_DWD = 9,
  /**
   * Trusted Identity Provider federation (e.g. AWS STS AssumeRoleWithWebIdentity)
   *
   * @generated from enum value: TRUSTED_IDP = 10;
   */
  TRUSTED_IDP = 10,
  /**
   * SMART on FHIR (SMART App Launch) — OAuth 2.0 authorization for FHIR servers
   *
   * @generated from enum value: SMART_FHIR = 11;
   */
  SMART_FHIR = 11,
  /**
   * No authentication — connector requires no credentials (e.g. public docs MCP servers)
   *
   * @generated from enum value: NO_AUTH = 12;
   */
  NO_AUTH = 12
}
//#endregion
//#region src/connected-accounts.d.ts
/**
 * Client for managing connected accounts for third-party integrations.
 *
 * This mirrors the Python SDK `ConnectedAccountsClient` and exposes a typed,
 * ergonomic API around the `ConnectedAccountService` to:
 * - list connected accounts
 * - create/update/delete connected accounts
 * - generate magic links for authorization
 * - fetch full authentication details for a connected account
 */
declare class ConnectedAccountsClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Lists connected accounts with optional filters and pagination.
   *
   * @param options Optional filtering and pagination parameters
   * @param options.query Text to search for (up to 100 characters). Matches anywhere in the
   *                      account identifier, the provider, the connection name and the
   *                      provider's display name, ignoring case. With `query`, only
   *                      `connector` and the paging options narrow the search;
   *                      `identifier`, `provider`, `connectionNames` and
   *                      `isOrgWideCredential` are not applied, so use those without it.
   * @param options.isOrgWideCredential For connections that share one credential across the
   *                      organization: `true` returns only the account that holds that
   *                      shared credential, `false` returns only the per-user accounts.
   *                      Leave it out to get both.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listConnectedAccounts(options?: {
    organizationId?: string;
    userId?: string;
    connector?: string;
    identifier?: string;
    provider?: string;
    pageSize?: number;
    pageToken?: string;
    query?: string;
    connectionNames?: string[];
    isOrgWideCredential?: boolean;
  }): Promise<ListConnectedAccountsResponse>;
  /**
   * Creates a new connected account.
   *
   * @param params Connected account creation parameters
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  createConnectedAccount(params: {
    connector: string;
    identifier: string;
    connectedAccount: CreateConnectedAccount;
    organizationId?: string;
    userId?: string;
  }): Promise<CreateConnectedAccountResponse>;
  /**
   * Gets an existing connected account by connector and identifier, or creates one if none exists.
   * Mirrors the Python SDK `get_or_create_connected_account`. When creating, the backend may require
   * valid authorization details; if omitted, a minimal payload is sent and the server may return
   * a validation error.
   *
   * @param params Get-or-create parameters
   * @param params.connector Connector identifier (required)
   * @param params.identifier Connected account identifier (required)
   * @param params.authorizationDetails Optional auth details for the create path (OAuth token or static auth)
   * @param params.organizationId Optional organization ID
   * @param params.userId Optional user ID
   * @param params.apiConfig Optional API config for the create path
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connector or identifier is missing.
   */
  getOrCreateConnectedAccount(params: {
    connector: string;
    identifier: string;
    authorizationDetails?: MessageInitShape<typeof AuthorizationDetailsSchema>;
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse>;
  /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
  upsertConnectedAccount: (params: {
    connector: string;
    identifier: string;
    authorizationDetails?: MessageInitShape<typeof AuthorizationDetailsSchema>;
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }) => Promise<CreateConnectedAccountResponse>;
  /**
   * Updates an existing connected account.
   *
   * You can target the account either by `connectedAccountId` alone, or by the
   * combination of `connector` and `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  updateConnectedAccount(params: {
    connector?: string;
    identifier?: string;
    connectedAccount: UpdateConnectedAccount;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<UpdateConnectedAccountResponse>;
  /**
   * Deletes a connected account and revokes its credentials.
   *
   * You can target the account either by `connectedAccountId` alone, or by the
   * combination of `connector` and `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  deleteConnectedAccount(params: {
    connector?: string;
    identifier?: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<DeleteConnectedAccountResponse>;
  /**
   * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  getMagicLinkForConnectedAccount(params: {
    connector?: string;
    identifier?: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
    state?: string;
    userVerifyUrl?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse>;
  /**
   * Verifies the connected account user after OAuth callback.
   *
   * Called by the B2B app server with the `auth_request_id` from the user verify
   * redirect URL and the current user's identifier. Validates that the asserted
   * identifier matches the one stored on the auth request and activates the account.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  verifyConnectedAccountUser(params: {
    authRequestId: string;
    identifier: string;
  }): Promise<VerifyConnectedAccountUserResponse>;
  /**
   * Retrieves complete authentication details for a connected account.
   *
   * This method returns sensitive credential information, so ensure you protect access
   * to this in your application.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitNotFoundException} If no matching connected account is found.
   */
  getConnectedAccountByIdentifier(params: {
    connector?: string;
    identifier?: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<GetConnectedAccountByIdentifierResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/mcp/mcp_pb.d.ts
/**
 * @generated from message scalekit.v1.mcp.CreateMcpConfigResponse
 */
type CreateMcpConfigResponse = Message<"scalekit.v1.mcp.CreateMcpConfigResponse"> & {
  /**
   * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
   */
  config?: McpConfig | undefined;
};
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpConfigRequest
 */
type UpdateMcpConfigRequest = Message<"scalekit.v1.mcp.UpdateMcpConfigRequest"> & {
  /**
   * @generated from field: string config_id = 1;
   */
  configId: string;
  /**
   * @generated from field: string description = 2;
   */
  description: string;
  /**
   * @generated from field: repeated scalekit.v1.mcp.McpConfigConnectionToolMapping connection_tool_mappings = 3;
   */
  connectionToolMappings: McpConfigConnectionToolMapping[];
};
/**
 * Describes the message scalekit.v1.mcp.UpdateMcpConfigRequest.
 * Use `create(UpdateMcpConfigRequestSchema)` to create a new message.
 */
declare const UpdateMcpConfigRequestSchema: GenMessage<UpdateMcpConfigRequest>;
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpConfigResponse
 */
type UpdateMcpConfigResponse = Message<"scalekit.v1.mcp.UpdateMcpConfigResponse"> & {
  /**
   * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
   */
  config?: McpConfig | undefined;
};
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpConfigResponse
 */
type DeleteMcpConfigResponse = Message<"scalekit.v1.mcp.DeleteMcpConfigResponse"> & {};
/**
 * @generated from message scalekit.v1.mcp.GetMcpConfigResponse
 */
type GetMcpConfigResponse = Message<"scalekit.v1.mcp.GetMcpConfigResponse"> & {
  /**
   * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
   */
  config?: McpConfig | undefined;
};
/**
 * @generated from message scalekit.v1.mcp.ListMcpConfigsResponse
 */
type ListMcpConfigsResponse = Message<"scalekit.v1.mcp.ListMcpConfigsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.mcp.McpConfig configs = 1;
   */
  configs: McpConfig[];
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
  /**
   * @generated from field: uint32 total_size = 4;
   */
  totalSize: number;
};
/**
 * @generated from message scalekit.v1.mcp.McpConnectionAuthState
 */
type McpConnectionAuthState = Message<"scalekit.v1.mcp.McpConnectionAuthState"> & {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId: string;
  /**
   * @generated from field: string connection_name = 2;
   */
  connectionName: string;
  /**
   * @generated from field: string provider = 3;
   */
  provider: string;
  /**
   * @generated from field: optional string connected_account_id = 4;
   */
  connectedAccountId?: string | undefined;
  /**
   * @generated from field: optional string connected_account_status = 5;
   */
  connectedAccountStatus?: string | undefined;
  /**
   * @generated from field: string authentication_link = 6;
   */
  authenticationLink: string;
};
/**
 * @generated from message scalekit.v1.mcp.ListMcpConnectedAccountsResponse
 */
type ListMcpConnectedAccountsResponse = Message<"scalekit.v1.mcp.ListMcpConnectedAccountsResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.mcp.McpConnectionAuthState connected_accounts = 1;
   */
  connectedAccounts: McpConnectionAuthState[];
};
/**
 * @generated from message scalekit.v1.mcp.McpConfig
 */
type McpConfig = Message<"scalekit.v1.mcp.McpConfig"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   * @generated from field: string description = 3;
   */
  description: string;
  /**
   * @generated from field: repeated scalekit.v1.mcp.McpConfigConnectionToolMapping connection_tool_mappings = 4;
   */
  connectionToolMappings: McpConfigConnectionToolMapping[];
  /**
   * @generated from field: string mcp_server_url = 5;
   */
  mcpServerUrl: string;
};
/**
 * Describes the message scalekit.v1.mcp.McpConfig.
 * Use `create(McpConfigSchema)` to create a new message.
 */
declare const McpConfigSchema: GenMessage<McpConfig>;
/**
 * @generated from message scalekit.v1.mcp.McpConfigConnectionToolMapping
 */
type McpConfigConnectionToolMapping = Message<"scalekit.v1.mcp.McpConfigConnectionToolMapping"> & {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId: string;
  /**
   * @generated from field: string connection_name = 2;
   */
  connectionName: string;
  /**
   * @generated from field: string provider = 3;
   */
  provider: string;
  /**
   * @generated from field: repeated string tools = 4;
   */
  tools: string[];
  /**
   * @generated from field: optional string connected_account_id = 5;
   */
  connectedAccountId?: string | undefined;
  /**
   * @generated from field: optional string connected_account_status = 6;
   */
  connectedAccountStatus?: string | undefined;
};
/**
 * @generated from message scalekit.v1.mcp.CreateMcpSessionTokenResponse
 */
type CreateMcpSessionTokenResponse = Message<"scalekit.v1.mcp.CreateMcpSessionTokenResponse"> & {
  /**
   * @generated from field: string token = 1;
   */
  token: string;
  /**
   * @generated from field: google.protobuf.Timestamp expires_at = 2;
   */
  expiresAt?: Timestamp | undefined;
};
//#endregion
//#region src/mcp.d.ts
/**
 * Tools an MCP session token can use: `'FULL'` for every tool, `'READ_ONLY'`
 * for tools annotated read-only only.
 */
type McpSessionTokenAccessLevel = 'FULL' | 'READ_ONLY';
/**
 * Parameters for {@link McpClient.createSessionToken}. Set a target:
 * `mcpConfigId` for a Virtual MCP server built from a configuration, or
 * `connectionName` for a connection's own MCP server. If both are set,
 * `mcpConfigId` is used.
 */
type CreateMcpSessionTokenParams = {
  /** Your application's unique identifier for the user, 1 to 255 characters. */identifier: string; /** Token lifetime in whole seconds, 60 to 86400. Defaults to 3600. */
  expirySeconds?: number; /** Tools the token can use. Omit for `'FULL'`. */
  accessLevel?: McpSessionTokenAccessLevel;
} & ({
  /** ID of the MCP configuration whose server the token is for. */mcpConfigId: string; /** Ignored when `mcpConfigId` is set. */
  connectionName?: string;
} | {
  /** Name of the AgentKit connection whose MCP server the token is for. */connectionName: string;
  mcpConfigId?: undefined;
});
/**
 * Client for Virtual MCP servers.
 *
 * A Virtual MCP server exposes a chosen set of connectors and tools over the
 * Model Context Protocol, so any MCP-capable agent can call them. You create one
 * configuration per agent role — not per user — and mint a short-lived session
 * token per user per run. The server URL is static; the token carries identity.
 *
 * This client covers the generally available surface only: MCP configurations,
 * their connected accounts, and session tokens. The `Mcp` and `McpInstance`
 * families in the same proto package back the older `/mcp/v1/` and `/mcp/v2/`
 * server generations, are marked PREVIEW, and are deliberately not exposed here.
 */
declare class McpClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a Virtual MCP server configuration.
   *
   * Create this once per agent role. The response carries a static
   * `config.mcpServerUrl` that every user and every session reuses.
   *
   * @param params.name Unique name. 1-100 characters, lowercase letters, digits, hyphens and underscores.
   * @param params.description Human-readable summary of what this server exposes.
   * @param params.connectionToolMappings Which connections, and which tools from each, to expose.
   *                                      Omit `tools` on a mapping to expose every tool for that connection.
   *                                      Maximum 25 mappings.
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @remarks
   * `config.mcpServerUrl` comes back as an **empty string** when the
   * `mcp_config_server_url` feature flag is not enabled for your environment —
   * the call still succeeds. Check it before storing the value, or every later
   * step fails with nothing to point at.
   */
  createConfig(params: {
    name: string;
    description?: string;
    connectionToolMappings?: MessageInitShape<typeof McpConfigSchema>['connectionToolMappings'];
  }): Promise<CreateMcpConfigResponse>;
  /**
   * Fetches a single MCP configuration by ID.
   *
   * @param configId ID of the configuration to fetch (`cfg_...`).
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  getConfig(configId: string): Promise<GetMcpConfigResponse>;
  /**
   * Lists MCP configurations for the current environment.
   *
   * @param options.search Free-text search across configuration metadata.
   * @param options.pageSize Maximum number of configurations to return per page
   *   (max 30; a larger value fails with `[invalid_argument] Validation error`).
   * @param options.pageToken Token from a previous `listConfigs` response.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listConfigs(options?: {
    search?: string;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListMcpConfigsResponse>;
  /**
   * Updates the description and connection-to-tool mappings of a configuration.
   *
   * The name cannot be changed after creation. Avoid updating while agent
   * sessions are running — tools can become unavailable mid-session. For a
   * significant change, create a new configuration and swap the URL instead.
   *
   * @param params.configId ID of the configuration to update.
   * @param params.description New description.
   * @param params.connectionToolMappings Replacement connection-to-tool mappings.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  updateConfig(params: {
    configId: string;
    description?: string;
    connectionToolMappings?: MessageInitShape<typeof UpdateMcpConfigRequestSchema>['connectionToolMappings'];
  }): Promise<UpdateMcpConfigResponse>;
  /**
   * Deletes an MCP configuration.
   *
   * @param configId ID of the configuration to delete.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  deleteConfig(configId: string): Promise<DeleteMcpConfigResponse>;
  /**
   * Lists the connected accounts backing a configuration for one user.
   *
   * Call this before minting a session token: OAuth credentials can expire or be
   * revoked at any time, and an agent that starts without an active connection
   * fails on every tool call. Surface `authenticationLink` for any account whose
   * `connectedAccountStatus` is not `"ACTIVE"`.
   *
   * @param params.configId ID of the configuration.
   * @param params.identifier Your application's unique identifier for the user.
   * @param params.includeAuthLink Include re-authorization URLs for inactive connections.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listConnectedAccounts(params: {
    configId: string;
    identifier: string;
    includeAuthLink?: boolean;
  }): Promise<ListMcpConnectedAccountsResponse>;
  /**
   * Mints a session token for one user, for either a Virtual MCP server or a
   * connection's own MCP server.
   *
   * Set a target; if both are set, `mcpConfigId` is used:
   *
   * - `mcpConfigId`: the token works on that configuration's
   *   `config.mcpServerUrl` (see {@link McpClient.getConfig}).
   * - `connectionName`: the token works on the connection's own MCP server at
   *   `<environment URL>/mcp/v3/connections/<connection name>`, which exposes
   *   all of that connection's tools without an MCP configuration. The name is
   *   matched without regard to case, but the URL path is case-sensitive:
   *   build it from the connection's name exactly as stored.
   *
   * A token works only on the server it was minted for. The server URL is
   * static; the token is what carries user identity. Mint a fresh one before
   * every agent run and never reuse one across runs. Set the expiry longer
   * than the run is expected to take.
   *
   * For a connection, the user should have an active connected account on it.
   * When they do not, the server either rejects the call, or creates a pending
   * connected account and returns a token whose tool calls report the account
   * as not connected, depending on the environment.
   *
   * @param params.mcpConfigId ID of the configuration. If both targets are
   * set, this one is used and `connectionName` is ignored.
   * @param params.connectionName Name of an AgentKit connection: the same
   * value used as `connectionName` elsewhere in the SDK. Used when
   * `mcpConfigId` is omitted or empty.
   * @param params.identifier Your application's unique identifier for the user,
   * 1 to 255 characters. For a connection it is checked before the request:
   * an empty value throws `identifier is required`.
   * @param params.expirySeconds Token lifetime in whole seconds, from 60
   * seconds to 24 hours (86400); 1 hour (3600) by default.
   * @param params.accessLevel Tools the token can use. `'READ_ONLY'` limits it
   * to tools annotated read-only: other tools are left out of the tool list
   * and refused when called. `'FULL'`, or omitting it, exposes every tool the
   * configuration or connection exposes.
   * @returns The session `token` and its `expiresAt` time.
   * @throws {Error} If `expirySeconds` is not a positive integer, or, for a
   * connection only, if `connectionName` is not a string or `identifier` is
   * empty. No request is sent. Calls with `mcpConfigId` are not checked
   * beyond `expirySeconds` and behave as they always have: a missing or empty
   * ID is sent and rejected by the server.
   * @throws {ScalekitNotFoundException} If `connectionName` matches no active
   * connection.
   * @throws {ScalekitBadRequestException} If the request is otherwise rejected:
   * for example the connection is not an AgentKit connection, the identifier
   * or expiry is out of range, or (in environments that do not create pending
   * accounts) the user has no active connected account on the connection.
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * ```typescript
   * // Virtual MCP server built from a configuration
   * const { config } = await scalekitClient.actions.mcp.getConfig(configId);
   * const session = await scalekitClient.actions.mcp.createSessionToken({
   *   mcpConfigId: configId,
   *   identifier: 'user_123',
   *   expirySeconds: 900,
   * });
   * // Hand config?.mcpServerUrl and session.token to your MCP client
   * ```
   *
   * @example
   * ```typescript
   * // A connection's own MCP server
   * const session = await scalekitClient.actions.mcp.createSessionToken({
   *   connectionName: 'gmail',
   *   identifier: 'user_123',
   *   expirySeconds: 900,
   *   accessLevel: 'READ_ONLY',
   * });
   * // The URL path is case-sensitive: use the connection's stored name.
   * const serverUrl = `${process.env.SCALEKIT_ENVIRONMENT_URL}/mcp/v3/connections/gmail`;
   * // Hand serverUrl and session.token to your MCP client
   * ```
   */
  createSessionToken(params: CreateMcpSessionTokenParams): Promise<CreateMcpSessionTokenResponse>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/providers/providers_pb.d.ts
/**
 * Provider represents a connected app provider
 *
 * @generated from message scalekit.v1.providers.Provider
 */
type Provider$1 = Message<"scalekit.v1.providers.Provider"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   * @generated from field: string identifier = 2;
   */
  identifier: string;
  /**
   * @generated from field: string display_name = 3;
   */
  displayName: string;
  /**
   * @generated from field: string description = 4;
   */
  description: string;
  /**
   * @generated from field: repeated string categories = 5;
   */
  categories: string[];
  /**
   * @generated from field: google.protobuf.ListValue auth_patterns = 6;
   */
  authPatterns?: ListValue | undefined;
  /**
   * @generated from field: string icon_src = 7;
   */
  iconSrc: string;
  /**
   * @generated from field: int32 display_priority = 8;
   */
  displayPriority: number;
  /**
   * @generated from field: bool coming_soon = 9;
   */
  comingSoon: boolean;
  /**
   * @generated from field: string proxy_url = 10;
   */
  proxyUrl: string;
  /**
   * @generated from field: bool proxy_enabled = 11;
   */
  proxyEnabled: boolean;
  /**
   * @generated from field: bool is_custom = 12;
   */
  isCustom: boolean;
  /**
   * @generated from field: bool is_custom_mcp = 13;
   */
  isCustomMcp: boolean;
  /**
   * @generated from field: map<string, string> metadata = 14;
   */
  metadata: {
    [key: string]: string;
  };
};
/**
 * @generated from message scalekit.v1.providers.DeleteProviderResponse
 */
type DeleteProviderResponse = Message<"scalekit.v1.providers.DeleteProviderResponse"> & {};
/**
 * @generated from enum scalekit.v1.providers.ProviderType
 */
declare enum ProviderType {
  /**
   * @generated from enum value: DEFAULT = 0;
   */
  DEFAULT = 0,
  /**
   * @generated from enum value: CUSTOM = 1;
   */
  CUSTOM = 1,
  /**
   * @generated from enum value: ALL = 2;
   */
  ALL = 2
}
//#endregion
//#region src/providers.d.ts
/**
 * One credential input shown to the user while they connect.
 *
 * Used with `BEARER`, `API_KEY` and `BASIC` patterns. An `OAUTH` flow collects
 * its own credentials, and `NO_AUTH` takes none, so leave `fields` empty for those.
 */
interface AuthField {
  /**
   * Key the credential is stored under. Use `token` for bearer patterns and
   * `api_key` for API-key patterns.
   */
  field_name: string;
  /** Label shown above the input. */
  label?: string;
  /** Use `password` for anything secret so the UI masks it. */
  input_type?: 'text' | 'password' | 'select';
  /** Helper text shown with the input. */
  hint?: string;
  /** Whether the user must fill this in before the connection can be saved. */
  required?: boolean;
}
/**
 * One way a user can authenticate against your connector.
 *
 * Sent to the API as-is, so the keys are snake_case to match the wire format
 * rather than the camelCase used elsewhere in this SDK.
 */
interface AuthPattern {
  /** Authentication method. */
  type: 'OAUTH' | 'BEARER' | 'API_KEY' | 'BASIC' | 'NO_AUTH' | (string & {});
  /** Name of this method, shown to the user while they connect. */
  display_name: string;
  /** Short explanation of this method, shown to the user. */
  description?: string;
  /** Set to `true` when the connector fronts an MCP server. */
  is_mcp?: boolean;
  /**
   * Credential inputs for `BEARER`, `API_KEY` and `BASIC`. Leave empty for
   * `OAUTH` and `NO_AUTH`.
   */
  fields?: AuthField[];
  /**
   * OAuth settings for an `OAUTH` pattern. Pass `{}` to use the upstream
   * server's discovered defaults.
   */
  oauth_config?: Record<string, unknown>;
  /**
   * Header name to send an `API_KEY` credential in, when the upstream expects
   * something other than the default.
   */
  auth_header_key_override?: string;
  [key: string]: unknown;
}
/**
 * A connector, built-in or custom, as returned by {@link ProvidersClient}.
 *
 * Same fields as the API's provider, except `authPatterns` is decoded into
 * plain {@link AuthPattern} objects. The API sends it as an untyped
 * `google.protobuf.ListValue`, so the raw value cannot be passed back to
 * {@link ProvidersClient.updateCustomProvider}; this shape can, which matches
 * Python's `Provider.auth_patterns`.
 */
type Provider = Omit<Provider$1, '$typeName' | 'authPatterns'> & {
  authPatterns: AuthPattern[];
};
/** Response returned by {@link ProvidersClient.createCustomProvider}. */
interface CreateProviderResponse {
  provider?: Provider;
}
/** Response returned by {@link ProvidersClient.updateCustomProvider}. */
interface UpdateProviderResponse {
  provider?: Provider;
}
/** Response returned by {@link ProvidersClient.listProviders}. */
interface ListProvidersResponse {
  providers: Provider[];
  nextPageToken: string;
  prevPageToken: string;
  totalSize: number;
}
/**
 * Client for bring-your-own connectors (custom providers).
 *
 * A custom connector puts a service Scalekit does not ship in front of the same
 * machinery as a built-in one: users connect an account, you call it through
 * `actions.request`, and Scalekit injects the credentials.
 *
 * Mirrors Python's `actions.providers`, including the preview status of
 * {@link listProviders} — see that method before you depend on it.
 */
declare class ProvidersClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Creates a custom connector.
   *
   * @param params.displayName Human-readable name. Letters, digits and spaces only.
   *                           Suffix it with "MCP" when the connector fronts an MCP server.
   * @param params.proxyUrl Base HTTPS URL of the upstream service.
   * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
   * @param params.authPatterns How users authenticate. Exactly one pattern is
   *                            supported today; the array is for future use.
   * @returns `provider.identifier` on the response is the id you pass to
   *          {@link updateCustomProvider} and {@link deleteCustomProvider}.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  createCustomProvider(params: {
    displayName: string;
    proxyUrl: string;
    proxyEnabled?: boolean;
    description?: string;
    authPatterns?: AuthPattern[];
    iconSrc?: string;
    metadata?: Record<string, string>;
  }): Promise<CreateProviderResponse>;
  /**
   * Updates a custom connector.
   *
   * Treat this as a PUT: read the current connector with {@link listProviders}
   * first, then send back every field you want to keep alongside the ones you
   * are changing. `provider.authPatterns` and `provider.proxyEnabled` from that
   * response can be passed here as-is.
   *
   * What the server does with each field:
   * - `displayName`, `proxyUrl` and `authPatterns` are required on every update.
   *   Omitting `authPatterns` fails with `[invalid_argument] Validation error`, and
   *   it replaces the whole list rather than merging into it. The pattern's
   *   `type` and `is_mcp` cannot be changed.
   * - `metadata` replaces the stored map, so leaving it out clears it.
   * - `proxyEnabled` is always applied. It defaults to `true` here, so pass the
   *   current value to keep a connector's proxying switched off.
   * - `description` and `iconSrc` keep their stored values when left out.
   *
   * @param params.identifier From `provider.identifier` on a create or list response.
   * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  updateCustomProvider(params: {
    identifier: string;
    displayName: string;
    proxyUrl: string; /** Required by the server on update, not just on create. */
    authPatterns: AuthPattern[];
    proxyEnabled?: boolean;
    description?: string;
    iconSrc?: string;
    metadata?: Record<string, string>;
  }): Promise<UpdateProviderResponse>;
  /**
   * Deletes a custom connector.
   *
   * Remove the connector's connections and connected accounts first; the server
   * refuses to delete one that is still in use, with
   * `[invalid_argument] cannot delete custom provider with existing connections`.
   *
   * Connected accounts come off with `actions.deleteConnectedAccount`. The app
   * connection itself has to go from the Scalekit dashboard: this SDK wraps no
   * delete for an environment-scoped connection, and `connection.deleteConnection`
   * takes an `organizationId`, which an app connection does not have.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  deleteCustomProvider(identifier: string): Promise<DeleteProviderResponse>;
  /**
   * Lists connectors, built-in and custom.
   *
   * Use it to find a connector's `identifier` before updating or deleting it.
   *
   * PREVIEW — the underlying `ListProviders` RPC is marked preview in the API and
   * may change. It is exposed because create, update and delete are generally
   * available but need an identifier this is the only way to discover. The Python
   * SDK wraps the same RPC at `actions.providers.list_providers`.
   *
   * @param params.providerType Filter by kind: `ProviderType.CUSTOM` for your own
   *                            connectors, `ProviderType.ALL` for built-ins and
   *                            custom together. Omitting it behaves like
   *                            `ProviderType.DEFAULT` and returns built-ins only,
   *                            so pass `CUSTOM` or `ALL` to find a custom
   *                            connector's identifier.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listProviders(params?: {
    pageSize?: number;
    pageToken?: string;
    providerType?: ProviderType;
    identifier?: string;
  }): Promise<ListProvidersResponse>;
}
//#endregion
//#region src/types/json.d.ts
/**
 * Any value that `JSON.parse` can return: a string, number, boolean, `null`,
 * an array of JSON values or a {@link JsonObject}.
 */
type JsonValue = string | number | boolean | null | JsonValue[] | {
  [key: string]: JsonValue;
};
/**
 * A JSON object: string keys mapped to {@link JsonValue}s.
 */
type JsonObject = {
  [key: string]: JsonValue;
};
//#endregion
//#region src/triggers.d.ts
/**
 * Who a trigger event is delivered for. Branch on it before acting:
 * `'account'` events concern one connected account
 * ({@link TriggerEvent.connectedAccountId}); `'connection'` events concern the
 * whole connection and carry an empty `connectedAccountId`.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
declare const DeliveryScope: {
  readonly ACCOUNT: "account";
  readonly CONNECTION: "connection";
};
/** See {@link (DeliveryScope:variable)}. Open: unknown values are plain strings. */
type DeliveryScope = (typeof DeliveryScope)[keyof typeof DeliveryScope] | (string & {});
/**
 * How the change behind a trigger event was detected: pushed by the provider
 * (`'webhook'`) or found by polling (`'poll'`).
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
declare const DetectionMode: {
  readonly WEBHOOK: "webhook";
  readonly POLL: "poll";
};
/** See {@link (DetectionMode:variable)}. Open: unknown values are plain strings. */
type DetectionMode = (typeof DetectionMode)[keyof typeof DetectionMode] | (string & {});
/**
 * Whether a trigger event carries the resource. `'full'`: `payload` holds it.
 * `'reference'`: `payload` is `null`; fetch the resource identified by
 * `resourceType` and `resourceId` yourself.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
declare const PayloadState: {
  readonly FULL: "full";
  readonly REFERENCE: "reference";
};
/** See {@link (PayloadState:variable)}. Open: unknown values are plain strings. */
type PayloadState = (typeof PayloadState)[keyof typeof PayloadState] | (string & {});
/**
 * A verified trigger event, as returned by {@link verifyTriggerEvent} and
 * `scalekit.actions.triggers.verifyEvent`.
 *
 * Field names are the camelCase form of the wire names (`trigger_type` →
 * `triggerType`). Top-level fields this SDK version does not know are kept,
 * under their wire names, in {@link TriggerEvent.extra}.
 */
interface TriggerEvent {
  /** Event format version, as sent (not validated, so newer versions still parse). */
  readonly version: string;
  /** The trigger that fired, for example `'example.item.created'`. */
  readonly triggerType: string;
  /** The trigger subscription this delivery belongs to. */
  readonly subscriptionId: string;
  /** `'account'` or `'connection'`; see {@link (DeliveryScope:type)}. */
  readonly deliveryScope: DeliveryScope;
  /** The connection the event came from. */
  readonly connectionId: string;
  /**
   * The connected account the event is for. An empty string when
   * `deliveryScope` is `'connection'`.
   */
  readonly connectedAccountId: string;
  /** Kind of resource that changed, as named by the provider. */
  readonly resourceType: string;
  /**
   * ID of the resource that changed. `undefined` when the event has none
   * (absent or `null` on the wire); an empty string is kept as `''`.
   */
  readonly resourceId: string | undefined;
  /**
   * When the change happened. `undefined` when absent, `null` or `''` on the
   * wire. Sub-millisecond digits are truncated.
   */
  readonly occurredAt: Date | undefined;
  /** `'webhook'` or `'poll'`; see {@link (DetectionMode:type)}. */
  readonly detectionMode: DetectionMode;
  /** `'full'` or `'reference'`; see {@link (PayloadState:type)}. */
  readonly payloadState: PayloadState;
  /** The resource as sent by the provider; `null` when absent (always for `'reference'`). */
  readonly payload: JsonValue;
  /** Stable key for de-duplicating redeliveries of the same event. */
  readonly dedupeKey: string;
  /** Links follow-up work back to the event that caused it. */
  readonly correlationId: string;
  /**
   * Top-level fields this SDK version does not recognise, under their wire
   * (snake_case) names. Empty when there are none.
   */
  readonly extra: Readonly<Record<string, JsonValue>>;
}
/**
 * Request headers as your framework exposes them: a Fetch `Headers` object
 * (Next.js route handlers, Hono, Workers) or a plain object such as Node's
 * `IncomingHttpHeaders` (`req.headers` in Express).
 *
 * In a plain object, names are matched case-insensitively. An object with a
 * `get(name)` method (Fetch `Headers`, or a `Map`) is queried with the
 * lower-case names `webhook-id`, `webhook-timestamp` and `webhook-signature`;
 * Fetch `Headers` is case-insensitive itself, but a `Map` must use lower-case
 * keys.
 */
type TriggerEventHeaders = Headers | Readonly<Record<string, string | readonly string[] | undefined>>;
/** Parameters for {@link verifyTriggerEvent} and `actions.triggers.verifyEvent`. */
interface TriggerEventVerifyParams {
  /**
   * The raw request body exactly as received: a `Buffer`/`Uint8Array`
   * (preferred, for example from `express.raw()`) or a string. Do not pass a
   * parsed or re-serialised object; the signature covers the original bytes.
   */
  body: string | Uint8Array;
  /** The request headers; `webhook-id`, `webhook-timestamp` and `webhook-signature` are read. */
  headers: TriggerEventHeaders;
  /** The signing secret for your trigger endpoint (`whsec_...`). */
  secret: string;
}
/**
 * Verifies a trigger event delivered to your endpoint and returns it parsed.
 *
 * The signature is checked first (HMAC-SHA256 over
 * `webhook-id.webhook-timestamp.body`, a 5-minute timestamp tolerance and a
 * constant-time comparison); the body is parsed only once it is verified.
 * Needs no client: call it before constructing one, or in a separate service.
 *
 * @remarks
 * - Delivery is at least once: the same event can arrive more than once. Make
 *   your handler idempotent, keyed on `dedupeKey` together with the connected
 *   account you acted as.
 * - Branch on `deliveryScope`: `'account'` events are for
 *   `connectedAccountId`; `'connection'` events are for the whole connection
 *   and `connectedAccountId` is `''`.
 * - When `payloadState` is `'reference'`, `payload` is `null`: fetch the
 *   resource identified by `resourceType` and `resourceId`.
 * - `payload` is decoded with `JSON.parse`, so integers larger than
 *   `Number.MAX_SAFE_INTEGER` (2^53 - 1) lose precision. If you need such
 *   values exactly, parse the raw body again with a parser that preserves them.
 * - Headers are matched case-insensitively. Every `webhook-signature`
 *   candidate is tried and malformed ones (including any that are not strict
 *   padded standard base64) are skipped; several different `webhook-id` or
 *   `webhook-timestamp` values are rejected.
 *
 * @param params - The raw body, the request headers and your signing secret.
 * @returns The verified, parsed event.
 * @throws {@link WebhookVerificationError} when the event is not authentic:
 *   a required header is missing or repeated with different values,
 *   `webhook-timestamp` is not decimal digits, the secret is malformed (the
 *   key after `whsec_` must be non-empty padded standard base64), the
 *   timestamp is more than 5 minutes off, no signature matches, or the body
 *   is not valid UTF-8 (including a string body with a lone UTF-16
 *   surrogate; `cause` holds the underlying error where there is one).
 * @throws {@link ScalekitTriggerEventParseError} (a subclass of
 *   `WebhookVerificationError`) when the signature is valid but the body is
 *   not JSON (a leading byte order mark counts as not JSON), not a JSON
 *   object, lacks a required field, has a field of the wrong type, or has an
 *   `occurred_at` that is not an RFC 3339 timestamp with an offset in years
 *   0001-9999 (after conversion to UTC).
 * @throws `TypeError` when called with the wrong argument types: `body` is
 *   not a string, `Buffer` or `Uint8Array`, `headers` is neither a plain
 *   object nor an object with a `get(name)` method (an array such as
 *   `req.rawHeaders`, a `Buffer` or a `Set` is rejected), a
 *   `webhook-id`, `webhook-timestamp` or `webhook-signature` value is not a
 *   string, an array of strings or `undefined`, or `secret` is not a string.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { verifyTriggerEvent, WebhookVerificationError } from '@scalekit-sdk/node';
 *
 * const app = express();
 * app.post('/triggers', express.raw({ type: 'application/json' }), (req, res) => {
 *   try {
 *     const event = verifyTriggerEvent({
 *       body: req.body,
 *       headers: req.headers,
 *       secret: process.env.SCALEKIT_TRIGGER_SECRET!,
 *     });
 *     // enqueue(event) and process it idempotently on event.dedupeKey
 *     res.sendStatus(204);
 *   } catch (err) {
 *     if (err instanceof WebhookVerificationError) return res.sendStatus(400);
 *     throw err;
 *   }
 * });
 * ```
 */
declare function verifyTriggerEvent(params: TriggerEventVerifyParams): TriggerEvent;
/**
 * Trigger events delivered to your endpoint. Reached as
 * `scalekit.actions.triggers`.
 */
declare class TriggersClient {
  /**
   * Verifies a trigger event delivered to your endpoint and returns it
   * parsed. Same behaviour as the standalone {@link verifyTriggerEvent},
   * which needs no client.
   *
   * @remarks
   * Delivery is at least once: de-duplicate on `dedupeKey` together with the
   * connected account you acted as. Branch on `deliveryScope`, and when
   * `payloadState` is `'reference'` fetch the resource yourself. See
   * {@link verifyTriggerEvent} for details.
   *
   * @param params - The raw body, the request headers and your signing secret.
   * @returns The verified, parsed event.
   * @throws {@link WebhookVerificationError} when the event is not authentic.
   * @throws {@link ScalekitTriggerEventParseError} when the signature is valid
   *   but the body is not a readable trigger event.
   * @throws `TypeError` when called with the wrong argument types.
   *
   * @example
   * ```ts
   * const event = scalekit.actions.triggers.verifyEvent({
   *   body: req.body, // raw Buffer, e.g. from express.raw()
   *   headers: req.headers,
   *   secret: process.env.SCALEKIT_TRIGGER_SECRET!,
   * });
   * ```
   */
  verifyEvent(params: TriggerEventVerifyParams): TriggerEvent;
}
//#endregion
//#region src/resumable-upload.d.ts
/** HTTP method that starts an upload session. */
type ResumableUploadMethod = 'POST' | 'PUT' | 'PATCH';
/** What to upload, and where. Passed to `actions.uploadResumable`. */
interface ResumableUploadParams {
  /** Connection name as shown in the dashboard, e.g. `'googledrive'`. Required; no CR/LF. */
  connectionName: string;
  /** Your application's identifier for the end user whose account is used. Required; no CR/LF. */
  identifier: string;
  /**
   * Provider upload path, e.g. `'/upload/drive/v3/files'`, or
   * `'/upload/drive/v3/files/{fileId}'` with `method: 'PATCH'` to replace a
   * file's content. A leading `/` is added if missing. Must not contain `?`,
   * `#`, spaces, control characters or `.`/`..` segments (also
   * percent-encoded): pass query parameters in `queryParams`.
   */
  path: string;
  /**
   * The content: bytes (`Buffer`, `Uint8Array`), or any async iterable of
   * bytes (`fs.createReadStream(file)`, a `Readable`, an async generator).
   * Streams are read one chunk at a time and never buffered whole.
   */
  data: Uint8Array | AsyncIterable<Uint8Array>;
  /**
   * Total size in bytes. Known automatically for bytes and for an unread
   * `fs.createReadStream(path)` with no `start`/`end`. When it is unknown,
   * the size is sent with the last chunk. If the stream turns out shorter or
   * longer than this, the upload fails with `ScalekitValidationError` before
   * the last chunk is sent.
   */
  totalBytes?: number;
  /** MIME type of the content. Defaults to `'application/octet-stream'`. Must not be empty or contain CR/LF. */
  contentType?: string;
  /** Resource metadata sent as JSON with the session-start request, e.g. `{ name, parents }`. */
  metadata?: Record<string, unknown>;
  /**
   * Extra query parameters for the session-start request only, e.g.
   * `{ supportsAllDrives: true }` or YouTube's `{ part: 'snippet,status' }`.
   * `uploadType` (exact, case-sensitive key) is set by the SDK and rejected here.
   */
  queryParams?: Record<string, string | number | boolean>;
  /** Method of the session-start request. Defaults to `'POST'`; Drive uses `'PATCH'` to replace content. */
  method?: ResumableUploadMethod;
  /** Bytes per chunk request. A positive multiple of 262144 (256 KiB). Defaults to 4 MiB. */
  chunkSize?: number;
}
/** Upload progress, as reported to `onProgress`. */
interface UploadProgress {
  /** Bytes the server has confirmed so far. */
  readonly bytesCommitted: number;
  /** Total size, or `undefined` while it is not known yet. */
  readonly totalBytes: number | undefined;
}
/** Per-call options for `actions.uploadResumable`. */
interface ResumableUploadOptions {
  /** Cancels the upload, including a wait between retries. Rejects with `ScalekitAbortError`. */
  signal?: AbortSignal;
  /**
   * Timeout for each HTTP request, in milliseconds. Defaults to the client's
   * `toolTimeoutMs` (60000 by default).
   */
  timeoutMs?: number;
  /**
   * Retries per chunk after a timeout, a connection error, HTTP 408, 429,
   * 500, 502, 503 or 504, or a 308 that commits no new bytes. Status checks
   * count too; the count resets only when the server confirms bytes beyond
   * the most it had confirmed before. Defaults to 3. `0` disables retries.
   * The session-start request is never retried.
   */
  maxRetries?: number;
  /**
   * Called each time the server confirms more bytes, and once when the upload
   * completes (a zero-byte upload gets one call with 0/0). The upload waits
   * for a returned promise. An error thrown here stops the upload and is
   * rethrown unchanged.
   */
  onProgress?: (progress: UploadProgress) => void | Promise<void>;
}
//#endregion
//#region src/actions.d.ts
/**
 * Creation timestamp for an app connection, re-exported as the protobuf
 * well-known `Timestamp` type. Passed through from the API unchanged
 * (`seconds` is an int64 and therefore a `bigint` in JS).
 */
type AppConnectionTimestamp = Timestamp;
/**
 * Normalized, consumer-friendly view of an app connection returned by
 * {@link ActionsClient.listAppConnections}. Internal proto fields
 * (`provider` enum, `organizationId`, `uiButtonTitle`, `organizationName`,
 * `domains`, `$typeName`) are omitted, and enum fields are decoded to their
 * string names.
 */
interface AppConnection {
  /** Unique connection identifier (format: "conn_..."). */
  id: string;
  /** Connection type, decoded from the ConnectionType enum (e.g. "OAUTH", "SAML"). */
  type: string;
  /** Connection status, decoded from the ConnectionStatus enum (e.g. "COMPLETED", "DRAFT"). */
  status: string;
  /** Whether the connection is enabled. */
  enabled: boolean;
  /** Provider key for the connection (e.g. "SALESFORCE", "GMAIL"). */
  provider: string;
  /** Human-readable connection name / key identifier (e.g. "salesforce-ubB7gpKc"). */
  connectionName: string;
  /** Creation timestamp, passed through as a protobuf Timestamp. */
  createdAt?: AppConnectionTimestamp;
}
/** Normalized response returned by {@link ActionsClient.listAppConnections}. */
interface ListAppConnectionsResult {
  connections: AppConnection[];
  nextPageToken: string;
  prevPageToken: string;
  totalSize: number;
}
/**
 * Normalized, consumer-friendly view of a tool returned by
 * {@link ActionsClient.listTools}. Internal proto fields (`$typeName`) are
 * omitted — every other field passes through unchanged from the generated
 * `Tool` message.
 */
interface ActionTool {
  id: string;
  provider: string;
  definition?: JsonObject$1;
  metadata?: JsonObject$1;
  tags: string[];
  isDefault?: boolean;
  updatedAt?: Timestamp;
}
/** Normalized response returned by {@link ActionsClient.listTools}. */
interface ListToolsResult {
  tools: ActionTool[];
  toolNames: string[];
  nextPageToken: string;
  prevPageToken: string;
  totalSize: number;
}
/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
declare class ActionsClient {
  private readonly tools;
  private readonly connectedAccounts;
  private readonly coreClient;
  private readonly connection;
  /** Virtual MCP servers: configurations, connected accounts and session tokens. */
  readonly mcp: McpClient;
  /** Bring-your-own connectors: create, update, list and delete custom connectors. */
  readonly providers: ProvidersClient;
  /**
   * Trigger events delivered to your endpoint: verify and parse them with
   * `triggers.verifyEvent`. Needs no network access.
   */
  readonly triggers: TriggersClient;
  /**
   * @param {ToolsClient} tools - Client used to execute tools on behalf of connected accounts.
   * @param {ConnectedAccountsClient} connectedAccounts - Client for connected-account lifecycle operations.
   * @param {CoreClient} coreClient - Shared core client (auth, HTTP, retries) used for proxied requests.
   * @param {ConnectionClient} connection - Client used to list app-level connections.
   */
  constructor(tools: ToolsClient, connectedAccounts: ConnectedAccountsClient, coreClient: CoreClient, connection: ConnectionClient, /** Virtual MCP servers: configurations, connected accounts and session tokens. */

  mcp: McpClient, /** Bring-your-own connectors: create, update, list and delete custom connectors. */

  providers: ProvidersClient);
  /**
   * Finds tools that fit a goal, ranked by relevance.
   *
   * Delegates to `tools.searchTools`. Prefer this over listing a connector:
   * binding a whole connector to a model is roughly 85k tokens of schema per
   * request, against about 700 for one search.
   *
   * Pass `identifier` and each result's `connections` carries that user's
   * `readinessState` per connection — check it before executing.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  searchTools(query: string, options?: {
    identifier?: string;
    topK?: number;
  }): Promise<SearchToolsResponse>;
  /**
   * Lists tools for one identifier, narrowed by an explicit filter.
   *
   * Delegates to `tools.listScopedTools`. `options.filter` is required by the
   * server even though its fields are individually optional.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listScopedTools(identifier: string, options: {
    filter: MessageInitShape<typeof ScopedToolFilterSchema>;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListScopedToolsResponse>;
  /**
   * Lists every tool available to one identifier across their connections.
   *
   * Delegates to `tools.listAvailableTools`. Paginated — follow
   * `nextPageToken` if you need the complete set.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listAvailableTools(identifier: string, options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListAvailableToolsResponse>;
  /**
   * Execute a tool on behalf of a connected account.
   *
   * Thin wrapper around ToolsClient.executeTool, reserved for future
   * pre/post modifier support.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If toolName is missing or an unexpected error occurs.
   */
  executeTool(params: {
    toolName: string;
    toolInput: Record<string, unknown>;
    identifier?: string;
    connectedAccountId?: string;
    connector?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<ExecuteToolResponse>;
  /**
   * List tools available in your workspace, optionally scoped to a connected account.
   *
   * Thin wrapper around ToolsClient.listTools. Use `connectedAccountId` as a
   * direct alternative to the `connectionName` + `identifier` combination.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listTools(params?: {
    connectionName?: string;
    identifier?: string;
    provider?: string;
    toolName?: string[];
    query?: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
    summary?: boolean;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListToolsResult>;
  /**
   * Get an authorization magic link for a connected account.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  getAuthorizationLink(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
    state?: string;
    userVerifyUrl?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse>;
  /**
   * Verify the connected account user after OAuth callback.
   *
   * Called by the B2B app server with the `authRequestId` from the user verify
   * redirect URL and the current user's identifier. Activates the connected account
   * once the asserted identifier is confirmed.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  verifyConnectedAccountUser(params: {
    authRequestId: string;
    identifier: string;
  }): Promise<VerifyConnectedAccountUserResponse>;
  /**
   * List connected accounts with optional filters.
   *
   * @param params.query Text to search for (up to 100 characters), ignoring case. With
   *                     `query`, only `connectionName` and the paging options narrow the
   *                     search; `identifier`, `provider`, `connectionNames` and
   *                     `isOrgWideCredential` are not applied, so use those without it.
   * @param params.isOrgWideCredential For connections that share one credential across the
   *                     organization: `true` returns only the account that holds that
   *                     shared credential, `false` returns only the per-user accounts.
   *                     Leave it out to get both.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listConnectedAccounts(params?: {
    connectionName?: string;
    identifier?: string;
    provider?: string;
    organizationId?: string;
    userId?: string;
    pageSize?: number;
    pageToken?: string;
    query?: string;
    connectionNames?: string[];
    isOrgWideCredential?: boolean;
  }): Promise<ListConnectedAccountsResponse>;
  /**
   * List app-level connections with optional pagination and provider filtering.
   *
   * Delegates to {@link ConnectionClient.listAppConnections} and returns a
   * normalized {@link ListAppConnectionsResult}: internal proto fields are
   * dropped and enum fields are decoded to strings. These are the connections
   * defined at the application level (e.g. tool/provider integrations), not the
   * SSO connections scoped to a specific organization.
   *
   * @param {object} [params] - Optional pagination and filtering parameters
   * @param {number} [params.pageSize] - Maximum number of connections to return per page (max 30)
   * @param {string} [params.pageToken] - Token identifying the page of results to return
   * @param {string} [params.provider] - Filter by provider key (case-sensitive, e.g. "SALESFORCE", "GMAIL")
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  listConnections(params?: {
    pageSize?: number;
    pageToken?: string;
    provider?: string;
  }): Promise<ListAppConnectionsResult>;
  /**
   * Delete a connected account.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  deleteConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<DeleteConnectedAccountResponse>;
  /**
   * Get connected account authorization details.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  getConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<GetConnectedAccountByIdentifierResponse>;
  /**
   * Create a new connected account.
   *
   * This helper accepts a high-level payload and builds the
   * underlying CreateConnectedAccount message.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connectionName or identifier is missing.
   */
  createConnectedAccount(params: {
    connectionName: string;
    identifier: string;
    /**
     * How the account authenticates, as a plain object (the shape `create()`
     * takes when the request is built).
     *
     * To connect a user's account, prefer {@link getAuthorizationLink}: it
     * creates the account if needed and the user completes authorization
     * through the link. OAuth credentials cannot be supplied directly.
     */
    authorizationDetails: MessageInitShape<typeof CreateConnectedAccountSchema>['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse>;
  /**
   * Get an existing connected account or create a new one if it doesn't exist.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connectionName or identifier is missing.
   */
  getOrCreateConnectedAccount(params: {
    connectionName: string;
    identifier: string; /** Same plain-object shape as {@link createConnectedAccount}. */
    authorizationDetails?: MessageInitShape<typeof CreateConnectedAccountSchema>['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse>;
  /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
  upsertConnectedAccount: (params: {
    connectionName: string;
    identifier: string; /** Same plain-object shape as {@link createConnectedAccount}. */
    authorizationDetails?: MessageInitShape<typeof CreateConnectedAccountSchema>["authorizationDetails"];
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }) => Promise<CreateConnectedAccountResponse>;
  /**
   * Update an existing connected account.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  updateConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    authorizationDetails?: UpdateConnectedAccount['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
    apiConfig?: UpdateConnectedAccount['apiConfig'];
  }): Promise<UpdateConnectedAccountResponse>;
  /**
   * Make a proxied REST API call on behalf of a connected account.
   *
   * @param params.timeoutMs Per-call request timeout in ms. Defaults to `toolTimeoutMs`
   *                         from the `ScalekitClient` constructor options (60000 by
   *                         default), since this proxies to a third-party API and can
   *                         legitimately run longer than a typical control-plane call.
   * @throws {ScalekitGatewayTimeoutException} If the request exceeds the timeout.
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing or an unexpected error occurs.
   * @throws {Error} If `path` resolves outside the proxy prefix (`<environment URL>/proxy/`),
   *                 for example through `..` segments, encoded dots or control characters.
   *                 Checked before any network call; every other path is sent unchanged.
   *
   * @remarks Redirects returned by the proxied API are followed as before. A redirect
   * hop that leaves the proxy prefix (another origin, or a same-origin path outside
   * `<environment URL>/proxy/`) is sent without the client's `Authorization`,
   * `connection_name` and `identifier` headers. So is a hop sent through an HTTP
   * forward proxy whose redirect location carries a fragment.
   */
  request(params: {
    connectionName: string;
    identifier: string;
    path: string;
    method?: string;
    queryParams?: Record<string, unknown>;
    body?: unknown;
    formData?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeoutMs?: number;
  }): Promise<AxiosResponse<any>>;
  /**
   * Upload a file of any size to a Google API that supports resumable
   * uploads (Drive v3, the Cloud Storage JSON API, YouTube Data API) through
   * a connected account.
   *
   * The content is sent in chunks (4 MiB by default), one request each, so
   * no single request runs long. After a timeout, a connection error or HTTP
   * 408, 429, 500, 502, 503 or 504, the SDK waits, asks the server how many
   * bytes it has and resumes from there instead of restarting. After a 308
   * that commits no new bytes, it waits and resends from the offset that 308
   * reported, without asking first. The session-start request is never
   * retried, because a retry would open a second session.
   *
   * Content can be bytes or a stream. A stream is read one chunk at a time
   * and never buffered whole. Its size is known for an unread
   * `fs.createReadStream(path)` without `start`/`end`; otherwise pass
   * `totalBytes`, or let the SDK send the size with the last chunk. Errors
   * from reading the stream propagate unchanged.
   *
   * @param params - What to upload and where. `connectionName`, `identifier`,
   *   `path` and `data` are required; see {@link ResumableUploadParams}.
   * @param options - Cancellation, timeout, retries and progress; see
   *   {@link ResumableUploadOptions}.
   * @returns The created or updated resource from the final response, such
   *   as the Drive file object (`{}` when that response has no body).
   * @throws {ScalekitValidationError} If an argument is invalid (before any
   *   request is sent), or if a stream is shorter or longer than `totalBytes`.
   * @throws {ScalekitUploadSessionExpiredException} If the upload session
   *   expired or no longer exists (HTTP 404/410 on a chunk). Upload again.
   * @throws {ScalekitUploadHttpException} If the session-start request fails,
   *   a chunk gets any other 4xx or 5xx (such as 403, 501 or 505) or a 2xx
   *   other than 200/201, or a retryable (408, 429, 500, 502, 503, 504)
   *   status persists after
   *   `maxRetries` retries. `status`, `headers` and `body` describe the response.
   * @throws {ScalekitUploadTimeoutException} If a request times out (a chunk:
   *   after `maxRetries` retries).
   * @throws {ScalekitUploadConnectionException} If a request gets no response
   *   (a chunk: after `maxRetries` retries).
   * @throws {ScalekitUploadProtocolException} If a response breaks the
   *   resumable protocol: the upload completes before the last chunk is sent,
   *   a chunk still commits no new bytes after `maxRetries` retries, or the
   *   final body is not a JSON object.
   * @throws {ScalekitAbortError} If `options.signal` is aborted.
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * ```ts
   * import fs from 'node:fs';
   *
   * const file = await scalekit.actions.uploadResumable(
   *   {
   *     connectionName: 'googledrive',
   *     identifier: 'user_123',
   *     path: '/upload/drive/v3/files',
   *     data: fs.createReadStream('video.mp4'),
   *     contentType: 'video/mp4',
   *     metadata: { name: 'video.mp4' },
   *   },
   *   { onProgress: (p) => console.log(p.bytesCommitted, p.totalBytes) }
   * );
   * console.log(file.id);
   * ```
   */
  uploadResumable(params: ResumableUploadParams, options?: ResumableUploadOptions): Promise<Record<string, unknown>>;
}
//#endregion
//#region src/pkg/grpc/scalekit/v1/events/events_pb.d.ts
/**
 * @generated from message scalekit.v1.events.ListEventsPaginatedResponse
 */
type ListEventsPaginatedResponse = Message<"scalekit.v1.events.ListEventsPaginatedResponse"> & {
  /**
   * @generated from field: repeated scalekit.v1.events.ScalekitEvent events = 1;
   */
  events: ScalekitEvent[];
  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken: string;
  /**
   * @generated from field: string prev_page_token = 3;
   */
  prevPageToken: string;
};
/**
 * @generated from message scalekit.v1.events.EventFilter
 */
type EventFilter = Message<"scalekit.v1.events.EventFilter"> & {
  /**
   * @generated from field: repeated string event_types = 1;
   */
  eventTypes: string[];
  /**
   * @generated from field: google.protobuf.Timestamp start_time = 2;
   */
  startTime?: Timestamp | undefined;
  /**
   * @generated from field: google.protobuf.Timestamp end_time = 3;
   */
  endTime?: Timestamp | undefined;
  /**
   * @generated from field: string organization_id = 4;
   */
  organizationId: string;
  /**
   * @generated from field: scalekit.v1.events.Source source = 5;
   */
  source: Source;
  /**
   * @generated from field: string auth_request_id = 6;
   */
  authRequestId: string;
  /**
   * @generated from field: optional string interceptor_id = 7;
   */
  interceptorId?: string | undefined;
  /**
   * @generated from field: optional string interceptor_status = 8;
   */
  interceptorStatus?: string | undefined;
  /**
   * @generated from field: optional string interceptor_decision = 9;
   */
  interceptorDecision?: string | undefined;
  /**
   * @generated from field: optional string connection_id = 10;
   */
  connectionId?: string | undefined;
  /**
   * map<string, string> metadata = 7 [(buf.validate.field).map = {
   *  keys: {
   *    string: {
   *      min_len: 3
   *      max_len: 25
   *    }
   *  }
   *  values: {
   *    string: {
   *      min_len: 1
   *      max_len: 2000
   *    }
   *  }
   * }];
   *  optional MetadataFilter metadata_filter = 6;
   *
   * @generated from field: optional string connected_account_id = 11;
   */
  connectedAccountId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.events.EventFilter.
 * Use `create(EventFilterSchema)` to create a new message.
 */
declare const EventFilterSchema: GenMessage<EventFilter>;
/**
 * @generated from message scalekit.v1.events.ScalekitEvent
 */
type ScalekitEvent = Message<"scalekit.v1.events.ScalekitEvent"> & {
  /**
   * @generated from field: string spec_version = 1;
   */
  specVersion: string;
  /**
   * @generated from field: string id = 2;
   */
  id: string;
  /**
   * Not adding a enum for forward compatibility
   *
   * @generated from field: string type = 3;
   */
  type: string;
  /**
   * @generated from field: google.protobuf.Timestamp occurred_at = 4;
   */
  occurredAt?: Timestamp | undefined;
  /**
   * @generated from field: string environment_id = 6;
   */
  environmentId: string;
  /**
   * @generated from field: optional string organization_id = 7;
   */
  organizationId?: string | undefined;
  /**
   * @generated from field: scalekit.v1.events.ObjectType object = 8;
   */
  object: ObjectType;
  /**
   * JSON - No Schema { id , object_type, data }
   *
   * @generated from field: google.protobuf.Struct data = 9;
   */
  data?: JsonObject$1 | undefined;
  /**
   * @generated from field: string display_name = 10;
   */
  displayName: string;
};
/**
 * @generated from enum scalekit.v1.events.Source
 */
declare enum Source {
  /**
   * @generated from enum value: SOURCE_UNSPECIFIED = 0;
   */
  SOURCE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: SCALEKIT = 1;
   */
  SCALEKIT = 1,
  /**
   * @generated from enum value: DIR_SYNC = 2;
   */
  DIR_SYNC = 2
}
/**
 * @generated from enum scalekit.v1.events.ObjectType
 */
declare enum ObjectType {
  /**
   * @generated from enum value: OBJECT_TYPE_UNSPECIFIED = 0;
   */
  OBJECT_TYPE_UNSPECIFIED = 0,
  /**
   * @generated from enum value: Workspace = 1;
   */
  Workspace = 1,
  /**
   * @generated from enum value: Environment = 2;
   */
  Environment = 2,
  /**
   * @generated from enum value: Organization = 3;
   */
  Organization = 3,
  /**
   * @generated from enum value: Connection = 4;
   */
  Connection = 4,
  /**
   * @generated from enum value: User = 5;
   */
  User = 5,
  /**
   * @generated from enum value: Role = 6;
   */
  Role = 6,
  /**
   * @generated from enum value: CustomAttributes = 7;
   */
  CustomAttributes = 7,
  /**
   * @generated from enum value: Directory = 8;
   */
  Directory = 8,
  /**
   * @generated from enum value: DirectoryUser = 9;
   */
  DirectoryUser = 9,
  /**
   * @generated from enum value: DirectoryGroup = 10;
   */
  DirectoryGroup = 10,
  /**
   * @generated from enum value: Session = 11;
   */
  Session = 11,
  /**
   * @generated from enum value: Template = 12;
   */
  Template = 12,
  /**
   * @generated from enum value: Job = 13;
   */
  Job = 13,
  /**
   * @generated from enum value: Domain = 14;
   */
  Domain = 14,
  /**
   * @generated from enum value: EmailServer = 15;
   */
  EmailServer = 15,
  /**
   * @generated from enum value: Email = 16;
   */
  Email = 16,
  /**
   * @generated from enum value: AuthRequest = 17;
   */
  AuthRequest = 17,
  /**
   * @generated from enum value: SAMLRequest = 18;
   */
  SAMLRequest = 18,
  /**
   * @generated from enum value: SAMLResponse = 19;
   */
  SAMLResponse = 19,
  /**
   * @generated from enum value: TokenClaims = 20;
   */
  TokenClaims = 20,
  /**
   * @generated from enum value: OIDCReqParams = 21;
   */
  OIDCReqParams = 21,
  /**
   * @generated from enum value: OIDCRespClaims = 22;
   */
  OIDCRespClaims = 22,
  /**
   * @generated from enum value: SSOError = 23;
   */
  SSOError = 23,
  /**
   * @generated from enum value: GenericError = 24;
   */
  GenericError = 24,
  /**
   * @generated from enum value: RefreshTokens = 25;
   */
  RefreshTokens = 25,
  /**
   * @generated from enum value: EndSessionRequest = 26;
   */
  EndSessionRequest = 26,
  /**
   * @generated from enum value: LogoutTokenClaims = 27;
   */
  LogoutTokenClaims = 27,
  /**
   * @generated from enum value: OAuthResponse = 28;
   */
  OAuthResponse = 28,
  /**
   * @generated from enum value: JSON = 29;
   */
  JSON = 29,
  /**
   * @generated from enum value: SKErrors = 30;
   */
  SKErrors = 30,
  /**
   * @generated from enum value: OrgMembership = 31;
   */
  OrgMembership = 31,
  /**
   * @generated from enum value: UserProfile = 32;
   */
  UserProfile = 32,
  /**
   * @generated from enum value: IDPInitiatedPayload = 33;
   */
  IDPInitiatedPayload = 33,
  /**
   * @generated from enum value: DeviceDetails = 34;
   */
  DeviceDetails = 34,
  /**
   * @generated from enum value: Actions = 35;
   */
  Actions = 35,
  /**
   * @generated from enum value: InterceptorEvent = 36;
   */
  InterceptorEvent = 36,
  /**
   * @generated from enum value: Permission = 37;
   */
  Permission = 37,
  /**
   * @generated from enum value: OrgMembershipEvent = 38;
   */
  OrgMembershipEvent = 38,
  /**
   * @generated from enum value: UserLoginEvent = 39;
   */
  UserLoginEvent = 39,
  /**
   * @generated from enum value: UserLogoutEvent = 40;
   */
  UserLogoutEvent = 40,
  /**
   * @generated from enum value: ConnectedAccount = 41;
   */
  ConnectedAccount = 41
}
//#endregion
//#region src/events.d.ts
/**
 * Client for reading Scalekit events.
 *
 * Events capture activity that occurs within your Scalekit environment — authentication
 * journeys, directory sync changes, connected-account activity, and more. Use this client
 * to page through the event log for auditing, monitoring, or building an activity feed.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const eventsClient = scalekitClient.events;
 *
 * @see {@link https://docs.scalekit.com/apis/ | Scalekit API Documentation}
 */
declare class EventsClient {
  private readonly grpcConnect;
  private readonly coreClient;
  private client;
  constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
  /**
   * Lists events for the current environment using cursor-based pagination.
   *
   * Returns a page of events ordered most-recent first. The response carries cursor tokens
   * for forward and backward pagination but omits the total event count. To page forward,
   * pass the returned `nextPageToken` as the `pageToken` on the next call.
   *
   * @param {number} [pageSize] - Number of events per page. Defaults to 10 and is clamped to 100 server-side.
   * @param {string} [pageToken] - Opaque cursor from a previous response (`nextPageToken`/`prevPageToken`).
   * @param {MessageInitShape<typeof EventFilterSchema>} [filter] - Optional filter. Accepts a plain
   *   object literal with any of: `eventTypes`, `startTime`, `endTime`, `organizationId`, `source`,
   *   `authRequestId`, `interceptorId`, `interceptorStatus`, `interceptorDecision`, `connectionId`,
   *   `connectedAccountId`. All fields are optional and fully type-checked.
   *
   * @returns {Promise<ListEventsPaginatedResponse>} A page of events with `nextPageToken` and `prevPageToken` cursors
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * const response = await scalekitClient.events.listEventsPaginated(10, '');
   * response.events.forEach((event) => console.log(event.type, event.object));
   *
   * @example
   * // With a filter — pass a plain object literal, no cast required.
   * const response = await scalekitClient.events.listEventsPaginated(25, '', {
   *   eventTypes: ['user.created'],
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/ | List Events API}
   */
  listEventsPaginated(pageSize?: number, pageToken?: string, filter?: MessageInitShape<typeof EventFilterSchema>): Promise<ListEventsPaginatedResponse>;
}
//#endregion
//#region src/scalekit.d.ts
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
 * @param {ScalekitOptions} [options] - Optional SDK configuration
 * @param {number} [options.timeoutMs=20000] - Timeout in ms for control-plane calls: gRPC RPCs (organizations, users, connections, etc) and the SDK's own HTTP calls (token endpoint, JWKS). Set below your infrastructure backend timeout (e.g. GCP LB = 30 s) so the SDK surfaces a clean error. Defaults to 20000.
 * @param {number} [options.toolTimeoutMs=60000] - Timeout in ms for tool-execution calls (`tools.*`, `actions.executeTool`, `actions.request`), which proxy to third-party provider APIs and can legitimately run longer. Connected-account methods under `actions.*` are control-plane operations and use `timeoutMs`. Defaults to 60000.
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
declare class ScalekitClient {
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
  readonly token: TokenClient;
  readonly m2m: M2MClient;
  readonly resources: ResourceClient;
  readonly tools: ToolsClient;
  readonly connectedAccounts: ConnectedAccountsClient;
  readonly actions: ActionsClient;
  readonly events: EventsClient;
  constructor(envUrl: string, clientId: string, clientSecret: string, options?: ScalekitOptions);
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
   * @param {string | string[]} [options.issuer] - Expected token issuer(s); the token is valid if its `iss` equals any entry
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
   * Generates an M2M access token using the client credentials grant for the given clientId and clientSecret.
   *
   * @param {string} clientId - The client ID to authenticate with
   * @param {string} clientSecret - The client secret to authenticate with
   * @returns {Promise<string>} The access token string
   * @throws {ScalekitServerException} If the server returns an error response (e.g. invalid credentials)
   * @throws {ScalekitException} If a network, DNS, or timeout failure occurs, or if the access token is missing from the response
   */
  generateClientToken(clientId: string, clientSecret: string): Promise<string>;
  /**
   * Generates an M2M access token using the stored client credentials (clientId and clientSecret
   * supplied to the ScalekitClient constructor).
   *
   * @returns {Promise<string>} The access token string
   */
  getClientAccessToken(): Promise<string>;
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
//#endregion
//#region src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb.d.ts
/**
 * @generated from message scalekit.v1.errdetails.ErrorInfo
 */
type ErrorInfo = Message<"scalekit.v1.errdetails.ErrorInfo"> & {
  /**
   * @generated from field: string error_code = 1;
   */
  errorCode: string;
  /**
   * @generated from field: optional scalekit.v1.errdetails.DebugInfo debug_info = 2;
   */
  debugInfo?: DebugInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.HelpInfo help_info = 3;
   */
  helpInfo?: HelpInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.LocalizedMessageInfo localized_message_info = 4;
   */
  localizedMessageInfo?: LocalizedMessageInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.ResourceInfo resource_info = 5;
   */
  resourceInfo?: ResourceInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.RequestInfo request_info = 6;
   */
  requestInfo?: RequestInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.ValidationErrorInfo validation_error_info = 8;
   */
  validationErrorInfo?: ValidationErrorInfo | undefined;
  /**
   * @generated from field: optional scalekit.v1.errdetails.ToolErrorInfo tool_error_info = 9;
   */
  toolErrorInfo?: ToolErrorInfo | undefined;
};
/**
 * Describes additional debugging info.
 *
 * @generated from message scalekit.v1.errdetails.DebugInfo
 */
type DebugInfo = Message<"scalekit.v1.errdetails.DebugInfo"> & {
  /**
   * The stack trace entries indicating where the error occurred.
   *
   * @generated from field: repeated string stack_entries = 1;
   */
  stackEntries: string[];
  /**
   * Additional debugging information provided by the server.
   *
   * @generated from field: string detail = 2;
   */
  detail: string;
};
/**
 * Describes violations in a client request. This error type focuses on the
 * syntactic aspects of the request.
 *
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo
 */
type ValidationErrorInfo = Message<"scalekit.v1.errdetails.ValidationErrorInfo"> & {
  /**
   * Describes all violations in a client request.
   *
   * @generated from field: repeated scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation field_violations = 1;
   */
  fieldViolations: ValidationErrorInfo_FieldViolation[];
};
/**
 * A message type used to describe a single bad request field.
 *
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation
 */
type ValidationErrorInfo_FieldViolation = Message<"scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation"> & {
  /**
   * @generated from field: string field = 1;
   */
  field: string;
  /**
   * A description of why the request element is bad.
   *
   * @generated from field: string description = 2;
   */
  description: string;
  /**
   * @generated from field: string constraint = 3;
   */
  constraint: string;
};
/**
 * Contains metadata about the request that clients can attach when filing a bug
 * or providing other forms of feedback.
 *
 * @generated from message scalekit.v1.errdetails.RequestInfo
 */
type RequestInfo = Message<"scalekit.v1.errdetails.RequestInfo"> & {
  /**
   * An opaque string that should only be interpreted by the service generating
   * it. For example, it can be used to identify requests in the service's logs.
   *
   * @generated from field: string request_id = 1;
   */
  requestId: string;
  /**
   * Any data that was used to serve this request. For example, an encrypted
   * stack trace that can be sent back to the service provider for debugging.
   *
   * @generated from field: string serving_data = 2;
   */
  servingData: string;
};
/**
 * Describes the resource that is being accessed.
 *
 * @generated from message scalekit.v1.errdetails.ResourceInfo
 */
type ResourceInfo = Message<"scalekit.v1.errdetails.ResourceInfo"> & {
  /**
   * @generated from field: string resource_name = 2;
   */
  resourceName: string;
  /**
   * @generated from field: string owner = 3;
   */
  owner: string;
  /**
   * Describes what error is encountered when accessing this resource.
   * For example, updating a cloud project may require the `writer` permission
   * on the developer console project.
   *
   * @generated from field: string description = 4;
   */
  description: string;
  /**
   * The required permissions needed to access the resource.
   *
   * @generated from field: repeated string required_permissions = 5;
   */
  requiredPermissions: string[];
  /**
   * @generated from field: string user = 6;
   */
  user: string;
};
/**
 * HelpInfo provides documentation links attached to an error response.
 * When present in ErrorInfo, clients should surface these links to help
 * developers resolve the error. For example, a missing required field error
 * may include a link to the relevant guide.
 *
 * @generated from message scalekit.v1.errdetails.HelpInfo
 */
type HelpInfo = Message<"scalekit.v1.errdetails.HelpInfo"> & {
  /**
   * One or more links relevant to resolving the error.
   *
   * @generated from field: repeated scalekit.v1.errdetails.HelpInfo.Link links = 1;
   */
  links: HelpInfo_Link[];
};
/**
 * A documentation or reference link.
 *
 * @generated from message scalekit.v1.errdetails.HelpInfo.Link
 */
type HelpInfo_Link = Message<"scalekit.v1.errdetails.HelpInfo.Link"> & {
  /**
   * Human-readable label for the link (e.g. "User verification flow").
   *
   * @generated from field: string description = 1;
   */
  description: string;
  /**
   * Absolute URL to the documentation page (e.g. "https://docs.scalekit.com/...").
   *
   * @generated from field: string url = 2;
   */
  url: string;
};
/**
 * @generated from message scalekit.v1.errdetails.LocalizedMessageInfo
 */
type LocalizedMessageInfo = Message<"scalekit.v1.errdetails.LocalizedMessageInfo"> & {
  /**
   * @generated from field: string locale = 1;
   */
  locale: string;
  /**
   * @generated from field: string message = 2;
   */
  message: string;
};
/**
 * @generated from message scalekit.v1.errdetails.ToolErrorInfo
 */
type ToolErrorInfo = Message<"scalekit.v1.errdetails.ToolErrorInfo"> & {
  /**
   * @generated from field: string execution_id = 1;
   */
  executionId: string;
  /**
   * @generated from field: string tool_error_message = 2;
   */
  toolErrorMessage: string;
  /**
   * @generated from field: string tool_error_code = 3;
   */
  toolErrorCode: string;
};
//#endregion
//#region src/errors/base-exception.d.ts
declare class ScalekitException extends Error {
  constructor(error: any);
}
/**
 * A method argument is invalid. Thrown before any network call, so nothing
 * was sent. Fix the argument named in the message; retrying unchanged fails
 * the same way.
 */
declare class ScalekitValidationError extends ScalekitException {
  /** Always `false`: the same input fails the same way. */
  readonly retryable: boolean;
  /** @internal */
  constructor(message: string);
}
/**
 * The caller's `AbortSignal` cancelled the call, including during a wait
 * between retries. `cause` is the signal's `reason`.
 */
declare class ScalekitAbortError extends ScalekitException {
  /** Always `false`: the caller asked to stop. */
  readonly retryable: boolean;
  /** The aborting signal's `reason`. */
  readonly cause: unknown;
  /** @internal */
  constructor(message: string, cause?: unknown);
}
declare class WebhookVerificationError extends ScalekitException {
  /**
   * The underlying error that caused this one, when there is one (for example
   * the decoding error behind an invalid request body).
   */
  cause?: unknown;
  constructor(error: any, options?: {
    cause?: unknown;
  });
}
declare class ScalekitValidateTokenFailureException extends ScalekitException {
  constructor(error: any);
}
declare class ScalekitServerException extends ScalekitException {
  private _grpcStatus;
  private _httpStatus;
  private _message;
  private _errDetails;
  private _errorCode;
  private _unpackedDetails;
  constructor(error: AxiosResponse | ConnectError);
  private isAxiosResponse;
  toString(): string;
  private getGrpcStatusName;
  private getHttpStatusName;
  get grpcStatus(): Code;
  get httpStatus(): number;
  get errorCode(): string | null;
  get message(): string;
  get errDetails(): any;
  get unpackedDetails(): ErrorInfo[];
  static promote(error: AxiosResponse | ConnectError, isToolError?: boolean): ScalekitServerException;
}
/**
 * Interface implemented by all tool exceptions.
 * Enables type-safe narrowing without relying on multiple inheritance.
 */
interface IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
}
/**
 * Type guard: returns true for any exception that originated from an upstream
 * tool provider (i.e. has errorCode == "TOOL_ERROR" in the gRPC status details).
 *
 * Usage:
 *   catch (e) {
 *     if (isToolException(e)) { // e is IScalekitToolException here
 *       console.log(e.toolErrorCode, e.executionId);
 *     }
 *   }
 */
declare function isToolException(e: unknown): e is IScalekitToolException;
declare class ScalekitBadRequestException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitUnauthorizedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitForbiddenException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitNotFoundException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitConflictException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitTooManyRequestsException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitInternalServerException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitNotImplementedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitServiceUnavailableException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitGatewayTimeoutException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
  static isAxiosTimeout(error: AxiosError): boolean;
  /**
   * An axios timeout carries no response, so it can't go through `promote`.
   * Wrap it as a DeadlineExceeded ConnectError so HTTP timeouts surface as
   * the same exception type as gRPC deadline expiry.
   */
  static fromAxiosTimeout(error: AxiosError): ScalekitGatewayTimeoutException;
}
declare class ScalekitCancelledException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
declare class ScalekitUnknownException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns a rate-limit (429) error.
 * Extends ScalekitTooManyRequestsException for backward compatibility.
 */
declare class ScalekitToolRateLimitException extends ScalekitTooManyRequestsException implements IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
  constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns an unauthorized (401) error.
 * Extends ScalekitUnauthorizedException for backward compatibility.
 */
declare class ScalekitToolUnauthorizedException extends ScalekitUnauthorizedException implements IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
  constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns a forbidden (403) error.
 * Extends ScalekitForbiddenException for backward compatibility.
 */
declare class ScalekitToolForbiddenException extends ScalekitForbiddenException implements IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
  constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns any other error during tool execution.
 * Extends ScalekitServerException as a general-purpose base.
 */
declare class ScalekitToolException extends ScalekitServerException implements IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
  constructor(error: AxiosResponse | ConnectError);
}
/**
 * Thrown by `verifyTriggerEvent` and `scalekit.actions.triggers.verifyEvent`
 * when a trigger event's signature is valid but its body is not a trigger
 * event this SDK can read: not JSON, not a JSON object, a required field
 * missing or of the wrong type, or an `occurred_at` that is not an RFC 3339
 * timestamp with an offset.
 *
 * It extends {@link WebhookVerificationError}, so a handler that answers
 * `400` on `WebhookVerificationError` covers it too. Catch it separately when
 * you want to tell "not from Scalekit" apart from "from Scalekit, but
 * unreadable". The message names the field; it never contains the body or
 * the secret.
 */
declare class ScalekitTriggerEventParseError extends WebhookVerificationError {
  /** @internal */
  constructor(message: string, options?: {
    cause?: unknown;
  });
}
//#endregion
//#region src/errors/upload-exceptions.d.ts
/**
 * An upload request got an HTTP error response.
 *
 * Raised when the session-start request fails (then `uploadId` is
 * `undefined`), when a chunk gets a 4xx other than 404/410, a 5xx that is
 * not retryable (such as 501 or 505), or a 2xx other
 * than 200/201, and when a
 * retryable status (408, 429, 500, 502, 503, 504) is still failing after
 * `maxRetries` retries. `status` is the real HTTP status; `httpStatus`
 * returns the same value.
 */
declare class ScalekitUploadHttpException extends ScalekitServerException {
  /** Upload session ID, or `undefined` when the session-start request failed. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** HTTP status of the failed response. */
  readonly status: number;
  /** Response headers, with lower-case names. */
  readonly headers: Readonly<Record<string, string>>;
  /** Response body: parsed JSON when it is JSON, otherwise the text. */
  readonly body: unknown;
  /** Whether a new attempt at the whole upload may succeed (408, 429, 500, 502, 503, 504). */
  readonly retryable: boolean;
  /** The underlying transport error. */
  readonly cause: unknown;
  /** @internal */
  constructor(init: {
    message: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: unknown;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  });
  /** The HTTP status of the failed response (same as `status`). */
  get httpStatus(): number;
  toString(): string;
}
/**
 * The upload session no longer exists: a chunk or status request got 404 or
 * 410. Google upload sessions expire after about a week. The SDK does not
 * start a new session on its own; call `uploadResumable` again to upload
 * from the beginning.
 */
declare class ScalekitUploadSessionExpiredException extends ScalekitUploadHttpException {
  /** @internal */
  constructor(init: ConstructorParameters<typeof ScalekitUploadHttpException>[0]);
}
/**
 * The server's response broke the resumable-upload protocol: no `upload_id`
 * in the session-start response, a malformed or out-of-range `Range` header,
 * an unexpected redirect, a completed upload before the last chunk was sent
 * (so a truncated file is never returned), a chunk that still commits no new
 * bytes after `maxRetries` retries, or a final response body that is not a
 * JSON object.
 */
declare class ScalekitUploadProtocolException extends ScalekitException {
  /** Upload session ID, or `undefined` when the session was not started. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** HTTP status of the offending response, when there was one. */
  readonly status: number | undefined;
  /** Headers of the offending response, when there was one. */
  readonly headers: Readonly<Record<string, string>> | undefined;
  /** Body of the offending response, when there was one. */
  readonly body: unknown;
  /** Always `false`. */
  readonly retryable: boolean;
  readonly cause: unknown;
  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    status?: number;
    headers?: Record<string, string>;
    body?: unknown;
    cause?: unknown;
  });
}
/**
 * An upload request timed out. On a chunk this is raised only after
 * `maxRetries` retries; the session-start request is never retried.
 * Extends `ScalekitGatewayTimeoutException`, the type other SDK calls raise
 * on a timeout.
 */
declare class ScalekitUploadTimeoutException extends ScalekitGatewayTimeoutException {
  /** Upload session ID, or `undefined` when the session-start request timed out. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** Always `true`. */
  readonly retryable: boolean;
  readonly cause: unknown;
  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  });
  toString(): string;
}
/**
 * An upload request got no response (connection refused or reset, DNS
 * failure). On a chunk this is raised only after `maxRetries` retries; the
 * session-start request is never retried.
 */
declare class ScalekitUploadConnectionException extends ScalekitException {
  /** Upload session ID, or `undefined` when the session-start request failed. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** Always `true`. */
  readonly retryable: boolean;
  readonly cause: unknown;
  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  });
}
declare namespace exports_d_exports {
  export { ActionTool, AuthField, AuthPattern, AuthRequestClient, AuthRequestDetails, AuthRequestResource, AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, Connection, ConnectionAuthMode, ConnectionProvider, ConnectionReadiness, ConnectionType, ConnectorStatus, ConnectorType, CreateConnection, CreateConnectionResponse, CreateMcpConfigResponse, CreateMcpSessionTokenParams, CreateMcpSessionTokenResponse, CreateProviderResponse, DeleteMcpConfigResponse, DeleteProviderResponse, DeliveryScope, DetectionMode, EventFilter, Flags, GetConnectionResponse, GetLoginRequestDetailsResponse, GetMcpConfigResponse, GetResourceResponse, GrantType, IScalekitToolException, IdTokenClaim, IdTokenClaimIdentity, Identity, IdpInitiatedLoginClaims, JsonObject, JsonValue, ListMcpConfigsResponse, ListMcpConnectedAccountsResponse, ListProvidersResponse, ListResourcesResponse, ListToolsResponse, ListToolsResult, LogoutUrlOptions, McpConfig, McpConfigConnectionToolMapping, McpSessionTokenAccessLevel, ObjectType, PayloadState, Provider, ProviderType, RefreshTokenResponse, Resource, ResourceType, ResumableUploadMethod, ResumableUploadOptions, ResumableUploadParams, ScalekitClient as Scalekit, ScalekitAbortError, ScalekitBadRequestException, ScalekitCancelledException, ScalekitClient, ScalekitConflictException, ScalekitException, ScalekitForbiddenException, ScalekitGatewayTimeoutException, ScalekitInternalServerException, ScalekitNotFoundException, ScalekitNotImplementedException, ScalekitOptions, ScalekitServerException, ScalekitServiceUnavailableException, ScalekitTooManyRequestsException, ScalekitToolException, ScalekitToolForbiddenException, ScalekitToolRateLimitException, ScalekitToolUnauthorizedException, ScalekitTriggerEventParseError, ScalekitUnauthorizedException, ScalekitUnknownException, ScalekitUploadConnectionException, ScalekitUploadHttpException, ScalekitUploadProtocolException, ScalekitUploadSessionExpiredException, ScalekitUploadTimeoutException, ScalekitValidateTokenFailureException, ScalekitValidationError, Scope, SearchToolsResponse, SearchedTool, Source, TokenResponse, TokenValidationOptions, Tool, ToolReadinessState, TriggerEvent, TriggerEventHeaders, TriggerEventVerifyParams, TriggersClient, UpdateConnection, UpdateConnectionResponse, UpdateMcpConfigResponse, UpdateProviderResponse, UploadProgress, User, WebhookVerificationError, isToolException, verifyTriggerEvent };
}
//#endregion
//#region src/index.d.ts
declare const DefaultExport: typeof ScalekitClient & typeof exports_d_exports & {
  default: typeof ScalekitClient;
};
type DefaultExport = ScalekitClient;
//#endregion
export { type ActionTool, type AuthField, type AuthPattern, type AuthRequestClient, type AuthRequestDetails, type AuthRequestResource, AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, type Connection, ConnectionAuthMode, ConnectionProvider, type ConnectionReadiness, ConnectionType, ConnectorStatus, ConnectorType, type CreateConnection, type CreateConnectionResponse, type CreateMcpConfigResponse, type CreateMcpSessionTokenParams, type CreateMcpSessionTokenResponse, type CreateProviderResponse, type DeleteMcpConfigResponse, type DeleteProviderResponse, DeliveryScope, DetectionMode, type EventFilter, type Flags, type GetConnectionResponse, type GetLoginRequestDetailsResponse, type GetMcpConfigResponse, type GetResourceResponse, GrantType, type IScalekitToolException, IdTokenClaim, IdTokenClaimIdentity, Identity, IdpInitiatedLoginClaims, type JsonObject, type JsonValue, type ListMcpConfigsResponse, type ListMcpConnectedAccountsResponse, type ListProvidersResponse, type ListResourcesResponse, type ListToolsResponse, type ListToolsResult, LogoutUrlOptions, type McpConfig, type McpConfigConnectionToolMapping, type McpSessionTokenAccessLevel, ObjectType, PayloadState, type Provider, ProviderType, RefreshTokenResponse, type Resource, ResourceType, type ResumableUploadMethod, type ResumableUploadOptions, type ResumableUploadParams, ScalekitClient as Scalekit, ScalekitClient, ScalekitAbortError, ScalekitBadRequestException, ScalekitCancelledException, ScalekitConflictException, ScalekitException, ScalekitForbiddenException, ScalekitGatewayTimeoutException, ScalekitInternalServerException, ScalekitNotFoundException, ScalekitNotImplementedException, ScalekitOptions, ScalekitServerException, ScalekitServiceUnavailableException, ScalekitTooManyRequestsException, ScalekitToolException, ScalekitToolForbiddenException, ScalekitToolRateLimitException, ScalekitToolUnauthorizedException, ScalekitTriggerEventParseError, ScalekitUnauthorizedException, ScalekitUnknownException, ScalekitUploadConnectionException, ScalekitUploadHttpException, ScalekitUploadProtocolException, ScalekitUploadSessionExpiredException, ScalekitUploadTimeoutException, ScalekitValidateTokenFailureException, ScalekitValidationError, type Scope, type SearchToolsResponse, type SearchedTool, Source, TokenResponse, TokenValidationOptions, type Tool, ToolReadinessState, type TriggerEvent, type TriggerEventHeaders, type TriggerEventVerifyParams, type TriggersClient, type UpdateConnection, type UpdateConnectionResponse, type UpdateMcpConfigResponse, type UpdateProviderResponse, type UploadProgress, User, WebhookVerificationError, DefaultExport as default, isToolException, verifyTriggerEvent };
//# sourceMappingURL=index.d.cts.map