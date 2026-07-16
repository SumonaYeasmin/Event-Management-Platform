// app/dashboard/layout.tsx

import { DashboardSidebar } from "@/src/components/modules/Dashboard/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { User, CalendarCheck, ShieldCheck } from "lucide-react";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    // 💡 ম্যাজিক ভ্যারিয়েবল: ফ্রন্টএন্ড ডিজাইন করার সময় এটা ম্যানুয়ালি চেঞ্জ করবে।
    // অপশনগুলো হলো: "USER" | "ORGANIZER" | "ADMIN"
    const currentRole = "USER";

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#F8FAFC]">

                {/* সাইডবারে আমরা কারেন্ট রোলটা পাঠিয়ে দিচ্ছি */}
                <DashboardSidebar currentRole={currentRole} />

                <div className="flex flex-1 flex-col">
                    <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-6">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="text-slate-500 hover:bg-slate-100 cursor-pointer" />
                            <span className="h-4 w-px bg-slate-200" />
                            <h1 className="text-base font-semibold text-slate-800">
                                Overview
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Right side icons pill */}
                            <div className="flex items-center gap-1.5 rounded-full bg-slate-100/80 p-1 px-2.5 text-slate-600">
                                <button className="rounded-full p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-xs transition-all cursor-pointer">
                                    <User className="h-4 w-4" />
                                </button>
                                <button className="rounded-full p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-xs transition-all cursor-pointer">
                                    <CalendarCheck className="h-4 w-4" />
                                </button>
                                <button className="rounded-full p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-xs transition-all cursor-pointer">
                                    <ShieldCheck className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}