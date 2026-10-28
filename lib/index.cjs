Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_issuer = require("./issuer.cjs");
const require_scalekit = require("./scalekit.cjs");
//#region src/exports.ts
var exports_exports = /* @__PURE__ */ require_issuer.__exportAll({
	ConnectionAuthMode: () => require_scalekit.ConnectionAuthMode,
	ConnectionProvider: () => require_scalekit.ConnectionProvider,
	ConnectionType: () => require_scalekit.ConnectionType,
	ConnectorStatus: () => require_scalekit.ConnectorStatus,
	ConnectorType: () => require_scalekit.ConnectorType,
	DeliveryScope: () => require_scalekit.DeliveryScope,
	DetectionMode: () => require_scalekit.DetectionMode,
	GrantType: () => require_issuer.GrantType,
	ObjectType: () => require_scalekit.ObjectType,
	PayloadState: () => require_scalekit.PayloadState,
	ProviderType: () => require_scalekit.ProviderType,
	ResourceType: () => require_scalekit.ResourceType,
	Scalekit: () => require_scalekit.ScalekitClient,
	ScalekitAbortError: () => require_scalekit.ScalekitAbortError,
	ScalekitBadRequestException: () => require_scalekit.ScalekitBadRequestException,
	ScalekitCancelledException: () => require_scalekit.ScalekitCancelledException,
	ScalekitClient: () => require_scalekit.ScalekitClient,
	ScalekitConflictException: () => require_scalekit.ScalekitConflictException,
	ScalekitException: () => require_scalekit.ScalekitException,
	ScalekitForbiddenException: () => require_scalekit.ScalekitForbiddenException,
	ScalekitGatewayTimeoutException: () => require_scalekit.ScalekitGatewayTimeoutException,
	ScalekitInternalServerException: () => require_scalekit.ScalekitInternalServerException,
	ScalekitNotFoundException: () => require_scalekit.ScalekitNotFoundException,
	ScalekitNotImplementedException: () => require_scalekit.ScalekitNotImplementedException,
	ScalekitServerException: () => require_scalekit.ScalekitServerException,
	ScalekitServiceUnavailableException: () => require_scalekit.ScalekitServiceUnavailableException,
	ScalekitTooManyRequestsException: () => require_scalekit.ScalekitTooManyRequestsException,
	ScalekitToolException: () => require_scalekit.ScalekitToolException,
	ScalekitToolForbiddenException: () => require_scalekit.ScalekitToolForbiddenException,
	ScalekitToolRateLimitException: () => require_scalekit.ScalekitToolRateLimitException,
	ScalekitToolUnauthorizedException: () => require_scalekit.ScalekitToolUnauthorizedException,
	ScalekitTriggerEventParseError: () => require_scalekit.ScalekitTriggerEventParseError,
	ScalekitUnauthorizedException: () => require_scalekit.ScalekitUnauthorizedException,
	ScalekitUnknownException: () => require_scalekit.ScalekitUnknownException,
	ScalekitUploadConnectionException: () => require_scalekit.ScalekitUploadConnectionException,
	ScalekitUploadHttpException: () => require_scalekit.ScalekitUploadHttpException,
	ScalekitUploadProtocolException: () => require_scalekit.ScalekitUploadProtocolException,
	ScalekitUploadSessionExpiredException: () => require_scalekit.ScalekitUploadSessionExpiredException,
	ScalekitUploadTimeoutException: () => require_scalekit.ScalekitUploadTimeoutException,
	ScalekitValidateTokenFailureException: () => require_scalekit.ScalekitValidateTokenFailureException,
	ScalekitValidationError: () => require_scalekit.ScalekitValidationError,
	Source: () => require_scalekit.Source,
	ToolReadinessState: () => require_scalekit.ToolReadinessState,
	WebhookVerificationError: () => require_scalekit.WebhookVerificationError,
	isToolException: () => require_scalekit.isToolException,
	verifyTriggerEvent: () => require_scalekit.verifyTriggerEvent
});
//#endregion
//#region src/index.ts
for (const [name, value] of Object.entries(exports_exports)) if (!(name in require_scalekit.ScalekitClient)) Object.defineProperty(require_scalekit.ScalekitClient, name, {
	value,
	enumerable: false
});
Object.defineProperty(require_scalekit.ScalekitClient, "default", {
	value: require_scalekit.ScalekitClient,
	enumerable: false
});
const DefaultExport = require_scalekit.ScalekitClient;
//#endregion
exports.ConnectionAuthMode = require_scalekit.ConnectionAuthMode;
exports.ConnectionProvider = require_scalekit.ConnectionProvider;
exports.ConnectionType = require_scalekit.ConnectionType;
exports.ConnectorStatus = require_scalekit.ConnectorStatus;
exports.ConnectorType = require_scalekit.ConnectorType;
exports.DeliveryScope = require_scalekit.DeliveryScope;
exports.DetectionMode = require_scalekit.DetectionMode;
exports.GrantType = require_issuer.GrantType;
exports.ObjectType = require_scalekit.ObjectType;
exports.PayloadState = require_scalekit.PayloadState;
exports.ProviderType = require_scalekit.ProviderType;
exports.ResourceType = require_scalekit.ResourceType;
exports.Scalekit = require_scalekit.ScalekitClient;
exports.ScalekitClient = require_scalekit.ScalekitClient;
exports.ScalekitAbortError = require_scalekit.ScalekitAbortError;
exports.ScalekitBadRequestException = require_scalekit.ScalekitBadRequestException;
exports.ScalekitCancelledException = require_scalekit.ScalekitCancelledException;
exports.ScalekitConflictException = require_scalekit.ScalekitConflictException;
exports.ScalekitException = require_scalekit.ScalekitException;
exports.ScalekitForbiddenException = require_scalekit.ScalekitForbiddenException;
exports.ScalekitGatewayTimeoutException = require_scalekit.ScalekitGatewayTimeoutException;
exports.ScalekitInternalServerException = require_scalekit.ScalekitInternalServerException;
exports.ScalekitNotFoundException = require_scalekit.ScalekitNotFoundException;
exports.ScalekitNotImplementedException = require_scalekit.ScalekitNotImplementedException;
exports.ScalekitServerException = require_scalekit.ScalekitServerException;
exports.ScalekitServiceUnavailableException = require_scalekit.ScalekitServiceUnavailableException;
exports.ScalekitTooManyRequestsException = require_scalekit.ScalekitTooManyRequestsException;
exports.ScalekitToolException = require_scalekit.ScalekitToolException;
exports.ScalekitToolForbiddenException = require_scalekit.ScalekitToolForbiddenException;
exports.ScalekitToolRateLimitException = require_scalekit.ScalekitToolRateLimitException;
exports.ScalekitToolUnauthorizedException = require_scalekit.ScalekitToolUnauthorizedException;
exports.ScalekitTriggerEventParseError = require_scalekit.ScalekitTriggerEventParseError;
exports.ScalekitUnauthorizedException = require_scalekit.ScalekitUnauthorizedException;
exports.ScalekitUnknownException = require_scalekit.ScalekitUnknownException;
exports.ScalekitUploadConnectionException = require_scalekit.ScalekitUploadConnectionException;
exports.ScalekitUploadHttpException = require_scalekit.ScalekitUploadHttpException;
exports.ScalekitUploadProtocolException = require_scalekit.ScalekitUploadProtocolException;
exports.ScalekitUploadSessionExpiredException = require_scalekit.ScalekitUploadSessionExpiredException;
exports.ScalekitUploadTimeoutException = require_scalekit.ScalekitUploadTimeoutException;
exports.ScalekitValidateTokenFailureException = require_scalekit.ScalekitValidateTokenFailureException;
exports.ScalekitValidationError = require_scalekit.ScalekitValidationError;
exports.Source = require_scalekit.Source;
exports.ToolReadinessState = require_scalekit.ToolReadinessState;
exports.WebhookVerificationError = require_scalekit.WebhookVerificationError;
exports.default = DefaultExport;
exports.isToolException = require_scalekit.isToolException;
exports.verifyTriggerEvent = require_scalekit.verifyTriggerEvent;

//# sourceMappingURL=index.cjs.map