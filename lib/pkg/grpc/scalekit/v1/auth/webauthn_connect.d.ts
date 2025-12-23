import { BeginAuthenticationRequest, BeginAuthenticationResponse, BeginRegistrationRequest, BeginRegistrationResponse, DeleteCredentialRequest, DeleteCredentialResponse, FinishAuthenticationRequest, FinishAuthenticationResponse, FinishRegistrationRequest, FinishRegistrationResponse, GetRelatedOriginsRequest, GetRelatedOriginsResponse, ListCredentialsRequest, ListCredentialsResponse, UpdateCredentialRequest, UpdateCredentialResponse } from "./webauthn_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.auth.webauthn.WebAuthnService
 */
export declare const WebAuthnService: {
    readonly typeName: "scalekit.v1.auth.webauthn.WebAuthnService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.BeginRegistration
         */
        readonly beginRegistration: {
            readonly name: "BeginRegistration";
            readonly I: typeof BeginRegistrationRequest;
            readonly O: typeof BeginRegistrationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.FinishRegistration
         */
        readonly finishRegistration: {
            readonly name: "FinishRegistration";
            readonly I: typeof FinishRegistrationRequest;
            readonly O: typeof FinishRegistrationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.BeginAuthentication
         */
        readonly beginAuthentication: {
            readonly name: "BeginAuthentication";
            readonly I: typeof BeginAuthenticationRequest;
            readonly O: typeof BeginAuthenticationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.FinishAuthentication
         */
        readonly finishAuthentication: {
            readonly name: "FinishAuthentication";
            readonly I: typeof FinishAuthenticationRequest;
            readonly O: typeof FinishAuthenticationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.ListCredentials
         */
        readonly listCredentials: {
            readonly name: "ListCredentials";
            readonly I: typeof ListCredentialsRequest;
            readonly O: typeof ListCredentialsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.DeleteCredential
         */
        readonly deleteCredential: {
            readonly name: "DeleteCredential";
            readonly I: typeof DeleteCredentialRequest;
            readonly O: typeof DeleteCredentialResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.UpdateCredential
         */
        readonly updateCredential: {
            readonly name: "UpdateCredential";
            readonly I: typeof UpdateCredentialRequest;
            readonly O: typeof UpdateCredentialResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.GetRelatedOrigins
         */
        readonly getRelatedOrigins: {
            readonly name: "GetRelatedOrigins";
            readonly I: typeof GetRelatedOriginsRequest;
            readonly O: typeof GetRelatedOriginsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
