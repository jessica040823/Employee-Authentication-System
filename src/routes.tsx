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
import UserEdit from "./admin/UserEdit";
import UserDelete from "./admin/UserDelete";

import AdminServices from "./admin/AdminServices";
import AdminServiceForm from "./admin/AdminServiceForm";
import AdminServiceDelete from "./admin/AdminServiceDelete";
import Queries from "./admin/Queries";
import QueryDetails from "./admin/QueryDetails";
import QueryDelete from "./admin/QueryDelete";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "services/:serviceId", Component: ServiceDetails },
      { path: "contact", Component: ContactUs },
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: EmployeeForm },
          { path: "forgot-password", Component: ForgetPassword },
        ],
      },
      { path: "reset-password", Component: ResetPassword },
      { path: "profile", Component: Profile },
      { path: "change-password", Component: ChangePassword },
    ],
  },

  {
    path: "/admin",
    Component: PrivateLayout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "profile", Component: AdminProfile },

      //Users
      { path: "users", Component: Users },
      { path: "users/:id/edit", Component: UserEdit },
      { path: "users/:id/delete", Component: UserDelete },


      // Services
      { path: "services", Component: AdminServices },
      { path: "services/new", Component: AdminServiceForm },
      { path: "services/:id/edit", Component: AdminServiceForm },
      { path: "services/:id/delete", Component: AdminServiceDelete },

      // Queries
      { path: "queries", Component: Queries },
      { path: "queries/:id", Component: QueryDetails },
      { path: "queries/:id/delete", Component: QueryDelete },
    ],
  },
]);

export default router;