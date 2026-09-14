"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Calendar,
  Ticket,
  ArrowRight,
  Check,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/services/auth";
import {
  getAllEventsForAdmin,
  approveEventByAdmin,
  rejectEventByAdmin,
  AdminEventItem,
} from "@/src/services/event.service";

interface DashboardStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalRegistrations: number;
}

export default function PlatformOverviewPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
  });
  const [pendingEvents, setPendingEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ১. ব্যাকএন্ড থেকে সমস্ত রিয়েল-টাইম ডেটা ফেচ করা
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_BASE_API ||
        "http://localhost:5000/api/v1";

      // প্যারালালে Users এবং Admin Events ফেচ করা
      const [usersRes, eventsRes] = await Promise.all([
        fetchWithAuth(`${baseUrl}/users`),
        getAllEventsForAdmin(),
      ]);

      let userCount = 0;
      let organizerCount = 0;
      let totalRegistrationsCount = 0;

      // ইউজার ও অর্গানাইজার গণনা
      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success && Array.isArray(usersData.data)) {
          const allUsers = usersData.data;
          userCount = allUsers.filter((u: any) => u.role === "USER").length;
          organizerCount = allUsers.filter((u: any) => u.role === "ORGANIZER").length;

          // মোট রেজিস্ট্রেশন সংখ্যা হিসাব
          totalRegistrationsCount = allUsers.reduce((sum: number, u: any) => {
            return sum + (u._count?.registrations || 0);
          }, 0);
        }
      }

      // ইভেন্ট ও পেন্ডিং তালিকা গণনা
      let eventCount = 0;
      let pendingList: AdminEventItem[] = [];

      if (eventsRes.ok && eventsRes.data) {
        const eventData = Array.isArray(eventsRes.data.data)
          ? eventsRes.data.data
          : Array.isArray(eventsRes.data)
          ? eventsRes.data
          : [];

        eventCount = eventsRes.data.meta?.total ?? eventData.length;
        pendingList = eventData.filter((e: AdminEventItem) => e.status.toUpperCase() === "PENDING");
      }

      setStats({
        totalUsers: userCount,
        totalOrganizers: organizerCount,
        totalEvents: eventCount,
        totalRegistrations: totalRegistrationsCount,
      });
      setPendingEvents(pendingList);
    } catch (error) {
      console.error("Error fetching overview stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // ২. পেন্ডিং ইভেন্ট অ্যাপ্রুভ (Approve) করা
  const handleApprove = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await approveEventByAdmin(id);

      if (res.ok) {
        toast.success(`'${title}' approved & published!`);
        setPendingEvents((prev) => prev.filter((event) => event.id !== id));
      } else {
        toast.error(res.data?.message || "Failed to approve event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ৩. পেন্ডিং ইভেন্ট রিজেক্ট (Reject) করা
  const handleReject = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await rejectEventByAdmin(id);

      if (res.ok) {
        toast.success(`'${title}' rejected!`);
        setPendingEvents((prev) => prev.filter((event) => event.id !== id));
      } else {
        toast.error(res.data?.message || "Failed to reject event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to reject event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // তারিখ ফরম্যাট
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <p className="text-sm text-slate-500">
          Monitor everything happening across EventHub in real-time.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total users</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : stats.totalUsers}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Organizers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Organizers</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-sky-500" /> : stats.totalOrganizers}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Total Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total events</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-500" /> : stats.totalEvents}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Registrations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Registrations</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : stats.totalRegistrations}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Ticket className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pending approvals</h2>
            <p className="text-xs lg:text-sm text-slate-400 mt-0.5">
              {loading
                ? "Loading pending reviews..."
                : pendingEvents.length === 0
                ? "No events awaiting review"
                : `${pendingEvents.length} event${pendingEvents.length > 1 ? "s" : ""} awaiting review`}
            </p>
          </div>
          <Link
            href="/admin/dashboard/pending-approvals"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            Review all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Pending Events List */}
        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span className="text-xs">Loading pending approvals...</span>
          </div>
        ) : pendingEvents.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-xs font-medium text-slate-600">All caught up! No pending approvals.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingEvents.slice(0, 3).map((event) => {
              const isActionLoading = actionLoadingId === event.id;
              const displayImage =
                event.bannerImage ||
                "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150";

              return (
                <div
                  key={event.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={displayImage}
                      alt={event.title}
                      className="h-16 w-24 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {event.organizer?.name || "Organizer"} · {event.category} · {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleApprove(event.id, event.title)}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs shadow-xs"
                    >
                      {isActionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Approve
                    </button>
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleReject(event.id, event.title)}
                      className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
