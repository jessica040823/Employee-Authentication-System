import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from "react-icons/fa";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/validation/login.schema";

const isAuth = false;

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/admin/dashboard");
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-yellow-50 flex justify-center items-center p-5">
      <div className="w-full max-w-4xl h-120 bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2 items-center p-10">
        {/* Left Side */}
        <div className="flex flex-col space-y-6 h-full rounded-2xl bg-purple-100 justify-center items-center p-10">
          <div className="bg-purple-300 rounded-full p-4">
            <FaUser size={30} />
          </div>

          <h1 className="font-extrabold text-3xl">Welcome Back!</h1>

          <p className="text-center pt-1 font-serif">
            Login to your account to continue to your dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col text-black">
          <div className="flex flex-col text-center">
            <h1 className="font-extrabold text-2xl">Login</h1>

            <p className="font-light font-serif">
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
              console.log(values);
            }}
          >
            <div className="px-3 py-3">
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label>Email</label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2" />

                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label>Password</label>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2" />

                    <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-purple-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full bg-purple-500">
                  Login
                </Button>
                <div className="flex justify-center text-sm text-black-100">
                  <p>
                    Don't have an account? {""}
                    <a
                      href="/auth/register"
                      className="text-purple-700 hover:underline"
                    >
                      Register
                    </a>
                  </p>
                </div>
              </Form>
            </div>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
