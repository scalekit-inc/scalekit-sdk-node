import type { IdTokenClaim, User } from '../types/user';
export declare const IdTokenClaimToUserMap: {
    [k in keyof IdTokenClaim]: keyof User;
};
