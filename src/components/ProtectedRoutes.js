import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import Dashboard from "../components/DashboardContainer/Dashboard"; 

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

  return isAuth ? (
    <Dashboard>
      <Outlet />
    </Dashboard>
  ) : (
    <Outlet /> // This will render login/register pages for unauthenticated users
  );
};

export default ProtectedRoute;
