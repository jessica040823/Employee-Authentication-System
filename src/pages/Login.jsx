import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/validation/login.schema";

const isAuth = false;


const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('http://192.168.150.169:3000/api/auth/login', {
      email: email,
      password: password
    });

    
    console.log('Login successful!', response.data);
    

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;

  } catch (error) {
    console.log("Login Failed", error)
  
    throw error;
  }
};

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/admin/dashboard");
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-5">
      <div className="w-full max-w-4xl h-120 bg-card  shadow-lg overflow-hidden grid md:grid-cols-2 items-center pr-5">
        {/* Left Side */}
        <div className="flex flex-col space-y-6 h-full  bg-accent justify-center items-center p-10">
          <div className="bg-primary rounded-full p-4">
            <FaUser size={30} className="text-primary-foreground" />
          </div>

          <h1 className="font-extrabold text-3xl text-foreground">Welcome Back!</h1>

          <p className="text-center pt-1  text-muted-foreground">
            Login to your account to continue to your dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col text-foreground pl-7">
          <div className="flex flex-col text-center">
            <h1 className="font-extrabold text-2xl text-foreground">Login</h1>

            <p className="font-light font-serif text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
         onSubmit={async (values) => {
                try {
                    await handleLogin(values.email, values.password);

                    navigate("/admin/dashboard");
                } catch (error) {
                    console.log("Login failed");
                }
                }}
                        >
            <div className="px-3 py-3">
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label>Email</label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

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
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                {/* Password */}
                <div>
                  <label>Password</label>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/auth/forgetpassword")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="flex justify-center text-sm text-muted-foreground">
                  <p>
                    Don't have an account? {""}
                    
                     <a  href="/auth/register"
                      className="text-primary hover:underline"
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