import type ActionsClient from './actions';
import type ToolsClient from './tools';
import { ToolReadinessState } from './pkg/grpc/scalekit/v1/tools/tools_pb';
import { ConnectorStatus } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

/** Where one user stands with one connection. */
export interface ConnectionState {
  connectionName: string;
  /** Numeric `ConnectorStatus`. Compare against the enum, never a string. */
  status: ConnectorStatus;
  /** True when tools can be called right now. */
  isActive: boolean;
  connectedAccountId?: string;
  /** Present only when the user still has to authorize. Send it to them. */
  authorizationLink?: string;
}

/** A tool this user can call right now, with the account to call it on. */
export interface ReadyTool {
  name: string;
  connectedAccountId: string;
  connectionName: string;
  provider: string;
  score: number;
  description: string;
}

/**
 * AgentKit bound to one end user. Created by `scalekit.forIdentifier(identifier)`.
 *
 * Nothing here is new capability — every method composes calls that already
 * exist on `actions` and `tools`. What it removes is the repetition: carrying
 * one identifier across three clients, comparing a numeric status enum by hand,
 * filtering search results by readiness, and unwrapping a tool payload.
 *
 * The SDK exposes five top-level clients with eight duplicated methods between
 * them, so there is no obvious place to start. This is the obvious place to
 * start. Drop back to `actions`/`tools` whenever you need something it does not
 * cover; the two styles mix freely.
 */
export default class UserScope {
  constructor(
    readonly identifier: string,
    private readonly actions: ActionsClient,
    private readonly tools: ToolsClient
  ) {}

  /**
   * Returns this user's state for a connection, with a link if action is needed.
   *
   * Composes `actions.getOrCreateConnectedAccount` and, when the account is not
   * yet active, `actions.getAuthorizationLink`. Executes nothing.
   *
   * @param connectionName Connection name exactly as it appears in the dashboard
   *                       under **AgentKit > Connections**. Case-sensitive.
   * @returns Check `.isActive`; when false, send `.authorizationLink` to the
   *          user and call again once they finish.
   */
  async ensureConnected(connectionName: string): Promise<ConnectionState> {
    const response = await this.actions.getOrCreateConnectedAccount({
      connectionName,
      identifier: this.identifier,
    });
    const account = response.connectedAccount;
    const status = (account?.status ??
      ConnectorStatus.CONNECTION_STATUS_UNSPECIFIED) as ConnectorStatus;

    if (status === ConnectorStatus.ACTIVE) {
      return {
        connectionName,
        status,
        isActive: true,
        connectedAccountId: account?.id,
      };
    }

    const link = await this.actions.getAuthorizationLink({
      connectionName,
      identifier: this.identifier,
    });
    return {
      connectionName,
      status,
      isActive: false,
      connectedAccountId: account?.id,
      authorizationLink: link.link,
    };
  }

  /**
   * Finds tools that fit a goal and that this user can actually call.
   *
   * Composes `tools.searchTools` and keeps only results with a connection in the
   * READY state, pairing each with the account id to execute against. Results
   * needing connection or re-auth are dropped — resolve those with
   * {@link ensureConnected} first.
   *
   * Prefer this over listing a whole connector: binding 217 tools to a model is
   * roughly 85k tokens of schema per request and measurably worsens selection.
   *
   * @param goal The job to be done, in plain language.
   * @param limit Maximum ranked results to consider. Defaults to 5.
   * @returns Ready tools, best match first. May be empty.
   */
  async findTools(goal: string, limit = 5): Promise<ReadyTool[]> {
    const response = await this.tools.searchTools(goal, {
      identifier: this.identifier,
      topK: limit,
    });

    const ready: ReadyTool[] = [];
    for (const tool of response.tools) {
      const connection = tool.connections.find(
        (c) => c.readinessState === ToolReadinessState.READY
      );
      if (connection) {
        ready.push({
          name: tool.name,
          connectedAccountId: connection.connectedAccountId,
          connectionName: connection.connectionName,
          provider: tool.provider,
          score: tool.score,
          description: tool.description,
        });
      }
    }
    return ready;
  }

  /**
   * Executes a tool for this user and returns the payload.
   *
   * Composes `actions.executeTool`. Results cross the wire as a protobuf
   * `Struct`, so a list-returning tool arrives wrapped as `{ array: [...] }`;
   * this unwraps that so you get the array directly. Every number in the payload
   * is a float as a result of that encoding — cast before formatting.
   *
   * Pass `connectedAccountId` (from {@link findTools}) when you have it.
   * Otherwise supply `connectionName` and the account is resolved from this
   * scope's identifier.
   *
   * @returns The tool's payload. Use `actions.executeTool` directly if you also
   *          need the execution id.
   */
  async run(
    toolName: string,
    inputs: Record<string, unknown> = {},
    options?: { connectedAccountId?: string; connectionName?: string }
  ): Promise<unknown> {
    const response = await this.actions.executeTool({
      toolName,
      toolInput: inputs,
      ...(options?.connectedAccountId
        ? { connectedAccountId: options.connectedAccountId }
        : {
            identifier: this.identifier,
            ...(options?.connectionName && {
              connector: options.connectionName,
            }),
          }),
    });

    const data = response.data as
      | Record<string, unknown>
      | unknown[]
      | undefined;
    if (data && !Array.isArray(data)) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'array') {
        return (data as Record<string, unknown>).array;
      }
    }
    return data;
  }
}
