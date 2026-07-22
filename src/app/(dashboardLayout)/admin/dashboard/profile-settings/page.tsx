import React from "react";
import EditProfileForm from "@/src/components/edit-profile-form";
import ChangePasswordForm from "@/src/components/change-password-form";

export default function AdminProfileSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Admin Profile Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage administration details, system settings, and security credentials.
        </p>
      </div>

      {/* Grid Layout for Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Edit Profile Details (7 cols) */}
        <div className="lg:col-span-7">
          <EditProfileForm />
        </div>

        {/* Right Column: Change Password (5 cols) */}
        <div className="lg:col-span-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
