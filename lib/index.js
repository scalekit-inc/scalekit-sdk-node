"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderType = exports.ToolReadinessState = exports.ConnectionAuthMode = exports.ConnectionProvider = exports.ConnectionType = exports.ConnectorType = exports.ConnectorStatus = exports.Source = exports.ObjectType = exports.ResourceType = exports.PayloadState = exports.DetectionMode = exports.DeliveryScope = exports.verifyTriggerEvent = exports.Scalekit = exports.ScalekitClient = void 0;
const scalekit_1 = __importDefault(require("./scalekit"));
exports.ScalekitClient = scalekit_1.default;
exports.Scalekit = scalekit_1.default;
exports.default = scalekit_1.default;
__exportStar(require("./types/scalekit"), exports);
__exportStar(require("./types/auth"), exports);
__exportStar(require("./errors"), exports);
// Trigger events delivered to your endpoint: `verifyTriggerEvent` (no client
// needed) and `scalekit.actions.triggers.verifyEvent`.
var triggers_1 = require("./triggers");
Object.defineProperty(exports, "verifyTriggerEvent", { enumerable: true, get: function () { return triggers_1.verifyTriggerEvent; } });
Object.defineProperty(exports, "DeliveryScope", { enumerable: true, get: function () { return triggers_1.DeliveryScope; } });
Object.defineProperty(exports, "DetectionMode", { enumerable: true, get: function () { return triggers_1.DetectionMode; } });
Object.defineProperty(exports, "PayloadState", { enumerable: true, get: function () { return triggers_1.PayloadState; } });
// Generated enum surfaced in the public `resources.listResources` API:
// `resourceType` is a required parameter, so callers need to name it (e.g.
// `ResourceType.MCP_SERVER`) without reaching into the internal pb path.
var clients_pb_1 = require("./pkg/grpc/scalekit/v1/clients/clients_pb");
Object.defineProperty(exports, "ResourceType", { enumerable: true, get: function () { return clients_pb_1.ResourceType; } });
// Generated enums/types surfaced in the public `events.listEventsPaginated` API:
// `ObjectType` appears on the returned `ScalekitEvent.object`, and `Source` on the
// optional `EventFilter` parameter — re-export them so callers can name them.
var events_pb_1 = require("./pkg/grpc/scalekit/v1/events/events_pb");
Object.defineProperty(exports, "ObjectType", { enumerable: true, get: function () { return events_pb_1.ObjectType; } });
Object.defineProperty(exports, "Source", { enumerable: true, get: function () { return events_pb_1.Source; } });
// Generated enums/types surfaced on every connected account: `status` is a
// `ConnectorStatus` and `authorizationType` a `ConnectorType`. Both are numeric at
// runtime, so callers need the named constants to test them — re-export here rather
// than leaving `connectedAccount.status === 1` as the only option. The internal pb
// path is not reachable: `exports` in package.json exposes only '.', './express',
// './next' and './edge', so a deep import fails with ERR_PACKAGE_PATH_NOT_EXPORTED.
var connected_accounts_pb_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb");
Object.defineProperty(exports, "ConnectorStatus", { enumerable: true, get: function () { return connected_accounts_pb_1.ConnectorStatus; } });
Object.defineProperty(exports, "ConnectorType", { enumerable: true, get: function () { return connected_accounts_pb_1.ConnectorType; } });
// Generated enums/types surfaced by the environment-scoped connection methods
// (`connection.createEnvironmentConnection` and friends). `type`, `provider` and
// `authMode` on a connection are numeric enums, so callers need the named
// constants, and the message types let them name what the methods return.
var connections_pb_1 = require("./pkg/grpc/scalekit/v1/connections/connections_pb");
Object.defineProperty(exports, "ConnectionType", { enumerable: true, get: function () { return connections_pb_1.ConnectionType; } });
Object.defineProperty(exports, "ConnectionProvider", { enumerable: true, get: function () { return connections_pb_1.ConnectionProvider; } });
Object.defineProperty(exports, "ConnectionAuthMode", { enumerable: true, get: function () { return connections_pb_1.ConnectionAuthMode; } });
// Generated enum/types surfaced in the public `tools.searchTools` API:
// `ToolReadinessState` appears on each result's `connections[].readinessState` —
// re-export it so callers can name it (e.g. `readinessState === ToolReadinessState.READY`)
// instead of importing the internal pb path or comparing against a raw number.
var tools_pb_1 = require("./pkg/grpc/scalekit/v1/tools/tools_pb");
Object.defineProperty(exports, "ToolReadinessState", { enumerable: true, get: function () { return tools_pb_1.ToolReadinessState; } });
var providers_pb_1 = require("./pkg/grpc/scalekit/v1/providers/providers_pb");
Object.defineProperty(exports, "ProviderType", { enumerable: true, get: function () { return providers_pb_1.ProviderType; } });
//# sourceMappingURL=index.js.map