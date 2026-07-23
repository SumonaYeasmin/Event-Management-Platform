"use client"; // Client-side component declaration

// Import UI primitives and icons
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"; // Avatar component
import { Card, CardContent } from "@/src/components/ui/card"; // Card component for layout
import { getInitials } from "@/src/lib/formatters"; // Fallback initial helper
import { Mail, Shield } from "lucide-react"; // Lucide icons
import React from "react";

interface MyProfileProps {
  userInfo: {
    email: string;
    role: string;
  };
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  // Derive username from email prefix
  const username = userInfo.email.split("@")[0];

  return (
    <Card className="border-slate-200/60 shadow-sm rounded-xl bg-white w-full max-w-xl mx-auto overflow-hidden">
      <CardContent className="p-5 space-y-6">
        
        {/* Header section */}
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800">Account Profile</h2>
          <p className="text-xs text-slate-400">View your active login account details.</p>
        </div>

        {/* Profile info card (Compact layout) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50/50 p-5 rounded-xl border border-slate-100/80">
          
          {/* Generate fallback avatar from email initials */}
          <Avatar className="h-16 w-16 border border-slate-200 shadow-sm bg-white rounded-full flex items-center justify-center">
            <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-600 w-full h-full flex items-center justify-center rounded-full">
              {getInitials(userInfo.email)}
            </AvatarFallback>
          </Avatar>

          {/* User details section */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Username</span>
              <span className="font-bold text-base text-slate-800 truncate mt-0.5 block">
                {username}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              {/* Email address display */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{userInfo.email}</span>
              </div>

              {/* Role badge display */}
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
