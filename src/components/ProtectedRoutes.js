import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import Dashboard from "../components/DashboardContainer/Dashboard"; // Import Dashboard Layout

const ProtectedRoute = () => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
};

export default ProtectedRoute;
