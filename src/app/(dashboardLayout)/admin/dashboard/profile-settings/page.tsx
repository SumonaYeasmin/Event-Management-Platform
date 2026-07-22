import React from "react";
import ChangePasswordForm from "@/src/components/change-password-form";

export default function AdminProfileSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Admin Profile Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage system administration settings, security parameters, and password.
        </p>
      </div>

      {/* Render the ChangePasswordForm */}
      <div className="mt-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
