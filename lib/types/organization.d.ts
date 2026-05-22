export type OrganizationSettings = {
    features: Feature[];
};
export type Feature = {
    name: string;
    enabled: boolean;
};
export type OrganizationUserManagementSettingsInput = {
    maxAllowedUsers?: number | null;
};
export type SessionPolicySource = 'APPLICATION' | 'CUSTOM';
export type TimeUnit = 'MINUTES' | 'HOURS' | 'DAYS';
type ApplicationSessionPolicyInput = {
    policySource: 'APPLICATION';
};
type CustomSessionPolicyInput = {
    policySource: 'CUSTOM';
    absoluteSessionTimeout: number;
    absoluteSessionTimeoutUnit: TimeUnit;
    idleSessionTimeoutEnabled?: boolean;
    idleSessionTimeout?: number;
    idleSessionTimeoutUnit?: TimeUnit;
};
export type OrganizationSessionPolicyInput = ApplicationSessionPolicyInput | CustomSessionPolicyInput;
export {};
