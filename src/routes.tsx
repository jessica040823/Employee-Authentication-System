import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ContactUs from "./pages/ContactUs";

import EmployeeForm from "./pages/EmployeeForm";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import PublicLayout from "./components/layouts/PublicLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";

import Dashboard from "./admin/Dashboard";
import AdminProfile from "./admin/Profile";
import Users from "./admin/Users";
import AdminServices from "./admin/AdminServices";
import Queries from "./admin/Queries";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "services/:serviceId",
        Component: ServiceDetails,
      },
      {
        path: "contact",
        Component: ContactUs,
      },
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
            path: "forgot-password",
            Component: ForgetPassword,
          },
        ],
      },
      {
        path: "reset-password",
        Component: ResetPassword,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "change-password",
        Component: ChangePassword,
      },
    ],
  },

  {
    path: "/admin",
    Component: PrivateLayout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "profile",
        Component: AdminProfile,
      },
      {
        path: "users",
        Component: Users,
      },
      {
        path: "services",
        Component: AdminServices,
      },
      {
        path: "queries",
        Component: Queries,
      },
    ],
  },
]);

export default router;
