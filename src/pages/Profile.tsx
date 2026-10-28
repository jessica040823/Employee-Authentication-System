import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/authService";

function Profile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">
          Failed to load profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      
      {/* Heading */}
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          View your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        
        {/* Profile Icon */}
        <div className="flex justify-center">
          <div className="flex size-15 items-center justify-center rounded-full border-2 border-primary bg-secondary text-primary">
            <FaUser className="text-3xl" />
          </div>
        </div>

        {/* Name and Email */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Name
            </label>

            <div className="flex items-center gap-3 rounded-md border border-input bg-background px-4 py-3">
              <FaUser className="text-muted-foreground" />

              <span className="text-sm text-foreground">
                {data?.fullName || "N/A"}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>

            <div className="flex items-center gap-3 rounded-md border border-input bg-background px-4 py-3">
              <FaEnvelope className="text-muted-foreground" />

              <span className="text-sm text-foreground">
                {data?.email || "N/A"}
              </span>
            </div>
          </div>

        </div>

        {/* Account Type */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Account Type
          </label>

          <div className="rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground">
            {data?.role || "User"}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;

