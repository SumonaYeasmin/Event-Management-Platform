import React from "react";
import { cookies } from "next/headers";
import MyProfile from "@/src/components/modules/MyProfile/MyProfile";
import ChangePasswordForm from "@/src/components/change-password-form";
import { decodeToken } from "@/src/lib/jwt"; // Import reusable helper

export default async function AdminProfileSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-red-50/50 rounded-xl border border-red-100 max-w-xl mx-auto my-12">
        Unauthorized access. Please log in to your account.
      </div>
    );
  }

  const identity = decodeToken(token); // Decode token using helper

  if (!identity) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-red-50/50 rounded-xl border border-red-100 max-w-xl mx-auto my-12">
        Invalid or expired session. Please log in again.
      </div>
    );
  }

  const fullUserInfo = {
    email: identity.email || "",
    role: identity.role || "ADMIN",
  };

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
        {/* Left Column: Edit Profile Details (8 cols for extra space) */}
        <div className="lg:col-span-8">
          <MyProfile userInfo={fullUserInfo} />
        </div>

        {/* Right Column: Change Password (4 cols) */}
        <div className="lg:col-span-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
