import * as Yup from "yup";

const employeeForm = Yup.object({
  fullName: Yup.string()
    .required("Fullname is required.")
    .min(3, "Minimum 3 characters."),

  email: Yup.string()
    .required("Email is required")
    .email("Should be in email format!!"),

  phoneNumber: Yup.string()
    .required("Phone number is required.")
    .matches(
      /^[0-9]{10}$/,
      "Phone number should be of 10 digits"
    ),

  gender: Yup.string()
    .required("Gender is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password should be of minimum 8 characters.")
    .matches(
      /[A-Z]/,
      "Must contain an uppercase letter."
    )
    .matches(
      /[a-z]/,
      "Must contain a lowercase letter."
    )
    .matches(
      /[0-9]/,
      "Must contain a number."
    ),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
});



export default employeeForm;