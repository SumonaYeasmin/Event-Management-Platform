"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Ban,
  Check,
  Search,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Globe,
  RefreshCw,
} from "lucide-react";
import { fetchWithAuth } from "@/src/services/auth";

export interface OrganizerEvent {
  id: string;
  title: string;
  description?: string;
  bannerImage?: string | null;
  date: string;
  endDate?: string | null;
  location: string;
  category: string;
  eventType: "IN_PERSON" | "ONLINE";
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
  isFeatured?: boolean;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  _count?: {
    registrations: number;
  };
}

export interface OrganizerItem {
  id: string;
  name: string;
  email: string;
  joined: string;
  rawJoined: string;
  eventsCount: number;
  status: "Active" | "Suspended";
  avatar: string;
  events: OrganizerEvent[];
}

export default function OrganizerManagementPage() {
  const [organizersList, setOrganizersList] = useState<OrganizerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activityFilter, setActivityFilter] = useState<string>("ALL");

  // Selected Organizer for Modal View
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerItem | null>(null);
  const [eventStatusFilter, setEventStatusFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_API ||
    "http://localhost:5000/api/v1";

  // ১. ব্যাকএন্ড থেকে সব অর্গানাইজার এবং তাদের ইভেন্ট তথ্য ফেচ করা
  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${baseUrl}/users?role=ORGANIZER`);
      if (!res || !res.ok) {
        console.error("Organizers API error response:", res?.status);
        setLoading(false);
        return;
      }

      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted: OrganizerItem[] = result.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          joined: new Date(u.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rawJoined: u.createdAt,
          eventsCount: u.events?.length ?? (u._count?.events ?? 0),
          status: "Active",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
          events: Array.isArray(u.events) ? u.events : [],
        }));
        setOrganizersList(formatted);

        // Update selected organizer if modal is open
        if (selectedOrganizer) {
          const updated = formatted.find((o) => o.id === selectedOrganizer.id);
          if (updated) setSelectedOrganizer(updated);
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  // ২. স্ট্যাটাস পরিবর্তন টগল (সাসপেন্ড / অ্যাক্টিভ)
  const handleToggleStatus = (id: string) => {
    setOrganizersList((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const nextStatus = org.status === "Active" ? "Suspended" : "Active";
          const updated = { ...org, status: nextStatus };
          if (selectedOrganizer?.id === id) {
            setSelectedOrganizer(updated);
          }
          return updated;
        }
        return org;
      })
    );
  };

  // ৩. অ্যাডমিন দ্বারা সরাসরি ইভেন্ট অনুমোদন (Approve) বা বাতিল (Reject) করা
  const handleModerateEvent = async (
    eventId: string,
    action: "approve" | "reject"
  ) => {
    try {
      setActionLoadingId(eventId);
      const res = await fetchWithAuth(`${baseUrl}/admin/events/${eventId}/${action}`, {
        method: "PATCH",
      });

      if (res && res.ok) {
        // Local state update immediately
        const newStatus = action === "approve" ? "PUBLISHED" : "REJECTED";
        setOrganizersList((prev) =>
          prev.map((org) => ({
            ...org,
            events: org.events.map((ev) =>
              ev.id === eventId ? { ...ev, status: newStatus } : ev
            ),
          }))
        );

        if (selectedOrganizer) {
          setSelectedOrganizer((prev) =>
            prev
              ? {
                  ...prev,
                  events: prev.events.map((ev) =>
                    ev.id === eventId ? { ...ev, status: newStatus } : ev
                  ),
                }
              : null
          );
        }
      } else {
        console.error(`Failed to ${action} event:`, res?.status);
      }
    } catch (err) {
      console.error(`Error moderating event:`, err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // সামগ্রিক পরিসংখ্যান হিসাব (Overall Metrics)
  const stats = useMemo(() => {
    let totalEvents = 0;
    let publishedEvents = 0;
    let pendingEvents = 0;
    let rejectedEvents = 0;

    organizersList.forEach((org) => {
      totalEvents += org.events.length;
      org.events.forEach((ev) => {
        if (ev.status === "PUBLISHED") publishedEvents++;
        if (ev.status === "PENDING") pendingEvents++;
        if (ev.status === "REJECTED") rejectedEvents++;
      });
    });

    return {
      totalOrganizers: organizersList.length,
      totalEvents,
      publishedEvents,
      pendingEvents,
      rejectedEvents,
    };
  }, [organizersList]);

  // ফিল্টার ও সার্চ লজিক
  const filteredOrganizers = useMemo(() => {
    return organizersList.filter((organizer) => {
      const matchesSearch =
        organizer.name.toLowerCase().includes(search.toLowerCase()) ||
        organizer.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || organizer.status.toUpperCase() === statusFilter;

      const matchesActivity =
        activityFilter === "ALL"
          ? true
          : activityFilter === "HAS_EVENTS"
          ? organizer.events.length > 0
          : organizer.events.length === 0;

      return matchesSearch && matchesStatus && matchesActivity;
    });
  }, [organizersList, search, statusFilter, activityFilter]);

  // মডালের ভেতর ফিল্টার করা ইভেন্টসমূহ
  const filteredOrganizerEvents = useMemo(() => {
    if (!selectedOrganizer) return [];
    if (eventStatusFilter === "ALL") return selectedOrganizer.events;
    return selectedOrganizer.events.filter(
      (ev) => ev.status.toUpperCase() === eventStatusFilter
    );
  }, [selectedOrganizer, eventStatusFilter]);

  // Helper for Status Badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Organizer Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Monitor all organizers, their created events, and moderate their event statuses in real-time.
          </p>
        </div>
        <button
          onClick={fetchOrganizers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Organizers */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Organizers
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
              {stats.totalOrganizers}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Total Events Created */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Events Created
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
              {stats.totalEvents}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Published Events */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Events
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-emerald-600">
              {stats.publishedEvents}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-amber-600">
              {stats.pendingEvents}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock3 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizer name or email..."
            className="w-full text-xs font-medium border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Account</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {/* Activity Filter */}
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Event Activities</option>
            <option value="HAS_EVENTS">Has Created Events</option>
            <option value="NO_EVENTS">No Events Yet</option>
          </select>
        </div>
      </div>

      {/* 4. Organizers Mobile Cards View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2">
            <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading organizers...</p>
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2">
            <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No organizers found</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredOrganizers.map((organizer) => {
            const isActive = organizer.status === "Active";
            const publishedCount = organizer.events.filter((e) => e.status === "PUBLISHED").length;
            const pendingCount = organizer.events.filter((e) => e.status === "PENDING").length;

            return (
              <div
                key={organizer.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4"
              >
                {/* Header: Avatar & Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={organizer.avatar}
                      alt={organizer.name}
                      className="h-11 w-11 rounded-full bg-slate-100 object-cover border border-slate-200/70"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {organizer.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{organizer.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {organizer.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px] uppercase mb-0.5">
                      Joined
                    </span>
                    <span className="text-slate-700">{organizer.joined}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px] uppercase mb-0.5">
                      Total Events
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold text-sm">
                        {organizer.eventsCount}
                      </span>
                      {organizer.eventsCount > 0 && (
                        <div className="flex items-center gap-1 text-[10px]">
                          {publishedCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 font-bold">
                              {publishedCount} Pub
                            </span>
                          )}
                          {pendingCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold">
                              {pendingCount} Pend
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedOrganizer(organizer);
                      setEventStatusFilter("ALL");
                    }}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Events ({organizer.eventsCount})
                  </button>

                  <button
                    onClick={() => handleToggleStatus(organizer.id)}
                    className={`border px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isActive
                        ? "border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600"
                        : "border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-slate-600"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Ban className="h-3.5 w-3.5 text-rose-500" /> Suspend
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Organizers Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Organizer Profile</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Events Created</th>
                <th className="py-4 px-6">Events Status Summary</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin mx-auto mb-2" />
                    Loading organizers data...
                  </td>
                </tr>
              ) : filteredOrganizers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    No organizers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrganizers.map((organizer) => {
                  const isActive = organizer.status === "Active";
                  const publishedCount = organizer.events.filter(
                    (e) => e.status === "PUBLISHED"
                  ).length;
                  const pendingCount = organizer.events.filter(
                    (e) => e.status === "PENDING"
                  ).length;
                  const rejectedCount = organizer.events.filter(
                    (e) => e.status === "REJECTED"
                  ).length;
                  const draftCount = organizer.events.filter(
                    (e) => e.status === "DRAFT"
                  ).length;

                  return (
                    <tr
                      key={organizer.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Organizer Profile */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={organizer.avatar}
                            alt={organizer.name}
                            className="h-10 w-10 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/60"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {organizer.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              {organizer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {organizer.joined}
                      </td>

                      {/* Total Events Count */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {organizer.eventsCount}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {organizer.eventsCount === 1 ? "Event" : "Events"}
                          </span>
                        </div>
                      </td>

                      {/* Status Summary Pills */}
                      <td className="py-4 px-6">
                        {organizer.eventsCount === 0 ? (
                          <span className="text-xs text-slate-400 italic">
                            No events created
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {publishedCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {publishedCount} Published
                              </span>
                            )}
                            {pendingCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                {pendingCount} Pending
                              </span>
                            )}
                            {rejectedCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                {rejectedCount} Rejected
                              </span>
                            )}
                            {draftCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                {draftCount} Draft
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Organizer Account Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 w-fit ${
                            isActive
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {organizer.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrganizer(organizer);
                              setEventStatusFilter("ALL");
                            }}
                            className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Events ({organizer.eventsCount})
                          </button>

                          <button
                            onClick={() => handleToggleStatus(organizer.id)}
                            className={`border py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              isActive
                                ? "border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600"
                                : "border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-slate-600"
                            }`}
                            title={isActive ? "Suspend Organizer" : "Activate Organizer"}
                          >
                            {isActive ? (
                              <Ban className="h-3.5 w-3.5 text-rose-500" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Comprehensive Organizer Details & Events Modal */}
      {selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedOrganizer.avatar}
                  alt={selectedOrganizer.name}
                  className="h-12 w-12 rounded-full bg-white object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedOrganizer.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Organizer
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedOrganizer.email} · Joined {selectedOrganizer.joined}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrganizer(null)}
                className="h-9 w-9 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Quick Analytics Banner */}
            <div className="px-6 py-4 bg-indigo-900 text-white flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider block">
                    Total Events
                  </span>
                  <span className="text-xl font-black">{selectedOrganizer.events.length}</span>
                </div>
                <div className="h-8 w-[1px] bg-indigo-700/50" />
                <div>
                  <span className="text-[11px] text-emerald-300 uppercase font-bold tracking-wider block">
                    Published
                  </span>
                  <span className="text-xl font-black text-emerald-300">
                    {selectedOrganizer.events.filter((e) => e.status === "PUBLISHED").length}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-indigo-700/50" />
                <div>
                  <span className="text-[11px] text-amber-300 uppercase font-bold tracking-wider block">
                    Pending
                  </span>
                  <span className="text-xl font-black text-amber-300">
                    {selectedOrganizer.events.filter((e) => e.status === "PENDING").length}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-indigo-700/50" />
                <div>
                  <span className="text-[11px] text-rose-300 uppercase font-bold tracking-wider block">
                    Rejected
                  </span>
                  <span className="text-xl font-black text-rose-300">
                    {selectedOrganizer.events.filter((e) => e.status === "REJECTED").length}
                  </span>
                </div>
              </div>

              {/* Status Filter inside Modal */}
              <div className="flex items-center gap-1.5 bg-indigo-950/60 p-1 rounded-xl border border-indigo-700/50 text-xs">
                {["ALL", "PUBLISHED", "PENDING", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEventStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      eventStatusFilter === st
                        ? "bg-white text-indigo-950 shadow-xs"
                        : "text-indigo-200 hover:text-white"
                    }`}
                  >
                    {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Events List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {filteredOrganizerEvents.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No events found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {eventStatusFilter === "ALL"
                      ? "This organizer hasn't created any events yet."
                      : `No events matching status "${eventStatusFilter}".`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrganizerEvents.map((event) => {
                    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const eventTime = new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isPending = event.status === "PENDING";
                    const isProcessing = actionLoadingId === event.id;

                    return (
                      <div
                        key={event.id}
                        className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Event Thumbnail & Badges */}
                        <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={
                              event.bannerImage ||
                              "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600"
                            }
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            {renderStatusBadge(event.status)}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                              {event.category}
                            </span>
                          </div>

                          {/* Bottom info inside image */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                            <span className="flex items-center gap-1 text-[11px] drop-shadow-xs">
                              <Globe className="h-3 w-3" />
                              {event.eventType === "ONLINE" ? "Online Event" : "In-Person"}
                            </span>
                            <span className="bg-indigo-600 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
                              {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                            </span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                              {event.title}
                            </h4>

                            <div className="space-y-1.5 text-xs text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>
                                  {eventDate} · {eventTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Seats & Registrations */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                            <div className="flex items-center gap-1">
                              <Ticket className="h-3.5 w-3.5 text-indigo-500" />
                              <span>
                                Seats: <strong>{event.availableSeats}</strong> / {event.totalSeats}
                              </span>
                            </div>
                            {event._count?.registrations !== undefined && (
                              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {event._count.registrations} Booked
                              </span>
                            )}
                          </div>

                          {/* Admin Moderation Actions for PENDING Events */}
                          {isPending && (
                            <div className="pt-2 flex items-center gap-2 border-t border-amber-100 bg-amber-50/50 p-2 rounded-xl">
                              <span className="text-[10px] font-bold text-amber-700 flex-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                                Needs Action:
                              </span>
                              <button
                                onClick={() => handleModerateEvent(event.id, "approve")}
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleModerateEvent(event.id, "reject")}
                                disabled={isProcessing}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Showing <strong>{filteredOrganizerEvents.length}</strong> of{" "}
                {selectedOrganizer.events.length} events
              </span>
              <button
                onClick={() => setSelectedOrganizer(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}