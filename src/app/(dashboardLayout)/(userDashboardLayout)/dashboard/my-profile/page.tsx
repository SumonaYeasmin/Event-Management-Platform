import { cookies } from "next/headers"; // সার্ভার সাইড থেকে কুকি রিড করার জন্য Next.js এর cookies মডিউল
import MyProfile from "@/src/components/modules/MyProfile/MyProfile"; // আমরা যে ক্লায়েন্ট কম্পোনেন্টটি বানিয়েছি তা ইম্পোর্ট করা হলো
import { getMyProfile } from "@/src/services/auth"; // প্রোফাইল ডাটা ব্যাকএন্ড থেকে নিয়ে আসার সার্ভিস ফাংশন

// JWT টোকেন থেকে রোল, আইডি, ইমেইল ডিকোড করার সার্ভার সাইড হেল্পার ফাংশন
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1]; // JWT টোকেনের Payload অংশটি আলাদা করা হলো
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // URL safe Base64 থেকে সাধারণ Base64 এ কনভার্ট
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload); // JSON অবজেক্ট হিসেবে ডিকোড করা ডাটা রিটার্ন (যেমন: { id, email, role })
  } catch (error) {
    return null; // ব্যর্থ হলে null
  }
}

export default async function MyProfilePage() {
  const cookieStore = await cookies(); // কুকিজ অবজেক্ট এক্সেস করা হচ্ছে
  const token = cookieStore.get("accessToken")?.value; // কুকি থেকে 'accessToken' এর ভ্যালু নেওয়া হলো

  // যদি কুকিতে টোকেন না থাকে, তবে মেসেজ দেখানো হবে
  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-red-50 rounded-xl border border-red-100 max-w-xl mx-auto my-12">
        ইউজার লগইন করা নেই। দয়া করে লগইন করুন।
      </div>
    );
  }

  // টোকেনটি ডিকোড করে ইউজারের আইডি, রোল ও বেসিক তথ্য নেওয়া হলো
  const identity = decodeToken(token);
  if (!identity) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-red-50 rounded-xl border border-red-100 max-w-xl mx-auto my-12">
        টোকেন সঠিক নয়। দয়া করে আবার লগইন করুন।
      </div>
    );
  }

  let profileData = {}; // ব্যাকএন্ডের প্রোফাইল ডাটা রাখার ভেরিয়েবল
  try {
    // getMyProfile সার্ভিস ব্যবহার করে ব্যাকএন্ড API থেকে সম্পূর্ণ প্রোফাইল তথ্য আনা হচ্ছে
    const res = await getMyProfile(token);
    if (res && res.success) {
      profileData = res.data || res; // রেসপন্স থেকে মূল ডাটা নেওয়া হলো
    }
  } catch (error) {
    console.error("Profile page fetch error:", error); // এরর হলে কনসোলে দেখানো হবে
  }

  // টোকেনের বেসিক তথ্য (identity) এবং ব্যাকএন্ডের আসল প্রোফাইল তথ্য (profileData) মার্জ করা হচ্ছে
  const fullUserInfo = {
    ...identity, // { id, email, role }
    ...profileData, // { name, contactNumber, address, admin/organizer/user অবজেক্টস }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* মার্জ করা সম্পূর্ণ ডাটা userInfo প্রপস হিসেবে MyProfile কম্পোনেন্টে পাঠানো হচ্ছে */}
      <MyProfile userInfo={fullUserInfo} />
    </div>
  );
}
