"use client";

import Link from "next/link";
import React from "react";

export default function RegisterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-90 flex flex-col justify-center">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2e3bb1] tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Join in seconds and start exploring events.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Full name
          </label>
          <input
            id="fullname"
            type="text"
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out text-center text-xs md:text-sm cursor-pointer mt-2"
        >
          Create account
        </button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-xs md:text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4f46e5] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block px-3 py-1.5 bg-slate-100/80 rounded-lg text-[10px] text-slate-500 tracking-wide font-medium">
          Prototype: pick any role above — no real credentials needed.
        </span>
      </div>
    </div>
  );
}
