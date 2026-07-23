"use client"; // ক্লায়েন্ট সাইড কম্পোনেন্ট ডিক্লেয়ার করা হলো

// ১. প্রয়োজনীয় Shadcn UI এবং আইকনসমূহ ইম্পোর্ট করা হচ্ছে
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"; // অ্যাভাটার কম্পোনেন্ট
import { Card, CardContent } from "@/src/components/ui/card"; // কার্ড লেআউটের জন্য
import { getInitials } from "@/src/lib/formatters"; // ইমেইল থেকে ইনিশিয়াল লেটার বের করার হেল্পার
import { Mail, Shield, User } from "lucide-react"; // আইকনসমূহ


interface MyProfileProps {
  userInfo: {
    email: string;
    role: string;
  };
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  // ইমেইলের প্রথম অংশকে ইউজারনেম হিসেবে নেওয়া হচ্ছে
  const username = userInfo.email.split("@")[0];

  return (
    <Card className="border-slate-200/60 shadow-sm rounded-xl bg-white w-full max-w-xl mx-auto overflow-hidden">
      <CardContent className="p-5 space-y-6">
        
        {/* হেডার সেকশন */}
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800">Account Profile</h2>
          <p className="text-xs text-slate-400">View your active login account details.</p>
        </div>

        {/* প্রোফাইল ইনফো (Compact layout) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50/50 p-5 rounded-xl border border-slate-100/80">
          
          {/* নামের বা ইমেইলের প্রথম অক্ষর দিয়ে তৈরি ইনিশিয়াল অ্যাভাটার */}
          <Avatar className="h-16 w-16 border border-slate-200 shadow-sm bg-white rounded-full flex items-center justify-center">
            <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-600 w-full h-full flex items-center justify-center rounded-full">
              {getInitials(userInfo.email)}
            </AvatarFallback>
          </Avatar>

          {/* ইউজার ইনফো বিবরণী */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Username</span>
              <span className="font-bold text-base text-slate-800 truncate mt-0.5 block">
                {username}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              {/* ইমেইল ঠিকানা */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{userInfo.email}</span>
              </div>

              {/* রোল ব্যাজ */}
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/30">
                <Shield className="h-3.5 w-3.5 text-indigo-500" />
                <span className="font-bold uppercase tracking-wider text-[9px]">{userInfo.role}</span>
              </div>
            </div>
          </div>

        </div>

      </CardContent>
    </Card>
  );
};

export default MyProfile;
