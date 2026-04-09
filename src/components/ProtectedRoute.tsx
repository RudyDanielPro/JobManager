import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "RECRUITER" | "CANDIDATO" | "ADMIN";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser?.rol || "";

  if (!userRole.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}