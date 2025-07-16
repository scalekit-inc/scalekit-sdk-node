export interface CreateUserRequest {
  email: string;
  externalId?: string;
  phoneNumber?: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
  };
  metadata?: Record<string, string>;
  sendActivationEmail?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  externalId?: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
  };
  metadata?: Record<string, string>;
}