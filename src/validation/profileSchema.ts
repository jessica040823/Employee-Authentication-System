import * as Yup from "yup";

const profileSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^[0-9]{10}$/,
      "Phone number must be exactly 10 digits"
    ),
});

export default profileSchema;