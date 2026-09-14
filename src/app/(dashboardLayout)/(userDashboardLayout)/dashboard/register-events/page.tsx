"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getMyRegistrations,
  cancelMyRegistration,
} from "@/src/services/event.service";

interface RegistrationItem {
  registrationId: string;
  status: string;
  registeredAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    bannerImage?: string;
    date: string;
    endDate?: string;
    location: string;
    category: string;
    eventType: "IN_PERSON" | "ONLINE";
    ticketPrice: number;
    totalSeats: number;
    availableSeats: number;
    organizer?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function RegisterEventsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // ১. ব্যাকএন্ড থেকে ইউজারের রেজিস্টার করা সমস্ত ইভেন্ট লোড করা
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await getMyRegistrations();

      if (res.ok && res.data) {
        if (Array.isArray(res.data.data)) {
          setRegistrations(res.data.data);
        } else if (Array.isArray(res.data)) {
          setRegistrations(res.data);
        }
      }
    } catch (error) {
      console.error("Failed to load registered events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // ২. রেজিস্ট্রেশন বাতিল করার হ্যান্ডলার
  const handleCancelRegistration = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel your registration for '${title}'?`)) {
      return;
    }

    try {
      setCancellingId(eventId);
      const res = await cancelMyRegistration(eventId);

      if (res.ok) {
        toast.success(`Registration for '${title}' cancelled successfully`);
        setRegistrations((prev) => prev.filter((item) => item.event.id !== eventId));
      } else {
        toast.error(res.data?.message || "Failed to cancel registration");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancellingId(null);
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
      return "TBA";
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Registered Events
            {!loading && (
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
                {registrations.length} tickets
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Events you have booked tickets for and registered to attend.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading your registered tickets...</p>
        </div>
      ) : registrations.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Ticket className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No registered events yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              You haven&apos;t registered for any events yet. Browse upcoming events on the homepage, click on an event, and register to claim your ticket!
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5"
          >
            Explore Events Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        /* Registered Tickets List */
        <div className="space-y-4">
          {registrations.map(({ registrationId, status, registeredAt, event }) => {
            const isCancelling = cancellingId === event.id;
            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400";

            return (
              <div
                key={registrationId}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center gap-5 justify-between"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {/* Event Banner */}
                  <img
                    src={displayImage}
                    alt={event.title}
                    className="w-full sm:w-36 h-28 rounded-xl object-cover bg-slate-100 shrink-0"
                  />

                  {/* Event & Ticket Details */}
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Badge */}
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {status === "CONFIRMED" ? "Confirmed Ticket" : status}
                      </span>

                      {/* Category */}
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {event.category}
                      </span>

                      {/* Event Type */}
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-100">
                        {event.eventType === "ONLINE" ? "Online" : "In-Person"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/events/${event.id}`}>
                      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Schedule & Location */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {formatTime(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {event.location}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {event.ticketPrice > 0 ? `$${event.ticketPrice.toFixed(2)}` : "Free Ticket"}
                      </span>
                    </div>

                    {/* Registration Meta */}
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      Booked on: {formatDate(registeredAt)} · Host: {event.organizer?.name || "Organizer"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Link
                    href={`/events/${event.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    View Event
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    disabled={isCancelling}
                    onClick={() => handleCancelRegistration(event.id, event.title)}
                    className="border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 font-semibold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    title="Cancel your ticket"
                  >
                    {isCancelling ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
