import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import EmployeeForm from "./pages/EmployeeForm";
import Login from "./pages/Login";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicLayout from "./components/layouts/PublicLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      // Guest Pages
      {
        path: "/",
        children: [
          {
            index: true,
            Component: Home,
          },

          // About → /about
          {
            path: "about",
            Component: About,
          },

          // Services → /services
          {
            path: "services",
            Component: Services,
          },

          // Service Details → /services/web-development
          {
            path: "services/:serviceId",
            Component: ServiceDetails,
          },
        ],
      },

      // Auth pages
      {
        path: "auth",
        children: [
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: EmployeeForm,
          },
          {
            path: "forgetpassword",
            Component: ForgetPassword,
          },
        ],
      },

      {
        path: "reset-password",
        Component: ResetPassword,
      },

      // Private pages
      {
        path: "admin",
        Component: PrivateLayout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
          },
        ],
      },
    ],
  },
]);

export default router;
