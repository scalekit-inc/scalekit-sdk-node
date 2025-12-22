import { DiscoveryAuthMethodRequest, DiscoveryAuthMethodResponse, GetAuthCustomizationsRequest, GetAuthCustomizationsResponse, GetAuthErrorRequest, GetAuthErrorResponse, GetAuthFeaturesResponse, GetAuthStateResponse, ListAuthMethodsRequest, ListAuthMethodsResponse, ListUserOrganizationsResponse, SignupOrganizationRequest, SignupOrganizationResponse, UpdateLoginUserDetailsRequest, VerifyPasswordLessOtpRequest, VerifyPasswordLessOtpResponse } from "./auth_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.auth.AuthService
 */
export declare const AuthService: {
    readonly typeName: "scalekit.v1.auth.AuthService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.ListAuthMethods
         */
        readonly listAuthMethods: {
            readonly name: "ListAuthMethods";
            readonly I: typeof ListAuthMethodsRequest;
            readonly O: typeof ListAuthMethodsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.DiscoveryAuthMethod
         */
        readonly discoveryAuthMethod: {
            readonly name: "DiscoveryAuthMethod";
            readonly I: typeof DiscoveryAuthMethodRequest;
            readonly O: typeof DiscoveryAuthMethodResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.VerifyPasswordLessOtp
         */
        readonly verifyPasswordLessOtp: {
            readonly name: "VerifyPasswordLessOtp";
            readonly I: typeof VerifyPasswordLessOtpRequest;
            readonly O: typeof VerifyPasswordLessOtpResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.ResendPasswordless
         */
        readonly resendPasswordless: {
            readonly name: "ResendPasswordless";
            readonly I: typeof Empty;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.ListUserOrganizations
         */
        readonly listUserOrganizations: {
            readonly name: "ListUserOrganizations";
            readonly I: typeof Empty;
            readonly O: typeof ListUserOrganizationsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.SignupOrganization
         */
        readonly signupOrganization: {
            readonly name: "SignupOrganization";
            readonly I: typeof SignupOrganizationRequest;
            readonly O: typeof SignupOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.GetAuthState
         */
        readonly getAuthState: {
            readonly name: "GetAuthState";
            readonly I: typeof Empty;
            readonly O: typeof GetAuthStateResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.GetAuthError
         */
        readonly getAuthError: {
            readonly name: "GetAuthError";
            readonly I: typeof GetAuthErrorRequest;
            readonly O: typeof GetAuthErrorResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.Logout
         */
        readonly logout: {
            readonly name: "Logout";
            readonly I: typeof Empty;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.GetAuthCustomizations
         */
        readonly getAuthCustomizations: {
            readonly name: "GetAuthCustomizations";
            readonly I: typeof GetAuthCustomizationsRequest;
            readonly O: typeof GetAuthCustomizationsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.GetAuthFeatures
         */
        readonly getAuthFeatures: {
            readonly name: "GetAuthFeatures";
            readonly I: typeof Empty;
            readonly O: typeof GetAuthFeaturesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.AuthService.UpdateLoginUserDetails
         */
        readonly updateLoginUserDetails: {
            readonly name: "UpdateLoginUserDetails";
            readonly I: typeof UpdateLoginUserDetailsRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
