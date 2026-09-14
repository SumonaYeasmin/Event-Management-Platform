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

export interface AdminEventItem {
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
  organizer?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  _count?: {
    registrations: number;
    favorites: number;
  };
}

export interface AdminEventsResponse {
  data: AdminEventItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/* =========================================================================
   ORGANIZER & PUBLIC APIS
   ========================================================================= */

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

/* =========================================================================
   ADMIN MODERATION APIS
   ========================================================================= */

/**
 * ৪. অ্যাডমিনের জন্য সিস্টেমের সমস্ত ইভেন্ট নিয়ে আসার API (Protected - Admin Only)
 */
export const getAllEventsForAdmin = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "All") {
      query.append("status", params.status.toUpperCase());
    }
    if (params?.search) {
      query.append("search", params.search);
    }
    if (params?.page) {
      query.append("page", String(params.page));
    }
    if (params?.limit) {
      query.append("limit", String(params.limit));
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetchWithAuth(`${BASE_API}/admin/events${queryString}`, {
      method: "GET",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("getAllEventsForAdmin API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to fetch admin events" },
    };
  }
};

/**
 * ৫. অ্যাডমিন কর্তৃক ইভেন্ট অনুমোদন (Approve) করার API
 */
export const approveEventByAdmin = async (id: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/admin/events/${id}/approve`, {
      method: "PATCH",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("approveEventByAdmin API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to approve event" },
    };
  }
};

/**
 * ৬. অ্যাডমিন কর্তৃক ইভেন্ট বাতিল / রিজেক্ট (Reject) করার API
 */
export const rejectEventByAdmin = async (id: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/admin/events/${id}/reject`, {
      method: "PATCH",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("rejectEventByAdmin API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to reject event" },
    };
  }
};

/**
 * ৭. অ্যাডমিন কর্তৃক ইভেন্ট স্থগিত (Cancel) করার API
 */
export const cancelEventByAdmin = async (id: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/admin/events/${id}/cancel`, {
      method: "PATCH",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("cancelEventByAdmin API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to cancel event" },
    };
  }
};

/**
 * ৮. অ্যাডমিন কর্তৃক ইভেন্ট চিরতরে মুছে ফেলা (Force Delete) করার API
 */
export const deleteEventByAdmin = async (id: string) => {
  try {
    const res = await fetchWithAuth(`${BASE_API}/admin/events/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("deleteEventByAdmin API error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: error.message || "Failed to permanently delete event" },
    };
  }
};
