import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import employeeForm from "../validation/employeeSchema";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const handleRegister = async (values) => {
  try {
    const response = await axios.post(
      "http://192.168.150.169:3000/api/auth/register",
      {
        fullName: values.fullName,
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }
    );

    console.log("Registration Successful", response.data);

    return response.data;
  } catch (error) {
    console.log("Registration Failed", error.response?.data);
    throw error;
  }
};

function EmployeeForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-6">

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
        onSubmit={async (values) => {
          try {
            await handleRegister(values);
            console.log("Registered successfully");
            navigate("/auth/login");
          } catch (error) {
            console.log("Registration failed");
          }
        }}
      >
        {({ setFieldValue }) => (

          <Form className="mx-auto my-10 flex w-full max-w-xl flex-col gap-5 rounded-2xl border border-border bg-card shadow-lg p-10">

            {/* Heading */}
            <div className="mb-2 text-center">

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Employee Registration
              </h1>

              <p className="text-center pt-1 font-serif text-muted-foreground">
                Create your employee account
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Full Name */}
              <div className="flex flex-col gap-2">

                <label>Full Name</label>

                <div className="relative">

                  <FaUser className="absolute left-3 top-2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                  />

                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="fullName" />
                </span>

              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">

                <label>Email</label>

                <div className="relative">

                  <FaEnvelope className="absolute left-3 top-2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                  />

                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="email" />
                </span>

              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">

                <label>Phone Number</label>

                <div className="relative">

                  <FaPhone className="absolute left-3 top-2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="phoneNumber"
                    type="text"
                    placeholder="Enter 10 digit phone number"
                    maxLength={10}
                    className="pl-10"
                    inputMode="numeric"
                    onChange={(e) => {
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

                <label>Gender</label>

                <Select
                  onValueChange={(value) =>
                    setFieldValue("gender", value)
                  }
                >

                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Male">
                      Male
                    </SelectItem>

                    <SelectItem value="Female">
                      Female
                    </SelectItem>

                    <SelectItem value="Other">
                      Other
                    </SelectItem>

                  </SelectContent>

                </Select>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="gender" />
                </span>

              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">

                <label>Password</label>

                <div className="relative">

                  <FaLock className="absolute left-3 top-2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                  />

                </div>

                <span className="text-sm text-destructive">
                  <ErrorMessage name="password" />
                </span>

              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">

                <label>Confirm Password</label>

                <div className="relative">

                  <FaLock className="absolute left-3 top-2 text-muted-foreground" />

                  <Field
                    as={Input}
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                  />

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
            >
              Register
            </Button>

            <div className="flex justify-center text-sm text-muted-foreground">

              <p>
                Already have an account?{" "}

                
                  <a href="/auth/login"
                  className="text-primary hover:underline"
                >
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