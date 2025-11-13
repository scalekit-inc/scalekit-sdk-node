import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
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
 * @generated from message scalekit.v1.commons.OrganizationMembership
 */
export declare class OrganizationMembership extends Message<OrganizationMembership> {
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
 * @generated from message scalekit.v1.commons.Role
 */
export declare class Role extends Message<Role> {
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
    constructor(data?: PartialMessage<Role>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.commons.Role";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Role;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Role;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Role;
    static equals(a: Role | PlainMessage<Role> | undefined, b: Role | PlainMessage<Role> | undefined): boolean;
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
    constructor(data?: PartialMessage<UserProfile>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.commons.UserProfile";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserProfile;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserProfile;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserProfile;
    static equals(a: UserProfile | PlainMessage<UserProfile> | undefined, b: UserProfile | PlainMessage<UserProfile> | undefined): boolean;
}
