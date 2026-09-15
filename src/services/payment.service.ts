import { fetchWithAuth } from "./auth";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1";

/**
 * ১. পেইড ইভেন্টের জন্য Stripe Checkout Session তৈরি করা
 */
export const createCheckoutSession = async (eventId: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/payments/create-checkout-session`, {
      method: "POST",
      body: JSON.stringify({ eventId }),
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("createCheckoutSession API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to initiate payment session" },
    };
  }
};

/**
 * ২. পেমেন্ট সেশন ভেরিফাই করে বুকিং কনফার্ম করা
 */
export const verifyPaymentSession = async (sessionId: string) => {
  try {
    const res = await fetchWithAuth(
      `${BASE_API}/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("verifyPaymentSession API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to verify payment session" },
    };
  }
};
