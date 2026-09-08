import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import employeeForm from "../validation/employeeSchema";
import { FaEnvelope, FaLock, FaMailBulk, FaPhone, FaUser } from "react-icons/fa";

function EmployeeForm() {
  return (
    <div className="min-h-screen bg-purple-50 px-4 py-6">
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
        onSubmit={(values) => {
          console.log("Form Submitted:", values);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="mx-auto my-10 flex w-full max-w-xl flex-col gap-5 rounded-2xl border bg-white shadow-lg p-10">

            {/* Heading */}
            <div className="mb-2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Employee Registration
              </h1>

              <p className="text-center pt-1 font-serif">
                Create your employee account
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label>Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-2"/>
                  <Field
                
                  as={Input}
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                />
                </div>
                <span className="text-sm text-red-400">
                  <ErrorMessage name="fullName" />
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label>Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-2"/>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className=" pl-10"
                />

                </div>

                <span className="text-sm text-red-400">
                  <ErrorMessage name="email" />
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label>Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-2"/>
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

                <span className="text-sm text-red-400">
                  <ErrorMessage name="phoneNumber" />
                </span>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label>Gender</label>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name="gender"
                      value="male"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name="gender"
                      value="female"
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      name="gender"
                      value="other"
                    />
                    Other
                  </label>
                </div>

                <span className="text-sm text-red-400">
                  <ErrorMessage name="gender" />
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label>Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-2"/>
                  <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                />

                </div>
                <span className="text-sm text-red-400">
                  <ErrorMessage name="password" />
                </span>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label>Confirm Password</label>
                  <div className="relative">
                  <FaLock className="absolute left-3 top-2"/>
                  <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                />

                </div>

              

                <span className="text-sm text-red-400">
                  <ErrorMessage name="confirmPassword" />
                </span>
              </div>

            </div>

            {/* Register Button */}
            <Button type="submit" className="w-full bg-purple-500">
              Register
            </Button>
             <div className="flex justify-center text-sm text-black-100">
               <p>Already have an account? {""}
                  <a href="/auth/login"
                    className="text-purple-700 hover:underline">
                    Login</a>
               </p>
             </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EmployeeForm;