import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const isAuth = false;

function PrivateLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  });
  // check authentication
  return <Outlet />;
}

export default PrivateLayout;
