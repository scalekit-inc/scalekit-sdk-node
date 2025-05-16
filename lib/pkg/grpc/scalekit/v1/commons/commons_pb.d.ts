import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
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
 * @generated from enum scalekit.v1.commons.UserStatus
 */
export declare enum UserStatus {
    /**
     * @generated from enum value: USER_STATUS_UNSPECIFIED = 0;
     */
    USER_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ACTIVE = 1;
     */
    ACTIVE = 1,
    /**
     * @generated from enum value: INACTIVE = 2;
     */
    INACTIVE = 2
}
/**
 * @generated from enum scalekit.v1.commons.MembershipRole
 */
export declare enum MembershipRole {
    /**
     * @generated from enum value: MEMBERSHIP_ROLE_UNSPECIFIED = 0;
     */
    MEMBERSHIP_ROLE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ADMIN = 1;
     */
    ADMIN = 1,
    /**
     * @generated from enum value: USER = 2;
     */
    USER = 2
}
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
    SCALEKIT = 15
}
/**
 * @generated from message scalekit.v1.commons.OrganizationMembership
 */
export declare class OrganizationMembership extends Message<OrganizationMembership> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.commons.UserStatus membership_status = 2;
     */
    membershipStatus: UserStatus;
    /**
     * @generated from field: scalekit.v1.commons.MembershipRole role = 3;
     */
    role: MembershipRole;
    /**
     * @generated from field: optional string name = 4;
     */
    name?: string;
    /**
     * @generated from field: scalekit.v1.commons.IdentityProviderType primary_identity_provider = 5;
     */
    primaryIdentityProvider: IdentityProviderType;
    constructor(data?: PartialMessage<OrganizationMembership>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.commons.OrganizationMembership";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OrganizationMembership;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OrganizationMembership;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OrganizationMembership;
    static equals(a: OrganizationMembership | PlainMessage<OrganizationMembership> | undefined, b: OrganizationMembership | PlainMessage<OrganizationMembership> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.commons.UserProfile
 */
export declare class UserProfile extends Message<UserProfile> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string first_name = 2;
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 3;
     */
    lastName: string;
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
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> custom_attributes = 8;
     */
    customAttributes: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<UserProfile>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.commons.UserProfile";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserProfile;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserProfile;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserProfile;
    static equals(a: UserProfile | PlainMessage<UserProfile> | undefined, b: UserProfile | PlainMessage<UserProfile> | undefined): boolean;
}
