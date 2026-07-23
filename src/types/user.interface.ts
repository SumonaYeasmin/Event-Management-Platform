// ইউজার প্রোফাইল ডাটার টাইপ ডেফিনিশন (Type Definition)
export interface UserInfo {
  id: string; // ইউজারের ইউনিক আইডি
  name: string; // ইউজারের নাম
  email: string; // ইউজারের ইমেইল
  role: "ADMIN" | "ORGANIZER" | "USER"; // ইউজারের নির্ধারিত রোল
  
  // এডমিন সম্পর্কিত তথ্য (যদি রোল ADMIN হয়)
  admin?: {
    id?: string;
    profilePhoto?: string; // এডমিন প্রোফাইল ছবি
    name?: string;
    contactNumber?: string; // ফোন নম্বর
    address?: string; // ঠিকানা
    adminAccessLevel?: "SUPER_ADMIN" | "MODERATOR" | "EDITOR"; // এক্সেস লেভেল
    department?: string; // বিভাগ
  };

  // অর্গানাইজার সম্পর্কিত তথ্য (যদি রোল ORGANIZER হয়)
  organizer?: {
    id?: string;
    profilePhoto?: string; // অর্গানাইজার প্রোফাইল ছবি
    name?: string;
    contactNumber?: string;
    address?: string;
    organizationName?: string; // অর্গানাইজেশনের নাম
    website?: string; // ওয়েবসাইট লিংক
    designation?: string; // পদবী
  };

  // সাধারণ ব্যবহারকারী সম্পর্কিত তথ্য (যদি রোল USER হয়)
  user?: {
    id?: string;
    profilePhoto?: string; // ইউজার প্রোফাইল ছবি
    name?: string;
    contactNumber?: string;
    address?: string;
    prefCategories?: string; // পছন্দের ক্যাটাগরি
    gender?: "MALE" | "FEMALE" | "OTHER"; // লিঙ্গ
  };
}
