import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-5">

      <div className=" fixed w-full max-w-lg bg-card shadow-lg overflow-hidden py-8">

        {/* Header */}
        <div className="flex flex-col px-10 pt-4 pb-8 space-y-4 items-center">

          <div className="bg-primary rounded-full p-4">
            <FaLock size={20} className="text-primary-foreground" />
          </div>

          <h1 className="font-extrabold text-2xl">
            Forgot Password?
          </h1>

          <p className="text-center text-muted-foreground leading-relaxed max-w-md">
            Enter your email address and we will send you a link to reset your password.
          </p>

        </div>

        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <div className="px-10 pb-6">

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
                    className="pl-10 h-11"
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
              >
                Send Reset Link
              </Button>

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