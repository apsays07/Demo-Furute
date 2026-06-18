"use client";

import { createContext, useContext } from "react";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminUserContextProps {
  adminUser: AdminUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AdminUserContext = createContext<AdminUserContextProps | null>(null);

export function useAdminUser() {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }
  return context;
}
