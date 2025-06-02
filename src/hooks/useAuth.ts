"use client";

import { useEffect, useContext, createContext } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "../types/user";
import { UserRole } from "../types/user";

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
