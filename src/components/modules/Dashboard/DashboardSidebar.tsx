"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CalendarHeart, UserCog, CalendarCheck,
  CalendarPlus, BarChart3, Users, ShieldAlert, 
  ClockAlert, List, ExternalLink, LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/src/components/ui/sidebar"
import { cn } from "@/src/lib/utils";

type DashboardRole = "USER" | "ORGANIZER" | "ADMIN";

interface DashboardSidebarProps {
  currentRole: DashboardRole;
}

export function DashboardSidebar({ currentRole }: DashboardSidebarProps) {
  const pathname = usePathname();

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
    { title: "Organizers", href: "/admin/dashboard/organizers", icon: ShieldAlert },
    { title: "All Events", href: "/admin/dashboard/all-events", icon: CalendarCheck },
    { title: "Pending Approvals", href: "/admin/dashboard/pending-approvals", icon: ClockAlert },
    { title: "Categories", href: "/admin/dashboard/categories", icon: List },
    { title: "Profile Settings", href: "/admin/dashboard/profile-settings", icon: UserCog },
  ];

  // currentRole অনুযায়ী কোন মেনুটা স্ক্রিনে দেখাবে তা সিলেক্ট করা হচ্ছে
  let activeItems = userItems;
  let sidebarLabel = "User Account";

  if (currentRole === "ORGANIZER") {
    activeItems = organizerItems;
    sidebarLabel = "Organizer Studio";
  } else if (currentRole === "ADMIN") {
    activeItems = adminItems;
    sidebarLabel = "Admin Control";
  }

  // Filter items for main section vs account section
  const mainItems = activeItems.filter(item => item.title !== "Profile Settings");
  const accountItems = activeItems.filter(item => item.title === "Profile Settings");

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      style={{
        "--sidebar": "#131b2e",
        "--sidebar-border": "rgba(30, 41, 59, 0.6)"
      } as React.CSSProperties}
      className="text-slate-300 border-r border-slate-800/60"
    >
      {/* Header */}
      <SidebarHeader className="px-5 py-5 flex flex-row items-center gap-3 border-b border-slate-800/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0 shadow-sm shadow-indigo-600/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
            <path d="M12 12h.01" />
            <path d="M16 16h.01" />
          </svg>
        </div>
        <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden text-left">
          <span className="font-bold text-white text-sm tracking-wide">EventHub</span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">{sidebarLabel}</span>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-3 py-4 flex flex-col gap-6">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      render={<Link href={item.href} />} 
                      tooltip={item.title} 
                      className={cn(
                        "flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 w-full",
                        isActive 
                          ? "bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10" 
                          : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                      <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        {accountItems.length > 0 && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:hidden">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {accountItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        render={<Link href={item.href} />} 
                        tooltip={item.title} 
                        className={cn(
                          "flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 w-full",
                          isActive 
                            ? "bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10" 
                            : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-0 mt-auto bg-transparent">
        {/* View Public Site Link */}
        <div className="px-3 py-2 border-t border-slate-800/40">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/30">
            <ExternalLink className="h-4 w-4 text-slate-300 shrink-0" />
            <span className="font-medium text-sm group-data-[collapsible=icon]:hidden text-slate-300">View public site</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800/40 bg-slate-900/10">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg">
            <div className="flex items-center gap-3 truncate">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                alt="Avatar"
                className="h-9 w-9 rounded-full object-cover border border-slate-800 shrink-0"
              />
              <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden text-left">
                <span className="text-sm font-semibold text-white truncate">Nova Events Co.</span>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">hello@novaevents.com</span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800/50 group-data-[collapsible=icon]:hidden shrink-0 transition-colors cursor-pointer">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}