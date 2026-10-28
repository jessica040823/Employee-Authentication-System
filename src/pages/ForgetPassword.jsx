import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { forgetPasswordSchema } from "@/validation/forgetPassword.schema";
import { forgotpassword } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const forgotMutation = useMutation({
    mutationFn: forgotpassword,

    onSuccess: (data) => {
      console.log("Reset link sent successfully:", data);
      navigate("/auth/reset-password");
    },

    onError: (error) => {
      console.log(
        "Forgot password failed:",
        error.response?.data || error.message
      );
    },
  });

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-8">

      <div className="w-full max-w-lg bg-card shadow-lg overflow-hidden rounded-2xl py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col px-5 sm:px-10 pt-4 pb-6 sm:pb-8 space-y-4 items-center">

          <div className="bg-primary rounded-full p-3 sm:p-4">
            <FaLock
              size={20}
              className="text-primary-foreground"
            />
          </div>

          <h1 className="font-extrabold text-xl sm:text-2xl text-center">
            Forgot Password?
          </h1>

          <p className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
            Enter your email address and we will send you a link to reset
            your password.
          </p>

        </div>


        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={forgetPasswordSchema}
          onSubmit={(values) => {
            forgotMutation.mutate(values.email);
          }}
        >
          <div className="px-5 sm:px-10 pb-6">

            <Form className="space-y-5">

              {/* Email */}
              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Email
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 w-full"
                  />

                </div>

                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-destructive"
                />

              </div>


              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary h-11"
                disabled={forgotMutation.isPending}
              >
                {forgotMutation.isPending
                  ? "Sending..."
                  : "Send Reset Link"}
              </Button>


              {/* Error */}
              {forgotMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {forgotMutation.error?.response?.data?.message ||
                    "Failed to send reset link."}
                </p>
              )}


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

export default ForgetPassword;