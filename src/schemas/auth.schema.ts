import { z } from "zod";

// ১. রেজিস্টার ফর্মের জন্য ভ্যালিডেশন স্কিমা
export const registerSchema = z
  .object({
    // name অবশ্যই স্ট্রিং হতে হবে এবং কমপক্ষে ২ অক্ষরের হতে হবে
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters long."),
    
    // email অবশ্যই সঠিক ফরম্যাটে হতে হবে এবং খালি রাখা যাবে না
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address."),
    
    // password কমপক্ষে ৬ অক্ষরের হতে হবে
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    
    // confirmPassword ইনপুট রিকোয়ার্ড
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required."),
  })
  // refine দিয়ে আমরা পাসওয়ার্ড ম্যাচিং চেক করছি (কাস্টম কন্ডিশন)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"], // এররটি confirmPassword ফিল্ডের জন্য জেনারেট হবে
  });

// ২. লগইন ফর্মের জন্য ভ্যালিডেশন স্কিমা
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(1, "Password is required."),
});

// ৩. পাসওয়ার্ড পরিবর্তনের জন্য ভ্যালিডেশন স্কিমা
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match!",
    path: ["confirmPassword"],
  });

// ৪. পাসওয়ার্ড রিকভারি ইমেইল পাঠানোর জন্য ভ্যালিডেশন স্কিমা
export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
});

// ৫. পাসওয়ার্ড রিসেট করার জন্য ভ্যালিডেশন স্কিমা
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match!",
    path: ["confirmPassword"],
  });
