"use client";

import React, { useState, useEffect, use } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Ticket,
  Loader2,
  AlertCircle,
  Sparkles,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/src/components/shared/Navbar";
import Footer from "@/src/components/shared/Footer";
import {
  getEventById,
  saveEventToFavorites,
  removeEventFromFavorites,
  getMyFavorites,
  registerForEvent,
} from "@/src/services/event.service";
import { createCheckoutSession } from "@/src/services/payment.service";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // ১. ব্যাকএন্ড থেকে নির্দিষ্ট ইভেন্টের ডাটা ফেচ করা
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getEventById(eventId);

        if (res.ok && res.data) {
          setEvent(res.data);
        } else {
          toast.error(res.data?.message || "Event not found");
        }

        // লগইন করা থাকলে চেক করা যে ইভেন্টটি অলরেডি ফেভারিটে আছে কিনা
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
          const favRes = await getMyFavorites();
          if (favRes.ok && Array.isArray(favRes.data?.data)) {
            const alreadySaved = favRes.data.data.some((fav: any) => fav.id === eventId);
            setIsSaved(alreadySaved);
          }
        }
      } catch (error: any) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  // ২. ইভেন্ট সেভ / বুকমার্ক করার হ্যান্ডলার
  const handleToggleSave = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      toast.error("Please login first to save events!");
      router.push("/login");
      return;
    }

    try {
      setActionLoading(true);
      if (isSaved) {
        // আন-সেভ করা
        const res = await removeEventFromFavorites(eventId);
        if (res.ok) {
          setIsSaved(false);
          toast.success("Event removed from your favorites");
        } else {
          toast.error(res.data?.message || "Failed to remove event");
        }
      } else {
        // সেভ করা
        const res = await saveEventToFavorites(eventId);
        if (res.ok) {
          setIsSaved(true);
          toast.success("Event saved to your favorites! Check in Dashboard > Saved Events");
        } else {
          toast.error(res.data?.message || "Failed to save event");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // ৩. ইভেন্টে রেজিস্ট্রেশন / টিকিট কাটার হ্যান্ডলার
  const handleRegister = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      toast.error("Please login first to register for this event!");
      router.push("/login");
      return;
    }

    const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (userRole && userRole.toUpperCase() !== "USER") {
      toast.error(`Only attendees (USER) can book or purchase tickets. You are currently logged in as ${userRole}.`);
      return;
    }

    if (event.availableSeats <= 0) {
      toast.error("Sorry, all seats for this event are fully booked!");
      return;
    }

    try {
      setActionLoading(true);

      // পেইড ইভেন্ট হলে Stripe Checkout Session শুরু হবে
      if (event.ticketPrice && Number(event.ticketPrice) > 0) {
        toast.loading("Redirecting to Stripe Checkout...", { id: "stripe-redirect" });
        const res = await createCheckoutSession(eventId);
        toast.dismiss("stripe-redirect");

        if (res.ok && res.data?.url) {
          window.location.href = res.data.url; // 🚀 Stripe Hosted Checkout-এ নিয়ে যাবে
          return;
        } else {
          toast.error(res.data?.message || "Failed to create payment session");
          return;
        }
      }

      // ফ্রি ইভেন্ট হলে সরাসরি রেজিস্ট্রেশন
      const res = await registerForEvent(eventId);
      if (res.ok) {
        setIsRegistered(true);
        toast.success("Registration successful! Check your tickets in Dashboard.");
        setEvent((prev: any) => ({
          ...prev,
          availableSeats: Math.max(0, prev.availableSeats - 1),
        }));
      } else {
        toast.error(res.data?.message || "Registration failed or already registered");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register for event");
    } finally {
      setActionLoading(false);
    }
  };

  // তারিখ ফরম্যাট
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-slate-600 font-medium text-sm">Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            The event you are looking for might have been removed, unpublished, or does not exist.
          </p>
          <Link
            href="/"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const organizerName = event.organizer?.name || "Event Organizer";
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    organizerName
  )}`;
  const displayImage =
    event.bannerImage ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 space-y-8 max-w-6xl">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all events
          </Link>
        </div>

        {/* Hero Banner with Details */}
        <div className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-md bg-slate-900">
          <img
            src={displayImage}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges & Title on Banner */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {event.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                {event.eventType === "ONLINE" ? "Online Event" : "In-Person Event"}
              </span>
              {event.isFeatured && (
                <span className="bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organizer Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={avatarUrl}
                  alt={organizerName}
                  className="h-12 w-12 rounded-full bg-slate-100 object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs font-medium text-slate-400">Organized by</span>
                  <h3 className="text-base font-bold text-slate-900">{organizerName}</h3>
                  {event.organizer?.email && (
                    <p className="text-xs text-slate-500">{event.organizer.email}</p>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold border border-emerald-100">
                <CheckCircle2 className="h-4 w-4" /> Verified Host
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                About this event
              </h2>
              <div className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Date, Time & Venue Information */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Date and Time
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Date</span>
                    <p className="text-sm font-bold text-slate-800">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Start Time</span>
                    <p className="text-sm font-bold text-slate-800">{formatTime(event.date)}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 pt-2">
                Location / Venue
              </h2>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">
                    {event.eventType === "ONLINE" ? "Meeting Platform / Link" : "Venue Address"}
                  </span>
                  <p className="text-sm font-bold text-slate-800">{event.location}</p>
                  {event.eventType === "ONLINE" && (
                    <p className="text-xs text-slate-500">
                      Link will also be visible on your dashboard ticket once registered.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Action Card) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              {/* Ticket Price */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Ticket Price</span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {event.ticketPrice > 0 ? (
                    `$${event.ticketPrice.toFixed(2)}`
                  ) : (
                    <span className="text-emerald-600">Free</span>
                  )}
                </div>
              </div>

              {/* Seats Remaining with Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-slate-400" /> Availability
                  </span>
                  <span
                    className={
                      event.availableSeats > 0 ? "text-indigo-600 font-bold" : "text-red-500 font-bold"
                    }
                  >
                    {event.availableSeats > 0
                      ? `${event.availableSeats} of ${event.totalSeats} seats left`
                      : "Sold Out"}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Register Button */}
                <button
                  disabled={actionLoading || event.availableSeats <= 0 || isRegistered}
                  onClick={handleRegister}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 text-sm ${
                    isRegistered
                      ? "bg-emerald-600 text-white cursor-default"
                      : event.availableSeats <= 0
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRegistered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Registered!
                    </>
                  ) : event.ticketPrice && Number(event.ticketPrice) > 0 ? (
                    <>
                      <CreditCard className="h-4 w-4" /> Pay ${event.ticketPrice} with Stripe
                    </>
                  ) : (
                    <>
                      <Ticket className="h-4 w-4" /> Register Free Ticket
                    </>
                  )}
                </button>

                {/* 2. Save / Bookmark Button */}
                <button
                  disabled={actionLoading}
                  onClick={handleToggleSave}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer text-sm ${
                    isSaved
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 text-indigo-600" />
                      Saved in Favorites
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 text-slate-400" />
                      Save to Favorites
                    </>
                  )}
                </button>
              </div>

              {/* Direct Link to Saved Events */}
              {isSaved && (
                <div className="pt-2 text-center">
                  <Link
                    href="/dashboard/save-events"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View in My Saved Events ➔
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
