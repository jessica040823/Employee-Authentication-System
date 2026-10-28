import * as Yup from "yup";

const contact = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  email: Yup.string()
    .required("Email is required.")
    .email("Should be in email format!!"),

  subject: Yup.string()
    .required("Subject is required.")
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be at most 150 characters."),

  message: Yup.string()
    .required("Message is required.")
    .min(10, "Message must be at least 10 characters."),
});

export default contact;