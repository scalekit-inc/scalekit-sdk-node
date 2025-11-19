import { CreateOrganizationRequest, CreateOrganizationResponse, CreateOrganizationSessionSettingsRequest, CreateOrganizationSessionSettingsResponse, DeleteOrganizationRequest, DeleteOrganizationSessionSettingsRequest, DeletePortalLinkByIdRequest, DeletePortalLinkRequest, GeneratePortalLinkRequest, GeneratePortalLinkResponse, GetOrganizationRequest, GetOrganizationResponse, GetOrganizationSessionSettingsRequest, GetOrganizationSessionSettingsResponse, GetOrganizationUserManagementSettingsRequest, GetOrganizationUserManagementSettingsResponse, GetPortalLinkRequest, GetPortalLinksResponse, ListOrganizationsRequest, ListOrganizationsResponse, SearchOrganizationsRequest, SearchOrganizationsResponse, UpdateOrganizationRequest, UpdateOrganizationResponse, UpdateOrganizationSessionSettingsRequest, UpdateOrganizationSessionSettingsResponse, UpdateOrganizationSettingsRequest, UpsertUserManagementSettingsRequest, UpsertUserManagementSettingsResponse } from "./organizations_pb.js";
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
         * @generated from rpc scalekit.v1.organizations.OrganizationService.SearchOrganization
         */
        readonly searchOrganization: {
            readonly name: "SearchOrganization";
            readonly I: typeof SearchOrganizationsRequest;
            readonly O: typeof SearchOrganizationsResponse;
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
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GeneratePortalLink
         */
        readonly generatePortalLink: {
            readonly name: "GeneratePortalLink";
            readonly I: typeof GeneratePortalLinkRequest;
            readonly O: typeof GeneratePortalLinkResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeletePortalLink
         */
        readonly deletePortalLink: {
            readonly name: "DeletePortalLink";
            readonly I: typeof DeletePortalLinkRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeletePortalLinkByID
         */
        readonly deletePortalLinkByID: {
            readonly name: "DeletePortalLinkByID";
            readonly I: typeof DeletePortalLinkByIdRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GetPortalLinks
         */
        readonly getPortalLinks: {
            readonly name: "GetPortalLinks";
            readonly I: typeof GetPortalLinkRequest;
            readonly O: typeof GetPortalLinksResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganizationSettings
         */
        readonly updateOrganizationSettings: {
            readonly name: "UpdateOrganizationSettings";
            readonly I: typeof UpdateOrganizationSettingsRequest;
            readonly O: typeof GetOrganizationResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.CreateOrganizationSessionSettings
         */
        readonly createOrganizationSessionSettings: {
            readonly name: "CreateOrganizationSessionSettings";
            readonly I: typeof CreateOrganizationSessionSettingsRequest;
            readonly O: typeof CreateOrganizationSessionSettingsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationSessionSettings
         */
        readonly getOrganizationSessionSettings: {
            readonly name: "GetOrganizationSessionSettings";
            readonly I: typeof GetOrganizationSessionSettingsRequest;
            readonly O: typeof GetOrganizationSessionSettingsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganizationSessionSettings
         */
        readonly updateOrganizationSessionSettings: {
            readonly name: "UpdateOrganizationSessionSettings";
            readonly I: typeof UpdateOrganizationSessionSettingsRequest;
            readonly O: typeof UpdateOrganizationSessionSettingsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteOrganizationSessionSettings
         */
        readonly deleteOrganizationSessionSettings: {
            readonly name: "DeleteOrganizationSessionSettings";
            readonly I: typeof DeleteOrganizationSessionSettingsRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Update user management setting for an organization
         *
         * @generated from rpc scalekit.v1.organizations.OrganizationService.UpsertUserManagementSettings
         */
        readonly upsertUserManagementSettings: {
            readonly name: "UpsertUserManagementSettings";
            readonly I: typeof UpsertUserManagementSettingsRequest;
            readonly O: typeof UpsertUserManagementSettingsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationUserManagementSetting
         */
        readonly getOrganizationUserManagementSetting: {
            readonly name: "GetOrganizationUserManagementSetting";
            readonly I: typeof GetOrganizationUserManagementSettingsRequest;
            readonly O: typeof GetOrganizationUserManagementSettingsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
