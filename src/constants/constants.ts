import type { UserRole } from "../components/ProtectedRoute";

export const CHARGES = {
  convenience_fee: 35,
  tax: 5,
};
export const UserRoles: Record<string, UserRole> = {
  ADMIN: "admin",
  USER: "user",
  SUPERADMIN: "superadmin",
};
