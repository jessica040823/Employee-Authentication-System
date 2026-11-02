import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/authService";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import employeeForm from "../validation/employeeSchema";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function EmployeeForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      toast.success("Registered Successfully.");
      navigate("/auth/login");
    },

    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.status === 409
            ? error.response.data?.message || "Email already registered."
            : error.response?.data?.message ?? error.message
          : error.message || "Something went wrong. Please try again."
      );
    },
  });

  return (
    <div className="min-h-screen bg-background px-3 sm:px-4 py-6 sm:py-10">
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          phoneNumber: "",
          gender: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={employeeForm}
        onSubmit={(values) => {
          registerMutation.mutate({
            fullName: values.fullName,
            email: values.email,
            phone: values.phoneNumber,
            password: values.password,
            confirmPassword: values.confirmPassword,
          });
        }}
      >
        {({ setFieldValue }) => (
          <Form className="mx-auto my-4 sm:my-10 flex w-full max-w-xl flex-col gap-4 sm:gap-5 rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-10 shadow-lg">
            {/* Heading */}
            <div className="mb-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Employee Registration
              </h1>

              <p className="pt-1 text-sm sm:text-base text-muted-foreground">
                Create your employee account
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Full Name</label>

                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 w-full"
                  />
                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="fullName" />
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Email</label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 w-full"
                  />
                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="email" />
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Phone Number</label>

                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="phoneNumber"
                    type="text"
                    placeholder="Enter 10 digit phone number"
                    maxLength={10}
                    className="pl-10 w-full"
                    inputMode="numeric"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFieldValue("phoneNumber", value);
                    }}
                  />
                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="phoneNumber" />
                </span>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Gender</label>

                <Select onValueChange={(value) => setFieldValue("gender", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="gender" />
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Password</label>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="password" />
                </span>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Confirm Password</label>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="confirmPassword" />
                </span>
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>

            {/* Login */}
            <div className="flex justify-center text-center text-xs sm:text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <a href="/auth/login" className="text-primary hover:underline">
                  Login
                </a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EmployeeForm;