import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
    password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Password must contain an uppercase letter")
          .matches(/[a-z]/, "Password must contain a lowercase letter")
          .matches(/[0-9]/, "Password must contain a number")
          .required("Password is required"),
    
    confirmPassword: Yup.string()
          .required("Confirm Password is required")
          .oneOf(
             [Yup.ref("password")],
             "Passwords must match"),
});