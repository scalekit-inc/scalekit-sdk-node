import { CreateOrganizationRequest, CreateOrganizationResponse, CustomerPortalLinkRequest, CustomerPortalLinksResponse, DeleteOrganizationRequest, GenerateCustomerPortalLinkResponse, GetOrganizationRequest, GetOrganizationResponse, ListOrganizationsRequest, ListOrganizationsResponse, UpdateOrganizationRequest, UpdateOrganizationResponse } from "./organizations_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.organizations.OrganizationService
 */
export declare const OrganizationService: {
    readonly typeName: "scalekit.v1.organizations.OrganizationService";
    readonly methods: {
        /**
         * Create Organization
         *
         * @generated from rpc scalekit.v1.organizations.OrganizationService.CreateOrganization
         */
        readonly createOrganization: {
            readonly name: "CreateOrganization";
            readonly I: typeof CreateOrganizationRequest;
            readonly O: typeof CreateOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Update Organization description here
         *
         * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganization
         */
        readonly updateOrganization: {
            readonly name: "UpdateOrganization";
            readonly I: typeof UpdateOrganizationRequest;
            readonly O: typeof UpdateOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Get Organization Description here
         *
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
         * Delete an Organization
         *
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteOrganization
         */
        readonly deleteOrganization: {
            readonly name: "DeleteOrganization";
            readonly I: typeof DeleteOrganizationRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Generate Portal Link for Org
         *
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GenerateCustomerPortalLink
         */
        readonly generateCustomerPortalLink: {
            readonly name: "GenerateCustomerPortalLink";
            readonly I: typeof CustomerPortalLinkRequest;
            readonly O: typeof GenerateCustomerPortalLinkResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteCustomerPortalLink
         */
        readonly deleteCustomerPortalLink: {
            readonly name: "DeleteCustomerPortalLink";
            readonly I: typeof CustomerPortalLinkRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GetCustomerPortalLink
         */
        readonly getCustomerPortalLink: {
            readonly name: "GetCustomerPortalLink";
            readonly I: typeof CustomerPortalLinkRequest;
            readonly O: typeof CustomerPortalLinksResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
