"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditProfileForm() {
  const [fullName, setFullName] = useState<string>("Aisha Rahman");
  const [email, setEmail] = useState<string>("aisha@example.com");
  const [bio, setBio] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Attempt to load current user info dynamically if present in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setRole(storedRole.toLowerCase());
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Mocking the profile update API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile details updated successfully!");
    }, 1000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
      {/* User Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 border-2 border-slate-100">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha"
            alt="User Avatar"
            className="h-full w-full object-cover bg-amber-100"
          />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{fullName}</h2>
          <p className="text-sm lg:text-base text-slate-500 capitalize mt-1">
            {role} • joined November 2025
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block text-sm lg:text-base font-semibold text-slate-700 mb-2">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Aisha Rahman"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm lg:text-base"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm lg:text-base font-semibold text-slate-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aisha@example.com"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm lg:text-base"
          />
        </div>

        {/* Bio Textarea */}
        <div>
          <label htmlFor="bio" className="block text-sm lg:text-base font-semibold text-slate-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a little about yourself..."
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm lg:text-base resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3 px-6 rounded-lg shadow-sm transition duration-150 ease-in-out text-center text-sm lg:text-base cursor-pointer flex items-center justify-center gap-2
              ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
