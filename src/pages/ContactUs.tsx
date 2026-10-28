import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { contactUs } from "../services/authService";
import {
  FaEnvelope,
  FaUser,
  FaMessage,
} from "react-icons/fa6";
import toast from "react-hot-toast";

import contact from "../validation/contactUsSchema";
import { FaEnvelopeOpen, FaSubscript } from "react-icons/fa";

function ContactUs() {
  const contactMutation = useMutation({
    mutationFn: contactUs,

    onSuccess: () => {
      toast.success("Message sent successfully!");
    },


    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Something went wrong. Please try again."
      );
    },
  });

  return (
    <div className="min-h-screen bg-background px-3 py-2 sm:px-4 sm:py-8">
      <Formik
        initialValues={{
          name: "",
          email: "",
          subject: "",
          message: "",
        }}
        validationSchema={contact}
        onSubmit={(values, { resetForm }) => {
          contactMutation.mutate(
            {
              name: values.name,
              email: values.email,
              subject: values.subject,
              message: values.message,
            },
            {
              onSuccess: () => {
                resetForm();
              },
            }
          );
        }}
      >
        <Form className="mx-auto my-4 flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-lg sm:my-10 sm:gap-5 sm:p-8 md:p-10">

          {/* Heading */}
          <div className="mb-2 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Contact Us
            </h1>

            <p className="pt-1 text-sm text-muted-foreground sm:text-base">
              Have a question? Send us a message and we'll get back to you.
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base">
              Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <Field
                as={Input}
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full pl-10"
              />
            </div>

            <span className="text-sm text-destructive">
              <ErrorMessage name="name" />
            </span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base">
              Email
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <Field
                as={Input}
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10"
              />
            </div>

            <span className="text-sm text-destructive">
              <ErrorMessage name="email" />
            </span>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base">
              Subject
            </label>

            <div className="relative">
              <FaEnvelopeOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <Field
                as={Input}
                name="subject"
                type="text"
                placeholder="Enter subject"
                className="w-full pl-10"
              />
            </div>

            <span className="text-sm text-destructive">
              <ErrorMessage name="subject" />
            </span>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base">
              Message
            </label>

            <div className="relative">
              <FaMessage className="absolute left-3 top-3 text-muted-foreground" />

              <Field
                as={Textarea}
                name="message"
                rows={5}
                placeholder="Write your message..."
                className="w-full pl-10"
                />
            </div>

            <span className="text-sm text-destructive">
              <ErrorMessage name="message" />
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={contactMutation.isPending}
            className="mt-2 w-full"
          >
            {contactMutation.isPending
              ? "Sending..."
              : "Send Message"}
          </Button>
        </Form>
      </Formik>
    </div>
  );
}

export default ContactUs;