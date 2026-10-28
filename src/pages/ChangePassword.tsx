import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current password is required."),

  newPassword: Yup.string()
    .required("New password is required.")
    .min(8, "Password must be at least 8 characters.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[0-9]/, "Password must contain a number."),

  confirmPassword: Yup.string()
    .required("Please confirm your password.")
    .oneOf(
      [Yup.ref("newPassword")],
      "Passwords do not match."
    ),
});

function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (values : any, { resetForm}: any) => {
    console.log(values);

    // API will be connected here after we confirm
    // the exact change-password endpoint.

    resetForm();
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">

      {/* Heading */}
      <div className="mx-auto mb-8 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Change Password
        </h1>

        <p className="mt-2 text-muted-foreground">
          Update your account password.
        </p>
      </div>

      {/* Form Card */}
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-5">

            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Current Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <Field
                  as={Input}
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <ErrorMessage
                name="currentPassword"
                component="p"
                className="mt-1 text-sm text-destructive"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                New Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <Field
                  as={Input}
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <ErrorMessage
                name="newPassword"
                component="p"
                className="mt-1 text-sm text-destructive"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Confirm New Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <Field
                  as={Input}
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="mt-1 text-sm text-destructive"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="mt-2 w-full">
              Change Password
            </Button>

          </Form>
        </Formik>

      </div>
    </div>
  );
}

export default ChangePassword;

