import type { IdTokenClaim, User } from '../types/auth';

export const IdTokenClaimToUserMap: { [k in keyof IdTokenClaim]: keyof User } = {
  "sub": "id",
  "name": "name",
  "preferred_username": "username",
  "given_name": "givenName",
  "family_name": "familyName",
  "email": "email",
  "email_verified": "emailVerified",
  "phone_number": "phoneNumber",
  "phone_number_verified": "phoneNumberVerified",
  "profile": 'profile',
  "picture": "picture",
  "gender": "gender",
  "birthdate": "birthDate",
  "zoneinfo": "zoneInfo",
  "locale": "locale",
  "updated_at": "updatedAt",
  "identities": "identities",
  "metadata": "metadata"
}