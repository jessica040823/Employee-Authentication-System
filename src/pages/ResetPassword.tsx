import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema } from "../validation/resetPassword.schema";
import { resetpassword } from "../services/authService";
import { useMutation } from "@tanstack/react-query";

import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetMutation = useMutation({
    mutationFn: resetpassword,

    onSuccess: (data) => {
      console.log("Password reset successful:", data);
      navigate("/auth/login");
    },

    onError: (error) => {(
       axios.isAxiosError(error)
          ? error.response?.data?.message || "Password reset Failed😢"
          : "Password Reset Failed😢"
      
      );
    },
  });

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-8">

      <div className="w-full max-w-lg bg-card shadow-lg overflow-hidden rounded-2xl py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col px-5 sm:px-10 pt-4 pb-6 sm:pb-8 space-y-3 items-center">

          <div className="bg-primary rounded-full p-3 sm:p-4">
            <FaLock
              size={20}
              className="text-primary-foreground"
            />
          </div>

          <h1 className="font-extrabold text-xl sm:text-2xl text-center">
            Reset Password
          </h1>

          <p className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
            Enter your new password below.
          </p>

        </div>


        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={resetPasswordSchema}
          onSubmit={(values) => {

            if (!token) {
              console.log("Reset token is missing.");
              return;
            }

            resetMutation.mutate({
              token: token,
              newPassword: values.password,
              confirmPassword: values.confirmPassword,
            });
          }}
        >
          <div className="px-5 sm:px-10 pb-6">

            <Form className="space-y-5">

              {/* Password */}
              <div>

                <label className="text-sm font-medium">
                  Password
                </label>

                <div className="relative mt-2">

                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="pl-10 pr-10 w-full"
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


              {/* Confirm Password */}
              <div>

                <label className="text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative mt-2">

                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 w-full"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="mt-1 text-sm text-destructive"
                />

              </div>


              {/* Missing Token */}
              {!token && (
                <p className="text-sm text-destructive text-center leading-5">
                  Reset token is missing. Please use the reset link sent to
                  your email.
                </p>
              )}


              {/* API Error */}
              {resetMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {axios.isAxiosError(resetMutation.error)
                    ? resetMutation.error.response?.data?.message ||
                      "Failed to reset password."
                    : "Failed to reset password."}
                </p>
              )}


              {/* Success */}
              {resetMutation.isSuccess && (
                <p className="text-sm text-green-600 text-center">
                  Password reset successfully.
                </p>
              )}


              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary h-11"
                disabled={resetMutation.isPending || !token}
              >
                {resetMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>


              {/* Back to Login */}
              <div className="text-center pt-2">

                <button
                  type="button"
                  onClick={() => navigate("/auth/login")}
                  className="text-sm text-primary hover:underline"
                >
                  Back to Login
                </button>

              </div>

            </Form>

          </div>
        </Formik>

      </div>

    </div>
  );
};

export default ResetPassword;