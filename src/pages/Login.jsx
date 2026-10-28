import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/validation/login.schema";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authService";
import { toast } from "react-hot-toast";

const isAuth = false;

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,

  
    onSuccess: (data) => {
      toast.success("Logged in Successfully😊");

      if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
      }

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      navigate("/admin/dashboard");
    },

    // CHANGED: safer error handling
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    },
  });

  useEffect(() => {
    if (isAuth) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-background px-4">

      <div className="w-full max-w-4xl h-auto md:h-[30rem] bg-card shadow-lg overflow-hidden rounded-2xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col space-y-6 bg-accent justify-center items-center p-10">

          <div className="bg-primary rounded-full p-4">
            <FaUser
              size={30}
              className="text-primary-foreground"
            />
          </div>

          <h1 className="font-extrabold text-3xl text-foreground text-center">
            Welcome Back!
          </h1>

          <p className="text-center text-base text-muted-foreground max-w-sm">
            Login to your account to continue to your dashboard.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center text-foreground px-5 py-6 sm:px-8 md:pl-7">

          <div className="flex flex-col text-center">

            <h1 className="font-extrabold text-2xl text-foreground">
              Login
            </h1>

            <p className="mt-1 text-sm sm:text-base font-light text-muted-foreground">
              Enter your credentials to access your account.
            </p>

          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              loginMutation.mutate({
                email: values.email,
                password: values.password,
              });
            }}
          >
            {() => (
              <Form className="mt-5 space-y-5">

                {/* EMAIL */}
                <div>
                  <label className="text-sm sm:text-base">
                    Email
                  </label>

                  <div className="relative mt-2">

                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10"
                    />

                  </div>

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm sm:text-base">
                    Password
                  </label>

                  <div className="relative mt-2">

                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                {/* FORGOT PASSWORD */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/auth/forgetpassword")
                    }
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* LOGIN */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending
                    ? "Logging in..."
                    : "Login"}
                </Button>

                {/* ERROR */}
                {loginMutation.isError && (
                  <p className="text-sm text-destructive text-center">
                    {loginMutation.error?.response?.data?.message ||
                      "Login failed. Please check your credentials."}
                  </p>
                )}

                {/* REGISTER */}
                <div className="flex justify-center text-center text-xs sm:text-sm text-muted-foreground">

                  <p>
                    Don't have an account?{" "}

                    <a
                      href="/auth/register"
                      className="text-primary hover:underline"
                    >
                      Register
                    </a>
                  </p>

                </div>

              </Form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
}

export default Login;