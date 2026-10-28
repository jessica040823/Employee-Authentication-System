import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

import {
  getProfile,
  updateProfile,
} from "../services/authService";

import profileSchema from "../validation/profileSchema";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof ProfileData, string>>;

const Profile = () => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Get Profile
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<Partial<ProfileData>>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // Set profile data into form
  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    }
  }, [data]);

  // Update Profile
  const updateMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      setIsEditing(false);
      setErrors({});

      toast.success("Profile updated successfully!");
    },

    onError: (error) => {
      console.log("Update Profile Error:", error);

      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to update profile."
      );
    },
  });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof ProfileData]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Save Changes
  const handleSave = async () => {
    try {
      await profileSchema.validate(formData, {
        abortEarly: false,
      });

      setErrors({});

      updateMutation.mutate(formData);
    } catch (validationError: any) {
      const newErrors: FormErrors = {};

      validationError.inner.forEach(
        (error: { path: keyof ProfileData; message: string }) => {
          if (!newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        }
      );

      setErrors(newErrors);

      toast.error("Please fix the errors in the form.");
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    }

    setErrors({});
    setIsEditing(false);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <p className="text-center text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  // Error
  if (isError) {
    console.log("Profile Error:", error);

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-card p-10 text-center shadow-sm">
          <p className="text-red-500">
            Failed to load profile.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {axios.isAxiosError(error)
              ? error.response?.data?.message ?? error.message
              : error?.message || "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Back */}
      <div className="mb-6">
        <NavLink
          to="/admin/dashboard"
          className="text-sm text-primary hover:underline"
        >
          ← Back
        </NavLink>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Profile
        </h1>

        <p className="mt-1 text-muted-foreground">
          View and update your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="mx-auto max-w-3xl rounded-xl bg-card p-10 shadow-sm">

        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center gap-4 border-b border-border pb-6 sm:flex-row">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <FaUser size={20} />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-card-foreground">
              {data?.fullName || "Admin"}
            </h2>

            <p className="text-muted-foreground">
              Admin
            </p>
          </div>

        </div>

        {/* Fields */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Full Name */}
          <div className="rounded-lg bg-secondary p-4">

            <div className="flex items-start gap-3">

              <FaUser className="mt-1 text-primary" />

              <div className="w-full">

                <p className="text-xs text-muted-foreground">
                  Full Name
                </p>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border focus:ring-primary"
                      }`}
                    />

                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-card-foreground">
                    {data?.fullName || "Not available"}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* Email */}
          <div className="rounded-lg bg-secondary p-4">

            <div className="flex items-start gap-3">

              <FaEnvelope className="mt-1 text-primary" />

              <div className="w-full">

                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border focus:ring-primary"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-card-foreground">
                    {data?.email || "Not available"}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* Phone */}
          <div className="rounded-lg bg-secondary p-4">

            <div className="flex items-start gap-3">

              <FaPhone className="mt-1 text-primary" />

              <div className="w-full">

                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border focus:ring-primary"
                      }`}
                    />

                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-card-foreground">
                    {data?.phone || "Not available"}
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;