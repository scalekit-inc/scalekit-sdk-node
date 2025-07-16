export type User = {
    id: string;
    username: string | undefined;
    name: string;
    givenName: string;
    familyName: string | undefined;
    email: string;
    emailVerified: boolean;
    phoneNumber: string | undefined;
    phoneNumberVerified: boolean | undefined;
    profile: string | undefined;
    picture: string | undefined;
    gender: string | undefined;
    birthDate: string | undefined;
    zoneInfo: string | undefined;
    locale: string | undefined;
    updatedAt: string | undefined;
    identities: Identity[];
    metadata: string | undefined;
};
export type Identity = {
    connectionId: string;
    organizationId: string;
    connectionType: string;
    providerName: string;
    social: boolean;
    providerRawAttributes: string;
};
export type IdTokenClaimIdentity = {
    connection_id: string;
    organization_id: string;
    connection_type: string;
    provider_name: string;
    social: boolean;
    provider_raw_attributes: string;
};
export type IdTokenClaim = {
    sub: string;
    name: string;
    preferred_username: string | undefined;
    given_name: string;
    family_name: string | undefined;
    email: string;
    email_verified: boolean;
    phone_number: string | undefined;
    phone_number_verified: boolean | undefined;
    profile: string | undefined;
    picture: string | undefined;
    gender: string | undefined;
    birthdate: string | undefined;
    zoneinfo: string | undefined;
    locale: string | undefined;
    updated_at: string | undefined;
    identities: IdTokenClaimIdentity[];
    metadata: string | undefined;
};
export type TokenResponse = {
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
};
export type IdpInitiatedLoginClaims = {
    connection_id: string;
    organization_id: string;
    login_hint: string;
    relay_state?: string;
};
