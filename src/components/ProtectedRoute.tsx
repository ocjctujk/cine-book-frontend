import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
export type UserRole = "admin" | "user" | "superadmin";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles: UserRole[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }
  console.log(requiredRoles, user?.role);
  if (!user || !requiredRoles.includes(user.role)) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
