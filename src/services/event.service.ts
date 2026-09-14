import { fetchWithAuth } from "./auth";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1";

export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  eventType: "IN_PERSON" | "ONLINE";
  date: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
  location: string;
  totalSeats: number;
  ticketPrice?: number;
  bannerImage?: string;
  isFeatured?: boolean;
  status?: "DRAFT" | "PENDING";
}

export interface OrganizerEventItem {
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
  isFeatured: boolean;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  registrations?: any[];
}

/**
 * ১. অর্গানাইজারের নতুন ইভেন্ট তৈরি করার API কল (Protected)
 */
export const createEvent = async (eventData: CreateEventPayload) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("createEvent API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to create event" },
    };
  }
};

/**
 * ২. অর্গানাইজারের নিজের তৈরি সমস্ত ইভেন্ট আনার API কল (Protected)
 */
export const getMyEvents = async () => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/events/my-events`, {
      method: "GET",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("getMyEvents API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to fetch events" },
    };
  }
};

/**
 * ৩. নির্দিষ্ট একটি ইভেন্ট ডিলিট / ক্যান্সেল করার API কল (Protected)
 */
export const deleteEvent = async (id: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/events/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("deleteEvent API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to delete event" },
    };
  }
};
