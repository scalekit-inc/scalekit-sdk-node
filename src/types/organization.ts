export type OrganizationSettings = {
  features: Feature[];
}

export type Feature = {
  name: string;
  enabled: boolean;
}

export type OrganizationUserManagementSettingsInput = {
  maxAllowedUsers?: number | null;
}