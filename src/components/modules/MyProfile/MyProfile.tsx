"use client"; // ক্লায়েন্ট সাইড কম্পোনেন্ট ডিক্লেয়ার করা হলো যাতে useState, useTransition ব্যবহার করা যায়

// ১. Shadcn UI এবং অন্যান্য প্রয়োজনীয় কম্পোনেন্ট ও আইকনসমূহ ইম্পোর্ট করা হচ্ছে
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"; // অ্যাভাটার কম্পোনেন্ট
import { Button } from "@/src/components/ui/button"; // বাটন কম্পোনেন্ট
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"; // কার্ড লেআউটের জন্য
import { Input } from "@/src/components/ui/input"; // কাস্টম ইনপুট কম্পোনেন্ট
import { Label } from "@/src/components/ui/label"; // কাস্টম লেবেল কম্পোনেন্ট
import { getInitials } from "@/src/lib/formatters"; // নামের প্রথম অক্ষর বের করার হেল্পার
import { updateMyProfile } from "@/src/services/auth"; // প্রোফাইল আপডেট করার সার্ভিস ফাংশন
import { UserInfo } from "@/src/types/user.interface"; // UserInfo টাইপ

import { Camera, Loader2, Save } from "lucide-react"; // আইকনসমূহ
import { useRouter } from "next/navigation"; // রাউটার নেভিগেশনের জন্য
import { useState, useTransition } from "react"; // স্টেট এবং রিয়্যাক্ট ১৯ ট্রানজিশন হুক

// প্রপস ইন্টারফেস ডিক্লেয়ারেশন
interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter(); // রাউটার ইনস্ট্যান্স
  const [isPending, startTransition] = useTransition(); // রিয়্যাক্ট ১৯ এর ট্রানজিশন হুক (লোডিং ট্র্যাকিং)
  const [previewImage, setPreviewImage] = useState<string | null>(null); // লোকাল ইমেজ লাইভ প্রিভিউ রাখার স্টেট
  const [error, setError] = useState<string | null>(null); // এরর মেসেজ রাখার স্টেট
  const [success, setSuccess] = useState<string | null>(null); // সাকসেস মেসেজ রাখার স্টেট

  // ইউজারের রোল অনুযায়ী প্রোফাইল ছবির URL বের করার হেল্পার ফাংশন
  const getProfilePhoto = () => {
    if (userInfo.role === "ADMIN") {
      return userInfo.admin?.profilePhoto;
    } else if (userInfo.role === "ORGANIZER") {
      return userInfo.organizer?.profilePhoto;
    } else if (userInfo.role === "USER") {
      return userInfo.user?.profilePhoto;
    }
    return null;
  };

  // ইউজারের রোল অনুযায়ী রোল-নির্দিষ্ট ডাটা অবজেক্ট বের করার হেল্পার ফাংশন
  const getProfileData = () => {
    if (userInfo.role === "ADMIN") {
      return userInfo.admin;
    } else if (userInfo.role === "ORGANIZER") {
      return userInfo.organizer;
    } else if (userInfo.role === "USER") {
      return userInfo.user;
    }
    return null;
  };

  // হেল্পার রান করে ফটো এবং প্রোফাইল ডাটা মেমরিতে সেভ করা হচ্ছে
  const profilePhoto = getProfilePhoto();
  const profileData = getProfileData();

  // ইউজার নতুন ছবি সিলেক্ট করলে রান হবে এবং ইমেজ প্রিভিউ দেখাবে
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // সিলেক্ট করা ফাইল নেওয়া হলো
    if (file) {
      const reader = new FileReader(); // FileReader তৈরি
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Base64 ফরম্যাটে প্রিভিউ সেট
      };
      reader.readAsDataURL(file); // ফাইল রিড করা হচ্ছে
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // পেজ যাতে রিলোড না হয়
    setError(null); // আগের এরর রিসেট
    setSuccess(null); // আগের সাকসেস রিসেট

    // ফর্মের সব ইনপুট ডাটা ও ফাইল FormData অবজেক্টে সংগ্রহ করা হচ্ছে
    const formData = new FormData(e.currentTarget);

    // startTransition দিয়ে ব্যাকগ্রাউন্ডে এপিআই রিকোয়েস্ট রান করা হচ্ছে
    startTransition(async () => {
      // প্রোফাইল আপডেটের সার্ভিস কল করা হলো
      const result = await updateMyProfile(formData);

      if (result.success) {
        setSuccess(result.message || "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"); // সফল মেসেজ সেট
        setPreviewImage(null); // লোকাল প্রিভিউ রিসেট
        router.refresh(); // পেজ ডাটা রিফ্রেশ করা হলো
      } else {
        setError(result.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।"); // এরর মেসেজ সেট
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* পেজ হেডার */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* সাবমিশন ফর্ম */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* প্রোফাইল পিকচার কার্ড */}
          <Card className="lg:col-span-1 border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-700">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                {/* অ্যাভাটার ইমেজ */}
                <Avatar className="h-32 w-32 border-4 border-indigo-50 shadow-sm">
                  {previewImage || profilePhoto ? (
                    <AvatarImage
                      src={previewImage || (profilePhoto as string)}
                      alt={userInfo.name}
                    />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-400">
                      {getInitials(userInfo.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* ফাইল সিলেক্ট করার ক্যামেরা বাটন */}
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 bg-[#4f46e5] text-white rounded-full p-2.5 cursor-pointer hover:bg-indigo-700 transition shadow-md"
                >
                  <Camera className="h-4 w-4" />
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    className="hidden" // ইনপুটটি হিডেন থাকবে
                    onChange={handleImageChange}
                    disabled={isPending}
                  />
                </label>
              </div>

              {/* ইউজারের নাম, ইমেইল ও রোল */}
              <div className="text-center">
                <p className="font-bold text-lg text-slate-800">{userInfo.name}</p>
                <p className="text-sm text-slate-500">{userInfo.email}</p>
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mt-2.5 inline-block uppercase tracking-wider">
                  {userInfo.role.replace("_", " ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* প্রোফাইল ইনফরমেশন এডিট কার্ড */}
          <Card className="lg:col-span-2 border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* এরর মেসেজ বক্স */}
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* সাকসেস মেসেজ বক্স */}
              {success && (
                <div className="bg-green-50 text-green-600 border border-green-100 px-4 py-3 rounded-xl text-sm font-semibold">
                  {success}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                
                {/* কমন ইনপুট ফিল্ডস (সবার জন্য) */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profileData?.name || userInfo.name}
                    required
                    disabled={isPending}
                    className="focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-sm font-semibold text-slate-700">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    defaultValue={profileData?.contactNumber || ""}
                    required
                    disabled={isPending}
                    className="focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-slate-700">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={profileData?.address || ""}
                    required
                    disabled={isPending}
                    className="focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* ============ কন্ডিশনাল বা রোল-নির্দিষ্ট ইনপুট ফিল্ডস ============ */}

                {/* ১. ORGANIZER রোল এর ইনপুট ফিল্ডস */}
                {userInfo.role === "ORGANIZER" && userInfo.organizer && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-sm font-semibold text-slate-700">Organization Name</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        defaultValue={userInfo.organizer.organizationName || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-sm font-semibold text-slate-700">Designation</Label>
                      <Input
                        id="designation"
                        name="designation"
                        defaultValue={userInfo.organizer.designation || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website" className="text-sm font-semibold text-slate-700">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        defaultValue={userInfo.organizer.website || ""}
                        disabled={isPending}
                      />
                    </div>
                  </>
                )}

                {/* ২. ADMIN রোল এর ইনপুট ফিল্ডস */}
                {userInfo.role === "ADMIN" && userInfo.admin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="adminAccessLevel" className="text-sm font-semibold text-slate-700">Admin Access Level</Label>
                      <select
                        id="adminAccessLevel"
                        name="adminAccessLevel"
                        defaultValue={userInfo.admin.adminAccessLevel || "MODERATOR"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold text-slate-700">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        defaultValue={userInfo.admin.department || ""}
                        disabled={isPending}
                      />
                    </div>
                  </>
                )}

                {/* ৩. USER (সাধারণ ব্যবহারকারী) রোল এর ইনপুট ফিল্ডস */}
                {userInfo.role === "USER" && userInfo.user && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="prefCategories" className="text-sm font-semibold text-slate-700">Preferred Categories</Label>
                      <Input
                        id="prefCategories"
                        name="prefCategories"
                        placeholder="e.g. Technology, Sports, Music"
                        defaultValue={userInfo.user.prefCategories || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-semibold text-slate-700">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        defaultValue={userInfo.user.gender || "MALE"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </>
                )}

              </div>

              {/* বাটন সাবমিট সেকশন */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="px-6 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition disabled:opacity-60 flex items-center gap-2 cursor-pointer">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
