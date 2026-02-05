import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/commons/commons.proto.
 */
export declare const file_scalekit_v1_commons_commons: GenFile;
/**
 * @generated from message scalekit.v1.commons.OrganizationMembership
 */
export type OrganizationMembership = Message<"scalekit.v1.commons.OrganizationMembership"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: google.protobuf.Timestamp join_time = 2;
     */
    joinTime?: Timestamp;
    /**
     * @generated from field: scalekit.v1.commons.MembershipStatus membership_status = 3;
     */
    membershipStatus: MembershipStatus;
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 4;
     */
    roles: Role[];
    /**
     * @generated from field: optional string name = 5;
     */
    name?: string;
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: optional string display_name = 9;
     */
    displayName?: string;
    /**
     * @generated from field: optional string inviter_email = 10;
     */
    inviterEmail?: string;
    /**
     * @generated from field: optional google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: optional google.protobuf.Timestamp accepted_at = 12;
     */
    acceptedAt?: Timestamp;
    /**
     * @generated from field: optional google.protobuf.Timestamp expires_at = 13;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: optional string provisioning_method = 14;
     */
    provisioningMethod?: string;
    /**
     * @generated from field: repeated string permissions = 15;
     */
    permissions: string[];
};
/**
 * Describes the message scalekit.v1.commons.OrganizationMembership.
 * Use `create(OrganizationMembershipSchema)` to create a new message.
 */
export declare const OrganizationMembershipSchema: GenMessage<OrganizationMembership>;
/**
 * @generated from message scalekit.v1.commons.Role
 */
export type Role = Message<"scalekit.v1.commons.Role"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
};
/**
 * Describes the message scalekit.v1.commons.Role.
 * Use `create(RoleSchema)` to create a new message.
 */
export declare const RoleSchema: GenMessage<Role>;
/**
 * @generated from message scalekit.v1.commons.UserProfile
 */
export type UserProfile = Message<"scalekit.v1.commons.UserProfile"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string given_name = 2;
     */
    givenName: string;
    /**
     * @generated from field: string family_name = 3;
     */
    familyName: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: string locale = 5;
     */
    locale: string;
    /**
     * @generated from field: bool email_verified = 6;
     */
    emailVerified: boolean;
    /**
     * @generated from field: string phone_number = 7;
     */
    phoneNumber: string;
    /**
     * @generated from field: map<string, string> metadata = 8;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> custom_attributes = 9;
     */
    customAttributes: {
        [key: string]: string;
    };
    /**
     * @generated from field: string first_name = 21 [deprecated = true];
     * @deprecated
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 22 [deprecated = true];
     * @deprecated
     */
    lastName: string;
    /**
     * @generated from field: string preferred_username = 12;
     */
    preferredUsername: string;
    /**
     * @generated from field: bool phone_number_verified = 13;
     */
    phoneNumberVerified: boolean;
    /**
     * @generated from field: string picture = 14;
     */
    picture: string;
    /**
     * @generated from field: repeated string groups = 15;
     */
    groups: string[];
    /**
     * @generated from field: string gender = 16;
     */
    gender: string;
    /**
     * @generated from field: repeated scalekit.v1.commons.ExternalIdentity external_identities = 10;
     */
    externalIdentities: ExternalIdentity[];
};
/**
 * Describes the message scalekit.v1.commons.UserProfile.
 * Use `create(UserProfileSchema)` to create a new message.
 */
export declare const UserProfileSchema: GenMessage<UserProfile>;
/**
 * @generated from message scalekit.v1.commons.ExternalIdentity
 */
export type ExternalIdentity = Message<"scalekit.v1.commons.ExternalIdentity"> & {
    /**
     * Identifier for this connection.
     *
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * Connection name.
     *
     * @generated from field: string connection_type = 2;
     */
    connectionType: string;
    /**
     * Name of connection, e.g. Google.
     *
     * @generated from field: scalekit.v1.commons.IdentityProviderType connection_provider = 3;
     */
    connectionProvider: IdentityProviderType;
    /**
     * Unique identifier of the user for this identity.
     *
     * @generated from field: string connection_user_id = 4;
     */
    connectionUserId: string;
    /**
     * Whether this identity is from a social provider (true) or not (false).
     *
     * @generated from field: bool is_social = 5;
     */
    isSocial: boolean;
    /**
     * Last successful login time with this IdP for the user.
     *
     * @generated from field: google.protobuf.Timestamp last_login_time = 6;
     */
    lastLoginTime?: Timestamp;
    /**
     * Creation of this external identity with the IdP for the user.
     *
     * @generated from field: google.protobuf.Timestamp created_time = 7;
     */
    createdTime?: Timestamp;
    /**
     * Last time when sync of data happened for this user from external IdP.
     *
     * @generated from field: google.protobuf.Timestamp last_synced_time = 8;
     */
    lastSyncedTime?: Timestamp;
};
/**
 * Describes the message scalekit.v1.commons.ExternalIdentity.
 * Use `create(ExternalIdentitySchema)` to create a new message.
 */
export declare const ExternalIdentitySchema: GenMessage<ExternalIdentity>;
/**
 * @generated from enum scalekit.v1.commons.RegionCode
 */
export declare enum RegionCode {
    /**
     *
     * If the region code is unspecified the selected region will automatically be decided based on the origin of the call.
     *
     * @generated from enum value: REGION_CODE_UNSPECIFIED = 0;
     */
    REGION_CODE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: US = 1;
     */
    US = 1,
    /**
     * @generated from enum value: EU = 2;
     */
    EU = 2
}
/**
 * Describes the enum scalekit.v1.commons.RegionCode.
 */
export declare const RegionCodeSchema: GenEnum<RegionCode>;
/**
 * @generated from enum scalekit.v1.commons.MembershipStatus
 */
export declare enum MembershipStatus {
    /**
     * @generated from enum value: Membership_Status_UNSPECIFIED = 0;
     */
    Membership_Status_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ACTIVE = 1;
     */
    ACTIVE = 1,
    /**
     * @generated from enum value: INACTIVE = 2;
     */
    INACTIVE = 2,
    /**
     * @generated from enum value: PENDING_INVITE = 3;
     */
    PENDING_INVITE = 3,
    /**
     * @generated from enum value: INVITE_EXPIRED = 4;
     */
    INVITE_EXPIRED = 4
}
/**
 * Describes the enum scalekit.v1.commons.MembershipStatus.
 */
export declare const MembershipStatusSchema: GenEnum<MembershipStatus>;
/**
 * @generated from enum scalekit.v1.commons.IdentityProviderType
 */
export declare enum IdentityProviderType {
    /**
     * @generated from enum value: IDENTITY_PROVIDER_UNSPECIFIED = 0;
     */
    IDENTITY_PROVIDER_UNSPECIFIED = 0,
    /**
     * @generated from enum value: OKTA = 1;
     */
    OKTA = 1,
    /**
     * @generated from enum value: GOOGLE = 2;
     */
    GOOGLE = 2,
    /**
     * @generated from enum value: MICROSOFT_AD = 3;
     */
    MICROSOFT_AD = 3,
    /**
     * @generated from enum value: AUTH0 = 4;
     */
    AUTH0 = 4,
    /**
     * @generated from enum value: ONELOGIN = 5;
     */
    ONELOGIN = 5,
    /**
     * @generated from enum value: PING_IDENTITY = 6;
     */
    PING_IDENTITY = 6,
    /**
     * @generated from enum value: JUMPCLOUD = 7;
     */
    JUMPCLOUD = 7,
    /**
     * @generated from enum value: CUSTOM = 8;
     */
    CUSTOM = 8,
    /**
     * @generated from enum value: GITHUB = 9;
     */
    GITHUB = 9,
    /**
     * @generated from enum value: GITLAB = 10;
     */
    GITLAB = 10,
    /**
     * @generated from enum value: LINKEDIN = 11;
     */
    LINKEDIN = 11,
    /**
     * @generated from enum value: SALESFORCE = 12;
     */
    SALESFORCE = 12,
    /**
     * @generated from enum value: MICROSOFT = 13;
     */
    MICROSOFT = 13,
    /**
     * @generated from enum value: IDP_SIMULATOR = 14;
     */
    IDP_SIMULATOR = 14,
    /**
     * @generated from enum value: SCALEKIT = 15;
     */
    SCALEKIT = 15,
    /**
     * @generated from enum value: ADFS = 16;
     */
    ADFS = 16
}
/**
 * Describes the enum scalekit.v1.commons.IdentityProviderType.
 */
export declare const IdentityProviderTypeSchema: GenEnum<IdentityProviderType>;
