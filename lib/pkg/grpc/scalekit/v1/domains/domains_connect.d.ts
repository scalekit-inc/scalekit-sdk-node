import { CreateDomainRequest, CreateDomainResponse, DeleteDomainRequest, GetDomainRequest, GetDomainResponse, ListAuthorizedDomainRequest, ListAuthorizedDomainResponse, ListDomainRequest, ListDomainResponse, UpdateDomainRequest, UpdateDomainResponse, VerifyDomainRequest } from "./domains_pb.js";
import { BoolValue, Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.domains.DomainService
 */
export declare const DomainService: {
    readonly typeName: "scalekit.v1.domains.DomainService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.CreateDomain
         */
        readonly createDomain: {
            readonly name: "CreateDomain";
            readonly I: typeof CreateDomainRequest;
            readonly O: typeof CreateDomainResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.UpdateDomain
         */
        readonly updateDomain: {
            readonly name: "UpdateDomain";
            readonly I: typeof UpdateDomainRequest;
            readonly O: typeof UpdateDomainResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.VerifyDomain
         */
        readonly verifyDomain: {
            readonly name: "VerifyDomain";
            readonly I: typeof VerifyDomainRequest;
            readonly O: typeof BoolValue;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.GetDomain
         */
        readonly getDomain: {
            readonly name: "GetDomain";
            readonly I: typeof GetDomainRequest;
            readonly O: typeof GetDomainResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.DeleteDomain
         */
        readonly deleteDomain: {
            readonly name: "DeleteDomain";
            readonly I: typeof DeleteDomainRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.ListDomains
         */
        readonly listDomains: {
            readonly name: "ListDomains";
            readonly I: typeof ListDomainRequest;
            readonly O: typeof ListDomainResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.domains.DomainService.ListAuthorizedDomains
         */
        readonly listAuthorizedDomains: {
            readonly name: "ListAuthorizedDomains";
            readonly I: typeof ListAuthorizedDomainRequest;
            readonly O: typeof ListAuthorizedDomainResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
