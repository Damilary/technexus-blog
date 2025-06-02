export enum UserRole {
  USER = "USER",
  CONTRIBUTOR = "CONTRIBUTOR",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
