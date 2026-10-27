import type ConnectionClient from './connection';
import { AppConnection, ListAppConnectionSummariesResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';
import type { JsonObject } from '@bufbuild/protobuf';
/** How end users authorize a connection. Chosen at creation; it cannot be changed afterwards. */
export type AgentKitAuthMode = 'USER' | 'ORG_WIDE';
/** Token endpoint client authentication. `'DEFAULT'` clears the stored value so the platform picks. */
export type AgentKitTokenEndpointAuthMethod = 'NONE' | 'BASIC_AUTH' | 'REQUEST_BODY' | 'DEFAULT';
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
    optionalScopes?: {
        scopes?: string[];
        fieldName?: string;
    };
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
export interface ListConnectionsParams {
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
/** A string that looks like `conn_<digits>` is an ID; anything else is a name. An object is used as given. */
export declare function toRef(connection: string | ConnectionRef): ConnectionRef;
/**
 * AgentKit connection methods behind `scalekit.actions.createConnection` and friends.
 * They call the AgentKit-only connection APIs (`/api/v1/agentkit/connection`) for create, get, list and
 * update, and the environment connection RPCs for enable, disable and delete.
 * @internal
 */
export declare class AgentKitConnections {
    private readonly connection;
    constructor(connection: ConnectionClient);
    create(params: CreateConnectionParams): Promise<AppConnection>;
    get(ref: ConnectionRef | string): Promise<AppConnection>;
    list(params?: ListConnectionsParams): Promise<ListAppConnectionSummariesResponse>;
    update(params: UpdateConnectionParams): Promise<AppConnection>;
    /** Enables or disables a connection and returns the new enabled state. */
    setEnabled(ref: ConnectionRef, enabled: boolean): Promise<boolean>;
    delete(ref: ConnectionRef): Promise<void>;
    private identifierOf;
    /** The connection ID: validated when given, resolved with one read when only a name is given. */
    private idOf;
}
