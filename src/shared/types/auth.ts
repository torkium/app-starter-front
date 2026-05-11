export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  emailVerified: boolean;
  roles: string[];
}
