"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllEventsForAdmin,
  approveEventByAdmin,
  rejectEventByAdmin,
  AdminEventItem,
} from "@/src/services/event.service";

export default function PendingApprovalsPage() {
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ১. ব্যাকএন্ড থেকে শুধুমাত্র PENDING ইভেন্টগুলো ফেচ করা
  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEventsForAdmin({ status: "PENDING" });

      if (res.ok && res.data) {
        if (Array.isArray(res.data.data)) {
          setEvents(res.data.data);
        } else if (Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } else {
        toast.error(res.data?.message || "Failed to load pending events");
      }
    } catch (error: any) {
      console.error("Error fetching pending events:", error);
      toast.error(error.message || "Failed to load pending events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  // ২. ইভেন্ট অনুমোদন (Approve & Publish) করা
  const handleApprove = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await approveEventByAdmin(id);

      if (res.ok) {
        toast.success(`'${title}' approved & published!`);
        // লিস্ট থেকে তৎক্ষণাৎ সরিয়ে ফেলা
        setEvents((prev) => prev.filter((event) => event.id !== id));
      } else {
        toast.error(res.data?.message || "Failed to approve event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ৩. ইভেন্ট বাতিল (Reject) করা
  const handleReject = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await rejectEventByAdmin(id);

      if (res.ok) {
        toast.success(`'${title}' rejected!`);
        // লিস্ট থেকে তৎক্ষণাৎ সরিয়ে ফেলা
        setEvents((prev) => prev.filter((event) => event.id !== id));
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

  // সময় ফরম্যাট
  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Title with live counter */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Pending Approvals
          {!loading && (
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              {events.length} pending
            </span>
          )}
        </h1>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading pending events...</p>
        </div>
      ) : events.length === 0 ? (
        /* Empty State: কোনো পেন্ডিং ইভেন্ট না থাকলে */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              There are no pending event approvals at the moment. New event submissions from organizers will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* Grid List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => {
            const isActionLoading = actionLoadingId === event.id;
            const organizerName = event.organizer?.name || "Organizer";
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              organizerName
            )}`;
            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400";

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group justify-between"
              >
                <div>
                  {/* Cover Image with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={displayImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status and Category Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Pending review
                      </span>

                      <span className="bg-indigo-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-indigo-500/20">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3.5">
                      {/* Title */}
                      <h3
                        className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 hover:text-indigo-600 transition-colors"
                        title={event.title}
                      >
                        {event.title}
                      </h3>

                      {/* Organizer info */}
                      <div className="flex items-center gap-2">
                        <img
                          src={avatarUrl}
                          alt={organizerName}
                          className="h-5 w-5 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/50"
                        />
                        <span className="text-xs text-slate-400 font-semibold truncate">
                          by {organizerName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-8">
                        {event.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-xs font-semibold text-slate-500 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{formatTime(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{event.totalSeats} seats</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleApprove(event.id, event.title)}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 w-full sm:flex-1 cursor-pointer transition-all active:scale-98 text-xs shadow-xs"
                    >
                      {isActionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Approve & publish
                    </button>
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleReject(event.id, event.title)}
                      className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 w-full sm:w-auto shrink-0 cursor-pointer transition-all active:scale-98 text-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}