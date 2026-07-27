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
exports.Source = exports.ObjectType = exports.Scalekit = exports.ScalekitClient = void 0;
const scalekit_1 = __importDefault(require("./scalekit"));
exports.ScalekitClient = scalekit_1.default;
exports.Scalekit = scalekit_1.default;
exports.default = scalekit_1.default;
__exportStar(require("./types/scalekit"), exports);
__exportStar(require("./types/auth"), exports);
__exportStar(require("./errors"), exports);
// Generated enums/types surfaced in the public `events.listEventsPaginated` API:
// `ObjectType` appears on the returned `ScalekitEvent.object`, and `Source` on the
// optional `EventFilter` parameter — re-export them so callers can name them.
var events_pb_1 = require("./pkg/grpc/scalekit/v1/events/events_pb");
Object.defineProperty(exports, "ObjectType", { enumerable: true, get: function () { return events_pb_1.ObjectType; } });
Object.defineProperty(exports, "Source", { enumerable: true, get: function () { return events_pb_1.Source; } });
//# sourceMappingURL=index.js.map