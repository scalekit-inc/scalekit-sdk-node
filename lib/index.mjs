import { t as __exportAll } from "./chunk.mjs";
import { r as GrantType } from "./issuer.mjs";
import { A as ScalekitNotImplementedException, B as ScalekitUnknownException, C as ScalekitCancelledException, D as ScalekitGatewayTimeoutException, E as ScalekitForbiddenException, F as ScalekitToolForbiddenException, H as ScalekitValidationError, I as ScalekitToolRateLimitException, L as ScalekitToolUnauthorizedException, M as ScalekitServiceUnavailableException, N as ScalekitTooManyRequestsException, O as ScalekitInternalServerException, P as ScalekitToolException, R as ScalekitTriggerEventParseError, S as ScalekitBadRequestException, T as ScalekitException, U as WebhookVerificationError, V as ScalekitValidateTokenFailureException, W as isToolException, _ as ResourceType, a as DetectionMode, b as ConnectionType, c as ConnectorStatus, d as ScalekitUploadHttpException, f as ScalekitUploadProtocolException, g as ProviderType, h as ToolReadinessState, i as DeliveryScope, j as ScalekitServerException, k as ScalekitNotFoundException, l as ConnectorType, m as ScalekitUploadTimeoutException, n as ObjectType, o as PayloadState, p as ScalekitUploadSessionExpiredException, r as Source, s as verifyTriggerEvent, t as ScalekitClient, u as ScalekitUploadConnectionException, v as ConnectionAuthMode, w as ScalekitConflictException, x as ScalekitAbortError, y as ConnectionProvider, z as ScalekitUnauthorizedException } from "./scalekit.mjs";
//#region src/exports.ts
var exports_exports = /* @__PURE__ */ __exportAll({
	ConnectionAuthMode: () => ConnectionAuthMode,
	ConnectionProvider: () => ConnectionProvider,
	ConnectionType: () => ConnectionType,
	ConnectorStatus: () => ConnectorStatus,
	ConnectorType: () => ConnectorType,
	DeliveryScope: () => DeliveryScope,
	DetectionMode: () => DetectionMode,
	GrantType: () => GrantType,
	ObjectType: () => ObjectType,
	PayloadState: () => PayloadState,
	ProviderType: () => ProviderType,
	ResourceType: () => ResourceType,
	Scalekit: () => ScalekitClient,
	ScalekitAbortError: () => ScalekitAbortError,
	ScalekitBadRequestException: () => ScalekitBadRequestException,
	ScalekitCancelledException: () => ScalekitCancelledException,
	ScalekitClient: () => ScalekitClient,
	ScalekitConflictException: () => ScalekitConflictException,
	ScalekitException: () => ScalekitException,
	ScalekitForbiddenException: () => ScalekitForbiddenException,
	ScalekitGatewayTimeoutException: () => ScalekitGatewayTimeoutException,
	ScalekitInternalServerException: () => ScalekitInternalServerException,
	ScalekitNotFoundException: () => ScalekitNotFoundException,
	ScalekitNotImplementedException: () => ScalekitNotImplementedException,
	ScalekitServerException: () => ScalekitServerException,
	ScalekitServiceUnavailableException: () => ScalekitServiceUnavailableException,
	ScalekitTooManyRequestsException: () => ScalekitTooManyRequestsException,
	ScalekitToolException: () => ScalekitToolException,
	ScalekitToolForbiddenException: () => ScalekitToolForbiddenException,
	ScalekitToolRateLimitException: () => ScalekitToolRateLimitException,
	ScalekitToolUnauthorizedException: () => ScalekitToolUnauthorizedException,
	ScalekitTriggerEventParseError: () => ScalekitTriggerEventParseError,
	ScalekitUnauthorizedException: () => ScalekitUnauthorizedException,
	ScalekitUnknownException: () => ScalekitUnknownException,
	ScalekitUploadConnectionException: () => ScalekitUploadConnectionException,
	ScalekitUploadHttpException: () => ScalekitUploadHttpException,
	ScalekitUploadProtocolException: () => ScalekitUploadProtocolException,
	ScalekitUploadSessionExpiredException: () => ScalekitUploadSessionExpiredException,
	ScalekitUploadTimeoutException: () => ScalekitUploadTimeoutException,
	ScalekitValidateTokenFailureException: () => ScalekitValidateTokenFailureException,
	ScalekitValidationError: () => ScalekitValidationError,
	Source: () => Source,
	ToolReadinessState: () => ToolReadinessState,
	WebhookVerificationError: () => WebhookVerificationError,
	isToolException: () => isToolException,
	verifyTriggerEvent: () => verifyTriggerEvent
});
//#endregion
//#region src/index.ts
for (const [name, value] of Object.entries(exports_exports)) if (!(name in ScalekitClient)) Object.defineProperty(ScalekitClient, name, {
	value,
	enumerable: false
});
Object.defineProperty(ScalekitClient, "default", {
	value: ScalekitClient,
	enumerable: false
});
const DefaultExport = ScalekitClient;
//#endregion
export { ConnectionAuthMode, ConnectionProvider, ConnectionType, ConnectorStatus, ConnectorType, DeliveryScope, DetectionMode, GrantType, ObjectType, PayloadState, ProviderType, ResourceType, ScalekitClient as Scalekit, ScalekitClient, ScalekitAbortError, ScalekitBadRequestException, ScalekitCancelledException, ScalekitConflictException, ScalekitException, ScalekitForbiddenException, ScalekitGatewayTimeoutException, ScalekitInternalServerException, ScalekitNotFoundException, ScalekitNotImplementedException, ScalekitServerException, ScalekitServiceUnavailableException, ScalekitTooManyRequestsException, ScalekitToolException, ScalekitToolForbiddenException, ScalekitToolRateLimitException, ScalekitToolUnauthorizedException, ScalekitTriggerEventParseError, ScalekitUnauthorizedException, ScalekitUnknownException, ScalekitUploadConnectionException, ScalekitUploadHttpException, ScalekitUploadProtocolException, ScalekitUploadSessionExpiredException, ScalekitUploadTimeoutException, ScalekitValidateTokenFailureException, ScalekitValidationError, Source, ToolReadinessState, WebhookVerificationError, DefaultExport as default, isToolException, verifyTriggerEvent };

//# sourceMappingURL=index.mjs.map