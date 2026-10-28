import { Navigate, Outlet } from "react-router-dom";

const PrivateLayout = () => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  // Login gareko chhaina -> login page
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Login gareko tara admin haina -> home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateLayout;