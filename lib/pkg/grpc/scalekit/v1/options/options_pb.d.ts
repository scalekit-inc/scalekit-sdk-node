import type { GenEnum, GenExtension, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { FieldOptions, MethodOptions } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/options/options.proto.
 */
export declare const file_scalekit_v1_options_options: GenFile;
/**
 * @generated from message scalekit.v1.options.AuthOption
 */
export type AuthOption = Message<"scalekit.v1.options.AuthOption"> & {
    /**
     * @generated from field: scalekit.v1.options.AuthenticationType authentication_type = 3;
     */
    authenticationType: AuthenticationType;
    /**
     * @generated from field: repeated string permissions = 1;
     */
    permissions: string[];
    /**
     * @generated from field: scalekit.v1.options.Policy policy = 2;
     */
    policy: Policy;
};
/**
 * Describes the message scalekit.v1.options.AuthOption.
 * Use `create(AuthOptionSchema)` to create a new message.
 */
export declare const AuthOptionSchema: GenMessage<AuthOption>;
/**
 * AgentToolOption declares an RPC as a support-agent tool and carries everything the
 * model needs to call it. The protoc-gen-agenttool plugin reads this option at build
 * time and emits compiled Go tool definitions; nothing is resolved at runtime.
 *
 * @generated from message scalekit.v1.options.AgentToolOption
 */
export type AgentToolOption = Message<"scalekit.v1.options.AgentToolOption"> & {
    /**
     * Model-facing tool name. Defaults to snake_case of the RPC method name when empty.
     *
     * Set this explicitly whenever the derived name would be wrong or would change an
     * existing tool name. Example: the RPC is `ListOrganization` (singular), so the
     * derived name is `list_organization`, but the tool the model already knows is
     * `list_organizations`.
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * Model-facing description. States what the tool does and when to use it, in that
     * order, so the model can pick between similar tools. This text is the only guidance
     * the model receives about the tool, so it must be self-contained: do not rely on the
     * RPC's OpenAPI description, which is not read by the generator.
     *
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * Declares whether the tool reads or writes. Required.
     *
     * MUTATION_UNSPECIFIED fails the build. The value drives the write-confirmation gate,
     * so a missing value would silently let a mutating tool run without human approval.
     * Failing the build keeps that decision fail-closed and moves it to review time.
     *
     * @generated from field: scalekit.v1.options.Mutation mutation = 3;
     */
    mutation: Mutation;
    /**
     * Human-readable approval-card template shown to the operator before a WRITE tool
     * runs. Interpolates request fields by their proto path in braces, for example
     * "Create organization {organization.display_name}".
     *
     * Required in practice for WRITE tools: without it the approval card cannot describe
     * what the operator is approving.
     *
     * @generated from field: string summary = 4;
     */
    summary: string;
    /**
     * Request fields supplied by the caller's session rather than by the model, named by
     * their proto field name in the request message.
     *
     * The generator strips these fields from the input schema, and the executor overwrites
     * them from the resolved session identity after decoding the model's arguments. This
     * is what stops the model from choosing its own tenant scope. The generator verifies
     * every name resolves to a field on the request message and fails the build on a typo,
     * because a misspelled entry would silently leave the field model-controlled.
     *
     * @generated from field: repeated string scope_fields = 5;
     */
    scopeFields: string[];
};
/**
 * Describes the message scalekit.v1.options.AgentToolOption.
 * Use `create(AgentToolOptionSchema)` to create a new message.
 */
export declare const AgentToolOptionSchema: GenMessage<AgentToolOption>;
/**
 * AgentFieldOption controls a single field's visibility to the support agent.
 *
 * PRESENCE RULES — the generator reads this option with `proto.HasExtension`, not by
 * reading the zero value, so three states are distinguishable and they behave differently:
 *
 *   1. Option ABSENT              => field is EXPOSED. This is the default; most fields
 *                                    carry no annotation at all.
 *   2. `[(agent_field).expose = false]` => field is HIDDEN. This is the only way to hide a
 *                                    field: stripped from the request schema and dropped
 *                                    from the projected response.
 *   3. `[(agent_field).expose = true]`  => field is EXPOSED, explicitly. Semantically
 *                                    identical to state 1, but it records an acknowledged
 *                                    review decision, which is what satisfies the
 *                                    generator's guard on sensitive-looking field names
 *                                    (`*secret*`, `*token*`, `*password*`, `*private_key*`,
 *                                    `*credential*`). Those names fail the build unless
 *                                    annotated either way.
 *
 * Do NOT read state 1 as `expose: false`. An absent option and an explicit `expose: false`
 * are opposite outcomes, and `[(agent_field) = {}]` reads as state 2 because `expose`
 * defaults to false inside a present message.
 *
 * @generated from message scalekit.v1.options.AgentFieldOption
 */
export type AgentFieldOption = Message<"scalekit.v1.options.AgentFieldOption"> & {
    /**
     * Whether the agent sees this field. Only meaningful when the option is present; see the
     * presence rules on the message.
     *
     * @generated from field: bool expose = 1;
     */
    expose: boolean;
};
/**
 * Describes the message scalekit.v1.options.AgentFieldOption.
 * Use `create(AgentFieldOptionSchema)` to create a new message.
 */
export declare const AgentFieldOptionSchema: GenMessage<AgentFieldOption>;
/**
 * @generated from enum scalekit.v1.options.Policy
 */
export declare enum Policy {
    /**
     * @generated from enum value: DENY = 0;
     */
    DENY = 0,
    /**
     * @generated from enum value: PARTIAL = 1;
     */
    PARTIAL = 1,
    /**
     * @generated from enum value: ALLOW = 2;
     */
    ALLOW = 2
}
/**
 * Describes the enum scalekit.v1.options.Policy.
 */
export declare const PolicySchema: GenEnum<Policy>;
/**
 * @generated from enum scalekit.v1.options.AuthenticationType
 */
export declare enum AuthenticationType {
    /**
     * API is Blocked to access
     *
     * API is blocked / private  and default
     *
     * @generated from enum value: BLOCKED = 0;
     */
    BLOCKED = 0,
    /**
     * API is open
     *
     * @generated from enum value: NONE = 1;
     */
    NONE = 1,
    /**
     * Workspace auth option is for Scalekit Dashboard
     *
     * workspace_id is in claims
     *
     * @generated from enum value: WORKSPACE = 64;
     */
    WORKSPACE = 64,
    /**
     * Customer portal is for customer admin portal access
     *
     * claims has organisation ID
     *
     * @generated from enum value: CUSTOMER_PORTAL = 32;
     */
    CUSTOMER_PORTAL = 32,
    /**
     * (UI audience in claims) this is for API that need to work on env.scalekit.com scoped access alone.
     *
     * @generated from enum value: SESSION = 16;
     */
    SESSION = 16,
    /**
     * @generated from enum value: WORKSPACE_SESSION = 80;
     */
    WORKSPACE_SESSION = 80,
    /**
     * workspace_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_CLIENT = 68;
     */
    WORKSPACE_CLIENT = 68,
    /**
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL = 112;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL = 112,
    /**
     * workspace_id,organization_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL_CLIENT = 116;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL_CLIENT = 116,
    /**
     * @generated from enum value: WORKSPACE_CUSTOMER_PORTAL_CLIENT = 100;
     */
    WORKSPACE_CUSTOMER_PORTAL_CLIENT = 100,
    /**
     * workspace_id,organization_id is in claims and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_CUSTOMER_PORTAL = 96;
     */
    WORKSPACE_CUSTOMER_PORTAL = 96,
    /**
     * user_id is in claims
     *
     * @generated from enum value: USER = 8;
     */
    USER = 8,
    /**
     * client is environment primary client ID
     *
     * client Id is in subject
     *
     * @generated from enum value: CLIENT = 4;
     */
    CLIENT = 4,
    /**
     * UI in audience or client Id is in subject
     *
     * @generated from enum value: SESSION_CLIENT = 20;
     */
    SESSION_CLIENT = 20,
    /**
     * workspace_id is in claims, UI in audience and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_SESSION_CLIENT = 84;
     */
    WORKSPACE_SESSION_CLIENT = 84,
    /**
     * claims has organisation ID, UI in audience and client Id is in subject
     *
     * @generated from enum value: CUSTOMER_PORTAL_SESSION_CLIENT = 52;
     */
    CUSTOMER_PORTAL_SESSION_CLIENT = 52,
    /**
     * @generated from enum value: SESSION_USER = 24;
     */
    SESSION_USER = 24,
    /**
     * @generated from enum value: ACTIONS_PORTAL = 128;
     */
    ACTIONS_PORTAL = 128,
    /**
     * workspace_id,organization_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL_ACTIONS_PORTAL = 240;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL_ACTIONS_PORTAL = 240,
    /**
     * workspace_id,organization_id is in claims, UI in audience and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL_ACTIONS_PORTAL_CLIENT = 244;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL_ACTIONS_PORTAL_CLIENT = 244,
    /**
     * workspace_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_ACTIONS_PORTAL = 192;
     */
    WORKSPACE_ACTIONS_PORTAL = 192,
    /**
     * workspace_id is in claims, UI in audience and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_ACTIONS_PORTAL_CLIENT = 196;
     */
    WORKSPACE_ACTIONS_PORTAL_CLIENT = 196,
    /**
     * @generated from enum value: WORKSPACE_ACTIONS_PORTAL_CUSTOMER_PORTAL_CLIENT = 228;
     */
    WORKSPACE_ACTIONS_PORTAL_CUSTOMER_PORTAL_CLIENT = 228,
    /**
     * workspace_id,organization_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_CUSTOMER_PORTAL_ACTIONS_PORTAL = 224;
     */
    WORKSPACE_CUSTOMER_PORTAL_ACTIONS_PORTAL = 224
}
/**
 * Describes the enum scalekit.v1.options.AuthenticationType.
 */
export declare const AuthenticationTypeSchema: GenEnum<AuthenticationType>;
/**
 * Mutation classifies a tool by its effect on stored state.
 *
 * @generated from enum scalekit.v1.options.Mutation
 */
export declare enum Mutation {
    /**
     * Not set. This is the zero value and is ALWAYS a build error on an RPC annotated with
     * agent_tool — an unclassified tool would bypass the write-confirmation gate, so the
     * generator refuses to guess.
     *
     * @generated from enum value: MUTATION_UNSPECIFIED = 0;
     */
    MUTATION_UNSPECIFIED = 0,
    /**
     * The tool only reads. It runs without operator approval.
     *
     * @generated from enum value: READ = 1;
     */
    READ = 1,
    /**
     * The tool changes state. The agent suspends the turn, asks the operator to approve the
     * call using `summary`, and records an audit event when the approved call executes.
     *
     * @generated from enum value: WRITE = 2;
     */
    WRITE = 2
}
/**
 * Describes the enum scalekit.v1.options.Mutation.
 */
export declare const MutationSchema: GenEnum<Mutation>;
/**
 * @generated from extension: scalekit.v1.options.AuthOption auth_option = 50000;
 */
export declare const auth_option: GenExtension<MethodOptions, AuthOption>;
/**
 * Exposes this RPC to the support agent as a callable tool. The
 * protoc-gen-agenttool plugin generates a tool definition (model-facing name and
 * description, JSON Schema for the request, and a response projection) for every
 * RPC that carries this option. RPCs without it are never reachable by the agent.
 *
 * @generated from extension: scalekit.v1.options.AgentToolOption agent_tool = 50001;
 */
export declare const agent_tool: GenExtension<MethodOptions, AgentToolOption>;
/**
 * Controls whether the support agent sees this field. Applies to request fields
 * (schema generation) and response fields (output projection).
 *
 * Absence of this option means the field IS exposed. See AgentFieldOption for the
 * full presence rules — an absent option and `{expose: false}` are not the same.
 *
 * @generated from extension: scalekit.v1.options.AgentFieldOption agent_field = 50002;
 */
export declare const agent_field: GenExtension<FieldOptions, AgentFieldOption>;
