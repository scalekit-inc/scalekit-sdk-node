import { CreateOrganizationRequest, CreateOrganizationResponse, DeleteOrganizationRequest, GetOrganizationRequest, GetOrganizationResponse, ListOrganizationsRequest, ListOrganizationsResponse, UpdateOrganizationRequest, UpdateOrganizationResponse } from "./organizations_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.organizations.OrganizationService
 */
export declare const OrganizationService: {
    readonly typeName: "scalekit.v1.organizations.OrganizationService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.CreateOrganization
         */
        readonly createOrganization: {
            readonly name: "CreateOrganization";
            readonly I: typeof CreateOrganizationRequest;
            readonly O: typeof CreateOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganization
         */
        readonly updateOrganization: {
            readonly name: "UpdateOrganization";
            readonly I: typeof UpdateOrganizationRequest;
            readonly O: typeof UpdateOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganization
         */
        readonly getOrganization: {
            readonly name: "GetOrganization";
            readonly I: typeof GetOrganizationRequest;
            readonly O: typeof GetOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.ListOrganization
         */
        readonly listOrganization: {
            readonly name: "ListOrganization";
            readonly I: typeof ListOrganizationsRequest;
            readonly O: typeof ListOrganizationsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteOrganization
         */
        readonly deleteOrganization: {
            readonly name: "DeleteOrganization";
            readonly I: typeof DeleteOrganizationRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
