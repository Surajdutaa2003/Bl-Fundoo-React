import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";

const ProtectedRoute = () => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (isAuth && (location.pathname === "/" || location.pathname === "/register")) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!isAuth && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render child routes without wrapping in Dashboard
};

export default ProtectedRoute;