"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
  Sparkles,
} from "lucide-react";
import { verifyPaymentSession } from "@/src/services/payment.service";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Invalid payment request.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        const res = await verifyPaymentSession(sessionId);

        if (res.ok && res.data?.success) {
          setSuccess(true);
          setRegistration(res.data?.registration);
        } else {
          setError(res.data?.message || "Failed to verify payment session.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center text-center max-w-md w-full">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 animate-bounce">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Verifying Payment...</h2>
          <p className="text-sm text-slate-500 mt-2">
            Please wait while we confirm your transaction and reserve your ticket.
          </p>
        </div>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl flex flex-col items-center text-center max-w-md w-full">
          <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Payment Verification Failed</h2>
          <p className="text-sm text-slate-500 mt-2">{error || "Something went wrong during payment verification."}</p>
          <div className="flex gap-3 w-full mt-6">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/events"
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white text-sm flex items-center justify-center gap-2"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 max-w-lg w-full text-center relative overflow-hidden">
        {/* Glow Decorator */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative inline-flex mb-6">
          <div className="h-20 w-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful! 🎉</h1>
        <p className="text-slate-500 text-sm mt-2">
          Thank you! Your ticket booking has been confirmed and registered.
        </p>

        {/* Event Ticket Card */}
        {registration?.event && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left my-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Confirmed Ticket
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Paid with Stripe
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base leading-snug">{registration.event.title}</h3>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              {registration.event.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{formatDate(registration.event.date)}</span>
                </div>
              )}
              {registration.event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{registration.event.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/my-tickets"
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Ticket className="h-4 w-4" /> View My Tickets
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
