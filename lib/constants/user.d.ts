import type { IdTokenClaim, User } from '../types/auth';
export declare const IdTokenClaimToUserMap: {
    [k in keyof IdTokenClaim]: keyof User;
};
