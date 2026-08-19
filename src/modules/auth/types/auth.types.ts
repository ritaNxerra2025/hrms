import { User } from '../../../database/models/user.model';

export interface ValidatedUser {
  userId: number;
  tenantId: number;
  email: string;
  fullName: string;
  // lastName: string;
}

export interface AuthProfile {
  user: User;
  // permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}
