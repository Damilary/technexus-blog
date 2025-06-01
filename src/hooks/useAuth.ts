"use client";

import { useEffect, useContext, createContext } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole, User } from "../graphql/types";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  hasRole: () => false,
});

export function useAuth() {
  const { user, hasRole } = useContext(AuthContext);

  return {
    user,
    hasRole,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isEditor: user?.role === UserRole.EDITOR,
    isContributor: user?.role === UserRole.CONTRIBUTOR,
  };
}
