import { create } from '@bufbuild/protobuf';
import { FieldMaskSchema } from '@bufbuild/protobuf/wkt';
import type ConnectionClient from './connection';
import { ScalekitValidationError } from './errors';
import { toAgentKitConnectionError } from './errors/agentkit-connection-exceptions';
import {
  AppConnection,
  AppConnectionUpdateSchema,
  AppOAuthConfig_TokenEndpointAuthMethod,
  AppOAuthConfigSchema,
  AppProviderConfigurationsSchema,
  ConnectionAuthMode,
  CreateAppConnectionRequestSchema,
  CreateAppConnectionSchema,
  GoogleDWDConfigSchema,
  ListAppConnectionSummariesResponse,
  OptionalScopesSchema,
  StaticAuthConfigSchema,
  UpdateAppConnectionRequestSchema,
} from './pkg/grpc/scalekit/v1/connections/connections_pb';
import type { JsonObject } from '@bufbuild/protobuf';

/** How end users authorize a connection. Chosen at creation; it cannot be changed afterwards. */
export type AgentKitAuthMode = 'USER' | 'ORG_WIDE';

/** Token endpoint client authentication. `'DEFAULT'` clears the stored value so the platform picks. */
export type AgentKitTokenEndpointAuthMethod =
  | 'NONE'
  | 'BASIC_AUTH'
  | 'REQUEST_BODY'
  | 'DEFAULT';

/**
 * Settings only some connectors use. At creation only `providerDomain` is accepted;
 * set the others with `updateConnection`. `providerDomain` cannot be changed after creation.
 */
export interface AgentKitProviderConfigurations {
  /** Regional connectors only, for example `'mcp-eu.mixpanel.com'`. Create only; never returned. */
  providerDomain?: string;
  /** Slack only: `'BOT'` or `'USER'`. */
  slackConnectionType?: 'BOT' | 'USER';
  /** Google Ads only. Masked on read; cannot be cleared once set. */
  googleadsDeveloperToken?: string;
  /** Microsoft connectors that declare a tenant. */
  microsoftTenantId?: string;
  /** Trello only. Update only. */
  trelloAppName?: string;
  /** SMART on FHIR connections only. */
  smartFhirAud?: string;
  /** SMART on FHIR connections only. */
  smartFhirDomain?: string;
}

/**
 * OAuth settings. Every field is optional: a field you leave out keeps its stored value.
 * A list or map you pass **empty** (`[]`, `{}`) is cleared. Secrets are masked on read.
 */
export interface AgentKitOAuthSettings {
  authorizeUri?: string;
  tokenUri?: string;
  userInfoUri?: string;
  /** Sending your own `clientId` or `clientSecret` turns `useScalekitCreds` off unless you set it. */
  clientId?: string;
  clientSecret?: string;
  /** A non-empty list replaces the stored scopes; `[]` clears them. */
  scopes?: string[];
  pkceEnabled?: boolean;
  /** Sent to the provider as `prompt`. `''` means no prompt is sent. */
  prompt?: string;
  useScalekitCreds?: boolean;
  accessType?: string;
  tokenAccessType?: string;
  optionalScopes?: { scopes?: string[]; fieldName?: string };
  /** Added as given to the provider's authorize URL. A non-empty map replaces the stored one; `{}` clears it. */
  extraAuthorizeParams?: Record<string, string>;
  tokenEndpointAuthMethod?: AgentKitTokenEndpointAuthMethod;
  scopeSelectionAllowed?: boolean;
  requiredScopes?: string[];
  requiredOptionalScopes?: string[];
}

/** Google domain-wide delegation settings. */
export interface AgentKitGoogleDwdSettings {
  /** The service account key file, stringified. */
  serviceAccountJson?: string;
  scopes?: string[];
  tokenUri?: string;
  scopeSelectionAllowed?: boolean;
  requiredScopes?: string[];
}

/** Static auth settings (API key, bearer and similar), as a JSON object. */
export type AgentKitStaticSettings = JsonObject;

export interface CreateConnectionParams {
  /** Connector identifier, for example `'GMAIL'` (case-insensitive), or a custom connector's identifier. */
  provider: string;
  /** Letters, digits and hyphens, unique per environment. Generated when omitted. */
  connectionName?: string;
  /** `'USER'` (default) or `'ORG_WIDE'`. */
  authMode?: AgentKitAuthMode;
  /** Required for regional connectors such as MIXPANELMCP and HONEYCOMBMCP; not allowed for others. */
  providerDomain?: string;
}

export interface ListAppConnectionsParams {
  provider?: string;
  /** At least 3 characters; matches name, provider and display name. */
  query?: string;
  /** 0 or omitted means 10; at most 100. */
  pageSize?: number;
  pageToken?: string;
}

/** Name or ID of the connection. Give exactly one. */
export interface ConnectionRef {
  connectionName?: string;
  connectionId?: string;
}

export interface UpdateConnectionParams extends ConnectionRef {
  /** Renames the connection. Same rules as at creation. */
  newConnectionName?: string;
  /** Send exactly one of `oauth`, `googleDwd` or `staticConfig`. */
  oauth?: AgentKitOAuthSettings;
  googleDwd?: AgentKitGoogleDwdSettings;
  staticConfig?: AgentKitStaticSettings;
  /** Only valid together with `oauth`, or on its own for connector-specific settings. */
  providerConfigurations?: AgentKitProviderConfigurations;
}

/** Own-property check, so inherited names such as 'toString' or 'constructor' are not accepted as enum values. */
const hasOwn = (obj: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

const AUTH_MODES: Record<AgentKitAuthMode, ConnectionAuthMode> = {
  USER: ConnectionAuthMode.USER,
  ORG_WIDE: ConnectionAuthMode.ORG_WIDE,
};

const TOKEN_AUTH_METHODS: Record<
  AgentKitTokenEndpointAuthMethod,
  AppOAuthConfig_TokenEndpointAuthMethod
> = {
  NONE: AppOAuthConfig_TokenEndpointAuthMethod.NONE,
  BASIC_AUTH: AppOAuthConfig_TokenEndpointAuthMethod.BASIC_AUTH,
  REQUEST_BODY: AppOAuthConfig_TokenEndpointAuthMethod.REQUEST_BODY,
  DEFAULT: AppOAuthConfig_TokenEndpointAuthMethod.DEFAULT,
};

const CONNECTION_ID = /^conn_\d+$/;

/** A string that looks like `conn_<digits>` is an ID; anything else is a name. An object is used as given. */
export function toRef(connection: string | ConnectionRef): ConnectionRef {
  if (typeof connection !== 'string') return connection;
  const value = connection.trim();
  return CONNECTION_ID.test(value)
    ? { connectionId: value }
    : { connectionName: value };
}

function invalid(message: string): ScalekitValidationError {
  return new ScalekitValidationError(message);
}

function pick<T extends object, K extends keyof T>(
  source: T,
  keys: K[]
): Partial<Pick<T, K>> {
  const out: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

function providerConfigurations(settings: AgentKitProviderConfigurations) {
  return create(
    AppProviderConfigurationsSchema,
    pick(settings, [
      'providerDomain',
      'slackConnectionType',
      'googleadsDeveloperToken',
      'microsoftTenantId',
      'trelloAppName',
      'smartFhirAud',
      'smartFhirDomain',
    ])
  );
}

/** Builds the OAuth message and records the list/map settings that are sent empty, which the server clears. */
function oauthConfig(settings: AgentKitOAuthSettings, cleared: string[]) {
  const {
    optionalScopes,
    extraAuthorizeParams,
    tokenEndpointAuthMethod,
    scopes,
    requiredScopes,
    requiredOptionalScopes,
  } = settings;
  if (tokenEndpointAuthMethod !== undefined) {
    if (!hasOwn(TOKEN_AUTH_METHODS, tokenEndpointAuthMethod)) {
      throw invalid(
        'tokenEndpointAuthMethod must be one of NONE, BASIC_AUTH, REQUEST_BODY or DEFAULT'
      );
    }
  }
  if (scopes?.length === 0) cleared.push('oauth_config.scopes');
  if (requiredScopes?.length === 0) {
    cleared.push('oauth_config.required_scopes');
  }
  if (requiredOptionalScopes?.length === 0) {
    cleared.push('oauth_config.required_optional_scopes');
  }
  if (optionalScopes?.scopes?.length === 0) {
    cleared.push('oauth_config.optional_scopes.scopes');
  }
  if (extraAuthorizeParams && Object.keys(extraAuthorizeParams).length === 0) {
    cleared.push('oauth_config.extra_authorize_params');
  }
  return create(AppOAuthConfigSchema, {
    ...pick(settings, [
      'authorizeUri',
      'tokenUri',
      'userInfoUri',
      'clientId',
      'clientSecret',
      'pkceEnabled',
      'prompt',
      'useScalekitCreds',
      'accessType',
      'tokenAccessType',
      'scopeSelectionAllowed',
    ]),
    ...(scopes && { scopes }),
    ...(requiredScopes && { requiredScopes }),
    ...(requiredOptionalScopes && { requiredOptionalScopes }),
    ...(extraAuthorizeParams && { extraAuthorizeParams }),
    ...(optionalScopes && {
      optionalScopes: create(OptionalScopesSchema, {
        scopes: optionalScopes.scopes ?? [],
        fieldName: optionalScopes.fieldName ?? '',
      }),
    }),
    ...(tokenEndpointAuthMethod !== undefined && {
      tokenEndpointAuthMethod: TOKEN_AUTH_METHODS[tokenEndpointAuthMethod],
    }),
  });
}

function googleDwdConfig(
  settings: AgentKitGoogleDwdSettings,
  cleared: string[]
) {
  if (settings.scopes?.length === 0) cleared.push('google_dwd_config.scopes');
  if (settings.requiredScopes?.length === 0) {
    cleared.push('google_dwd_config.required_scopes');
  }
  return create(GoogleDWDConfigSchema, {
    ...pick(settings, [
      'serviceAccountJson',
      'tokenUri',
      'scopeSelectionAllowed',
    ]),
    ...(settings.scopes && { scopes: settings.scopes }),
    ...(settings.requiredScopes && { requiredScopes: settings.requiredScopes }),
  });
}

/**
 * AgentKit connection methods behind `scalekit.actions.createConnection` and friends.
 * They call the AgentKit-only connection APIs (`/api/v1/agentkit/connection`) for create, get, list and
 * update, and the environment connection RPCs for enable, disable and delete.
 * @internal
 */
export class AgentKitConnections {
  constructor(private readonly connection: ConnectionClient) {}

  async create(params: CreateConnectionParams): Promise<AppConnection> {
    const provider = (params?.provider ?? '').trim();
    if (!provider) {
      throw invalid("provider is required, for example 'GMAIL'.");
    }
    if (params.authMode !== undefined && !hasOwn(AUTH_MODES, params.authMode)) {
      throw invalid("authMode must be 'USER' or 'ORG_WIDE'");
    }
    const request = create(CreateAppConnectionRequestSchema, {
      connection: create(CreateAppConnectionSchema, {
        provider,
        ...(params.connectionName !== undefined && {
          connectionName: params.connectionName,
        }),
        ...(params.authMode !== undefined && {
          authMode: AUTH_MODES[params.authMode],
        }),
        ...(params.providerDomain !== undefined && {
          providerConfigurations: providerConfigurations({
            providerDomain: params.providerDomain,
          }),
        }),
      }),
    });
    try {
      const response = await this.connection.createAppConnection(request);
      return response.connection as AppConnection;
    } catch (error) {
      throw toAgentKitConnectionError(error, 'write');
    }
  }

  async get(ref: ConnectionRef | string): Promise<AppConnection> {
    const identifier = this.identifierOf(ref);
    try {
      const response = await this.connection.getAppConnection(identifier);
      return response.connection as AppConnection;
    } catch (error) {
      throw toAgentKitConnectionError(error, 'read');
    }
  }

  async list(
    params?: ListAppConnectionsParams
  ): Promise<ListAppConnectionSummariesResponse> {
    if (params?.query !== undefined && params.query.trim().length < 3) {
      throw invalid('query needs at least 3 characters');
    }
    try {
      return await this.connection.listAppConnectionSummaries(params);
    } catch (error) {
      throw toAgentKitConnectionError(error, 'read');
    }
  }

  async update(params: UpdateConnectionParams): Promise<AppConnection> {
    const groups = [params.oauth, params.googleDwd, params.staticConfig].filter(
      (group) => group !== undefined
    );
    if (groups.length > 1) {
      throw invalid('send only one of oauth, googleDwd or staticConfig');
    }
    if (
      groups.length === 0 &&
      params.providerConfigurations === undefined &&
      params.newConnectionName === undefined
    ) {
      throw invalid(
        'nothing to update: pass oauth, googleDwd, staticConfig, providerConfigurations or newConnectionName'
      );
    }
    const cleared: string[] = [];
    const body = create(AppConnectionUpdateSchema, {
      ...(params.oauth && { oauthConfig: oauthConfig(params.oauth, cleared) }),
      ...(params.googleDwd && {
        googleDwdConfig: googleDwdConfig(params.googleDwd, cleared),
      }),
      ...(params.staticConfig && {
        staticConfig: create(StaticAuthConfigSchema, {
          staticConfig: params.staticConfig,
        }),
      }),
      ...(params.providerConfigurations && {
        providerConfigurations: providerConfigurations(
          params.providerConfigurations
        ),
      }),
      ...(params.newConnectionName !== undefined && {
        connectionName: params.newConnectionName,
      }),
    });
    const connectionId = await this.idOf(params);
    // The SDK talks gRPC, so the gateway does not derive the mask from the body. The server clears a
    // list or map only when it is sent empty and its path is in the mask; everything else is a partial merge.
    const request = create(UpdateAppConnectionRequestSchema, {
      connectionId,
      connection: body,
      ...(cleared.length > 0 && {
        updateMask: create(FieldMaskSchema, { paths: cleared }),
      }),
    });
    try {
      const response = await this.connection.updateAppConnection(request);
      return response.connection as AppConnection;
    } catch (error) {
      throw toAgentKitConnectionError(error, 'write');
    }
  }

  async delete(ref: ConnectionRef): Promise<void> {
    const connectionId = await this.idOf(ref);
    try {
      await this.connection.deleteEnvironmentConnection(connectionId);
    } catch (error) {
      throw toAgentKitConnectionError(error, 'write');
    }
  }

  private identifierOf(ref: ConnectionRef | string): string {
    if (typeof ref === 'string') {
      if (!ref.trim()) throw invalid('connection name or id is required');
      return ref.trim();
    }
    const name = ref?.connectionName?.trim();
    const id = ref?.connectionId?.trim();
    if (name && id) {
      throw invalid('pass connectionName or connectionId, not both');
    }
    if (!name && !id)
      throw invalid('connectionName or connectionId is required');
    return (name || id) as string;
  }

  /** The connection ID: validated when given, resolved with one read when only a name is given. */
  private async idOf(ref: ConnectionRef): Promise<string> {
    const identifier = this.identifierOf(ref);
    if (ref.connectionId) {
      if (!CONNECTION_ID.test(identifier)) {
        throw invalid(
          'connectionId is not valid; connection ids look like conn_...'
        );
      }
      return identifier;
    }
    return (await this.get(identifier)).id;
  }
}
