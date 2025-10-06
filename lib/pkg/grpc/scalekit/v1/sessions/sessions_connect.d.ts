import { RevokeAllUserSessionsRequest, RevokeAllUserSessionsResponse, RevokeSessionRequest, RevokeSessionResponse, SessionDetails, SessionDetailsRequest, UserSessionDetails, UserSessionDetailsRequest } from "./sessions_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.sessions.SessionService
 */
export declare const SessionService: {
    readonly typeName: "scalekit.v1.sessions.SessionService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.sessions.SessionService.GetSession
         */
        readonly getSession: {
            readonly name: "GetSession";
            readonly I: typeof SessionDetailsRequest;
            readonly O: typeof SessionDetails;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.sessions.SessionService.RevokeSession
         */
        readonly revokeSession: {
            readonly name: "RevokeSession";
            readonly I: typeof RevokeSessionRequest;
            readonly O: typeof RevokeSessionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.sessions.SessionService.GetUserSessions
         */
        readonly getUserSessions: {
            readonly name: "GetUserSessions";
            readonly I: typeof UserSessionDetailsRequest;
            readonly O: typeof UserSessionDetails;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.sessions.SessionService.RevokeAllUserSessions
         */
        readonly revokeAllUserSessions: {
            readonly name: "RevokeAllUserSessions";
            readonly I: typeof RevokeAllUserSessionsRequest;
            readonly O: typeof RevokeAllUserSessionsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
