import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  if (!user) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
