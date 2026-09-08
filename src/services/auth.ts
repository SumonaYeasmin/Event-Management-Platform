// Base URL for backend authentication APIs
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1"}/auth`;

/**
 * Service to register a new user
 */
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await res.json();
  } catch (error) {
    console.error("registerUser service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 1. Service to verify OTP code (Matches your exact backend payload)
 */
export const verifyOtp = async (email: string, code: string, type: string = "ACCOUNT_VERIFY") => {
  try {
    const res = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        code, 
        type 
      }),
    });
    
    return await res.json();
  } catch (error) {
    console.error("verifyOtp service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 2. Service to resend OTP code (Updated to support dynamic type)
 */
export const resendOtp = async (email: string, type: string = "ACCOUNT_VERIFY") => {
  try {
    const res = await fetch(`${API_BASE_URL}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email,
        type
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("resendOtp service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

// 3. Service to login user
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // ইমেইল ও পাসওয়ার্ড পাঠানো হচ্ছে
    });
    
    return await res.json();
  } catch (error) {
    console.error("loginUser service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 4. Service to refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    return await res.json();
  } catch (error) {
    console.error("refreshAccessToken service error:", error);
    throw new Error("Failed to refresh access token.");
  }
};

/**
 * Helper function to handle the access token refresh API request
 */
const handleTokenRefresh = async (refreshToken: string): Promise<boolean> => {
  try {
    const data = await refreshAccessToken(refreshToken);
    if (!data.success) return false;

    const newAccessToken = data.data?.accessToken || data.accessToken;
    if (!newAccessToken) return false;

    localStorage.setItem("accessToken", newAccessToken);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper to clear local session data, cookies, and redirect to login page
 */
export const logoutUser = () => {
  localStorage.clear();
  if (typeof window !== "undefined") {
    // Clear the accessToken cookie
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    window.location.href = "/login";
  }
};

/**
 * 5. Custom wrapper around native fetch that handles JWT Authorization
 * and automatically attempts to refresh expired access tokens on 401.
 */
// export const fetchWithAuth = async (url: string, options: any = {}) => {
//   const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

//   options.headers = {
//     ...options.headers,
//     "Authorization": accessToken ? `Bearer ${accessToken}`,
//     "Content-Type": "application/json",
//   };

export const fetchWithAuth = async (url: string, options: any = {}) => {
  let accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // ১. টোকেন থেকে অতিরিক্ত কোটেশন ("), Newline (\n) ও স্পেস মুছে ফেলুন
  if (accessToken) {
    accessToken = accessToken.replace(/^"|"$/g, '').replace(/[\r\n]/g, '').trim();
  }

  // ২. হেডার অবজেক্ট তৈরি করুন
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // ৩. টোকেন থাকলেই শুধু Authorization হেডার পাঠাবেন (কখনই খালি স্ট্রিং "" পাঠাবেন না)
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete headers["Authorization"];
  }

  options.headers = headers;


  let res = await fetch(url, options);

  // Guard Clause: If the request is successful or fails with something other than 401, return it
  if (res.status !== 401) {
    return res;
  }

  // Handle Token Refresh on 401 Unauthorized
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) {
    logoutUser();
    return res;
  }

  const isRefreshed = await handleTokenRefresh(refreshToken);
  if (!isRefreshed) {
    logoutUser();
    return res;
  }

  // Retry the original request with the fresh token
  const newAccessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  options.headers["Authorization"] = newAccessToken ? `Bearer ${newAccessToken}` : "";
  return fetch(url, options);
};

/**
 * 6. Service to request password reset link (forgot password)
 */
export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await res.json();
  } catch (error) {
    console.error("forgotPassword service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 7. Service to reset password using token
 */
export const resetPassword = async (resetToken: string, newPassword: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    return await res.json();
  } catch (error) {
    console.error("resetPassword service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 8. Service to change password (Authenticated route using fetchWithAuth)
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/change-password`, {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    return await res.json();
  } catch (error) {
    console.error("changePassword service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};


