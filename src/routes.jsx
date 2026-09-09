import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import EmployeeForm from "./pages/EmployeeForm";
import Login from "./pages/Login";
import Services from "./pages/Services";
import ForgetPassword from "./pages/ForgetPassword";
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
          //Services
          {
            path: "services",
            Component: Services,
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
          }
        ],
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
