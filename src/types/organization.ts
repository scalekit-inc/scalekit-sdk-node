export type OrganizationSettings = {
  features: Feature[];
}

export type Feature = {
  name: string;
  enabled: boolean;
}