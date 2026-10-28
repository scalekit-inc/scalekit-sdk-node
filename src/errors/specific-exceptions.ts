// Moved into base-exception.ts so ScalekitServerException.promote() can reference
// these classes without a circular import. Re-exported here for existing import paths.
export {
  isToolException,
  ScalekitBadRequestException,
  ScalekitUnauthorizedException,
  ScalekitForbiddenException,
  ScalekitNotFoundException,
  ScalekitConflictException,
  ScalekitTooManyRequestsException,
  ScalekitInternalServerException,
  ScalekitNotImplementedException,
  ScalekitServiceUnavailableException,
  ScalekitGatewayTimeoutException,
  ScalekitCancelledException,
  ScalekitUnknownException,
  ScalekitToolRateLimitException,
  ScalekitToolUnauthorizedException,
  ScalekitToolForbiddenException,
  ScalekitToolException,
  ScalekitTriggerEventParseError,
} from './base-exception';
export type { IScalekitToolException } from './base-exception';
