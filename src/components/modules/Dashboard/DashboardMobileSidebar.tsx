"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast' // toast ইম্পোর্ট করা হলো
import { logoutUser } from '@/src/services/auth' // logoutUser ইম্পোর্ট করা হলো
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger 
} from '@/src/components/ui/sheet'
import { 
  Menu, LayoutDashboard, CalendarHeart, UserCog, 
  CalendarCheck, CalendarPlus, Users, ShieldAlert, 
  ClockAlert, List, ExternalLink, LogOut 
} from 'lucide-react'
import { cn } from '@/src/lib/utils'

type DashboardRole = "USER" | "ORGANIZER" | "ADMIN";

interface DashboardMobileSidebarProps {
  currentRole: DashboardRole;
}

export default function DashboardMobileSidebar({ currentRole }: DashboardMobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ১. ইউজার মেনু আইটেম
  const userItems = [
    { title: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { title: "Save Events", href: "/dashboard/save-events", icon: CalendarHeart },
    { title: "My Register Events", href: "/dashboard/register-events", icon: CalendarCheck },
    { title: "Profile Settings", href: "/dashboard/profile-settings", icon: UserCog },
  ];

  // ২. অর্গানাইজার মেনু আইটেম 
  const organizerItems = [
    { title: "Overview", href: "/organizer/dashboard", icon: LayoutDashboard },
    { title: "My Events", href: "/organizer/dashboard/my-events", icon: CalendarCheck },
    { title: "Create Event", href: "/organizer/dashboard/create-event", icon: CalendarPlus },
    { title: "Profile Settings", href: "/organizer/dashboard/profile-settings", icon: UserCog },
  ];

  // ৩. এডমিন মেনু আইটেম
  const adminItems = [
    { title: "Platform Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/dashboard/users", icon: Users },
    { title: "Organizers", href: "/admin/dashboard/organizars", icon: ShieldAlert },
    { title: "All Events", href: "/admin/dashboard/all-events", icon: CalendarCheck },
    { title: "Pending Approvals", href: "/admin/dashboard/pending-approvals", icon: ClockAlert },
    { title: "Categories", href: "/admin/dashboard/categories", icon: List },
    { title: "Profile Settings", href: "/admin/dashboard/profile-settings", icon: UserCog },
  ];

  const getItems = () => {
    switch (currentRole) {
      case "ADMIN":
        return adminItems;
      case "ORGANIZER":
        return organizerItems;
      default:
        return userItems;
    }
  };

  const menuItems = getItems();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger className="xs:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"> */}
      <SheetTrigger className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      
      <SheetContent side="left" className="w-72 p-0 bg-[#0F172A] text-slate-100 border-r-slate-800 flex flex-col justify-between">
        <div className="flex-1 flex flex-col pt-5">
          {/* Header */}
          <div className="px-6 pb-6 border-b border-slate-800 flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">EventHub</h2>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {currentRole === 'ADMIN' ? 'Admin Console' : currentRole === 'ORGANIZER' ? 'Organizer Studio' : 'User Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl cursor-pointer transition-all duration-150 active:scale-98",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800 bg-[#0A0F1D]">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl mb-3">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Profile" 
              className="h-8 w-8 rounded-full bg-slate-800 object-cover border border-slate-700/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate leading-none">
                {currentRole === 'ADMIN' ? 'Admin Control' : 'User Account'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentRole === 'ADMIN' ? 'admin@eventhub.com' : 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-1 pt-1.5">
            <Link 
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              View public site
            </Link>
            <button 
              onClick={() => {
                setOpen(false);
                toast.success("Logged out successfully!");
                logoutUser();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 w-full text-left transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-rose-500/80" />
              Log out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}